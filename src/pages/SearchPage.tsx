
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import SearchBar, { SearchOptions } from '../components/search/SearchBar';
import VideoGrid from '../components/video/VideoGrid';
import { VideoData } from '../components/video/VideoCard';
import YoutubeService from '../services/YoutubeService';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import TranscriptResult from '../components/video/TranscriptResult';
import ApiKeyCheck from '../components/search/ApiKeyCheck';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadResults, setDownloadResults] = useState<{folderPath: string, results: any[]} | null>(null);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    maxResults: 25,
    order: 'relevance',
    duration: 'any'
  });
  
  useEffect(() => {
    if (query && YoutubeService.hasApiKey()) {
      handleSearch(query, searchOptions);
    }
  }, [query]);
  
  const handleSearch = async (searchQuery: string, options?: SearchOptions) => {
    if (!searchQuery.trim()) return;
    
    if (!YoutubeService.hasApiKey()) {
      toast.error('Please set your YouTube API key first');
      return;
    }
    
    setIsLoading(true);
    setDownloadResults(null);
    
    try {
      // Update URL with the new search query
      if (searchQuery !== query) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      
      // Save the options for later use
      if (options) {
        setSearchOptions(options);
      }
      
      const results = await YoutubeService.searchVideos(
        searchQuery,
        options?.maxResults || 25,
        false,
        options?.order || 'relevance',
        options?.duration || 'any'
      );
      
      setVideos(results.videos);
      
      if (results.videos.length === 0) {
        toast.info('No videos found with transcripts. Try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = async (videoIds: string[]) => {
    setIsLoading(true);
    
    try {
      const results = await YoutubeService.downloadTranscripts(videoIds);
      setDownloadResults(results);
      
      const successCount = results.results.filter(r => r.success).length;
      toast.success(`Successfully downloaded ${successCount} transcripts`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('An error occurred while downloading transcripts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <ApiKeyCheck>
        <div className="py-8 md:py-12">
          <div className="container max-w-7xl">
            <div className="mb-10">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6"
              >
                Search for videos with transcripts
              </motion.h1>
              
              <SearchBar 
                onSearch={handleSearch} 
                initialValue={query} 
                showAdvanced={true}
              />
            </div>
            
            {isLoading ? (
              <div className="py-20">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground">
                    {downloadResults ? 'Downloading transcripts...' : 'Searching for videos...'}
                  </p>
                </div>
              </div>
            ) : downloadResults ? (
              <TranscriptResult 
                results={downloadResults.results}
                folderPath={downloadResults.folderPath}
              />
            ) : videos.length > 0 ? (
              <VideoGrid videos={videos} onDownload={handleDownload} />
            ) : query ? (
              <div className="py-16 text-center">
                <h3 className="text-xl font-medium mb-2">No videos found</h3>
                <p className="text-muted-foreground">
                  Try a different search term or adjust your filters
                </p>
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">
                  Enter a search term to find videos with transcripts
                </p>
              </div>
            )}
          </div>
        </div>
      </ApiKeyCheck>
    </Layout>
  );
};

export default SearchPage;
