
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
            
            // Get the transcript data using the YouTube Captions API
            const transcriptContent = await this.fetchCaptionsWithAPI(id);
            
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

  // Primary method: Fetch transcript using YouTube Captions API
  private async fetchCaptionsWithAPI(videoId: string): Promise<string | null> {
    try {
      console.log(`Fetching captions list for video ${videoId} using YouTube Captions API`);
      
      // First, list the available captions for the video
      const captionsListUrl = `${this.YT_API_URL}/captions?videoId=${videoId}&part=snippet&key=${this.apiKey}`;
      const captionsResponse = await axios.get(captionsListUrl);
      
      if (!captionsResponse.data.items || captionsResponse.data.items.length === 0) {
        console.log(`No captions found via Captions API for video ${videoId}`);
        return null;
      }
      
      // Find the best caption track (prefer English)
      let captionTrack = null;
      const englishCaptions = captionsResponse.data.items.filter(
        (item: any) => item.snippet.language?.toLowerCase().startsWith('en')
      );
      
      if (englishCaptions.length > 0) {
        captionTrack = englishCaptions[0];
        console.log(`Found English caption with id ${captionTrack.id}`);
      } else {
        // Use the first available caption
        captionTrack = captionsResponse.data.items[0];
        console.log(`No English caption found, using first available caption with id ${captionTrack.id}`);
      }
      
      // Since the direct Captions API requires OAuth for downloading the actual transcript,
      // we'll use YouTube's timedtext API which is publicly accessible
      const videoLanguage = captionTrack.snippet.language || 'en';
      const timedTextUrl = `https://www.youtube.com/api/timedtext?lang=${videoLanguage}&v=${videoId}`;
      
      console.log(`Retrieving transcript from timedtext API for video ${videoId} with language ${videoLanguage}`);
      
      const timedTextResponse = await axios.get(timedTextUrl, { responseType: 'text' });
      
      if (!timedTextResponse.data) {
        console.log(`No data returned from timedtext API for video ${videoId}`);
        return null;
      }
      
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
        fullText += this.decodeHtmlEntities(text) + " ";
      }
      
      return this.cleanTranscriptText(fullText);
    } catch (error) {
      console.error(`Error fetching captions with API for video ${videoId}:`, error);
      return null;
    }
  }
  
  // Clean and format transcript text
  private cleanTranscriptText(text: string): string {
    if (!text) return '';
    
    // Decode HTML entities
    let cleaned = this.decodeHtmlEntities(text);
    
    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Clean up whitespace
    cleaned = cleaned
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleaned;
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
