
import React from 'react';
import { Check, X, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface TranscriptResult {
  videoId: string;
  title: string;
  filename: string;
  path: string;
  success: boolean;
}

interface TranscriptResultsProps {
  results: TranscriptResult[];
  folderPath: string;
}

const TranscriptResult = ({ results, folderPath }: TranscriptResultsProps) => {
  const successCount = results.filter(r => r.success).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="p-6 rounded-xl neo-glass space-y-4">
        <h2 className="text-xl font-semibold mb-4">Download Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-700 mb-1">Total Transcripts</h3>
            <span className="text-2xl font-bold text-blue-800">{results.length}</span>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <h3 className="text-sm font-medium text-green-700 mb-1">Successfully Downloaded</h3>
            <span className="text-2xl font-bold text-green-800">{successCount}</span>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
            <h3 className="text-sm font-medium text-amber-700 mb-1">Failed Downloads</h3>
            <span className="text-2xl font-bold text-amber-800">{results.length - successCount}</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 rounded-lg border border-border bg-secondary">
          <h3 className="text-sm font-medium mb-1">Saved to:</h3>
          <p className="text-sm font-mono bg-white/50 p-2 rounded break-all">{folderPath}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Transcript Files</h3>
        
        <div className="divide-y divide-border border rounded-xl overflow-hidden">
          {results.map((result, index) => (
            <div key={index} className="flex items-start p-4 gap-3 bg-white">
              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                result.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {result.success ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium line-clamp-1">{result.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{result.filename}</span>
                </div>
              </div>
              
              <a 
                href={`https://www.youtube.com/watch?v=${result.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TranscriptResult;
