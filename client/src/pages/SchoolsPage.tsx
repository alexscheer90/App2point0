import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useMacSchools } from "../hooks/useSchool";
import SchoolCard from "../components/SchoolCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";

const SchoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: schools, isLoading } = useMacSchools();
  
  // Filter schools by search term
  const filteredSchools = schools?.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.mascot.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <span style={{ color: MAC_GREEN }}>MAC</span> <span style={{ color: MAC_NAVY }}>Schools</span>
      </h1>
      
      <div className="mb-6 relative">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <Input 
          type="text" 
          placeholder="Search schools..." 
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : filteredSchools && filteredSchools.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSchools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <p className="text-gray-500">No schools found matching "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;
