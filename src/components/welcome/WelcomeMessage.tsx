
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, KeyRound, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: "Search Videos with Transcripts",
    description: "Find YouTube videos with detailed filtering options",
    icon: <Search className="h-5 w-5 text-primary" />
  },
  {
    title: "Download Clean Transcripts",
    description: "Extract and save transcripts in text format",
    icon: <CircleCheck className="h-5 w-5 text-primary" />
  },
  {
    title: "API Key Required",
    description: "Use your YouTube Data API key for real data",
    icon: <KeyRound className="h-5 w-5 text-primary" />
  }
];

const WelcomeMessage = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-4xl mx-auto my-12"
    >
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to YouTube Transcript Tool</CardTitle>
          <CardDescription>
            Start searching for videos and extract transcripts for your projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg border border-border/60 bg-card flex flex-col items-center text-center"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Set your YouTube API key from the top right menu</li>
              <li>Search for videos using keywords or channel ID</li>
              <li>Select videos from the results</li>
              <li>Download transcripts with a single click</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/search')}
            className="px-8"
          >
            Get Started
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default WelcomeMessage;
