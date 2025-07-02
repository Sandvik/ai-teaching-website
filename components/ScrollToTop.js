import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Tjek om knappen skal vises baseret på scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll til toppen af siden
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Håndter keyboard shortcuts
  const handleKeyDown = (event) => {
    // Escape key scroll til toppen
    if (event.key === 'Escape') {
      scrollToTop();
    }
  };

  // Lyt efter scroll events og keyboard events
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-sage-600 hover:bg-sage-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
          aria-label="Scroll to top (or press Escape)"
          title="Scroll to top (or press Escape)"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
} 