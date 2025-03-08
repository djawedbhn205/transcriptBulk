
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M21 5H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zm-1 11h-8v-2h-2v2H4V7h16v9z" 
                  fill="white"
                />
                <path d="M10 9H8v2h2V9zm4 0h-2v2h2V9zm4 0h-2v2h2V9z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">Transcript</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Transcript. All rights reserved.
          </div>
          
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link to="/search" className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity">Search</Link></li>
              <li><Link to="/about" className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity">About</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
