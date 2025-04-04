import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FavoriteSchoolBanner from "./components/FavoriteSchoolBanner";
import FavoriteSchoolModal from "./components/FavoriteSchoolModal";

import ScoresPage from "./pages/ScoresPage";
import StandingsPage from "./pages/StandingsPage";
import NewsPage from "./pages/NewsPage";
import SchoolsPage from "./pages/SchoolsPage";
import SchoolProfile from "./pages/SchoolProfile";
import RivalriesPage from "./pages/RivalriesPage";
import SoundsPage from "./pages/SoundsPage";
import LocalEatsPage from "./pages/LocalEatsPage";
import PodcastPage from "./pages/PodcastPage";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function App() {
  const [location] = useLocation();
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  
  // Extract the current tab from the location
  const currentRoute = location === "/" ? "/scores" : location;
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg">
        <Header 
          activeTab={currentRoute.substring(1).split('/')[0]} 
        />
        
        <FavoriteSchoolBanner onChangeFavorite={() => setShowFavoriteModal(true)} />
        
        <main className="flex-1 overflow-y-auto pb-16">
          <Switch>
            <Route path="/" component={ScoresPage} />
            <Route path="/scores" component={ScoresPage} />
            <Route path="/standings" component={StandingsPage} />
            <Route path="/news" component={NewsPage} />
            <Route path="/schools" component={SchoolsPage} />
            <Route path="/schools/:id" component={SchoolProfile} />
            <Route path="/rivalries" component={RivalriesPage} />
            <Route path="/sounds" component={SoundsPage} />
            <Route path="/eats" component={LocalEatsPage} />
            <Route path="/podcast" component={PodcastPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        
        <BottomNav activeTab={currentRoute.substring(1).split('/')[0]} />
        
        <FavoriteSchoolModal 
          isOpen={showFavoriteModal} 
          onClose={() => setShowFavoriteModal(false)}
        />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
