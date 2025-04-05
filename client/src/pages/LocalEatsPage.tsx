import React, { useState } from 'react';
import { useMacSchools } from '../hooks/useSchool';
import { useLocalEats } from '../hooks/useLocalEats';
import LocalEatCard from '../components/LocalEatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Utensils, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocalEats } from '@shared/schema';

// MAC colors
const MAC_NAVY = "#0B213E";
const MAC_GREEN = "#019E4F";
const MAC_GRAY = "#9DA5A8";

const LocalEatsPage = () => {
  const { data: schools, isLoading: isSchoolsLoading } = useMacSchools();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: restaurants, isLoading: isRestaurantsLoading } = useLocalEats(selectedSchool || "");
  const isLoading = isSchoolsLoading || isRestaurantsLoading;

  if (isSchoolsLoading || !schools) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-48 w-full mb-3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // Filter restaurants based on price and search term
  const filteredRestaurants = restaurants?.filter(restaurant => {
    const matchesPrice = priceFilter === "all" || restaurant.priceRange === priceFilter;
    const matchesSearch = searchTerm === '' || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPrice && matchesSearch;
  }) || [];

  // Group restaurants by school for "all" view
  type SchoolRestaurants = {
    school: typeof schools[0];
    restaurants: LocalEats[];
  };
  
  const restaurantsBySchool: Record<string, SchoolRestaurants> = {};
  
  if (!selectedSchool && restaurants) {
    schools.forEach(school => {
      const schoolRestaurants = restaurants.filter(r => r.schoolId === school.id);
      
      const filteredSchoolRestaurants = schoolRestaurants.filter(restaurant => {
        const matchesPrice = priceFilter === "all" || restaurant.priceRange === priceFilter;
        const matchesSearch = searchTerm === '' || 
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesPrice && matchesSearch;
      });
      
      if (filteredSchoolRestaurants.length > 0) {
        restaurantsBySchool[school.id] = {
          school,
          restaurants: filteredSchoolRestaurants
        };
      }
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        <span style={{ color: MAC_GREEN }}>Local</span> <span style={{ color: MAC_NAVY }}>Eats</span>
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search restaurants or cuisine..."
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
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All MAC Cities</SelectItem>
              {schools.map(school => (
                <SelectItem key={school.id} value={school.id}>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {school.city}, {school.state}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-full sm:w-[120px]" style={{ backgroundColor: "white", borderColor: MAC_NAVY }}>
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="$">$</SelectItem>
              <SelectItem value="$$">$$</SelectItem>
              <SelectItem value="$$$">$$$</SelectItem>
              <SelectItem value="$$$$">$$$$</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-48 w-full mb-3" />
          <Skeleton className="h-48 w-full mb-3" />
          <Skeleton className="h-48 w-full mb-3" />
        </>
      ) : selectedSchool ? (
        // Single school view
        <div>
          {filteredRestaurants.length > 0 ? (
            <>
              <div className="mb-4">
                {/* Get selected school */}
                {(() => {
                  const school = schools.find(s => s.id === selectedSchool);
                  if (!school) return null;
                  
                  return (
                    <h3 className="font-semibold text-lg">
                      <div className="flex items-center">
                        {school.logoUrl ? (
                          <img 
                            src={school.logoUrl} 
                            alt={`${school.name} logo`} 
                            className="w-8 h-8 mr-2 object-contain" 
                          />
                        ) : (
                          <div 
                            className="w-8 h-8 mr-2 rounded-full flex items-center justify-center" 
                            style={{ backgroundColor: school.primaryColor }}
                          >
                            <span className="text-sm font-bold" style={{ color: school.secondaryColor }}>
                              {school.shortName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          {school.city}, {school.state}
                        </div>
                      </div>
                    </h3>
                  );
                })()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRestaurants.map(restaurant => (
                  <LocalEatCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No restaurants found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : (
        // All schools view
        <div className="space-y-8">
          {Object.keys(restaurantsBySchool).length > 0 ? (
            Object.entries(restaurantsBySchool).map(([schoolId, { school, restaurants }]) => (
              <div key={schoolId} className="space-y-4">
                <h2 className="text-xl font-semibold">
                  <div className="flex items-center">
                    {school.logoUrl ? (
                      <img 
                        src={school.logoUrl} 
                        alt={`${school.name} logo`} 
                        className="w-8 h-8 mr-2 object-contain" 
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 mr-2 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: school.primaryColor }}
                      >
                        <span className="text-sm font-bold" style={{ color: school.secondaryColor }}>
                          {school.shortName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {school.city}, {school.state}
                    </div>
                  </div>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restaurants.map(restaurant => (
                    <LocalEatCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
              <p className="text-gray-500">No restaurants found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocalEatsPage;