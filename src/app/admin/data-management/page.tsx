
"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { getCurrentUser, canAccess, EDITOR_ROLES } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast'; // Corrected path
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';

export default function DataManagementPage() {
  const currentUser = getCurrentUser();

  if (!canAccess(currentUser.role, EDITOR_ROLES)) {
    return <div className="container mx-auto py-8 text-center">Access Denied. You do not have permission to view this page.</div>;
  }

  const { toast } = useToast();

  const [exportUsers, setExportUsers] = useState(true);
  const [exportContent, setExportContent] = useState(true);
  const [exportSuggestions, setExportSuggestions] = useState(false);

  const handleExportData = () => {
    const exportOptions = { exportUsers, exportContent, exportSuggestions };
    console.log('Exporting data with options:', exportOptions);
    toast({
      title: "Export Initiated",
      description: `Data export process has started with options: ${JSON.stringify(exportOptions)} (mock operation).`,
    });
  };

  const handleImportData = () => {
    const fileInput = document.getElementById('importFile') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      console.log('Importing file:', file.name, file.type, file.size);
      toast({
        title: "Import File Selected",
        description: `${file.name} (${(file.size / 1024).toFixed(2)} KB) ready for import (mock operation).`,
      });
      // Reset file input after selection (optional)
      // fileInput.value = "";
    } else {
      toast({
        title: "No File Selected",
        description: "Please select a file to import.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Data Management"
        description="Manage application data import and export operations."
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>Select the data types you want to export.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="exportUsers" checked={exportUsers} onCheckedChange={(checked) => setExportUsers(Boolean(checked))} />
              <Label htmlFor="exportUsers">Users</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exportContent" checked={exportContent} onCheckedChange={(checked) => setExportContent(Boolean(checked))} />
              <Label htmlFor="exportContent">Content (Politicians, Parties, etc.)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="exportSuggestions" checked={exportSuggestions} onCheckedChange={(checked) => setExportSuggestions(Boolean(checked))} />
              <Label htmlFor="exportSuggestions">Suggestions</Label>
            </div>
            <Button onClick={handleExportData} className="mt-2">
              <Download className="mr-2 h-4 w-4" /> Export Selected Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>Select a JSON file to import data from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="file" id="importFile" accept=".json" className="mb-2" />
            <Button onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" /> Import from Selected File
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-secondary/30 border-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Data Management Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Backup & Restore:</strong> Regular data backups are crucial. A production system would have automated backup procedures and a clear process for restoring data in case of failure.
          </p>
          <p>
            <strong>Data Validation:</strong> Both import and export processes should include robust data validation to ensure data integrity and compatibility between different versions or environments.
          </p>
          <p>
            <strong>Security & Permissions:</strong> Access to data management features should be strictly controlled and limited to authorized administrative roles. All operations should be logged in the audit trail.
          </p>
          <p>
            <strong>Scalability:</strong> For large datasets, import/export operations should be designed to be scalable and performant, possibly using background jobs or streaming techniques.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
