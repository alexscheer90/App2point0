import { macNavy } from "../utils/teamLogoMap";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-2 border-t border-gray-200 bg-gray-50">
      <div className="container flex flex-col items-center justify-center px-2 mx-auto text-center">
        <div className="flex flex-wrap justify-center text-[10px] text-gray-600">
          <span className="font-medium">© {currentYear}</span>
          <span className="ml-1">
            Property of The MAC Sports Connection. All rights reserved.
          </span>
        </div>
        
        <div className="flex justify-center">
          <p className="text-[10px] text-gray-500">
            All logos property of the associated schools and organizations.
          </p>
        </div>
      </div>
    </footer>
  );
}