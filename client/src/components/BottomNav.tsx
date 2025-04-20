import { useState } from "react";
import { Link } from "wouter";
import { FileText, ChartBar, Newspaper, School, MoreHorizontal } from "lucide-react";
import MoreMenu from "./MoreMenu";

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";

interface BottomNavProps {
  activeTab: string;
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  
  return (
    <>
      <nav className="bg-white px-2 py-3 flex items-center justify-around border-t border-gray-200 sticky bottom-0 z-30">
        <NavItem 
          to="/scores" 
          icon={<FileText className="h-5 w-5" />}
          label="Scores"
          active={activeTab === "scores"} 
        />
        <NavItem 
          to="/standings" 
          icon={<ChartBar className="h-5 w-5" />}
          label="Standings"
          active={activeTab === "standings"} 
        />
        <NavItem 
          to="/news" 
          icon={<Newspaper className="h-5 w-5" />}
          label="News"
          active={activeTab === "news"} 
        />
        <NavItem 
          to="/schools" 
          icon={<School className="h-5 w-5" />}
          label="Schools"
          active={activeTab === "schools"} 
        />
        <button 
          onClick={() => setMoreMenuOpen(true)}
          className={`flex flex-col items-center justify-center w-14 ${
            ['schedule', 'calendar', 'rivalries', 'sounds', 'eats', 'podcast'].includes(activeTab) 
              ? 'text-green-600' 
              : 'text-gray-600'
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-[10px] mt-1">More</span>
        </button>
      </nav>
      
      <MoreMenu 
        open={moreMenuOpen} 
        onOpenChange={setMoreMenuOpen} 
      />
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => {
  return (
    <Link href={to} className={`flex flex-col items-center justify-center w-14 ${active ? 'text-green-600' : 'text-gray-600'}`}>
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </Link>
  );
};

export default BottomNav;
