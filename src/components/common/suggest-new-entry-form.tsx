
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; // Added for boolean type
import type { PendingEdit } from '@/types/gov';
import { getCurrentUser } from '@/lib/auth';
import type { FormFieldSchema, FieldType } from '@/types/form-schema';
import { DynamicFormRenderer } from './form-parts/DynamicFormRenderer'; // Import the new renderer

// Removed local FieldType and FormFieldSchema definitions

interface SuggestNewEntryFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entityType: string;
  entitySchema: FormFieldSchema[]; // Changed from hardcoded fields
  onSubmit: (formData: Record<string, any>) => void; // Changed to accept generic formData
}

export const SuggestNewEntryForm: React.FC<SuggestNewEntryFormProps> = ({
  isOpen,
  onOpenChange,
  entityType,
  entitySchema, // Added
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  // Helper to get value from formData using a path string
  const getValueByPath = (obj: Record<string, any>, path: string): any => {
    if (!path) return obj; // If path is empty, return the object itself (useful for root of a sub-schema)
    // Normalize array access (e.g., arr[0]) to dot notation (e.g., arr.0)
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = obj;
    for (const key of keys) {
      if (current === null || typeof current !== 'object') return undefined;
      if (Array.isArray(current) && /^\d+$/.test(key)) {
        current = current[parseInt(key, 10)];
      } else {
        current = current[key];
      }
      if (current === undefined) return undefined;
    }
    return current;
  };

  const handleInputChange = (path: string, value: any) => {
    setFormData((prevData) => {
      const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.'); // Normalize array access to dot notation
      let currentLevel = { ...prevData };
      let dataRef = currentLevel;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        const isNextKeyArrayIndex = /^\d+$/.test(nextKey);

        if (!dataRef[key] || typeof dataRef[key] !== 'object') {
          dataRef[key] = isNextKeyArrayIndex ? [] : {};
        } else {
          // Important: create a shallow copy of the nested object/array to avoid direct state mutation
          dataRef[key] = Array.isArray(dataRef[key]) ? [...dataRef[key]] : { ...dataRef[key] };
        }
        dataRef = dataRef[key];
      }

      const lastKey = keys[keys.length - 1];
      dataRef[lastKey] = value;
      return currentLevel;
    });
  };


  const handleSubmit = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // Or handle more gracefully, e.g., show a message, redirect to login
      console.error("No user logged in. Cannot submit new entry suggestion.");
      // Potentially show a toast message to the user here
      return;
    }

    const pendingEditData: PendingEdit = {
      entityType: entityType, // from props
      // entityId is undefined for new entries
      proposedData: formData, // from component state
      reasonForChange: reason, // from component state
      evidenceUrl: evidenceUrl, // from component state
      submittedByUserId: currentUser.id,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      // adminFeedback, approvedByUserId, deniedByUserId, reviewedAt are undefined initially
    };

    onSubmit(pendingEditData);
    setFormData({}); // Reset dynamic form data
    setReason('');
    setEvidenceUrl('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({}); // Reset dynamic form data
    setReason('');
    setEvidenceUrl('');
  };

  // Local renderFormField removed, will use DynamicFormRenderer

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suggest New {entityType}</DialogTitle>
          <DialogDescription>
            Please provide the details for the new {entityType.toLowerCase()} you are suggesting.
            All suggestions will be reviewed before being added.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Dynamic form fields will be rendered here */}
          {entitySchema.map((field) => (
            <DynamicFormRenderer
              key={field.name}
              fieldSchema={field}
              basePath=""
              dataForPath={formData}
              onInputChange={handleInputChange}
              // isSingleFieldRoot is false by default for SNEF
            />
          ))}

          {/* Fixed fields for reason and evidence */}
          <div className="grid grid-cols-4 items-start gap-4 pt-4 border-t mt-4">
            <Label htmlFor="reason" className="text-right pt-2 font-semibold">
              Reason for Suggestion*
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3 min-h-[80px]"
              placeholder="Why should this new entry be added?"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="evidenceUrl" className="text-right font-semibold">
              Evidence URL*
            </Label>
            <Input
              id="evidenceUrl"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="col-span-3"
              placeholder="Link to official page, news article, etc."
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            // Basic validation - can be improved based on schema.required
            disabled={!reason || !evidenceUrl /* Add other required fields from schema if needed */}
          >
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestNewEntryForm;
