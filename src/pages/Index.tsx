
import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/hero/Hero';
import { ArrowRight, Search, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <Hero />
      
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Our tool makes it easy to find and extract transcripts from YouTube videos in just a few simple steps.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Search Videos</h3>
              <p className="text-muted-foreground">
                Enter keywords or a YouTube channel ID to find videos with available transcripts.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Select Content</h3>
              <p className="text-muted-foreground">
                Choose the videos you want transcripts for from the search results.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-4">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Download Transcripts</h3>
              <p className="text-muted-foreground">
                Get clean, formatted transcript text files for your selected videos.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium transition-transform hover:scale-[1.02] active:scale-[.98]"
            >
              <span>Start Searching</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Use Our Tool</h2>
            <p className="text-lg text-muted-foreground">
              Our YouTube transcript tool offers several advantages for researchers, content creators, and anyone working with video content.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Time Efficiency",
                description: "Save hours of manual transcription work with our automated tool."
              },
              {
                title: "Clean Formatting",
                description: "Get well-formatted transcripts without timestamps or unnecessary markup."
              },
              {
                title: "Batch Processing",
                description: "Download multiple transcripts at once for efficient workflow."
              },
              {
                title: "Advanced Filtering",
                description: "Find exactly what you need with our powerful search filters."
              },
              {
                title: "Research Ready",
                description: "Perfect for academic research, content analysis, and more."
              },
              {
                title: "User Friendly",
                description: "Intuitive design makes finding and downloading transcripts easy."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="p-6 rounded-xl neo-glass"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
