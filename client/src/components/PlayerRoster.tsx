import React, { useState } from 'react';
import { Player } from '@shared/schema';
import PlayerCard from './PlayerCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import { useMacSports } from '@/hooks/useMacSports';
import { useSchool } from '@/hooks/useSchool';

interface PlayerRosterProps {
  players: Player[];
  title?: string;
}

type GroupedPlayers = {
  [key: string]: Player[];
};

const PlayerRoster: React.FC<PlayerRosterProps> = ({ players, title = 'Player Roster' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');
  
  const { data: sports } = useMacSports();
  const { data: school } = useSchool(players[0]?.schoolId || '');
  
  // Extract unique positions from players
  const positionsSet = new Set<string>();
  players.forEach(p => {
    if (p.position) positionsSet.add(p.position);
  });
  const positions = Array.from(positionsSet);
  
  // Extract unique years from players
  const yearsSet = new Set<string>();
  players.forEach(p => {
    if (p.year) yearsSet.add(p.year);
  });
  const years = Array.from(yearsSet);
  
  // Extract unique sports from players
  const sportsSet = new Set<string>();
  players.forEach(p => sportsSet.add(p.sportId));
  const uniqueSports = Array.from(sportsSet);
  
  // Filter players based on search and filters
  const filteredPlayers = players.filter(player => {
    // Apply text search
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply position filter
    if (selectedPosition !== 'all' && player.position !== selectedPosition) {
      return false;
    }
    
    // Apply year filter
    if (selectedYear !== 'all' && player.year !== selectedYear) {
      return false;
    }
    
    // Apply sport filter
    if (selectedSport !== 'all' && player.sportId !== selectedSport) {
      return false;
    }
    
    return true;
  });
  
  // Group players by position
  const groupedPlayers: GroupedPlayers = filteredPlayers.reduce((acc, player) => {
    const position = player.position || 'Unspecified';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(player);
    return acc;
  }, {} as GroupedPlayers);
  
  // Helper function to convert hex color to rgba with opacity
  const getBgColor = (hex: string, opacity: number = 0.15) => {
    if (hex?.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return hex || '#eee';
  };
  
  // Get sport name from ID
  const getSportName = (sportId: string) => {
    if (!sports) return sportId;
    const sport = sports.find(s => s.id === sportId);
    return sport ? sport.name : sportId.charAt(0).toUpperCase() + sportId.slice(1);
  };
  
  const primaryColor = school?.primaryColor || '#0B213E';
  
  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3" style={{ backgroundColor: getBgColor(primaryColor, 0.1) }}>
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{title}</span>
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {filteredPlayers.length} Players
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Search and filters */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Sport filter - only show if there are multiple sports */}
            {uniqueSports.length > 1 && (
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Sport" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {uniqueSports.map(sportId => (
                    <SelectItem key={sportId} value={sportId}>
                      {getSportName(sportId)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Position filter - only if positions exist */}
            {positions.length > 0 && (
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Position" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map(position => (
                    <SelectItem key={position} value={position || ''}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {/* Year filter - only if years exist */}
            {years.length > 0 && (
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    <SelectValue placeholder="Year" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year || ''}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        {/* Display players */}
        {filteredPlayers.length > 0 ? (
          <div>
            {/* If sport or year filters are applied, don't group by position */}
            {(selectedSport !== 'all' || selectedYear !== 'all' || selectedPosition !== 'all') ? (
              <div className="space-y-4">
                {filteredPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} compact />
                ))}
              </div>
            ) : (
              // Group by position when showing all
              Object.entries(groupedPlayers).map(([position, positionPlayers]) => (
                <div key={position} className="mb-6">
                  <h3 className="font-semibold mb-3 pb-1 border-b">
                    {position} <span className="text-muted-foreground">({positionPlayers.length})</span>
                  </h3>
                  <div className="space-y-4">
                    {positionPlayers.map(player => (
                      <PlayerCard key={player.id} player={player} compact />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No players found matching your filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRoster;