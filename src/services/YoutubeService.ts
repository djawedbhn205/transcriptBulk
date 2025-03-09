import { toast } from 'sonner';
import { VideoData } from '../components/video/VideoCard';
import axios from 'axios';

interface SearchResults {
  videos: VideoData[];
  nextPageToken?: string;
}

export interface TranscriptResult {
  videoId: string;
  title: string;
  filename: string;
  path: string;
  success: boolean;
  transcript?: string;
}

export interface DownloadResponse {
  folderPath: string;
  results: TranscriptResult[];
}

interface YouTubeVideoResponse {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

interface YouTubeVideoDetailsResponse {
  id: string;
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

interface YoutubeCaptionResponse {
  items: {
    id: string;
    snippet: {
      language: string;
      trackKind: string;
      name: string;
    };
  }[];
}

class YoutubeService {
  private apiKey: string = '';
  private YT_API_URL = 'https://www.googleapis.com/youtube/v3';
  
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('youtube_api_key', key);
    toast.success('API Key set successfully');
  }
  
  getApiKey(): string {
    if (!this.apiKey) {
      // Try to load from localStorage
      const savedKey = localStorage.getItem('youtube_api_key');
      if (savedKey) {
        this.apiKey = savedKey;
      }
    }
    return this.apiKey;
  }
  
  hasApiKey(): boolean {
    return !!this.getApiKey();
  }
  
  // Search for videos with transcripts
  async searchVideos(
    query: string, 
    maxResults: number = 25, 
    byChannel: boolean = false,
    order: string = 'relevance',
    duration: string = 'any'
  ): Promise<SearchResults> {
    try {
      if (!this.hasApiKey()) {
        toast.error('Please set your YouTube API key first');
        return { videos: [] };
      }
      
      if (!query) {
        return { videos: [] };
      }
      
      // Search for videos with the query
      let searchUrl = `${this.YT_API_URL}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${this.apiKey}`;
      
      // Add additional parameters if provided
      if (order && order !== 'relevance') {
        searchUrl += `&order=${order}`;
      }
      
      if (byChannel) {
        // If byChannel is true, we assume the query is a channel ID
        searchUrl += `&channelId=${query}`;
      }
      
      // Duration filter - only available in video search
      if (duration && duration !== 'any') {
        searchUrl += `&videoDuration=${duration}`;
      }
      
      searchUrl += '&relevanceLanguage=en&videoCaption=closedCaption'; // Only videos with captions
      
      const searchResponse = await axios.get(searchUrl);
      const nextPageToken = searchResponse.data.nextPageToken;
      
      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        return { videos: [] };
      }
      
      // Get video IDs from the search results
      const videoIds = searchResponse.data.items.map((item: YouTubeVideoResponse) => item.id.videoId).join(',');
      
      // Get video details (duration, view count, etc.)
      const videoDetailsUrl = `${this.YT_API_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${this.apiKey}`;
      const videoDetailsResponse = await axios.get(videoDetailsUrl);
      
      // Map video details to the VideoData format
      const videos: VideoData[] = searchResponse.data.items.map((item: YouTubeVideoResponse) => {
        const details = videoDetailsResponse.data.items.find(
          (detail: YouTubeVideoDetailsResponse) => detail.id === item.id.videoId
        );
        
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          duration: details?.contentDetails?.duration || 'PT0S',
          viewCount: details?.statistics?.viewCount || '0'
        };
      });
      
