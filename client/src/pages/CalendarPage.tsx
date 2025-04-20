import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { useMacCalendarEvents } from "../hooks/useMacCalendarEvents";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import SportSelector from "../components/SportSelector";
import UpcomingGameCard from "../components/UpcomingGameCard";
import CompletedGameCard from "../components/CompletedGameCard";
import GameScoreCard from "../components/GameScoreCard";

const CalendarPage = () => {
  // Get current date at start of day
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [selectedSport, setSelectedSport] = useState<string>("all");
  
  // Format date for API call (YYYY-MM-DD)
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  
  // Fetch MAC calendar events for the selected date
  const { data: events, isLoading } = useMacCalendarEvents(formattedDate);
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };
  
  // Navigate to today
  const goToToday = () => {
    setCurrentDate(startOfDay(new Date()));
  };
  
  // Handle sport selection change
  const handleChangeSport = (sportId: string) => {
    setSelectedSport(sportId);
  };
  
  // Filter events by selected sport
  const filteredEvents = events?.filter(event => 
    selectedSport === "all" || event.sportId === selectedSport
  ) || [];
  
  // Separate events by status
  const liveEvents = filteredEvents.filter(event => event.status === "live");
  const upcomingEvents = filteredEvents.filter(event => event.status === "scheduled");
  const completedEvents = filteredEvents.filter(event => event.status === "final");
  
  // Sort events by start time
  const sortedUpcomingEvents = [...upcomingEvents].sort((a, b) => 
    new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime()
  );
  
  const sortedCompletedEvents = [...completedEvents].sort((a, b) => 
    new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime()
  );
  
  // Format displayed date
  const displayDate = format(currentDate, "EEEE, MMMM d, yyyy");
  const isToday = format(currentDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  
  const renderLoadingState = () => (
    <>
      <div className="px-4 mb-6">
        <Skeleton className="w-32 h-6 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
      </div>
      
      <div className="px-4">
        <Skeleton className="w-32 h-6 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
        <Skeleton className="w-full h-24 mb-3" />
      </div>
    </>
  );
  
  return (
    <div className="py-4">
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousDay}
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <h1 className="text-lg font-bold">{displayDate}</h1>
            </div>
            
            {!isToday && (
              <Button
                variant="link"
                size="sm"
                onClick={goToToday}
                className="text-xs p-0 h-auto mt-1"
              >
                Go to today
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextDay}
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <SportSelector
          selectedSport={selectedSport}
          onChange={handleChangeSport}
          showAllOption={true}
        />
      </div>
      
      {isLoading ? (
        renderLoadingState()
      ) : (
        <>
          {liveEvents.length > 0 && (
            <div className="px-4 mb-6">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 rounded-full bg-[#28A745] mr-2 animate-pulse"></div>
                <h2 className="font-bold text-lg">Live Games</h2>
              </div>
              
              {liveEvents.map(event => (
                <GameScoreCard key={event.id} game={event} />
              ))}
            </div>
          )}
          
          {sortedUpcomingEvents.length > 0 && (
            <div className="px-4 mb-6">
              <h2 className="font-bold text-lg mb-3">Upcoming Events</h2>
              
              {sortedUpcomingEvents.map(event => (
                <UpcomingGameCard key={event.id} game={event} />
              ))}
            </div>
          )}
          
          {sortedCompletedEvents.length > 0 && (
            <div className="px-4 mb-6">
              <h2 className="font-bold text-lg mb-3">Completed Events</h2>
              
              {sortedCompletedEvents.map(event => (
                <CompletedGameCard key={event.id} game={event} />
              ))}
            </div>
          )}
          
          {filteredEvents.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500 mb-2">No events found for this date and filter criteria.</p>
              <p className="text-sm text-gray-400">
                Try selecting a different date or sport.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarPage;