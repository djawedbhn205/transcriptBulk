
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { KeyRound, Settings } from 'lucide-react';
import ApiKeySetup from '../settings/ApiKeySetup';
import YoutubeService from '@/services/YoutubeService';

const HeaderActions = () => {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const hasApiKey = YoutubeService.hasApiKey();
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={hasApiKey ? "outline" : "default"} 
        size="sm" 
        onClick={() => setApiKeyDialogOpen(true)}
        className="flex items-center gap-1.5"
      >
        <KeyRound className="h-4 w-4" />
        {hasApiKey ? 'Update API Key' : 'Set API Key'}
      </Button>
      
      <ApiKeySetup open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen} />
    </div>
  );
};

export default HeaderActions;
