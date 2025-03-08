
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  showAdvanced?: boolean;
}

const SearchBar = ({ onSearch, initialValue = '', showAdvanced = false }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for videos with transcripts..."
            className="w-full h-14 px-5 pl-12 rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
            onFocus={() => setIsExpanded(true)}
            onBlur={() => !showAdvanced && setIsExpanded(false)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[.98]"
          >
            Search
          </button>
        </div>
        
        {(showAdvanced || isExpanded) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-4 rounded-xl border border-border bg-background shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="sort" className="block text-xs font-medium text-muted-foreground">
                  Sort By
                </label>
                <select 
                  id="sort"
                  className="w-full p-2 text-sm rounded-lg border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date (newest)</option>
                  <option value="rating">Rating</option>
                  <option value="viewCount">View count</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="block text-xs font-medium text-muted-foreground">
                  Duration
                </label>
                <select 
                  id="duration" 
                  className="w-full p-2 text-sm rounded-lg border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
                >
                  <option value="any">Any</option>
                  <option value="short">Short (< 4 minutes)</option>
                  <option value="medium">Medium (4-20 minutes)</option>
                  <option value="long">Long (> 20 minutes)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="results" className="block text-xs font-medium text-muted-foreground">
                  Results
                </label>
                <select 
                  id="results" 
                  className="w-full p-2 text-sm rounded-lg border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
                >
                  <option value="10">10 results</option>
                  <option value="25">25 results</option>
                  <option value="50">50 results</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default SearchBar;
