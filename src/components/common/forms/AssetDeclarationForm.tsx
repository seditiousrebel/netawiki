"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DynamicFormRenderer } from '@/components/common/forms/DynamicFormRenderer';
import type { FormFieldSchema } from '@/types/form-schema';
import type { AssetDeclaration } from '@/types/gov';

interface AssetDeclarationFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assetData?: AssetDeclaration | null;
  onSubmit: (data: Omit<AssetDeclaration, 'id'> & { id?: string }) => void;
  entitySchema: FormFieldSchema[];
  dialogTitle?: string;
}

export const AssetDeclarationForm: React.FC<AssetDeclarationFormProps> = ({
  isOpen,
  onOpenChange,
  assetData,
  onSubmit,
  entitySchema,
  dialogTitle = 'Asset Declaration', // Default title
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (assetData) {
      setFormData(assetData);
    } else {
      setFormData({});
    }
  }, [assetData, isOpen]);

  const handleFormChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct the data to submit, ensuring all fields from the type are present
    // and correctly typed, especially for optional fields.
    const submissionData: Omit<AssetDeclaration, 'id'> & { id?: string } = {
      year: parseInt(formData.year, 10) || 0, // Ensure year is a number
      description: formData.description || '',
      value: formData.value || undefined,
      sourceUrl: formData.sourceUrl || undefined,
    };

    if (assetData?.id) {
      submissionData.id = assetData.id;
    }
    onSubmit(submissionData);
    onOpenChange(false);
  };

  // Ensure ID field is read-only and not part of the main dynamic form if handled separately
  const formSchemaForRenderer = entitySchema.filter(field => field.name !== 'id');
  const idFieldSchema = entitySchema.find(field => field.name === 'id');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {assetData?.id && idFieldSchema && (
            <div className="mb-4">
              <label htmlFor={idFieldSchema.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {idFieldSchema.label}
              </label>
              <input
                type="text"
                name={idFieldSchema.name}
                id={idFieldSchema.name}
                value={assetData.id}
                readOnly
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed p-2"
              />
            </div>
          )}
          <DynamicFormRenderer
            schema={formSchemaForRenderer}
            formData={formData}
            onFormChange={handleFormChange}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Asset Declaration</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
