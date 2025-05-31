"use client";

import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // For the disabled file input

export default function DataManagementPage() {
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Export Not Implemented",
      description: "Data export functionality is not available in this mock version.",
      variant: "destructive",
      duration: 5000,
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Not Implemented",
      description: "Data import functionality is not available in this mock version.",
      variant: "destructive",
      duration: 5000,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Data Management"
        description="Manage application data import and export operations."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download your application data. This mock version does not perform actual exports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportData} className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export All Content (JSON)
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Note: In a real application, this would generate and download a JSON file containing all relevant data like politicians, parties, bills, etc.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Import Data
            </CardTitle>
            <CardDescription>
              Upload data from a JSON file. This mock version does not perform actual imports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Button onClick={handleImportData} className="w-full sm:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                Import Content from JSON
              </Button>
              <Input type="file" disabled className="w-full sm:w-auto max-w-xs bg-muted/50" />
            </div>
            <p className="text-xs text-muted-foreground">
              Note: In a real application, you would be able to select a JSON file, which would then be parsed and its content imported into the database, potentially with validation and conflict resolution steps.
            </p>
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
