import { useEffect } from 'react';

export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      // Cleanup
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ref, callback]);
};