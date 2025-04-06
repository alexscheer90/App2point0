import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NotificationBell from "./NotificationBell";

interface HeaderProps {
  activeTab?: string; // Made optional since we're no longer using it
}

const Header = ({ activeTab }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30">
      <div className="bg-[#0B213E] text-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Mobile <span className="text-[#019E4F]">#MACtion</span></h1>
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
            
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
