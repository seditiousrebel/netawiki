"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DynamicFormRenderer } from '@/components/common/forms/DynamicFormRenderer';
import type { FormFieldSchema } from '@/types/form-schema';
import type { ElectionTimelineEvent } from '@/types/gov';

interface TimelineEventFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  eventData?: ElectionTimelineEvent | null;
  onSubmit: (data: Omit<ElectionTimelineEvent, 'id'> & { id?: string }) => void;
  entitySchema: FormFieldSchema[];
}

export const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
  isOpen,
  onOpenChange,
  eventData,
  onSubmit,
  entitySchema,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (eventData) {
      // Populate form with existing data when editing
      setFormData(eventData);
    } else {
      // Reset form for new entry
      setFormData({});
    }
  }, [eventData, isOpen]); // Reset form when dialog opens or eventData changes

  const handleFormChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: Omit<ElectionTimelineEvent, 'id'> & { id?: string } = {
      date: formData.date,
      event: formData.event,
      description: formData.description,
      relatedDocumentUrl: formData.relatedDocumentUrl,
    };
    if (eventData?.id) {
      submissionData.id = eventData.id;
    }
    onSubmit(submissionData);
    onOpenChange(false); // Close dialog after submit
  };

  // Filter out the 'id' field from being rendered by DynamicFormRenderer for new events,
  // or make it read-only for existing ones as defined in the schema.
  const formSchema = entitySchema.map(field => {
    if (field.name === 'id') {
      return { ...field, readOnly: true }; // Ensure ID is not user-editable
    }
    return field;
  });

  // Find the ID field to display it separately if needed, or ensure it's handled by DynamicFormRenderer if readOnly is effective
  const idField = entitySchema.find(f => f.name === 'id');


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{eventData ? 'Edit Timeline Event' : 'Add New Timeline Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {eventData?.id && idField && (
             <div className="mb-4">
                <label htmlFor={idField.name} className="block text-sm font-medium text-gray-700">
                    {idField.label}
                </label>
                <input
                    type="text"
                    name={idField.name}
                    id={idField.name}
                    value={eventData.id}
                    readOnly
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 cursor-not-allowed p-2"
                />
            </div>
          )}
          <DynamicFormRenderer
            schema={formSchema.filter(f => f.name !== 'id')} // Don't render ID field if it's handled manually above or should be hidden
            formData={formData}
            onFormChange={handleFormChange}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save Timeline Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
