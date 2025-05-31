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

interface SuggestNewEntryFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entityType: string; // e.g., "Politician"
  onSubmit: (newEntryData: any) => void;
}

export const SuggestNewEntryForm: React.FC<SuggestNewEntryFormProps> = ({
  isOpen,
  onOpenChange,
  entityType,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [partyName, setPartyName] = useState('');
  const [positions, setPositions] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const handleSubmit = () => {
    const newEntryData = {
      entityType, // Include entityType in the submission
      name,
      partyName,
      positions, // This would likely be parsed into an array of Position objects later
      bio,
      contactInfo: { email },
      photoUrl,
      reason,
      evidenceUrl,
      // Add a timestamp for the suggestion
      submittedAt: new Date().toISOString(),
      status: 'PendingNewEntry', // Special status for new entry suggestions
    };
    onSubmit(newEntryData);
    // Reset form fields
    setName('');
    setPartyName('');
    setPositions('');
    setBio('');
    setEmail('');
    setPhotoUrl('');
    setReason('');
    setEvidenceUrl('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form fields
    setName('');
    setPartyName('');
    setPositions('');
    setBio('');
    setEmail('');
    setPhotoUrl('');
    setReason('');
    setEvidenceUrl('');
  };

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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name*
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="partyName" className="text-right">
              Party Name
            </Label>
            <Input
              id="partyName"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Liberty Party, Independent"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="positions" className="text-right">
              Positions
            </Label>
            <Input
              id="positions"
              value={positions}
              onChange={(e) => setPositions(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Senator, Governor (comma-separated)"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="bio" className="text-right pt-2">
              Biography
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder="Enter a brief biography"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Contact Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="contact@example.com"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photoUrl" className="text-right">
              Photo URL
            </Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="reason" className="text-right pt-2">
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
            <Label htmlFor="evidenceUrl" className="text-right">
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
            disabled={!name || !reason || !evidenceUrl} // Basic validation
          >
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestNewEntryForm;
