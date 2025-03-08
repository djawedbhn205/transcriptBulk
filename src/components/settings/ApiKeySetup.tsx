
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, InfoIcon } from 'lucide-react';
import YoutubeService from '@/services/YoutubeService';
import { toast } from 'sonner';

interface ApiKeySetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeySetup = ({ open, onOpenChange }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  
  useEffect(() => {
    if (open) {
      // Load the API key when dialog opens
      setApiKey(YoutubeService.getApiKey() || '');
    }
  }, [open]);
  
  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    YoutubeService.setApiKey(apiKey.trim());
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Set YouTube API Key
          </DialogTitle>
          <DialogDescription>
            Enter your YouTube Data API key to enable searching and downloading transcripts.
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
          
          <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm">
            <InfoIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-muted-foreground">
                To get a YouTube API key, visit the <a href="https://console.developers.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Developer Console</a>, 
                create a project, enable the YouTube Data API v3, and create credentials.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={saveApiKey}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeySetup;
