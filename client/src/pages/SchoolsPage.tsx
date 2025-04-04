import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMacSchools } from "../hooks/useSchool";
import SchoolCard from "../components/SchoolCard";
import { Skeleton } from "@/components/ui/skeleton";

const SchoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  
  const { data: schools, isLoading } = useMacSchools();
  
  // Filter schools by search term
  const filteredSchools = schools?.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.mascot.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Determine how many schools to display
  const displayedSchools = filteredSchools 
    ? (showAll ? filteredSchools : filteredSchools.slice(0, 8))
    : [];
  
  const totalSchools = filteredSchools?.length || 0;
  const hiddenSchools = totalSchools - displayedSchools.length;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Always show all results when searching
    if (e.target.value) {
      setShowAll(true);
    } else {
      setShowAll(false);
    }
  };
  
  const handleShowAll = () => {
    setShowAll(true);
  };
  
  return (
    <div className="py-4">
      <div className="px-4 mb-4">
        <Input 
          type="text" 
          placeholder="Search schools..." 
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
        />
      </div>
      
      <div className="px-4">
        <h2 className="font-bold text-lg mb-3">MAC Schools</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array(4).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : displayedSchools.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {displayedSchools.map(school => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
            <p className="text-gray-500">No schools found matching "{searchTerm}".</p>
          </div>
        )}
        
        {hiddenSchools > 0 && (
          <Button 
            variant="ghost" 
            className="w-full mt-3 py-3 text-sm text-[#C8102E] font-medium"
            onClick={handleShowAll}
          >
            View All {totalSchools} Schools
          </Button>
        )}
      </div>
    </div>
  );
};

export default SchoolsPage;
