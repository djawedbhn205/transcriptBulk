
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { KeyRound, Settings, Check } from 'lucide-react';
import ApiKeySetup from '../settings/ApiKeySetup';
import YoutubeService from '@/services/YoutubeService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const HeaderActions = () => {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const hasApiKey = YoutubeService.hasApiKey();
  
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={hasApiKey ? "outline" : "default"} 
            size="sm" 
            onClick={() => setApiKeyDialogOpen(true)}
            className="flex items-center gap-1.5"
          >
            {hasApiKey ? <Check className="h-4 w-4 text-green-500" /> : <KeyRound className="h-4 w-4" />}
            {hasApiKey ? 'API Key Set' : 'Set API Key'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {hasApiKey 
              ? 'Your YouTube API key is set. Click to update it.' 
              : 'Set your YouTube API key to enable searches'}
          </p>
        </TooltipContent>
      </Tooltip>
      
      <ApiKeySetup open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen} />
    </div>
  );
};

export default HeaderActions;
