
import React from 'react';
import { Clock, Eye, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

interface VideoCardProps {
  video: VideoData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

// Helper function to format duration from ISO 8601 duration format
const formatDuration = (isoDuration: string) => {
  let duration = isoDuration.replace('PT', '');
  
  let hours = duration.match(/(\d+)H/);
  let minutes = duration.match(/(\d+)M/);
  let seconds = duration.match(/(\d+)S/);
  
  let formattedDuration = '';
  
  if (hours) formattedDuration += `${hours[1]}:`;
  if (minutes) formattedDuration += `${hours ? minutes[1].padStart(2, '0') : minutes[1]}:`;
  else formattedDuration += '0:';
  if (seconds) formattedDuration += seconds[1].padStart(2, '0');
  else formattedDuration += '00';
  
  return formattedDuration;
};

// Helper function to format view count
const formatViewCount = (viewCount: string) => {
  if (viewCount === 'N/A') return 'No views';
  
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  } else {
    return `${count} views`;
  }
};

const VideoCard = ({ video, isSelected, onSelect, viewMode = 'grid' }: VideoCardProps) => {
  // Format the date to "time ago" format
  const timeAgo = formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true });
  
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "group relative overflow-hidden border transition-all hover:shadow-md cursor-pointer flex",
          isSelected ? 'border-primary bg-primary/5' : 'border-border'
        )}
        onClick={() => onSelect(video.id)}
      >
        <div className="absolute top-3 left-3 z-10">
          <div className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected ? 'bg-primary border-primary' : 'bg-white/80 border-gray-300'
          )}>
            {isSelected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>
        
        <div className="w-52 flex-shrink-0 relative">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          <h3 className="font-medium text-base line-clamp-1 mb-1">{video.title}</h3>
          
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 
              {video.channelTitle}
            </p>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatViewCount(video.viewCount)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(video.duration)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "group relative rounded-xl overflow-hidden border transition-all hover:shadow-md cursor-pointer",
        isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-border'
      )}
      onClick={() => onSelect(video.id)}
    >
      <div className="absolute top-3 left-3 z-10">
        <div className={cn(
          "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
          isSelected ? 'bg-primary border-primary' : 'bg-white/80 border-gray-300'
        )}>
          {isSelected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
      
      <div className="aspect-video w-full relative overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-base line-clamp-2 mb-2 h-12">{video.title}</h3>
        
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground/80 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 
            {video.channelTitle}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{formatViewCount(video.viewCount)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
