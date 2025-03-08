
import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <Layout>
      <div className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-16"
          >
            <div className="space-y-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About Transcript</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A tool designed for researchers, content creators, and anyone who needs quick access to video transcripts.
              </p>
            </div>
            
            <div className="space-y-12">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Our Mission</h2>
                <p className="text-muted-foreground">
                  We created this tool to simplify the process of working with video content. Transcripts make videos searchable, accessible, and more useful for a variety of purposes - from content research to data analysis.
                </p>
                <p className="text-muted-foreground">
                  Our mission is to help users easily find and extract the information they need from video content without the hassle of manual transcription or complex workflows.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">How It Works</h2>
                <p className="text-muted-foreground">
                  Our tool leverages YouTube's API to search for videos that have closed captions available. When you select videos for download, we extract the transcript content, clean up the formatting, and provide you with readable text files.
                </p>
                <p className="text-muted-foreground">
                  The clean transcripts remove timestamps, speaker identifications, and other markup that might clutter the text, giving you just the content you need.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Use Cases</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl neo-glass">
                    <h3 className="text-lg font-medium mb-2">Academic Research</h3>
                    <p className="text-muted-foreground">
                      Extract interview content, lectures, or presentation transcripts for qualitative research.
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-xl neo-glass">
                    <h3 className="text-lg font-medium mb-2">Content Creation</h3>
                    <p className="text-muted-foreground">
                      Repurpose video content into blog posts, articles, or other written formats.
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-xl neo-glass">
                    <h3 className="text-lg font-medium mb-2">Data Analysis</h3>
                    <p className="text-muted-foreground">
                      Perform text analysis on large collections of video transcripts to identify patterns.
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-xl neo-glass">
                    <h3 className="text-lg font-medium mb-2">Accessibility</h3>
                    <p className="text-muted-foreground">
                      Make video content accessible to those who prefer or need text-based formats.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="text-center space-y-6">
                <h2 className="text-2xl font-semibold">Ready to Start?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Try our transcript tool now and streamline your video content workflow.
                </p>
                <Link 
                  to="/search" 
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-[1.02] active:scale-[.98]"
                >
                  <span>Start Searching</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
