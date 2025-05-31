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

// Define FieldType and FormFieldSchema interfaces
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'date'
  | 'url'
  | 'email';

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FieldType | 'object' | 'array'; // Allow 'object' and 'array' as types
  required?: boolean;
  placeholder?: string;
  options?: string[]; // For select/radio group type fields (not implemented yet)
  objectSchema?: FormFieldSchema[]; // For nested objects
  arrayItemSchema?: FormFieldSchema | FieldType; // Schema for array items
}

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
    const newEntryData = {
      entityType,
      ...formData, // Spread the dynamic form data
      reason,
      evidenceUrl,
      submittedAt: new Date().toISOString(),
      status: 'PendingNewEntry',
    };
    onSubmit(newEntryData);
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

  // Placeholder for the recursive rendering function
  const renderFormField = (fieldSchema: FormFieldSchema, basePath: string, dataForPath: any) => {
    const { name, label, type, required, placeholder, objectSchema, arrayItemSchema } = fieldSchema;
    // Construct the full path for the current field. If basePath is empty (root level), don't prepend a dot.
    const fullPath = basePath ? `${basePath}.${name}` : name;

    // Get the current value for this field using the full path from the top-level formData
    // This was a slight misunderstanding in previous step: getValueByPath should always work from root formData or the specific object slice.
    // dataForPath IS the specific slice. So we access `name` directly on it.
    // const currentValue = getValueByPath(formData, fullPath); // Option 1: always use root formData
    const currentValue = dataForPath && typeof dataForPath === 'object' ? dataForPath[name] : undefined; // Option 2: use the passed dataForPath slice


    switch (type) {
      case 'text':
      case 'url':
      case 'email':
      case 'date':
      case 'number':
        return (
          <div key={fieldId} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={fieldId} className="text-right">
              {label}{required && '*'}
            </Label>
            <Input
              id={fieldId}
              type={type === 'number' ? 'number' : (type === 'date' ? 'date' : 'text')}
              value={currentValue || ''}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              className="col-span-3"
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              required={required}
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={fieldId} className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor={fieldId} className="text-right pt-2">
              {label}{required && '*'}
            </Label>
            <Textarea
              id={fieldId}
              value={currentValue || ''}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder={placeholder || `Enter ${label.toLowerCase()}`}
              required={required}
            />
          </div>
        );
      case 'boolean':
        return (
          <div key={fieldId} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={fieldId} className="text-right col-span-3">
              {label}{required && '*'}
            </Label>
            <Checkbox
              id={fieldId}
              checked={!!currentValue}
              onCheckedChange={(checked) => handleInputChange(fieldId, checked)}
              className="col-span-1 justify-self-start"
            />
          </div>
        );
      case 'object':
        if (!objectSchema) {
          return <p key={fullPath}>Error: objectSchema not defined for {name}</p>;
        }
        return (
          <div key={fullPath} className="space-y-4 p-4 border rounded-md">
            <h3 className="font-semibold text-lg">{label}</h3>
            {/* Pass `currentValue` as the `dataForPath` for sub-fields. This is the object slice. */}
            {objectSchema.map(subField => renderFormField(subField, fullPath, currentValue || {}))}
          </div>
        );
      case 'array':
        if (!arrayItemSchema) {
          return <p key={fullPath}>Error: arrayItemSchema not defined for {name}</p>;
        }
        // `currentValue` here is the array itself
        const items = Array.isArray(currentValue) ? currentValue : [];
        return (
          <div key={fullPath} className="space-y-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{label}</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        // Path for the new item in the array
                        const newItemPath = `${fullPath}[${items.length}]`;
                        if (typeof arrayItemSchema === 'object' && arrayItemSchema.objectSchema) {
                            // Initialize new object based on its schema
                            const newObj = arrayItemSchema.objectSchema.reduce((acc, sf) => {
                                // @ts-ignore - initialize with undefined or default based on schema
                                acc[sf.name] = undefined;
                                return acc;
                            }, {} as Record<string, any>);
                            handleInputChange(newItemPath, newObj);
                        } else {
                             // For simple types or arrayItemSchema as FieldType
                            handleInputChange(newItemPath, ''); // Initialize with empty string or undefined
                        }
                    }}
                >
                    Add {typeof arrayItemSchema === 'object' ? arrayItemSchema.label || 'Item' : 'Item'}
                </Button>
            </div>
            {items.map((item: any, index: number) => {
              // Path for the current item within the array
              const itemPath = `${fullPath}[${index}]`;
              return (
                <div key={itemPath} className="p-3 border rounded bg-slate-50 dark:bg-slate-800 relative">
                  {typeof arrayItemSchema === 'object' ? (
                     arrayItemSchema.objectSchema ?
                        // For array of objects, 'item' is the object. Pass it as `dataForPath`.
                        // The `basePath` for sub-fields is `itemPath`.
                        arrayItemSchema.objectSchema.map(subField => renderFormField(subField, itemPath, item))
                        : <p>Error: objectSchema missing in arrayItemSchema for {arrayItemSchema.label}</p>
                  ) : (
                    // Array of simple types. `item` is the value.
                    <div className="grid grid-cols-4 items-center gap-2">
                        <Input
                            id={itemPath} // ID for the input field itself
                            type={arrayItemSchema as FieldType === 'number' ? 'number' : 'text'}
                            value={item || ''}
                            onChange={(e) => handleInputChange(itemPath, e.target.value)}
                            className="col-span-3"
                            placeholder={`Enter value`}
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                const newItems = [...items];
                                newItems.splice(index, 1);
                                // Update the whole array at its path (`fullPath`)
                                handleInputChange(fullPath, newItems);
                            }}
                            className="col-span-1"
                        >
                            Remove
                        </Button>
                    </div>
                  )}
                   {/* Common Remove button for array of objects items */}
                   {typeof arrayItemSchema === 'object' && (
                     <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            const newItems = [...items];
                            newItems.splice(index, 1);
                            handleInputChange(fullPath, newItems); // Update the whole array
                        }}
                        className="mt-2" // Placed consistently for object array items
                    >
                        Remove {arrayItemSchema.label || 'Item'}
                    </Button>
                   )}
                </div>
              );
            })}
             {items.length === 0 && <p className="text-sm text-muted-foreground">No items yet. Click "Add" to create one.</p>}
          </div>
        );
      default:
        // Fallback for unsupported field types
        const fieldIdForDefault = fullPath; // Use fullPath for id
        return (
          <div key={fieldIdForDefault} className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={fieldIdForDefault} className="text-right">
              {label}
            </Label>
            <Input
              id={fieldIdForDefault}
              value={currentValue || ''} // Display current value if any
              onChange={(e) => handleInputChange(fullPath, e.target.value)} // Allow editing, though type is unknown
              className="col-span-3"
              placeholder={`Unsupported field type: ${String(type)}`}
              disabled
            />
          </div>
        );
    }
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
          {/* Dynamic form fields will be rendered here */}
          {/* Initial call: basePath is empty, dataForPath is the root formData object */}
          {entitySchema.map((field) => renderFormField(field, '', formData))}

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
