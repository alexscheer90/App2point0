import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMacSchools } from "../hooks/useSchool";
import { useNews } from "../hooks/useNews";
import FeaturedNewsItem from "../components/FeaturedNewsItem";
import NewsItem from "../components/NewsItem";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsItem as NewsItemType } from "@shared/schema";

const NewsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsItemType | null>(null);
  const [showNewsDialog, setShowNewsDialog] = useState(false);
  
  const { data: schools, isLoading: isSchoolsLoading } = useMacSchools();
  const { 
    featuredNews, 
    regularNews, 
    isLoading: isNewsLoading,
    loadMore,
    hasMore
  } = useNews(selectedSchool);
  
  const handleFilterBySchool = (schoolId: string) => {
    setSelectedSchool(schoolId);
  };
  
  const handleNewsClick = (newsItem: NewsItemType) => {
    setSelectedNews(newsItem);
    setShowNewsDialog(true);
  };
  
  const handleCloseNewsDialog = () => {
    setShowNewsDialog(false);
  };
  
  const { data: schoolInfo } = useMacSchools();
  const newsSchool = selectedNews ? schoolInfo?.find(s => s.id === selectedNews.schoolId) : null;
  
  return (
    <div className="py-4">
      <div className="px-4 mb-4">
        <div className="relative">
          <Select 
            value={selectedSchool} 
            onValueChange={handleFilterBySchool}
            disabled={isSchoolsLoading}
          >
            <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#0B213E]">
              <SelectValue placeholder="Select a school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools?.map(school => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Featured News */}
      <div className="px-4 mb-6">
        {isNewsLoading ? (
          <Skeleton className="w-full h-72" />
        ) : featuredNews.length > 0 ? (
          <FeaturedNewsItem news={featuredNews[0]} onClick={handleNewsClick} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200 mb-4">
            <p className="text-gray-500">No featured news available.</p>
          </div>
        )}
      </div>
      
      {/* News List */}
      <div className="px-4">
        {isNewsLoading ? (
          <>
            <Skeleton className="w-full h-28 mb-3" />
            <Skeleton className="w-full h-28 mb-3" />
            <Skeleton className="w-full h-28 mb-3" />
          </>
        ) : regularNews.length > 0 ? (
          <>
            {regularNews.map(item => (
              <NewsItem key={item.id} news={item} onClick={handleNewsClick} />
            ))}
            
            {hasMore && (
              <Button 
                variant="ghost" 
                className="w-full py-3 text-sm text-[#0B213E] font-medium"
                onClick={loadMore}
              >
                Load More News
              </Button>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
            <p className="text-gray-500">No news available for the selected school.</p>
          </div>
        )}
      </div>
      
      {/* News dialog */}
      <Dialog open={showNewsDialog} onOpenChange={handleCloseNewsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNews?.title || "News"}</DialogTitle>
          </DialogHeader>
          
          {selectedNews && (
            <div>
              {selectedNews.imageUrl && (
                <img 
                  src={selectedNews.imageUrl} 
                  alt={selectedNews.title} 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
              )}
              
              <div className="flex items-center mb-3">
                {newsSchool && (
                  <div 
                    className="w-5 h-5 mr-2 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: newsSchool.primaryColor }}
                  >
                    <span className="text-xs font-bold" style={{ color: newsSchool.secondaryColor }}>
                      {newsSchool.shortName.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-600">
                  {newsSchool?.name} • {new Date(selectedNews.publishedAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">{selectedNews.content || selectedNews.summary}</p>
              
              {selectedNews.url && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(selectedNews.url, "_blank")}
                >
                  Read Full Article
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsPage;
