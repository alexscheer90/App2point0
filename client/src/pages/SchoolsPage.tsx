import { useState } from "react";
import { useMacSchools } from "../hooks/useSchool";
import SchoolCard from "../components/SchoolCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School } from "@shared/schema";
import { ExternalLink } from "lucide-react";

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";

// External URLs for affiliate schools
const getSchoolUrl = (school: School): string => {
  const urls: Record<string, string> = {
    "jmu": "https://jmusports.com/",
    "appstate": "https://appstatesports.com/",
    "longwood": "https://longwoodlancers.com/",
    "bellarmine": "https://athletics.bellarmine.edu/",
    "chicagostate": "https://gocsucougars.com/",
    "siuedwardsville": "https://siuecougars.com/",
    "lockhaven": "https://golhu.com/",
    "georgemason": "https://gomason.com/",
    "rider": "https://gobroncs.com/",
    "edinboro": "https://goedup.com/",
    "clevelandstate": "https://csuvikings.com/",
    "clarion": "https://clariongoldeneagles.com/",
    "bloomsburg": "https://buhuskies.com/",
    "robertmorris": "https://rmucolonials.com/",
    "detroitmercy": "https://detroittitans.com/",
    "youngstownstate": "https://ysusports.com/"
  };
  return urls[school.id] || "#";
};

// Create a custom version of SchoolCard for affiliate schools that links to external site
const AffiliateSchoolCard = ({ school }: { school: School }) => {
  const handleClick = () => {
    window.open(getSchoolUrl(school), '_blank');
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
      onClick={handleClick}
    >
      <div 
        className="h-24 flex items-center justify-center relative"
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
        
        <div className="absolute top-1 right-1">
          <ExternalLink size={16} className="text-white drop-shadow-sm" />
        </div>
      </div>
      
      <div className="p-3 text-center">
        <h3 className="font-bold italic">{school.name}</h3>
        <p className="text-xs text-gray-600">{school.mascot}</p>
        <p className="text-xs text-gray-500 mt-1">{school.city}, {school.state}</p>
      </div>
    </div>
  );
};

const SchoolsPage = () => {
  const { data: schools, isLoading } = useMacSchools();
  const [activeTab, setActiveTab] = useState("mac");
  
  // Separate schools into MAC and Affiliate categories
  const macSchools = schools?.filter(school => !school.affiliate) || [];
  const affiliateSchools = schools?.filter(school => school.affiliate) || [];
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <span style={{ color: MAC_GREEN }}>MAC</span> <span style={{ color: MAC_NAVY }}>Schools</span>
      </h1>
      
      <Tabs defaultValue="mac" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mac" className="text-sm">Full Members</TabsTrigger>
          <TabsTrigger value="affiliate" className="text-sm">Affiliate Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mac">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(12).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full" />
              ))}
            </div>
          ) : macSchools.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {macSchools.map(school => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No MAC schools found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="affiliate">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full" />
              ))}
            </div>
          ) : affiliateSchools.length > 0 ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-1">About Affiliate Members</h3>
                <p className="text-sm text-gray-600">
                  MAC affiliate members participate in specific sports but are not full conference members. 
                  Click on a school card to visit their official athletics website.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {affiliateSchools.map(school => (
                  <AffiliateSchoolCard key={school.id} school={school} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No affiliate schools found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolsPage;
