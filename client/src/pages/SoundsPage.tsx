import React, { useState } from 'react';
import { useMacSchools } from '../hooks/useSchool';
import { useSchoolSounds } from '../hooks/useSchoolSounds';
import SchoolSoundCard from '../components/SchoolSoundCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SchoolSound } from '@shared/schema';

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";
const MAC_GRAY = "#9DA5A8";

const SoundsPage = () => {
  const { data: schools, isLoading: isSchoolsLoading } = useMacSchools();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [soundType, setSoundType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: sounds, isLoading: isSoundsLoading } = useSchoolSounds(selectedSchool || "");
  const isLoading = isSchoolsLoading || (selectedSchool && isSoundsLoading);

  if (isSchoolsLoading || !schools) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-40 w-full mb-3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  // Filter sounds based on type and search term
  const filteredSounds = sounds?.filter(sound => {
    const matchesType = soundType === "all" || sound.type === soundType;
    const matchesSearch = searchTerm === '' || 
      sound.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sound.description && sound.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesSearch;
  }) || [];

  // Group sounds by school for "all" view
  type SchoolSounds = {
    school: typeof schools[0];
    sounds: SchoolSound[];
  };
  
  const soundsBySchool: Record<string, SchoolSounds> = {};
  
  if (!selectedSchool && sounds) {
    schools.forEach(school => {
      const schoolSounds = sounds.filter(s => s.schoolId === school.id);
      
      const filteredSchoolSounds = schoolSounds.filter(sound => {
        const matchesType = soundType === "all" || sound.type === soundType;
        const matchesSearch = searchTerm === '' || 
          sound.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sound.description && sound.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesType && matchesSearch;
      });
      
      if (filteredSchoolSounds.length > 0) {
        soundsBySchool[school.id] = {
          school,
          sounds: filteredSchoolSounds
        };
      }
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <span style={{ color: MAC_GREEN }}>Sounds</span> <span style={{ color: MAC_NAVY }}>of the Stadium</span>
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search sounds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-3">
          <Select 
            value={selectedSchool || "all"} 
            onValueChange={(value) => setSelectedSchool(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]" style={{ backgroundColor: "white", borderColor: MAC_NAVY }}>
              <SelectValue placeholder="Select a school" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All MAC Schools</SelectItem>
              {schools.map(school => (
                <SelectItem key={school.id} value={school.id}>
                  <div className="flex items-center">
                    {school.logoUrl && (
                      <div className="w-5 h-5 mr-2">
                        <img 
                          src={school.logoUrl} 
                          alt={`${school.name} logo`} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    {school.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={soundType} onValueChange={setSoundType}>
            <SelectTrigger className="w-full sm:w-[140px]" style={{ backgroundColor: "white", borderColor: MAC_NAVY }}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fight_song">Fight Songs</SelectItem>
              <SelectItem value="alma_mater">Alma Maters</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-40 w-full mb-3" />
          <Skeleton className="h-40 w-full mb-3" />
        </>
      ) : selectedSchool ? (
        // Single school view
        <div className="space-y-6">
          {filteredSounds.length > 0 ? (
            <div className="space-y-4">
              {(soundType === "all" || soundType === "fight_song") && 
                filteredSounds.filter(sound => sound.type === "fight_song").length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-lg flex items-center">
                    <Music className="h-4 w-4 mr-2 text-amber-500" />
                    Fight Songs
                  </h3>
                  <div className="space-y-3">
                    {filteredSounds
                      .filter(sound => sound.type === "fight_song")
                      .map(sound => (
                        <SchoolSoundCard key={sound.id} sound={sound} />
                      ))}
                  </div>
                </div>
              )}
              
              {(soundType === "all" || soundType === "alma_mater") && 
                filteredSounds.filter(sound => sound.type === "alma_mater").length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-lg flex items-center">
                    <Music className="h-4 w-4 mr-2 text-blue-500" />
                    Alma Maters
                  </h3>
                  <div className="space-y-3">
                    {filteredSounds
                      .filter(sound => sound.type === "alma_mater")
                      .map(sound => (
                        <SchoolSoundCard key={sound.id} sound={sound} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No school sounds found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : (
        // All schools view
        <div className="space-y-8">
          {Object.keys(soundsBySchool).length > 0 ? (
            Object.entries(soundsBySchool).map(([schoolId, { school, sounds }]) => (
              <div key={schoolId} className="space-y-4">
                <h2 className="text-xl font-semibold">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 mr-2 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: school.primaryColor }}
                    >
                      <span className="text-sm font-bold" style={{ color: school.secondaryColor }}>
                        {school.shortName.charAt(0)}
                      </span>
                    </div>
                    {school.name} {school.mascot}
                  </div>
                </h2>
                
                <div className="space-y-3 ml-2">
                  {sounds.map(sound => (
                    <SchoolSoundCard key={sound.id} sound={sound} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No school sounds found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoundsPage;