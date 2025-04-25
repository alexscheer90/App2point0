import { Badge } from "./ui/badge";
import { macNavy, macGreen } from "../utils/teamLogoMap";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-3 mt-auto border-t border-gray-200" style={{ backgroundColor: macNavy }}>
      <div className="container flex flex-col items-center justify-center px-4 mx-auto space-y-1 text-center">
        <div className="flex items-center">
          <span className="text-white font-medium">© {currentYear}</span>
          <span className="ml-1 text-sm text-gray-300">
            Property of The MAC Sports Connection. All rights reserved.
          </span>
        </div>
        
        <p className="text-xs text-gray-400">
          All logos property of the associated schools and organizations.
        </p>
        
        <div className="flex items-center mt-1">
          <Badge 
            variant="outline" 
            className="text-xs border-gray-500" 
            style={{ backgroundColor: macGreen, color: 'white' }}
          >
            Official MAC App
          </Badge>
        </div>
      </div>
    </footer>
  );
}