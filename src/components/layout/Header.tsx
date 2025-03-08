
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 h-16 glass z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M21 5H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm-1 11h-8v-2h-2v2H4V7h16v9z" 
                fill="white"
              />
              <path d="M10 9H8v2h2V9zm4 0h-2v2h2V9zm4 0h-2v2h2V9z" fill="white" />
            </svg>
          </div>
          <span className="font-semibold text-base text-foreground">Transcript</span>
        </Link>
        
        <nav className="hidden md:flex">
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Home</Link></li>
            <li><Link to="/search" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Search</Link></li>
            <li><Link to="/about" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">About</Link></li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
