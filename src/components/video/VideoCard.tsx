
import React from 'react';
import { Clock, Eye, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

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

const VideoCard = ({ video, isSelected, onSelect }: VideoCardProps) => {
  // Format the date to "time ago" format
  const timeAgo = formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative rounded-xl overflow-hidden border ${isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-border'} transition-all hover:shadow-md cursor-pointer`}
      onClick={() => onSelect(video.id)}
    >
      <div className="absolute top-3 left-3 z-10">
        <div className={`h-5 w-5 rounded-full border-2 ${isSelected ? 'bg-primary border-primary' : 'bg-white/80 border-gray-300'} flex items-center justify-center transition-all`}>
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
          <p className="text-sm font-medium text-foreground/80">{video.channelTitle}</p>
          
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
