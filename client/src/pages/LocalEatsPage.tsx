import React, { useState } from 'react';
import { useMacSchools } from '../hooks/useSchool';
import { useLocalEats } from '../hooks/useLocalEats';
import LocalEatCard from '../components/LocalEatCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Utensils, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocalEats } from '@shared/schema';

const LocalEatsPage = () => {
  const { data: schools, isLoading: isSchoolsLoading } = useMacSchools();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: restaurants, isLoading: isRestaurantsLoading } = useLocalEats(selectedSchool || "");
  const isLoading = isSchoolsLoading || (selectedSchool && isRestaurantsLoading);

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
      <h1 className="text-2xl font-bold mb-4 text-[#0C2340]">
        <span className="text-[#C8102E]">Local</span> Eats
      </h1>
      
      <div className="flex gap-3 mb-4">
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
        
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-[120px]">
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
      
      <Tabs defaultValue={selectedSchool || "all"} className="w-full mb-6">
        <TabsList className="w-full mb-4 flex overflow-x-auto">
          <TabsTrigger 
            value="all"
            onClick={() => setSelectedSchool(null)}
          >
            All Cities
          </TabsTrigger>
          {schools.map(school => (
            <TabsTrigger 
              key={school.id} 
              value={school.id}
              onClick={() => setSelectedSchool(school.id)}
              className="whitespace-nowrap"
            >
              {school.city}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
                  return (
                    <h3 className="font-semibold text-lg flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {school?.city}, {school?.state}
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
                <h2 className="text-xl font-semibold flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  {school.city}, {school.state}
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