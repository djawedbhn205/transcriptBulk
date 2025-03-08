
import React, { useState } from 'react';
import VideoCard, { VideoData } from './VideoCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Download, Grid2X2, List, CheckSquare, Square, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  videos: VideoData[];
  onDownload: (ids: string[]) => void;
}

type ViewMode = 'grid' | 'list';

const VideoGrid = ({ videos, onDownload }: VideoGridProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterActive, setFilterActive] = useState(false);
  const [filterDate, setFilterDate] = useState('all');

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(videoId => videoId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === videos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(videos.map(v => v.id));
    }
  };

  const handleDownload = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one video to download transcripts');
      return;
    }
    
    toast.info(`Preparing to download ${selectedIds.length} transcripts...`);
    onDownload(selectedIds);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const toggleFilter = () => {
    setFilterActive(!filterActive);
  };

  const filteredVideos = filterActive && filterDate !== 'all'
    ? videos.filter(video => {
        const date = new Date(video.publishedAt);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
        
        switch(filterDate) {
          case 'today':
            return daysDiff < 1;
          case 'week':
            return daysDiff < 7;
          case 'month':
            return daysDiff < 30;
          case 'year':
            return daysDiff < 365;
          default:
            return true;
        }
      })
    : videos;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSelectAll} 
            className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
          >
            {selectedIds.length === videos.length ? 
              <CheckSquare className="h-4 w-4" /> : 
              <Square className="h-4 w-4" />
            }
            {selectedIds.length === videos.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <p className="text-sm text-muted-foreground">
            {selectedIds.length} of {videos.length} selected
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-secondary rounded-lg p-1 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-colors", 
                viewMode === 'grid' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Grid view"
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-colors", 
                viewMode === 'list' ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={toggleFilter}
              className={cn(
                "p-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors border",
                filterActive 
                  ? "border-primary/30 bg-primary/5 text-primary" 
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            
            <AnimatePresence>
              {filterActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 z-10 bg-background border border-border rounded-lg shadow-lg w-48 overflow-hidden"
                >
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-muted-foreground p-2">Upload Date</h3>
                    <div className="space-y-1">
                      {[
                        {value: 'all', label: 'All time'},
                        {value: 'today', label: 'Today'},
                        {value: 'week', label: 'This week'},
                        {value: 'month', label: 'This month'},
                        {value: 'year', label: 'This year'}
                      ].map(option => (
                        <button
                          key={option.value}
                          className={cn(
                            "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                            filterDate === option.value 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "hover:bg-muted"
                          )}
                          onClick={() => setFilterDate(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all ${
              selectedIds.length > 0 ? 'bg-primary' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleDownload}
            disabled={selectedIds.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
            {selectedIds.length > 0 && <span className="rounded-full bg-white/20 px-1.5 text-xs">{selectedIds.length}</span>}
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center"
          >
            <h3 className="text-xl font-medium mb-2">No videos match your filter</h3>
            <p className="text-muted-foreground">Try adjusting your filter options</p>
            <button
              onClick={() => {
                setFilterActive(false);
                setFilterDate('all');
              }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={cn(
        "grid gap-6 transition-all",
        viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      )}>
        {filteredVideos.map(video => (
          <VideoCard 
            key={video.id}
            video={video}
            isSelected={selectedIds.includes(video.id)}
            onSelect={handleSelect}
            viewMode={viewMode}
          />
        ))}
      </div>
      
      {filteredVideos.length > 0 && (
        <div className="mt-8 text-center space-y-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all mx-auto ${
              selectedIds.length > 0 ? 'bg-primary' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleDownload}
            disabled={selectedIds.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Download {selectedIds.length} Transcripts</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;
