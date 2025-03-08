
import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../search/SearchBar';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-blue-50 to-transparent -z-10" />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100">
              <span className="text-xs font-medium text-primary">YouTube Transcript Tool</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-balance">
              Find and extract transcripts with precision
            </h1>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
              Search through YouTube videos with transcripts and download clean, formatted text versions for your projects.
            </p>
            
            <SearchBar onSearch={handleSearch} />
            
            <div className="mt-8 text-sm text-muted-foreground">
              Try searching for: <button className="text-primary hover:underline mx-1" onClick={() => handleSearch("apple keynote")}>apple keynote</button> or 
              <button className="text-primary hover:underline mx-1" onClick={() => handleSearch("ted talks")}>ted talks</button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-background to-transparent -z-10" />
    </section>
  );
};

export default Hero;
