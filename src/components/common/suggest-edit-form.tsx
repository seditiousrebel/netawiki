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

interface SuggestEditFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entityType: string;
  entityName: string;
  fieldName: string;
  oldValue: string | any;
  onSubmit: (suggestion: {
    suggestedValue: string;
    reason: string;
    evidenceUrl: string;
  }) => void;
}

export const SuggestEditForm: React.FC<SuggestEditFormProps> = ({
  isOpen,
  onOpenChange,
  entityType,
  entityName,
  fieldName,
  oldValue,
  onSubmit,
}) => {
  const [suggestedValue, setSuggestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const handleSubmit = () => {
    onSubmit({ suggestedValue, reason, evidenceUrl });
    // Reset form fields after submission
    setSuggestedValue('');
    setReason('');
    setEvidenceUrl('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Optionally reset fields on cancel as well
    setSuggestedValue('');
    setReason('');
    setEvidenceUrl('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Suggest an Edit for {entityType}: {entityName}</DialogTitle>
          <DialogDescription>
            You are suggesting an edit for the field: <strong>{fieldName}</strong>.
            Please provide your suggested change, a reason for the change, and any supporting evidence URL.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldName" className="text-right">
              Field
            </Label>
            <Input id="fieldName" value={fieldName} disabled className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="oldValue" className="text-right pt-2">
              Current Value
            </Label>
            <Textarea id="oldValue" value={String(oldValue)} disabled className="col-span-3 min-h-[80px]" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="suggestedValue" className="text-right pt-2">
              Suggested Value
            </Label>
            <Textarea
              id="suggestedValue"
              value={suggestedValue}
              onChange={(e) => setSuggestedValue(e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder="Enter your suggested new value"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3"
              placeholder="Why are you suggesting this change?"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="evidenceUrl" className="text-right">
              Evidence URL
            </Label>
            <Input
              id="evidenceUrl"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="col-span-3"
              placeholder="Optional: Link to supporting evidence (e.g., news article, official document)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestEditForm;
