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
    console.log("Parsing XML feed for school:", schoolId);
    
    // Load the XML content with proper options
    const $ = cheerio.load(xml, { 
      xmlMode: true,
      decodeEntities: true
    });
    
    const items: NewsItem[] = [];

    // Find all RSS items/entries
    $('item, entry').each((i, element) => {
      try {
        const title = $(element).find('title').text().trim();
        
        // Try different ways to get the link
        let link = $(element).find('link').text().trim();
        if (!link) {
          const linkWithAttr = $(element).find('link[href]').attr('href');
          if (linkWithAttr) {
            link = linkWithAttr;
          }
        }
        
        const pubDate = $(element).find('pubDate, published').text().trim();
        
        // Try different ways to get the description
        let description = $(element).find('description').text().trim();
        if (!description) {
          description = $(element).find('content\\:encoded, content, summary').text().trim();
        }
        
        console.log(`Found item: "${title.substring(0, 30)}..."`, link ? "has link" : "no link");
        
        // Try to extract an image URL from the description
        let imageUrl: string | undefined = undefined;
        if (description) {
          try {
            const descriptionHtml = cheerio.load(description);
            const img = descriptionHtml('img').first();
            if (img.length > 0) {
              imageUrl = img.attr('src');
            }
          } catch (descError) {
            console.warn("Could not parse HTML in description:", descError);
          }
        }
        
        // Also check for media:content or enclosure tags for images
        if (!imageUrl) {
          const mediaContent = $(element).find('media\\:content[medium="image"], media\\:thumbnail, enclosure[type^="image"]');
          if (mediaContent.length > 0) {
            imageUrl = mediaContent.attr('url') || mediaContent.attr('src');
          }
        }
        
        // Clean up HTML from the description to use as summary
        const summary = description
          ? description.replace(/<\/?[^>]+(>|$)/g, " ").trim() // Remove HTML tags
          : "";
        
        // Create a unique ID
        const id = `${schoolId}-${Buffer.from(link || title).toString('base64').substring(0, 12)}`;

        // Compute a valid date or use current time as fallback
        let publishedDate: Date;
        try {
          publishedDate = new Date(pubDate);
          // Check if date is valid
          if (isNaN(publishedDate.getTime())) {
            publishedDate = new Date();
          }
        } catch (dateError) {
          publishedDate = new Date();
        }

        // Create the news item
        const newsItem: NewsItem = {
          id,
          schoolId,
          title,
          summary: summary.substring(0, 200) + (summary.length > 200 ? '...' : ''),
          publishedAt: publishedDate.toISOString(),
          url: link,
          imageUrl
        };

        items.push(newsItem);
      } catch (itemError) {
        console.error("Error parsing individual RSS item:", itemError);
      }
    });

    console.log(`Successfully parsed ${items.length} news items for ${schoolId}`);
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
  'toledo': 'https://utrockets.com/rss?path=general',
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