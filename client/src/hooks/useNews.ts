import { useQuery } from '@tanstack/react-query';
import { NewsItem } from '@shared/schema';
import { fetchSchoolNewsFeed, fetchAllSchoolsNews, schoolFeedUrls } from '../services/newsFeedParser';
import { useState, useCallback } from 'react';

// Hook to fetch news items from all schools or a specific school
export function useNews(schoolId: string = 'all') {
  const [displayCount, setDisplayCount] = useState(5);
  
  const { data: allNews, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['news', schoolId],
    queryFn: async () => {
      if (schoolId === 'all') {
        // Fetch news from all schools
        return fetchAllSchoolsNews();
      } else {
        // Fetch news from a specific school
        const feedUrl = schoolFeedUrls[schoolId];
        if (!feedUrl) {
          console.warn(`No RSS feed URL configured for school: ${schoolId}`);
          return [];
        }
        return fetchSchoolNewsFeed(schoolId, feedUrl);
      }
    },
    // Keep data fresh but don't re-fetch too often
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // If we have news items, split them into featured and regular news
  const featuredNews = (allNews && allNews.length > 0) ? [allNews[0]] : [];
  const regularNews = (allNews && allNews.length > 1) 
    ? allNews.slice(1, Math.min(displayCount + 1, allNews.length)) 
    : [];
    
  // Function to load more news items
  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + 5);
  }, []);
  
  // Determine if there are more news items to load
  const hasMore = allNews ? regularNews.length < allNews.length - 1 : false;
  
  return {
    featuredNews,
    regularNews,
    isLoading,
    error,
    loadMore,
    hasMore
  };
}

// Convenience hook specifically for school news
export function useSchoolNews(schoolId: string) {
  return useNews(schoolId);
}