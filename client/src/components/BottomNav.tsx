import { Link } from "wouter";
import { FileText, ChartBar, Newspaper, School, Trophy, Music, Utensils, Headphones } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  return (
    <nav className="bg-white px-2 py-2 flex items-center justify-around border-t border-gray-200 sticky bottom-0 z-30">
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
      <NavItem 
        to="/rivalries" 
        icon={<Trophy className="h-5 w-5" />}
        label="Rivalries"
        active={activeTab === "rivalries"} 
      />
      <NavItem 
        to="/sounds" 
        icon={<Music className="h-5 w-5" />}
        label="Sounds"
        active={activeTab === "sounds"} 
      />
      <NavItem 
        to="/eats" 
        icon={<Utensils className="h-5 w-5" />}
        label="Eats"
        active={activeTab === "eats"} 
      />
      <NavItem 
        to="/podcast" 
        icon={<Headphones className="h-5 w-5" />}
        label="Podcast"
        active={activeTab === "podcast"} 
      />
    </nav>
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
    <Link href={to} className={`flex flex-col items-center justify-center w-12 ${active ? 'text-[#C8102E]' : 'text-gray-600'}`}>
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </Link>
  );
};

export default BottomNav;
