import React from 'react';
import { TeamStat } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartIcon, TrophyIcon, ListOrderedIcon } from 'lucide-react';
import { useSchool } from '@/hooks/useSchool';
import { Progress } from '@/components/ui/progress';

interface TeamStatsCardProps {
  stats: TeamStat;
}

const TeamStatsCard: React.FC<TeamStatsCardProps> = ({ stats }) => {
  const { data: school } = useSchool(stats.schoolId);
  
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
  
  // Determine a max value to scale the stats
  const getMaxValue = (statType: string) => {
    switch (statType) {
      case 'percentage':
        return 100;
      case 'yards':
        return 5000;
      default:
        return 1000;
    }
  };
  
  // Format the stat value based on its type
  const formatStatValue = (key: string, value: number) => {
    if (key.toLowerCase().includes('percentage')) {
      return `${value.toFixed(1)}%`;
    }
    if (key.toLowerCase().includes('per')) {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };
  
  // Determine the category of a stat for grouping
  const getStatCategory = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('percentage') || k.includes('pct') || k.includes('efficiency')) {
      return 'percentage';
    }
    if (k.includes('yards') || k.includes('yds')) {
      return 'yards';
    }
    return 'general';
  };
  
  // Group stats by category
  const generalStats = Object.entries(stats.stats).filter(
    ([key]) => !key.toLowerCase().includes('percentage') && 
               !key.toLowerCase().includes('pct') && 
               !key.toLowerCase().includes('efficiency') &&
               !key.toLowerCase().includes('yards') &&
               !key.toLowerCase().includes('yds')
  );
  
  const percentageStats = Object.entries(stats.stats).filter(
    ([key]) => key.toLowerCase().includes('percentage') || 
               key.toLowerCase().includes('pct') || 
               key.toLowerCase().includes('efficiency')
  );
  
  const yardageStats = Object.entries(stats.stats).filter(
    ([key]) => key.toLowerCase().includes('yards') || 
               key.toLowerCase().includes('yds')
  );
  
  // Format stat key for display
  const formatStatKey = (key: string) => {
    // Convert camelCase to separate words
    const words = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    // Capitalize first letter of each word
    return words
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const primaryColor = school?.primaryColor || '#0B213E';
  
  return (
    <Card className="overflow-hidden mb-6">
      <CardHeader className="pb-3" style={{ backgroundColor: getBgColor(primaryColor, 0.1) }}>
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartIcon className="h-5 w-5" />
              <span>Team Statistics</span>
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {stats.season}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="general" className="w-full mb-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="general" className="flex-1">
              <ListOrderedIcon className="h-4 w-4 mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger value="percentage" className="flex-1">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Percentages
            </TabsTrigger>
            <TabsTrigger value="yardage" className="flex-1">
              <ChartIcon className="h-4 w-4 mr-1" />
              Yardage
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-3">
            {generalStats.map(([key, value]) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{formatStatKey(key)}</span>
                  <span className="text-sm font-medium">{formatStatValue(key, value)}</span>
                </div>
                <Progress 
                  value={(value / getMaxValue('general')) * 100} 
                  className="h-2" 
                  style={{ 
                    '--progress-background': primaryColor 
                  } as React.CSSProperties} 
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="percentage" className="space-y-3">
            {percentageStats.map(([key, value]) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{formatStatKey(key)}</span>
                  <span className="text-sm font-medium">{formatStatValue(key, value)}</span>
                </div>
                <Progress 
                  value={value} 
                  className="h-2" 
                  style={{ 
                    '--progress-background': primaryColor 
                  } as React.CSSProperties} 
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="yardage" className="space-y-3">
            {yardageStats.map(([key, value]) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{formatStatKey(key)}</span>
                  <span className="text-sm font-medium">{formatStatValue(key, value)}</span>
                </div>
                <Progress 
                  value={(value / getMaxValue('yards')) * 100} 
                  className="h-2" 
                  style={{ 
                    '--progress-background': primaryColor 
                  } as React.CSSProperties} 
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        {stats.lastUpdated && (
          <div className="text-xs text-muted-foreground mt-4 text-right">
            Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamStatsCard;