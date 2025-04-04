import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNews } from "../lib/api";
import { NewsItem } from "@shared/schema";

export function useNews(schoolId: string = "all") {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  
  const { data: allNews, isLoading } = useQuery({
    queryKey: [`/api/news${schoolId === "all" ? "" : `/${schoolId}`}`],
    queryFn: () => getNews(schoolId),
  });
  
  // Split news into featured and regular
  const featuredNews = allNews && allNews.length > 0 ? [allNews[0]] : [];
  
  // Paginate regular news
  const regularNewsAll = allNews ? allNews.slice(1) : [];
  const regularNews = regularNewsAll.slice(0, page * pageSize);
  
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const hasMore = regularNews.length < regularNewsAll.length;
  
  return {
    featuredNews,
    regularNews,
    isLoading,
    loadMore,
    hasMore,
  };
}

export function useSchoolNews(schoolId: string) {
  const { data: news, isLoading } = useQuery({
    queryKey: [`/api/schools/${schoolId}/news`],
    queryFn: () => getNews(schoolId),
  });
  
  return { news: news || [], isLoading };
}
