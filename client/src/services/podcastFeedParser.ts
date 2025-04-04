import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

// Define podcast episode interface
export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  imageUrl?: string;
  audioUrl: string;
  featured?: boolean;
}

// Define podcast info interface
export interface PodcastInfo {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  author: string;
}

// The MAC Sports Connection RSS feed URL
export const MAC_PODCAST_FEED_URL = 'https://rss.art19.com/mac-sports-connection-podcast';

/**
 * Fetches and parses the MAC Sports Connection podcast RSS feed
 * @returns Promise containing podcast info and episodes
 */
export async function fetchPodcastFeed(): Promise<{ 
  info: PodcastInfo; 
  episodes: PodcastEpisode[];
}> {
  try {
    // Use server proxy to avoid CORS issues
    const response = await axios.get('/api/fetch-podcast-rss');
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch podcast feed');
    }

    return parsePodcastFeed(response.data);
  } catch (error) {
    console.error('Error fetching podcast feed:', error);
    throw error;
  }
}

/**
 * Parses the podcast RSS XML content
 */
function parsePodcastFeed(xml: string): { 
  info: PodcastInfo; 
  episodes: PodcastEpisode[];
} {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      isArray: (name) => name === 'item',
    });
    
    const result = parser.parse(xml);
    const channel = result.rss.channel;
    
    // Parse podcast channel info
    let imageUrl = '';
    if (channel.image) {
      if (typeof channel.image === 'object') {
        imageUrl = channel.image.url || '';
      }
    } else if (channel['itunes:image']) {
      if (typeof channel['itunes:image'] === 'object') {
        imageUrl = channel['itunes:image']['@_href'] || '';
      }
    }
    
    const info: PodcastInfo = {
      title: channel.title || 'MAC Sports Connection',
      description: channel.description || '',
      link: channel.link || '',
      imageUrl,
      author: channel['itunes:author'] || 'MAC Sports Connection',
    };
    
    // Parse episodes
    let episodes: PodcastEpisode[] = [];
    
    if (channel.item && Array.isArray(channel.item)) {
      episodes = channel.item.map((item: any, index: number) => {
        // Parse duration to human readable format
        let duration = item['itunes:duration'] || '';
        if (duration && !isNaN(Number(duration))) {
          const mins = Math.floor(Number(duration) / 60);
          const secs = Number(duration) % 60;
          duration = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        // Parse publish date
        let date = '';
        try {
          const pubDate = new Date(item.pubDate);
          date = pubDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch (e) {
          date = item.pubDate || '';
        }
        
        // Get audio URL from enclosure
        let audioUrl = '';
        if (item.enclosure) {
          if (Array.isArray(item.enclosure)) {
            // If it's an array, get the first enclosure
            audioUrl = item.enclosure[0]?.['@_url'] || '';
          } else {
            // If it's a single object
            audioUrl = item.enclosure['@_url'] || '';
          }
        }
        
        // Handle guid which might be an object or a string
        let id = `episode-${index}`;
        if (item.guid) {
          if (typeof item.guid === 'object' && item.guid['#text']) {
            id = item.guid['#text'];
          } else if (typeof item.guid === 'string') {
            id = item.guid;
          }
        }
        
        return {
          id: id,
          title: item.title || `Episode ${index + 1}`,
          description: item.description || item['itunes:summary'] || '',
          date,
          duration: duration || 'Unknown',
          // Handle itunes:image which might have different structures
          imageUrl: typeof item['itunes:image'] === 'object' 
            ? (item['itunes:image']?.['@_href'] || info.imageUrl)
            : info.imageUrl,
          audioUrl,
          featured: index === 0, // Mark the latest episode as featured
        };
      });
    }
    
    return { info, episodes };
  } catch (error) {
    console.error('Error parsing podcast feed:', error);
    throw new Error('Failed to parse podcast feed');
  }
}