import { Link } from "wouter";
import { FileText, ChartBar, Newspaper, School } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  return (
    <nav className="bg-white px-4 py-3 flex items-center justify-around border-t border-gray-200 sticky bottom-0 z-30">
      <NavItem 
        to="/scores" 
        icon={<FileText className="h-6 w-6" />}
        label="Scores"
        active={activeTab === "scores"} 
      />
      <NavItem 
        to="/standings" 
        icon={<ChartBar className="h-6 w-6" />}
        label="Standings"
        active={activeTab === "standings"} 
      />
      <NavItem 
        to="/news" 
        icon={<Newspaper className="h-6 w-6" />}
        label="News"
        active={activeTab === "news"} 
      />
      <NavItem 
        to="/schools" 
        icon={<School className="h-6 w-6" />}
        label="Schools"
        active={activeTab === "schools"} 
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
    <Link href={to}>
      <a className={`flex flex-col items-center justify-center w-16 ${active ? 'text-[#C8102E]' : 'text-gray-600'}`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </a>
    </Link>
  );
};

export default BottomNav;
