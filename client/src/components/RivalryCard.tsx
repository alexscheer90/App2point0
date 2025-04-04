import React from 'react';
import { Rivalry, School } from '@shared/schema';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSchool } from '@/hooks/useSchool';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy } from 'lucide-react';

interface RivalryCardProps {
  rivalry: Rivalry;
}

const RivalryCard = ({ rivalry }: RivalryCardProps) => {
  const { data: team1 } = useSchool(rivalry.team1Id);
  const { data: team2 } = useSchool(rivalry.team2Id);
  
  if (!team1 || !team2) return null;
  
  const getSeriesSummary = () => {
    const { team1Wins, team2Wins, ties } = rivalry.series;
    if (team1Wins > team2Wins) {
      return `${team1.name} leads series ${team1Wins}-${team2Wins}${ties > 0 ? `-${ties}` : ''}`;
    } else if (team2Wins > team1Wins) {
      return `${team2.name} leads series ${team2Wins}-${team1Wins}${ties > 0 ? `-${ties}` : ''}`;
    } else {
      return `Series tied ${team1Wins}-${team2Wins}${ties > 0 ? `-${ties}` : ''}`;
    }
  };

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center text-center w-5/12">
            {team1.logoUrl ? (
              // When logo is available
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <img 
                  src={team1.logoUrl} 
                  alt={`${team1.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular color block when no logo
              <div 
                className="w-16 h-16 rounded-full mb-2"
                style={{ 
                  backgroundColor: team1.primaryColor,
                  border: `2px solid ${team1.secondaryColor}`,
                }}
              ></div>
            )}
            <span className="font-semibold">{team1.name}</span>
            <span className="text-sm text-muted-foreground">{team1.mascot}</span>
          </div>
          
          <div className="text-center w-2/12">
            <div className="text-xl font-bold">VS</div>
          </div>
          
          <div className="flex flex-col items-center text-center w-5/12">
            {team2.logoUrl ? (
              // When logo is available
              <div className="w-16 h-16 mb-2 flex items-center justify-center">
                <img 
                  src={team2.logoUrl} 
                  alt={`${team2.name} logo`} 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              // Fallback to circular color block when no logo
              <div 
                className="w-16 h-16 rounded-full mb-2"
                style={{ 
                  backgroundColor: team2.primaryColor,
                  border: `2px solid ${team2.secondaryColor}`,
                }}
              ></div>
            )}
            <span className="font-semibold">{team2.name}</span>
            <span className="text-sm text-muted-foreground">{team2.mascot}</span>
          </div>
        </div>
        
        <div className="text-center text-sm font-medium mb-2">
          {getSeriesSummary()}
        </div>
        
        {rivalry.firstGame && (
          <div className="text-center text-xs text-muted-foreground">
            First played: {new Date(rivalry.firstGame).getFullYear()}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-2">
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