import { useMacSchools } from "../hooks/useSchool";
import SchoolCard from "../components/SchoolCard";
import { Skeleton } from "@/components/ui/skeleton";

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";

const SchoolsPage = () => {
  const { data: schools, isLoading } = useMacSchools();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <span style={{ color: MAC_GREEN }}>MAC</span> <span style={{ color: MAC_NAVY }}>Schools</span>
      </h1>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : schools && schools.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {schools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <p className="text-gray-500">No schools found.</p>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;
