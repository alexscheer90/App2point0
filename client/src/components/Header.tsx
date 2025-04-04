import { Link } from "wouter";
import { Search, Bell, Trophy, Music, Utensils, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  activeTab: string;
}

const Header = ({ activeTab }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30">
      <div className="bg-[#0C2340] text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Mobile <span className="text-[#FFD100]">#MACtion</span></h1>
          </div>
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#0a1d36]">
                    <Search className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Search (Coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#0a1d36]">
                    <Bell className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications (Coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="px-4 pt-1 pb-0 flex space-x-4 overflow-x-auto bg-white text-gray-800 border-b border-gray-200">
        <TabLink to="/scores" active={activeTab === "scores"}>
          Scores
        </TabLink>
        <TabLink to="/standings" active={activeTab === "standings"}>
          Standings
        </TabLink>
        <TabLink to="/news" active={activeTab === "news"}>
          News
        </TabLink>
        <TabLink to="/schools" active={activeTab === "schools"}>
          Schools
        </TabLink>
        <TabLink to="/rivalries" active={activeTab === "rivalries"}>
          <div className="flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            <span>Rivalries</span>
          </div>
        </TabLink>
        <TabLink to="/sounds" active={activeTab === "sounds"}>
          <div className="flex items-center gap-1">
            <Music className="h-3 w-3" />
            <span>Sounds</span>
          </div>
        </TabLink>
        <TabLink to="/eats" active={activeTab === "eats"}>
          <div className="flex items-center gap-1">
            <Utensils className="h-3 w-3" />
            <span>Eats</span>
          </div>
        </TabLink>
        <TabLink to="/podcast" active={activeTab === "podcast"}>
          <div className="flex items-center gap-1">
            <Headphones className="h-3 w-3" />
            <span>Podcast</span>
          </div>
        </TabLink>
      </div>
    </header>
  );
};

interface TabLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const TabLink = ({ to, active, children }: TabLinkProps) => {
  return (
    <Link href={to}>
      <a className={`px-3 py-2 text-sm font-semibold focus:outline-none ${
        active 
          ? "text-[#C8102E] border-b-2 border-[#C8102E]" 
          : "text-gray-600 hover:text-gray-800"
      }`}>
        {children}
      </a>
    </Link>
  );
};

export default Header;
