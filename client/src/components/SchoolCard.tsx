import { School } from "@shared/schema";
import { Link } from "wouter";

interface SchoolCardProps {
  school: School;
}

const SchoolCard = ({ school }: SchoolCardProps) => {
  return (
    <Link href={`/schools/${school.id}`}>
      <a className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-shadow hover:shadow-lg">
        <div 
          className="h-24 flex items-center justify-center"
          style={{ backgroundColor: school.primaryColor }}
        >
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
        </div>
        <div className="p-3 text-center">
          <h3 className="font-bold">{school.name}</h3>
          <p className="text-xs text-gray-600">{school.mascot}</p>
        </div>
      </a>
    </Link>
  );
};

export default SchoolCard;
