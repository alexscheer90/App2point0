import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import FavoriteSchoolBanner from "./components/FavoriteSchoolBanner";
import FavoriteSchoolModal from "./components/FavoriteSchoolModal";
import { NotificationProvider } from "./contexts/NotificationContext";

import ScoresPage from "./pages/ScoresPage";
import StandingsPage from "./pages/StandingsPage";
import NewsPage from "./pages/NewsPage";
import SchoolsPage from "./pages/SchoolsPage";
import SchoolProfile from "./pages/SchoolProfile";
import RivalriesPage from "./pages/RivalriesPage";
import SoundsPage from "./pages/SoundsPage";
import LocalEatsPage from "./pages/LocalEatsPage";
import PodcastPage from "./pages/PodcastPage";
import SchedulePage from "./pages/SchedulePage";
import TestNotificationsPage from "./pages/TestNotificationsPage";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function App() {
  console.log("App component rendering");
  
  try {
    const [location] = useLocation();
    console.log("Current location:", location);
    
    const [showFavoriteModal, setShowFavoriteModal] = useState(false);
    
    // Extract the current tab from the location
    const currentRoute = location === "/" ? "/scores" : location;
    console.log("Current route:", currentRoute);
    
    return (
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg">
            {console.log("Rendering Header")}
            <Header />
            
            {console.log("Rendering FavoriteSchoolBanner")}
            <FavoriteSchoolBanner onChangeFavorite={() => setShowFavoriteModal(true)} />
            
            <main className="flex-1 overflow-y-auto pb-16">
              {console.log("Setting up routes")}
              <Switch>
                <Route path="/" component={ScoresPage} />
                <Route path="/scores" component={ScoresPage} />
                <Route path="/standings" component={StandingsPage} />
                <Route path="/news" component={NewsPage} />
                <Route path="/schools" component={SchoolsPage} />
                <Route path="/schools/:id" component={SchoolProfile} />
                <Route path="/schedule" component={SchedulePage} />
                <Route path="/rivalries" component={RivalriesPage} />
                <Route path="/sounds" component={SoundsPage} />
                <Route path="/eats" component={LocalEatsPage} />
                <Route path="/podcast" component={PodcastPage} />
                <Route path="/test-notifications" component={TestNotificationsPage} />
                <Route component={NotFound} />
              </Switch>
            </main>
            
            {console.log("Rendering BottomNav")}
            <BottomNav activeTab={currentRoute.substring(1).split('/')[0]} />
            
            {console.log("Rendering FavoriteSchoolModal")}
            <FavoriteSchoolModal 
              isOpen={showFavoriteModal} 
              onClose={() => setShowFavoriteModal(false)}
            />
          </div>
          <Toaster />
        </NotificationProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("Error in App component:", error);
    return <div className="error-boundary p-4 text-red-500">An error occurred while rendering the app. Check console for details.</div>;
  }
}

export default App;
