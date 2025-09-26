import { useState, useEffect } from 'react';

interface UseLoadingStateProps {
  initialLoading?: boolean;
  delay?: number;
}

export const useLoadingState = ({ initialLoading = false, delay = 200 }: UseLoadingStateProps = {}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      // Delay showing loader to prevent flicker for fast operations
      timer = setTimeout(() => setShowLoader(true), delay);
    } else {
      setShowLoader(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, delay]);

  return {
    isLoading,
    showLoader,
    setIsLoading,
    startLoading: () => setIsLoading(true),
    stopLoading: () => setIsLoading(false),
  };
};