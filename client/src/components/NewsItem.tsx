import { NewsItem as NewsItemType } from "@shared/schema";
import { useMacSchools } from "../hooks/useSchool";
import { formatDistanceToNow } from "date-fns";

interface NewsItemProps {
  news: NewsItemType;
  onClick: (newsItem: NewsItemType) => void;
}

const NewsItem = ({ news, onClick }: NewsItemProps) => {
  const { data: schools } = useMacSchools();
  
  if (!schools) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-200 animate-pulse">
        <div className="flex">
          <div className="w-20 h-20 bg-gray-200 rounded mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const school = schools.find(s => s.id === news.schoolId);
  
  if (!school) {
    return null;
  }
  
  const timeAgo = formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true });
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(news)}
    >
      <div className="flex">
        {news.imageUrl ? (
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-20 h-20 rounded object-cover mr-3" 
          />
        ) : (
          <div 
            className="w-20 h-20 rounded mr-3 flex items-center justify-center"
            style={{ backgroundColor: school.primaryColor }}
          >
            <span className="text-xl font-bold" style={{ color: school.secondaryColor }}>
              {school.shortName.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <div 
              className="w-4 h-4 rounded-full mr-1 flex items-center justify-center"
              style={{ backgroundColor: school.primaryColor }}
            >
              <span className="text-[0.5rem] font-bold" style={{ color: school.secondaryColor }}>
                {school.shortName.charAt(0)}
              </span>
            </div>
            <span className="text-xs text-gray-600">{school.name} • {timeAgo}</span>
          </div>
          <h3 className="font-semibold text-sm mb-1">{news.title}</h3>
          <p className="text-xs text-gray-600 line-clamp-2">{news.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
