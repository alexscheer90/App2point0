import { useQuery } from '@tanstack/react-query';
import { fetchPodcastFeed, PodcastEpisode, PodcastInfo } from '../services/podcastFeedParser';

/**
 * Hook to fetch and manage podcast data
 */
export function usePodcast() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/podcast'],
    queryFn: async () => {
      try {
        const data = await fetchPodcastFeed();
        return data;
      } catch (error) {
        console.error('Error in usePodcast hook:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const info: PodcastInfo | undefined = data?.info;
  const episodes: PodcastEpisode[] = data?.episodes || [];
  const featuredEpisode = episodes.find(ep => ep.featured);
  const regularEpisodes = episodes.filter(ep => !ep.featured);

  return {
    info,
    episodes,
    featuredEpisode,
    regularEpisodes,
    isLoading,
    error,
  };
}