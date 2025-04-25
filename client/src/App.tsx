import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect, useRef } from "react";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import FavoriteSchoolBanner from "./components/FavoriteSchoolBanner";
import FavoriteSchoolModal from "./components/FavoriteSchoolModal";
import { NotificationProvider } from "./contexts/NotificationContext";
import { lazyLoad } from "./utils/lazyLoad";

// Main pages - eagerly loaded because they're frequently accessed
import ScoresPage from "./pages/ScoresPage";
import SchedulePage from "./pages/SchedulePage";

// Lazily loaded pages
const StandingsPage = lazyLoad(() => import("./pages/StandingsPage"), 'page');
const NewsPage = lazyLoad(() => import("./pages/NewsPage"), 'page');
const SchoolsPage = lazyLoad(() => import("./pages/SchoolsPage"), 'page');
const SchoolProfile = lazyLoad(() => import("./pages/SchoolProfile"), 'page');
const RivalriesPage = lazyLoad(() => import("./pages/RivalriesPage"), 'page');
const SoundsPage = lazyLoad(() => import("./pages/SoundsPage"), 'page');
const LocalEatsPage = lazyLoad(() => import("./pages/LocalEatsPage"), 'page');
const PodcastPage = lazyLoad(() => import("./pages/PodcastPage"), 'page');
const GameStatsPage = lazyLoad(() => import("./pages/GameStatsPage"), 'page');
const GameDetails = lazyLoad(() => import("./pages/GameDetails"), 'page');
const TestNotificationsPage = lazyLoad(() => import("./pages/TestNotificationsPage"), 'page');
const AdminPage = lazyLoad(() => import("./pages/AdminPage"), 'page');
const NotFound = lazyLoad(() => import("@/pages/not-found"), 'page');

function App() {
  console.log("App component rendering");
  
  try {
    const [location] = useLocation();
    console.log("Current location:", location);
    
    const [showFavoriteModal, setShowFavoriteModal] = useState(false);
    const [showFooter, setShowFooter] = useState(false);
    const mainRef = useRef<HTMLElement>(null);
    
    // Handle scroll to show footer only when at bottom
    useEffect(() => {
      const handleScroll = () => {
        if (!mainRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
        // Show footer when scrolled to near the bottom (within 50px)
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
        setShowFooter(isNearBottom);
      };
      
      const mainElement = mainRef.current;
      if (mainElement) {
        mainElement.addEventListener('scroll', handleScroll);
        // Initial check in case page loads with content already at bottom
        handleScroll();
        return () => mainElement.removeEventListener('scroll', handleScroll);
      }
    }, [location]); // Re-run when location changes to handle different page lengths
    
    // Extract the current tab from the location
    const currentRoute = location === "/" ? "/scores" : location;
    console.log("Current route:", currentRoute);
    
    return (
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg">
            <Header />
            
            <FavoriteSchoolBanner onChangeFavorite={() => setShowFavoriteModal(true)} />
            
            <main ref={mainRef} className="flex-1 overflow-y-auto pb-20">
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
                <Route path="/games/:gameId" component={GameDetails} />
                <Route path="/test-notifications" component={TestNotificationsPage} />
                <Route path="/admin" component={AdminPage} />
                <Route component={NotFound} />
              </Switch>
            </main>
            
            {showFooter && <Footer />}
            <BottomNav activeTab={currentRoute.substring(1).split('/')[0]} />
            
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
