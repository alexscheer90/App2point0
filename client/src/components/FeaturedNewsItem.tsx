import { NewsItem } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import ShareButton from "./ShareButton";

interface FeaturedNewsItemProps {
  news: NewsItem;
  onClick: (newsItem: NewsItem) => void;
}

const FeaturedNewsItem = ({ news, onClick }: FeaturedNewsItemProps) => {
  const { data: schools } = useMacSchools();
  
  if (!schools) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4 animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  
  const school = schools.find(s => s.id === news.schoolId);
  
  if (!school) {
    return null;
  }
  
  const timeAgo = formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true });
  
  // Create a share URL for the news item
  const shareUrl = `/news/${news.id}`;
  
  const handleShareClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent any parent onClick from firing
    e.stopPropagation();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-4">
      {news.imageUrl ? (
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-48 object-cover" 
        />
      ) : (
        <div 
          className="w-full h-48 flex items-center justify-center"
          style={{ backgroundColor: school.primaryColor }}
        >
          <span className="text-4xl font-bold" style={{ color: school.secondaryColor }}>
            {school.shortName}
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div 
              className="w-5 h-5 mr-2 rounded-full flex items-center justify-center"
              style={{ backgroundColor: school.primaryColor }}
            >
              <span className="text-xs font-bold" style={{ color: school.secondaryColor }}>
                {school.shortName.charAt(0)}
              </span>
            </div>
            <span className="text-xs text-gray-600">{school.name} • {timeAgo}</span>
          </div>
          
          <div onClick={handleShareClick}>
            <ShareButton 
              url={shareUrl}
              title={`${news.title} - Mobile #MACtion`}
              description={news.summary}
              compact={true}
            />
          </div>
        </div>
        <h3 className="font-bold text-lg mb-1">{news.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{news.summary}</p>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="link" 
            className="p-0 h-auto text-[#C8102E] text-sm font-medium"
            onClick={() => onClick(news)}
          >
            Read More
          </Button>
          
          <div onClick={handleShareClick} className="md:hidden">
            <ShareButton 
              url={shareUrl}
              title={`${news.title} - Mobile #MACtion`}
              description={news.summary}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsItem;
