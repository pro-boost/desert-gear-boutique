
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = (threshold = 300) => {
  const { pathname } = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  // Handle scroll event to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > threshold);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return { showBackToTop, scrollToTop };
};
