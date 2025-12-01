import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

export const AdminSettings: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Settings</h1>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="sms">SMS Configuration</TabsTrigger>
            <TabsTrigger value="maps">Maps Configuration</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Platform configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <p>General settings form...</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sms">
            <Card>
              <CardHeader>
                <CardTitle>SMS Configuration</CardTitle>
                <CardDescription>Configure SMS providers</CardDescription>
              </CardHeader>
              <CardContent>
                <p>SMS configuration form...</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="maps">
            <Card>
              <CardHeader>
                <CardTitle>Maps Configuration</CardTitle>
                <CardDescription>Configure Google Maps / Ola Maps</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Maps configuration form...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
