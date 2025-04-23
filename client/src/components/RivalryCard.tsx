import React from 'react';
import { Rivalry, School } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSchool } from '@/hooks/useSchool';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy } from 'lucide-react';
import { getOptimizedImagePath, handleImageError } from '../utils/imageOptimizer';

interface RivalryCardProps {
  rivalry: Rivalry;
}

const RivalryCard = ({ rivalry }: RivalryCardProps) => {
  const { data: team1 } = useSchool(rivalry.team1Id);
  const { data: team2 } = useSchool(rivalry.team2Id);
  const { data: team3 } = rivalry.team3Id ? useSchool(rivalry.team3Id) : { data: null };
  
  if (!team1 || !team2) return null;
  const isThreeWayRivalry = rivalry.team3Id && team3;
  
  const getSeriesSummary = () => {
    const { team1Wins, team2Wins, team3Wins = 0, ties } = rivalry.series;
    
    if (isThreeWayRivalry) {
      return `${team1.shortName} (${team1Wins}), ${team2.shortName} (${team2Wins}), ${team3!.shortName} (${team3Wins})`;
    } else {
      if (team1Wins > team2Wins) {
        return `${team1.shortName} leads ${team1Wins}-${team2Wins}${ties > 0 ? `-${ties}` : ''}`;
      } else if (team2Wins > team1Wins) {
        return `${team2.shortName} leads ${team2Wins}-${team1Wins}${ties > 0 ? `-${ties}` : ''}`;
      } else {
        return `Series tied ${team1Wins}-${team2Wins}${ties > 0 ? `-${ties}` : ''}`;
      }
    }
  };

  const renderTeamLogo = (team: School, size: string = "w-16 h-16") => (
    <div className="flex flex-col items-center text-center">
      {team.logoUrl ? (
        <div className={`${size} mb-2 flex items-center justify-center`}>
          <img 
            src={team.logoUrl}
            alt={`${team.name} logo`}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.currentTarget.src = getOptimizedImagePath(team.name, true);
              handleImageError(e);
            }}
            loading="lazy"
          />
        </div>
      ) : (
        <div 
          className={`${size} rounded-full mb-2`}
          style={{ 
            backgroundColor: team.primaryColor,
            border: `2px solid ${team.secondaryColor}`,
          }}
        ></div>
      )}
      <span className="font-semibold text-sm truncate max-w-28">{team.shortName}</span>
      <span className="text-xs text-muted-foreground truncate max-w-28">{team.mascot}</span>
    </div>
  );

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full">
      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{rivalry.name}</CardTitle>
          {rivalry.trophyName && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {rivalry.trophyName}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isThreeWayRivalry ? (
          // Three-way rivalry layout
          <div className="grid grid-cols-3 gap-2 mb-4">
            {renderTeamLogo(team1, "w-14 h-14")}
            {renderTeamLogo(team2, "w-14 h-14")}
            {renderTeamLogo(team3!, "w-14 h-14")}
          </div>
        ) : (
          // Two-way rivalry layout
          <div className="flex justify-between items-center mb-4">
            <div className="w-5/12">
              {renderTeamLogo(team1)}
            </div>
            
            <div className="text-center w-2/12">
              <div className="text-xl font-bold">VS</div>
            </div>
            
            <div className="w-5/12">
              {renderTeamLogo(team2)}
            </div>
          </div>
        )}
        
        <div className="text-center text-sm font-medium mb-2">
          {getSeriesSummary()}
        </div>
        
        {rivalry.firstGame && (
          <div className="text-center text-xs text-muted-foreground">
            First played: {new Date(rivalry.firstGame).getFullYear()}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-2 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between"
          onClick={() => {
            // This would navigate to a detailed rivalry page in a real app
            // For now just show an alert with the description
            alert(rivalry.description || 'No additional details available for this rivalry.');
          }}
        >
          <span>View Rivalry Details</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RivalryCard;