import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ImportDataTester = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [importType, setImportType] = useState<'standings' | 'roster' | 'schedule' | 'stats' | 'rss' | 'baseball-standings'>('standings');
  const [sportId, setSportId] = useState<string>('baseball');
  const [url, setUrl] = useState<string>('https://getsomemaction.com/standings.aspx?path=baseball');
  const [schoolId, setSchoolId] = useState<string>('');
  const [results, setResults] = useState<string>('');

  const handleImport = async () => {
    try {
      setIsLoading(true);
      setResults('');

      // Direct baseball standings import (convenience endpoint)
      if (importType === 'baseball-standings') {
        const response = await fetch('/api/import/baseball-standings');
        const data = await response.json();
        setResults(JSON.stringify(data, null, 2));
        
        if (data.success) {
          toast({
            title: "Import Successful",
            description: `Imported ${data.count} baseball standings entries`,
          });
        } else {
          toast({
            title: "Import Failed",
            description: data.error || "Unknown error occurred",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      // General sport standings import with URL
      if (importType === 'standings') {
        const response = await fetch(`/api/import/standings/${sportId}?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        setResults(JSON.stringify(data, null, 2));
        
        if (data.success) {
          toast({
            title: "Import Successful",
            description: `Imported ${data.count} standings entries for ${sportId}`,
          });
        } else {
          toast({
            title: "Import Failed",
            description: data.error || "Unknown error occurred",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      // For other types, use the general POST endpoint
      const payload: any = {
        type: importType,
        url,
      };

      if (sportId) payload.sportId = sportId;
      if (schoolId) payload.schoolId = schoolId;

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResults(JSON.stringify(data, null, 2));
        
      if (data.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${data.count} ${importType} entries`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setResults(JSON.stringify({ error: "Request failed" }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Data Import Tester</CardTitle>
        <CardDescription>
          Test importing data from external sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="import-type">Import Type</Label>
          <Select
            value={importType}
            onValueChange={(value) => setImportType(value as any)}
            disabled={isLoading}
          >
            <SelectTrigger id="import-type">
              <SelectValue placeholder="Select import type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baseball-standings">Baseball Standings (Direct)</SelectItem>
              <SelectItem value="standings">Standings (Custom URL)</SelectItem>
              <SelectItem value="roster">Team Roster</SelectItem>
              <SelectItem value="schedule">Team Schedule</SelectItem>
              <SelectItem value="stats">Team Stats</SelectItem>
              <SelectItem value="rss">RSS Feed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {importType !== 'baseball-standings' && (
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              disabled={isLoading}
            />
          </div>
        )}

        {(importType === 'standings' || importType === 'roster' || importType === 'schedule' || importType === 'stats') && (
          <div className="space-y-2">
            <Label htmlFor="sport-id">Sport ID</Label>
            <Input
              id="sport-id"
              value={sportId}
              onChange={(e) => setSportId(e.target.value)}
              placeholder="Enter Sport ID"
              disabled={isLoading || importType === 'baseball-standings' as any}
            />
          </div>
        )}

        {(importType === 'roster' || importType === 'schedule' || importType === 'stats') && (
          <div className="space-y-2">
            <Label htmlFor="school-id">School ID</Label>
            <Input
              id="school-id"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="Enter School ID"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="results">Results</Label>
          <Textarea
            id="results"
            value={results}
            readOnly
            className="h-64 font-mono text-sm"
            placeholder="Import results will appear here"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleImport} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            'Import Data'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImportDataTester;