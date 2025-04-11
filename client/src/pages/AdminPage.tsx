import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImportDataTester from '../components/admin/ImportDataTester';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen pb-16">
      <Header activeTab="admin" />
      
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Tools</h1>
        
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="import" className="flex-1">Data Import</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="mt-4">
            <ImportDataTester />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Application Settings</h3>
              <p className="text-card-foreground/70">
                Settings panel will be implemented in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav activeTab="more" />
    </div>
  );
};

export default AdminPage;