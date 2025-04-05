import React from 'react';
import { useRivalries } from '../hooks/useRivalries';
import { useMacSchools } from '../hooks/useSchool';
import RivalryCard from '../components/RivalryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { School } from '@shared/schema';

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";
const MAC_GRAY = "#9DA5A8";

const RivalriesPage = () => {
  const { data: rivalries, isLoading } = useRivalries();
  const { data: schools } = useMacSchools();

  if (isLoading || !schools) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // No filtering needed
  const filteredRivalries = rivalries;

  const getSchoolById = (id: string): School | undefined => {
    return schools?.find(school => school.id === id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        <span style={{ color: MAC_GREEN }}>MAC</span> <span style={{ color: MAC_NAVY }}>Rivalries</span>
      </h1>
      
      {filteredRivalries && filteredRivalries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRivalries.map(rivalry => (
            <div key={rivalry.id} className="h-full">
              <RivalryCard rivalry={rivalry} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <p className="text-gray-500">No MAC rivalries available.</p>
        </div>
      )}
    </div>
  );
};

export default RivalriesPage;