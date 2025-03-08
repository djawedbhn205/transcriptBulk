
import { toast } from 'sonner';
import { VideoData } from '../components/video/VideoCard';

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

class YoutubeService {
  private apiKey: string = '';
  
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
      
      // In a real application, this would make an actual API call
      // For now, we'll simulate the response with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!query) {
        return { videos: [] };
      }
      
      // Mock data generator based on the query
      const videos = this.generateMockVideos(query, maxResults);
      
      return { 
        videos,
        nextPageToken: videos.length >= maxResults ? 'mock_next_page_token' : undefined
      };
      
    } catch (error) {
      console.error("Error searching videos:", error);
      toast.error("Failed to search for videos. Please try again later.");
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
      
      // In a real application, this would make an actual API call
      // For now, we'll simulate the response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!videoIds.length) {
        throw new Error("No videos selected");
      }
      
      const results: TranscriptResult[] = videoIds.map(id => {
        // Generate mock transcript data
        const success = Math.random() > 0.2; // 80% success rate
        return {
          videoId: id,
          title: `Video Title for ${id}`,
          filename: `${id}_transcript.txt`,
          path: `/mock/path/to/transcripts/${id}_transcript.txt`,
          success
        };
      });
      
      return {
        folderPath: "/mock/path/to/transcripts/",
        results
      };
      
    } catch (error) {
      console.error("Error downloading transcripts:", error);
      toast.error("Failed to download transcripts. Please try again later.");
      throw error;
    }
  }
  
  // Helper method to generate mock video data
  private generateMockVideos(query: string, count: number): VideoData[] {
    const videos: VideoData[] = [];
    
    for (let i = 0; i < count; i++) {
      const id = `video_${query.substring(0, 3)}_${i}`.replace(/\s/g, '');
      const publishedDate = new Date();
      publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 365));
      
      videos.push({
        id,
        title: `${query} - Video Title ${i + 1} with transcript example`,
        description: `This is a sample description for video ${i + 1} about ${query}. It contains information about the content of the video and might be quite long.`,
        thumbnail: `https://picsum.photos/id/${(i * 10) % 100 + 1}/640/360`,
        channelTitle: `Channel ${(i % 5) + 1}`,
        publishedAt: publishedDate.toISOString(),
        duration: `PT${Math.floor(Math.random() * 60) + 1}M${Math.floor(Math.random() * 60)}S`,
        viewCount: (Math.floor(Math.random() * 1000000) + 1000).toString()
      });
    }
    
    return videos;
  }
}

export default new YoutubeService();
