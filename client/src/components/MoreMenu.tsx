import { X } from "lucide-react";
import { Link } from "wouter";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

import { 
  Calendar, 
  Trophy, 
  Music, 
  Utensils, 
  Headphones,
  Settings,
  Database
} from "lucide-react";

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";

interface MoreMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MoreMenu = ({ open, onOpenChange }: MoreMenuProps) => {
  const menuItems = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      path: "/schedule",
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: "Rivalries",
      path: "/rivalries",
    },
    {
      icon: <Music className="h-5 w-5" />,
      label: "Sounds",
      path: "/sounds",
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      label: "Eats",
      path: "/eats",
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      label: "Podcast",
      path: "/podcast",
    },
    {
      icon: <Database className="h-5 w-5" />,
      label: "Admin",
      path: "/admin",
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] pt-6">
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-bold">More</SheetTitle>
            <SheetClose className="rounded-full p-2 hover:bg-gray-200">
              <X className="h-4 w-4" />
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="grid grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => onOpenChange(false)}
              className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-100"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${MAC_GREEN}20` }}
              >
                <div className="text-green-600">
                  {item.icon}
                </div>
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MoreMenu;