      return { 
        videos,
        nextPageToken
      };
      
    } catch (error) {
      console.error("Error searching videos:", error);
      toast.error("Failed to search for videos. Please check your API key or try again later.");
      return { videos: [] };
    }
  }
  
  // Download transcripts for selected videos
  async downloadTranscripts(videoIds: string[], searchQuery: string): Promise<DownloadResponse> {
    try {
      if (!this.hasApiKey()) {
        toast.error('Please set your YouTube API key first');
        throw new Error('API key not set');
      }
      
      if (!videoIds.length) {
        throw new Error("No videos selected");
      }
      
      // Create a folder name based on search query and current date
      const sanitizedQuery = this.sanitizeFilename(searchQuery || 'youtube_transcripts');
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const folderName = `${sanitizedQuery}_${timestamp}`;
      
      console.log(`Creating folder: ${folderName} for storing transcripts`);
      
      // Get video details to get the actual titles
      const videoDetailsUrl = `${this.YT_API_URL}/videos?part=snippet&id=${videoIds.join(',')}&key=${this.apiKey}`;
      const videoDetailsResponse = await axios.get(videoDetailsUrl);
      
      // Process each video to get its transcript
      const results: TranscriptResult[] = await Promise.all(
        videoIds.map(async (id) => {
          try {
            // Match with the video title from the API response
            const videoDetails = videoDetailsResponse.data.items.find(
              (item: any) => item.id === id
            );
            
            const title = videoDetails?.snippet?.title || `Video ${id}`;
            const safeTitle = this.sanitizeFilename(title);
            const filename = `${safeTitle}_${id}.txt`;
            
            console.log(`Fetching transcript for video: ${title} (${id})`);
            
            // Get the transcript data for this video - try multiple methods
            const transcriptContent = await this.fetchTranscript(id);
            
            if (!transcriptContent) {
              console.log(`No transcript found for video ${id}`);
              return {
                videoId: id,
                title,
                filename,
                path: `/${folderName}/${filename}`,
                success: false
              };
            }
            
            console.log(`Successfully retrieved transcript for ${id}, length: ${transcriptContent.length} chars`);
            
            // Create a blob with the transcript content
            const blob = new Blob([transcriptContent], { type: 'text/plain' });
            
            // Create a download link and trigger it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return {
              videoId: id,
              title,
              filename,
              path: `/${folderName}/${filename}`,
              success: true,
              transcript: transcriptContent
            };
          } catch (error) {
            console.error(`Error downloading transcript for video ${id}:`, error);
            
            // Get the video title even if transcript download failed
            const videoDetails = videoDetailsResponse.data.items.find(
              (item: any) => item.id === id
            );
            const title = videoDetails?.snippet?.title || `Video ${id}`;
            
            return {
              videoId: id,
              title,
              filename: `${this.sanitizeFilename(title)}_${id}.txt`,
              path: `/${folderName}/${this.sanitizeFilename(title)}_${id}.txt`,
              success: false
            };
          }
        })
      );
      
      return {
        folderPath: folderName,
        results
      };
      
    } catch (error) {
      console.error("Error downloading transcripts:", error);
      toast.error("Failed to download transcripts. Please try again later.");
      throw error;
    }
  }

  // Main transcript fetching method that tries multiple approaches
  private async fetchTranscript(videoId: string): Promise<string | null> {
    console.log(`Attempting to fetch transcript for video ${videoId} using multiple methods`);
    
    try {
      // First try: Use YouTube Captions API
      const captionsResult = await this.fetchTranscriptWithCaptionsAPI(videoId);
      if (captionsResult) {
        console.log(`Successfully fetched transcript with Captions API for ${videoId}`);
        return captionsResult;
      }
      
      // Second try: Use third-party API
      const thirdPartyResult = await this.fetchTranscriptFromThirdParty(videoId);
      if (thirdPartyResult) {
        console.log(`Successfully fetched transcript with third-party API for ${videoId}`);
        return thirdPartyResult;
      }
      
      // Third try: Use YouTube's timedtext API
      const timedTextResult = await this.fetchTranscriptFromTimedText(videoId);
      if (timedTextResult) {
        console.log(`Successfully fetched transcript with timedtext API for ${videoId}`);
        return timedTextResult;
      }
      
      // If all methods fail, return null
      console.log(`All transcript fetch methods failed for ${videoId}`);
      return null;
    } catch (error) {
      console.error(`All transcript fetching methods failed for video ${videoId}:`, error);
      return null;
    }
  }

  // Fetch transcript using YouTube Captions API
  private async fetchTranscriptWithCaptionsAPI(videoId: string): Promise<string | null> {
    try {
      console.log(`Fetching captions list for video ${videoId} using YouTube Captions API`);
      // First, list the available captions for the video
      const captionsListUrl = `${this.YT_API_URL}/captions?videoId=${videoId}&part=snippet&key=${this.apiKey}`;
      const captionsResponse = await axios.get<YoutubeCaptionResponse>(captionsListUrl);
      
      if (!captionsResponse.data.items || captionsResponse.data.items.length === 0) {
        console.log(`No captions found via Captions API for video ${videoId}`);
        return null;
      }
      
      // Prefer English captions if available
      let captionId = null;
      const englishCaption = captionsResponse.data.items.find(
        item => item.snippet.language === 'en' || item.snippet.language === 'en-US'
      );
      
      if (englishCaption) {
        captionId = englishCaption.id;
        console.log(`Found English caption with id ${captionId}`);
      } else {
        // Otherwise use the first available caption
        captionId = captionsResponse.data.items[0].id;
        console.log(`No English caption found, using first available caption with id ${captionId}`);
      }
      
      // The captions.download endpoint requires OAuth, so we use alternative methods
      // Here we would try to download using the captionId, but we need to use alternative methods
      
      console.log(`Caption API found captions, but can't download directly with API key. Using alternative methods.`);
      return null;
      
    } catch (error) {
      console.error(`Error fetching captions with API for video ${videoId}:`, error);
      return null;
    }
  }

  // Fetch transcript from a third-party API service
  private async fetchTranscriptFromThirdParty(videoId: string): Promise<string | null> {
    try {
      console.log(`Trying third-party API to get transcript for ${videoId}`);
      // Using a third-party API to get transcript data
      const response = await axios.get(`https://ytapi-transcript.vercel.app/api?videoId=${videoId}`);
      
      if (response.data && response.data.transcript && response.data.transcript.length > 0) {
        console.log(`Third-party API returned transcript with ${response.data.transcript.length} items`);
        const cleanedTranscript = this.cleanTranscript(response.data.transcript);
        return cleanedTranscript;
      }
      
      console.log(`Third-party API returned no transcript for ${videoId}`);
      return null;
      
    } catch (error) {
      console.error(`Error fetching transcript from third-party for video ${videoId}:`, error);
      return null;
    }
  }
  
  // Fetch transcript from YouTube's timedtext API (works without API key)
  private async fetchTranscriptFromTimedText(videoId: string): Promise<string | null> {
    try {
      console.log(`Trying YouTube timedtext API for ${videoId}`);
      const timedTextResponse = await axios.get(
        `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`,
        { responseType: 'text' }
      );
      
      if (timedTextResponse.data) {
        console.log(`Timedtext API returned data for ${videoId}`);
        // Parse the XML response to extract text
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(timedTextResponse.data, "text/xml");
        const textElements = xmlDoc.getElementsByTagName("text");
        
        if (textElements.length === 0) {
          console.log(`No text elements found in timedtext response for ${videoId}`);
          return null;
        }
        
        console.log(`Found ${textElements.length} text elements in timedtext response`);
        
        let fullText = "";
        for (let i = 0; i < textElements.length; i++) {
          const text = textElements[i].textContent || "";
          // Decode HTML entities
          const decodedText = this.decodeHtmlEntities(text);
          fullText += decodedText + " ";
        }
        
        return fullText.trim();
      }
      
      console.log(`Timedtext API returned no data for ${videoId}`);
      return null;
      
    } catch (error) {
      console.error(`Error with timedtext API for ${videoId}:`, error);
      return null;
    }
  }
  
  // Clean transcript data by removing timestamps and only keeping the text content
  private cleanTranscript(transcriptItems: any[]): string {
    if (!transcriptItems || transcriptItems.length === 0) {
      return "No transcript available";
    }
    
    // Extract only the text from each transcript item and join them with spaces
    const fullText = transcriptItems.map(item => {
      // Decode HTML entities if present
      return this.decodeHtmlEntities(item.text.trim());
    }).join(' ');
    
    // Clean up any extra spaces or line breaks
    return fullText
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Helper function to decode HTML entities
  private decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    // Get decoded text
    const decoded = textarea.value;
    // Remove any HTML tags
    return decoded.replace(/<[^>]*>/g, '');
  }
  
  // Helper function to sanitize filenames
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[\/\\:*?"<>|]/g, '_') // Replace illegal filename characters with underscores
      .replace(/\s+/g, '_')          // Replace spaces with underscores
      .substring(0, 50);              // Limit the length
  }
}

export default new YoutubeService();
