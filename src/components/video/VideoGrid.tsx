
import React, { useState } from 'react';
import VideoCard, { VideoData } from './VideoCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

interface VideoGridProps {
  videos: VideoData[];
  onDownload: (ids: string[]) => void;
}

const VideoGrid = ({ videos, onDownload }: VideoGridProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    
    onDownload(selectedIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <button 
            onClick={handleSelectAll} 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {selectedIds.length === videos.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <p className="text-sm text-muted-foreground">
            {selectedIds.length} of {videos.length} selected
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition-all ${
            selectedIds.length > 0 ? 'bg-primary' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleDownload}
          disabled={selectedIds.length === 0}
        >
          <Download className="h-4 w-4" />
          <span>Download Transcripts</span>
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoCard 
            key={video.id}
            video={video}
            isSelected={selectedIds.includes(video.id)}
            onSelect={handleSelect}
          />
        ))}
      </div>
      
      {videos.length > 0 && (
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
