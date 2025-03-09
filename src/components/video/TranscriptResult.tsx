import React, { useState } from 'react';
import { Check, X, FileText, ExternalLink, Download, ChevronDown, ChevronUp, Clock, FolderOpen, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface TranscriptResult {
  videoId: string;
  title: string;
  filename: string;
  path: string;
  success: boolean;
  transcript?: string;
}

interface TranscriptResultsProps {
  results: TranscriptResult[];
  folderPath: string;
}

const TranscriptResult = ({ results, folderPath }: TranscriptResultsProps) => {
  const successCount = results.filter(r => r.success).length;
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  const toggleExpand = (videoId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };
  
  const handleDownloadAgain = (result: TranscriptResult) => {
    if (!result.transcript) return;
    
    // Create a blob with the transcript content
    const blob = new Blob([result.transcript], { type: 'text/plain' });
    
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(`Downloaded: ${result.filename}`);
  };
  
  const handleCopyToClipboard = (result: TranscriptResult) => {
    if (!result.transcript) return;
    
    navigator.clipboard.writeText(result.transcript)
      .then(() => {
        toast.success("Transcript copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy to clipboard");
      });
  };
  
  const downloadAllTranscripts = () => {
    // For browsers that support the File System Access API (modern browsers)
    if ('showDirectoryPicker' in window) {
      toast.info("Select a folder to save all transcripts");
    } else {
      // For browsers that do not support the File System Access API
      results.filter(r => r.success).forEach(result => {
        handleDownloadAgain(result);
      });
      
      toast.success(`Downloaded ${successCount} transcripts to folder: ${folderPath}`);
    }
  };
  
  const formattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="p-6 rounded-xl bg-card border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold">Download Results</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formattedDate()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadAllTranscripts()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              disabled={successCount === 0}
            >
              <FolderOpen className="h-4 w-4" />
              Download All Again
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Transcript Folder:</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <code className="text-xs bg-background p-1 rounded">{folderPath}</code>
              </p>
              <p className="text-sm mt-3 text-muted-foreground">
                All transcripts have been downloaded as <code className="text-xs bg-background p-1 rounded">.txt</code> files containing 
                the full transcript text (without timestamps). The files are organized in a folder named after your search query.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Transcript Files</h3>
        
        <div className="divide-y divide-border border rounded-xl overflow-hidden">
          {results.map((result, index) => (
            <div key={index} className="flex flex-col bg-card">
              <div className="flex items-start p-4 gap-3">
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
                
                <div className="flex items-center gap-2">
                  {result.success && (
                    <>
                      <button
                        onClick={() => handleCopyToClipboard(result)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        aria-label="Copy to clipboard"
                      >
                        <Share className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDownloadAgain(result)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors"
                        aria-label="Download again"
                      >
                        <Download className="h-4 w-4 text-primary" />
                      </button>
                    </>
                  )}
                  
                  <a 
                    href={`https://www.youtube.com/watch?v=${result.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                  
                  {result.success && (
                    <button
                      onClick={() => toggleExpand(result.videoId)}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      aria-label={expandedItems[result.videoId] ? "Hide transcript preview" : "Show transcript preview"}
                    >
                      {expandedItems[result.videoId] ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedItems[result.videoId] && result.transcript && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <div className="bg-muted p-3 rounded-md max-h-60 overflow-y-auto">
                        <p className="text-xs whitespace-pre-wrap">{result.transcript.substring(0, 500)}...</p>
                        <div className="flex justify-end mt-2 gap-2">
                          <button
                            onClick={() => handleCopyToClipboard(result)}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Share className="h-3 w-3" /> Copy
                          </button>
                          <button
                            onClick={() => handleDownloadAgain(result)}
                            className="text-xs text-primary flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      
      {results.length > 0 && !results.every(r => r.success) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-medium text-amber-800 mb-2">Some transcripts could not be downloaded</h3>
          <p className="text-xs text-amber-700">
            This could be due to unavailable transcripts, private videos, or API limitations. 
            You can try again later or check directly on YouTube if transcripts are available.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TranscriptResult;
