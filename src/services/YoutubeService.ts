
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
  async downloadTranscripts(videoIds: string[]): Promise<DownloadResponse> {
    try {
      if (!this.hasApiKey()) {
        toast.error('Please set your YouTube API key first');
        throw new Error('API key not set');
      }
      
      if (!videoIds.length) {
        throw new Error("No videos selected");
      }
      
      // In a real application, this would connect to a backend service
      // to download and save the transcripts
      // For now, we'll simulate a more realistic response with a delay
      
      // Get video details to get the actual titles
      const videoDetailsUrl = `${this.YT_API_URL}/videos?part=snippet&id=${videoIds.join(',')}&key=${this.apiKey}`;
      const videoDetailsResponse = await axios.get(videoDetailsUrl);
      
      // Simulate API delay - in a real app this would be a call to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results: TranscriptResult[] = videoIds.map(id => {
        // Match with the video title from the API response
        const videoDetails = videoDetailsResponse.data.items.find(
          (item: any) => item.id === id
        );
        
        const title = videoDetails?.snippet?.title || `Video ${id}`;
        // In a real application, you would actually download the transcript here
        // For now, we'll simulate success/failure with a high success rate
        const success = Math.random() > 0.1; // 90% success rate
        
        return {
          videoId: id,
          title,
          filename: `${id}_transcript.txt`,
          path: `/downloads/transcripts/${id}_transcript.txt`,
          success
        };
      });
      
      // In a real application, this would be the path where the transcripts were saved
      const folderPath = "/downloads/transcripts/";
      
      return {
        folderPath,
        results
      };
      
    } catch (error) {
      console.error("Error downloading transcripts:", error);
      toast.error("Failed to download transcripts. Please try again later.");
      throw error;
    }
  }
}

export default new YoutubeService();
