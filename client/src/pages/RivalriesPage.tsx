import React, { useState } from 'react';
import { useRivalries } from '../hooks/useRivalries';
import { useMacSchools } from '../hooks/useSchool';
import RivalryCard from '../components/RivalryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { School } from '@shared/schema';

const RivalriesPage = () => {
  const { data: rivalries, isLoading } = useRivalries();
  const { data: schools } = useMacSchools();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  if (isLoading || !schools) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Filter rivalries based on search and/or selected school
  const filteredRivalries = rivalries?.filter(rivalry => {
    const matchesSearch = searchTerm === '' || 
      rivalry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rivalry.trophyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schools?.find(s => s.id === rivalry.team1Id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schools?.find(s => s.id === rivalry.team2Id)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = selectedSchool === null || 
      rivalry.team1Id === selectedSchool || 
      rivalry.team2Id === selectedSchool;
    
    return matchesSearch && matchesSchool;
  });

  const getSchoolById = (id: string): School | undefined => {
    return schools?.find(school => school.id === id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#0C2340]">
        <span className="text-[#C8102E]">MAC</span> Rivalries
      </h1>
      
      <div className="mb-4 relative">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for rivalries or trophies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="w-full mb-4 flex overflow-x-auto">
          <TabsTrigger value="all" onClick={() => setSelectedSchool(null)}>
            All Rivalries
          </TabsTrigger>
          {schools.map(school => (
            <TabsTrigger 
              key={school.id} 
              value={school.id}
              onClick={() => setSelectedSchool(school.id)}
              className="whitespace-nowrap"
            >
              {school.shortName}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {filteredRivalries && filteredRivalries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRivalries.map(rivalry => (
            <RivalryCard 
              key={rivalry.id} 
              rivalry={rivalry} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
          <p className="text-gray-500">No rivalries found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RivalriesPage;