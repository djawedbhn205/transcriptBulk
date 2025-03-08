
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import YoutubeService from '@/services/YoutubeService';

interface ApiKeyCheckProps {
  children: React.ReactNode;
}

const ApiKeyCheck = ({ children }: ApiKeyCheckProps) => {
  const [showDialog, setShowDialog] = useState(!YoutubeService.hasApiKey());
  const [apiKey, setApiKey] = useState('');
  
  const handleSave = () => {
    YoutubeService.setApiKey(apiKey.trim());
    setShowDialog(false);
  };
  
  if (!showDialog) {
    return <>{children}</>;
  }
  
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            API Key Required
          </DialogTitle>
          <DialogDescription>
            You need to set a YouTube API key before you can search or download transcripts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">YouTube API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" onClick={handleSave}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyCheck;
