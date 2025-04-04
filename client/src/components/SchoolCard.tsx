import { School } from "@shared/schema";
import { Link } from "wouter";

interface SchoolCardProps {
  school: School;
}

const SchoolCard = ({ school }: SchoolCardProps) => {
  return (
    <Link href={`/schools/${school.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-shadow hover:shadow-lg">
      <div 
        className="h-24 flex items-center justify-center"
        style={{ 
          backgroundColor: 
            school.id === "bowlinggreen" ? school.secondaryColor :
            school.id === "centralmichigan" ? school.secondaryColor :
            school.id === "buffalo" || 
            school.id === "easternmichigan" ? 
              "white" : school.primaryColor
        }}
      >
        {school.logoUrl ? (
          // When logo is available
          <div className="h-16 w-16 flex items-center justify-center">
            <img 
              src={school.logoUrl} 
              alt={`${school.name} logo`} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          // Fallback to circular initial when no logo
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: school.secondaryColor }}
          >
            <span 
              className="text-2xl font-bold"
              style={{ color: school.primaryColor }}
            >
              {school.shortName.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 text-center">
        <h3 className="font-bold italic">{school.name}</h3>
        <p className="text-xs text-gray-600">{school.mascot}</p>
      </div>
    </Link>
  );
};

export default SchoolCard;
