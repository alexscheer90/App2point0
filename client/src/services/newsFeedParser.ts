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
    
    // We proxy through our server to avoid CORS issues
    const response = await axios.get(`/api/fetch-rss?url=${encodeURIComponent(feedUrl)}`, {
      // Set responseType to 'text' to ensure we get the raw XML
      responseType: 'text'
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch RSS feed, status: ${response.status}`);
    }

    // Always use the response.data as a string
    const xml = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    return await parseRssFeed(xml, schoolId);
  } catch (error) {
    console.error(`Error fetching news feed for ${schoolId}:`, error);
    return [];
  }
}

/**
 * Parses RSS XML content into structured NewsItem objects
 */
async function parseRssFeed(xml: string, schoolId: string): Promise<NewsItem[]> {
  try {
    console.log("Parsing XML feed for school:", schoolId);
    
    try {
      // Sometimes the RSS feed returns HTML instead of XML, so we'll check for that
      if (xml.includes('<!DOCTYPE html>') || xml.includes('<html')) {
        console.warn("Received HTML instead of XML feed.");
        return [];
      }
      
      // Load the XML content with proper options
      const $ = cheerio.load(xml, { 
        xmlMode: true
      });
      
      const items: NewsItem[] = [];
  
      // Debug the XML structure
      if (schoolId === 'ballstate') {
        console.log("Ball State XML structure debug:");
        console.log("Number of item elements:", $('item').length);
        
        // Extract the first item element to debug its structure
        const firstItem = $('item').first();
        if (firstItem.length > 0) {
          console.log("First item structure:", {
            tagName: firstItem.prop('tagName'),
            title: firstItem.find('title').text(),
            link: firstItem.find('link').text(),
            hasDescription: firstItem.find('description').length > 0,
            descriptionLength: firstItem.find('description').text().length
          });
        }
      }
      
      // Find all RSS items/entries
      $('item, entry').each((i, element) => {
        try {
          const el = $(element);
          const title = el.find('title').text().trim();
          
          if (!title) {
            console.warn("Found item without title, skipping");
            return; // Skip items without title
          }
          
          // Get link - Ball State has a different structure
          let link = '';
          if (schoolId === 'ballstate') {
            // Direct child text node for 'link'
            link = el.children('link').text().trim();
          } else {
            link = el.find('link').text().trim();
            // Try for link with href attribute if text node is empty
            if (!link) {
              const linkWithAttr = el.find('link[href]').attr('href');
              if (linkWithAttr) {
                link = linkWithAttr;
              }
            }
          }
          
          // If we still don't have a link, use a default based on schoolId
          if (!link) {
            if (schoolId === 'ballstate') {
              link = `https://ballstatesports.com/`;
            } else if (schoolId === 'toledo') {
              link = `https://utrockets.com/`;
            } else {
              link = `https://getsomemaction.com/`;
            }
          }
          
          // Get publication date
          const pubDate = el.find('pubDate, published').text().trim();
          
          // Try to get description/content
          let description = '';
          
          // Ball State puts description in CDATA
          if (schoolId === 'ballstate') {
            // Get raw description with CDATA
            description = el.find('description').html() || '';
            // Remove CDATA tags if present
            description = description.replace(/^<!\[CDATA\[|\]\]>$/g, '');
          } else {
            description = el.find('description').text().trim();
            if (!description) {
              description = el.find('content\\:encoded, content, summary').text().trim();
            }
          }
          
          console.log(`Processing news item: "${title.substring(0, 30)}..."`);
          
          // Try to extract an image URL from the description
          let imageUrl: string | undefined = undefined;
          if (description) {
            try {
              // Load the description as HTML
              const descriptionHtml = cheerio.load(description);
              const img = descriptionHtml('img').first();
              if (img.length > 0) {
                imageUrl = img.attr('src');
                // Fix relative URLs
                if (imageUrl && !imageUrl.startsWith('http')) {
                  if (schoolId === 'ballstate') {
                    imageUrl = `https://ballstatesports.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                  }
                }
              }
            } catch (descError) {
              console.warn("Could not parse HTML in description", descError);
            }
          }
          
          // Also check for media:content or enclosure tags for images
          if (!imageUrl) {
            const mediaContent = el.find('media\\:content[medium="image"], media\\:thumbnail, enclosure[type^="image"]');
            if (mediaContent.length > 0) {
              imageUrl = mediaContent.attr('url') || mediaContent.attr('src');
            }
          }
          
          // If we still don't have an image, use school-specific fallback
          if (!imageUrl) {
            if (schoolId === 'ballstate') {
              imageUrl = "https://ballstatesports.com/images/logos/site/site.png";
            } else if (schoolId === 'toledo') {
              imageUrl = "https://static.gozips.com/images/logos/toledo.png";
            } else {
              imageUrl = "https://getsomemaction.com/images/logos/mac-logo.png";
            }
          }
          
          // Clean up HTML from the description to use as summary
          let summary = "No description available.";
          if (description) {
            summary = description.replace(/<\/?[^>]+(>|$)/g, " ").trim(); // Remove HTML tags
          }
          
          // Create a unique ID - avoiding Node's Buffer which isn't available in browser
          // Use a more robust hash function with a timestamp to ensure uniqueness
          const hashStr = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
              const char = str.charCodeAt(i);
              hash = ((hash << 5) - hash) + char;
              hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash).toString(16).substring(0, 8);
          };
          
          // Add a unique suffix based on position in the feed to ensure uniqueness
          const timestamp = Date.now();
          const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          const id = `${schoolId}-${hashStr(title)}-${timestamp.toString().slice(-6)}-${randomSuffix}`;
  
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
          console.log(`Successfully parsed news item: "${title.substring(0, 30)}..." for ${schoolId}`);
        } catch (itemError) {
          console.error("Error parsing individual RSS item", itemError);
          console.error(itemError);
        }
      });
  
      console.log(`Successfully parsed ${items.length} news items for ${schoolId}`);
      
      // If we couldn't parse any items, fetch directly from the API
      if (items.length === 0) {
        console.warn("No items were successfully parsed. Trying direct fetch method.");
        try {
          if (schoolId === 'ballstate') {
            // Ball State uses Sidearm CMS which has a JSON news API
            const newsResponse = await fetch('https://ballstatesports.com/services/archives.ashx?path=general');
            if (newsResponse.ok) {
              const newsData = await newsResponse.json();
              if (Array.isArray(newsData) && newsData.length > 0) {
                return newsData.slice(0, 10).map((item, index) => ({
                  id: `${schoolId}-direct-${Date.now().toString().slice(-6)}-${index}-${Math.floor(Math.random() * 1000)}`,
                  schoolId,
                  title: item.headline,
                  summary: item.teaser || "Latest news from Ball State Athletics",
                  publishedAt: new Date(item.posted).toISOString(),
                  url: `https://ballstatesports.com${item.url}`,
                  imageUrl: item.photo ? `https://ballstatesports.com${item.photo}` : "https://ballstatesports.com/images/logos/site/site.png"
                }));
              }
            }
          }
        } catch (directFetchError) {
          console.error("Direct fetch method failed:", directFetchError);
        }
        
        // If direct fetch also fails, return empty array
        console.warn("Direct fetch also failed. No news available for this school at the moment.");
        return [];
      }
      
      return items;
    } catch (parseError) {
      console.error("Error during XML parsing:", parseError);
      return [];
    }
  } catch (error) {
    console.error('Error in parseRssFeed function:', error);
    return [];
  }
}

/**
 * Maps school IDs to their respective RSS feed URLs
 */
export const schoolFeedUrls: Record<string, string> = {
  'akron': 'https://gozips.com/rss?path=general',
  'ballstate': 'https://ballstatesports.com/rss?path=general',
  'bowlinggreen': 'https://bgsufalcons.com/rss?path=general',
  'buffalo': 'http://www.ubbulls.com/rss?path=general',
  'centralmichigan': 'https://cmuchippewas.com/rss?path=general',
  'easternmichigan': 'https://emueagles.com/rss.aspx?path=gen',
  'kentstate': 'http://kentstatesports.com/rss.aspx?path=general',
  'massachusetts': 'https://umassathletics.com/rss?path=general',
  'miamioh': 'https://miamiredhawks.com/rss?path=general',
  'northernillinois': 'https://niuhuskies.com/rss?path=general',
  'ohio': 'https://ohiobobcats.com/rss?path=general',
  'toledo': 'https://utrockets.com/rss?path=general',
  'westernmichigan': 'https://wmubroncos.com/rss?path=general'
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