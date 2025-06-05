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
import type { CriminalRecord } from '@/types/gov';

interface CriminalRecordFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  recordData?: CriminalRecord | null;
  onSubmit: (data: Omit<CriminalRecord, 'id'> & { id?: string }) => void;
  entitySchema: FormFieldSchema[];
  dialogTitle?: string;
}

export const CriminalRecordForm: React.FC<CriminalRecordFormProps> = ({
  isOpen,
  onOpenChange,
  recordData,
  onSubmit,
  entitySchema,
  dialogTitle = 'Criminal Record', // Default title
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (recordData) {
      setFormData(recordData);
    } else {
      // Initialize with default values for new entries if necessary
      setFormData({
        date: '',
        offense: '',
        status: '', // Default to empty or a specific default status
      });
    }
  }, [recordData, isOpen]);

  const handleFormChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: Omit<CriminalRecord, 'id'> & { id?: string } = {
      date: formData.date,
      offense: formData.offense,
      status: formData.status,
      caseNumber: formData.caseNumber || undefined,
      court: formData.court || undefined,
      summary: formData.summary || undefined,
      sourceUrl: formData.sourceUrl || undefined,
    };

    if (recordData?.id) {
      submissionData.id = recordData.id;
    }
    onSubmit(submissionData);
    onOpenChange(false);
  };

  const formSchemaForRenderer = entitySchema.filter(field => field.name !== 'id');
  const idFieldSchema = entitySchema.find(field => field.name === 'id');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {recordData?.id && idFieldSchema && (
             <div className="mb-4">
                <label htmlFor={idFieldSchema.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {idFieldSchema.label}
                </label>
                <input
                    type="text"
                    name={idFieldSchema.name}
                    id={idFieldSchema.name}
                    value={recordData.id}
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
            <Button type="submit">Save Criminal Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
