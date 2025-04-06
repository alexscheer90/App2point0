import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#0a1d36]">
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
