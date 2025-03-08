import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Clock, Eye, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string, options?: SearchOptions) => void;
  initialValue?: string;
  showAdvanced?: boolean;
}

export interface SearchOptions {
  maxResults?: number;
  order?: string;
  duration?: string;
}

const SearchBar = ({ onSearch, initialValue = '', showAdvanced = false }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    maxResults: 25,
    order: 'relevance',
    duration: 'any'
  });

  useEffect(() => {
    // Load recent searches from localStorage on component mount
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // If initialValue changes, update the query state
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Add the search to recent searches
      const newRecentSearches = [
        query,
        ...recentSearches.filter(item => item !== query)
      ].slice(0, 5); // Keep only the 5 most recent searches
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      setShowRecent(false);
      onSearch(query, searchOptions);
    }
  };

  const selectRecentSearch = (search: string) => {
    setQuery(search);
    setShowRecent(false);
    onSearch(search, searchOptions);
  };

  const clearInput = () => {
    setQuery('');
    setShowRecent(false);
  };

  const toggleAdvanced = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSearchOptions(prev => ({
      ...prev,
      [id]: id === 'maxResults' ? parseInt(value) : value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full relative"
    >
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for videos with transcripts..."
            className="w-full h-14 px-5 pl-12 pr-24 rounded-xl border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none transition-all duration-300"
            onFocus={() => {
              if (recentSearches.length > 0) setShowRecent(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowRecent(false), 200);
            }}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          
          {query && (
            <button 
              type="button"
              onClick={clearInput}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <motion.button 
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAdvanced}
              className={cn(
                "p-2 rounded-lg text-muted-foreground transition-colors",
                isExpanded && "bg-muted text-primary"
              )}
              aria-label="Toggle advanced search"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </motion.button>
            
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-transform"
            >
              Search
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {showRecent && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 right-0 z-10 bg-background border border-border rounded-xl shadow-lg p-2"
            >
              <h3 className="text-xs font-medium text-muted-foreground px-3 py-2">Recent Searches</h3>
              <ul>
                {recentSearches.map((search, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => selectRecentSearch(search)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg text-sm flex items-center gap-2"
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {(showAdvanced || isExpanded) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-xl border border-border bg-background shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="order" className="block text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> Sort By
                  </label>
                  <select 
                    id="order"
                    value={searchOptions.order}
                    onChange={handleOptionChange}
                    className="w-full p-2 text-sm rounded-lg border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Date (newest)</option>
                    <option value="rating">Rating</option>
                    <option value="viewCount">View count</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="duration" className="block text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Duration
                  </label>
                  <select 
                    id="duration" 
                    value={searchOptions.duration}
                    onChange={handleOptionChange}
                    className="w-full p-2 text-sm rounded-lg border border-border bg-background focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
                  >
                    <option value="any">Any</option>
                    <option value="short">Short (&lt; 4 minutes)</option>
                    <option value="medium">Medium (4-20 minutes)</option>
                    <option value="long">Long (&gt; 20 minutes)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="maxResults" className="block text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Results
                  </label>
                  <select 
                    id="maxResults" 
                    value={searchOptions.maxResults}
                    onChange={handleOptionChange}
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
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

export default SearchBar;
