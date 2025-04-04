import axios from 'axios';
import * as cheerio from 'cheerio';
import { NewsItem } from '@shared/schema';

/**
 * Fetches and parses RSS news feeds from MAC school websites
 * @param schoolId The school ID to fetch news for
 * @param feedUrl The URL of the RSS feed
 * @returns Promise containing news items
 */
export async function fetchSchoolNewsFeed(schoolId: string, feedUrl: string): Promise<NewsItem[]> {
  try {
    console.log(`Fetching news for ${schoolId} from ${feedUrl}`);
    
    // In a production environment, this would call a backend API endpoint to avoid CORS issues
    // For now, we'll proxy through our server
    const response = await axios.get(`/api/fetch-rss?url=${encodeURIComponent(feedUrl)}`);
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch RSS feed, status: ${response.status}`);
    }

    const xml = response.data;
    return parseRssFeed(xml, schoolId);
  } catch (error) {
    console.error(`Error fetching news feed for ${schoolId}:`, error);
    return [];
  }
}

/**
 * Parses RSS XML content into structured NewsItem objects
 */
function parseRssFeed(xml: string, schoolId: string): NewsItem[] {
  try {
    const $ = cheerio.load(xml, { xmlMode: true });
    const items: NewsItem[] = [];

    $('item').each((i, element) => {
      const title = $(element).find('title').text().trim();
      const link = $(element).find('link').text().trim();
      const pubDate = $(element).find('pubDate').text().trim();
      const description = $(element).find('description').text().trim();
      
      // Try to extract an image URL from the description
      let imageUrl: string | undefined = undefined;
      if (description) {
        const descriptionHtml = cheerio.load(description);
        const img = descriptionHtml('img').first();
        if (img.length > 0) {
          imageUrl = img.attr('src');
        }
      }
      
      // Clean up HTML from the description to use as summary
      const summary = description
        ? description.replace(/<\/?[^>]+(>|$)/g, " ").trim() // Remove HTML tags
        : "";
      
      // Create a unique ID
      const id = `${schoolId}-${Buffer.from(link || title).toString('base64').substring(0, 12)}`;

      // Create the news item
      const newsItem: NewsItem = {
        id,
        schoolId,
        title,
        summary: summary.substring(0, 200) + (summary.length > 200 ? '...' : ''),
        publishedAt: new Date(pubDate).toISOString(),
        url: link,
        imageUrl
      };

      items.push(newsItem);
    });

    return items;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
}

/**
 * Maps school IDs to their respective RSS feed URLs
 */
export const schoolFeedUrls: Record<string, string> = {
  'toledo': 'http://utrockets.com/rss.aspx?path=general',
  // Add other schools' RSS feed URLs here as we find them
};

/**
 * Fetches news from all available school feeds
 */
export async function fetchAllSchoolsNews(): Promise<NewsItem[]> {
  const allNewsPromises = Object.entries(schoolFeedUrls).map(
    ([schoolId, feedUrl]) => fetchSchoolNewsFeed(schoolId, feedUrl)
  );
  
  const results = await Promise.all(allNewsPromises);
  return results.flat().sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}