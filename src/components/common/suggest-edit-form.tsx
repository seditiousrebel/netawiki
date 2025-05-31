import React, { useState, useEffect, useCallback } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox'; // For boolean fields
import type { FormFieldSchema, FieldType } from './suggest-new-entry-form'; // Assuming types are here
import { ScrollArea } from '@/components/ui/scroll-area'; // For potentially long forms

// Helper function to safely get a value by path (can be moved to a utils file)
export const getValueByPath = (obj: Record<string, any>, path: string): any => {
  if (!path) return undefined;
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

// Helper function to deep clone (basic version)
const deepClone = (obj: any) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }
  const cloned = {} as Record<string, any>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};


export interface SuggestEditFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entitySchema: FormFieldSchema[];
  fieldPath: string; // e.g., 'bio', 'contactInfo.email', 'aliases[0]' or 'aliases[0].name'
  currentEntityData: Record<string, any>;
  entityDisplayName?: string; // Optional: For display in title, e.g. Politician name
  onSubmit: (suggestion: {
    fieldPath: string;
    suggestedValue: any;
    oldValue: any;
    reason: string;
    evidenceUrl: string;
  }) => void;
}

export const SuggestEditForm: React.FC<SuggestEditFormProps> = ({
  isOpen,
  onOpenChange,
  entitySchema,
  fieldPath,
  currentEntityData,
  entityDisplayName,
  onSubmit,
}) => {
  const [suggestedValue, setSuggestedValue] = useState<any>(null);
  const [oldValue, setOldValue] = useState<any>(null);
  const [targetSchema, setTargetSchema] = useState<FormFieldSchema | null>(null);
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const getFieldSchemaByPath = useCallback((entitySchemaFields: FormFieldSchema[], path: string): FormFieldSchema | null => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let currentSchema: FormFieldSchema[] | FormFieldSchema | undefined = entitySchemaFields;
    let resolvedSchema: FormFieldSchema | null = null;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!currentSchema) return null;

      if (Array.isArray(currentSchema)) {
        resolvedSchema = currentSchema.find(f => f.name === key) || null;
      } else { // currentSchema is a single FormFieldSchema (likely from arrayItemSchema or objectSchema)
        resolvedSchema = currentSchema; // This is the schema for the current key if it's an array index or the object itself
      }

      if (!resolvedSchema) return null;

      if (i < keys.length - 1) { // Not the last key, so we need to go deeper
        const nextKeyIsArrayIndex = /^\d+$/.test(keys[i + 1]);
        if (resolvedSchema.type === 'object' && resolvedSchema.objectSchema && !nextKeyIsArrayIndex) {
          currentSchema = resolvedSchema.objectSchema;
        } else if (resolvedSchema.type === 'array' && resolvedSchema.arrayItemSchema) {
          if (nextKeyIsArrayIndex) {
            // The next key is an index, so currentSchema for the next iteration
            // should be the arrayItemSchema itself.
            if (typeof resolvedSchema.arrayItemSchema === 'object') {
              currentSchema = resolvedSchema.arrayItemSchema as FormFieldSchema;
            } else { // Array of simple types
              // This case means path is like 'simpleArray[0]' and this is the last part.
              // If path continues, e.g. 'simpleArray[0].nonExistentProp', it's an error.
              // For now, we'll let it be handled by the next iteration which will likely fail to find a sub-schema.
              // Or, more correctly, the schema for 'simpleArray[0]' is just its type.
              currentSchema = { name: keys[i+1], label: `Item ${parseInt(keys[i+1],10)+1}`, type: resolvedSchema.arrayItemSchema as FieldType };
            }
          } else { // Next key is a property name inside an array item (which must be an object)
            if (typeof resolvedSchema.arrayItemSchema === 'object' && (resolvedSchema.arrayItemSchema as FormFieldSchema).objectSchema) {
              currentSchema = (resolvedSchema.arrayItemSchema as FormFieldSchema).objectSchema;
            } else {
              return null; // Trying to access property of a non-object array item
            }
          }
        } else {
          return null; // Cannot go deeper
        }
      }
    }
    // If the last key was an array index for a simple type array, construct a temporary schema
    const lastKey = keys[keys.length -1];
    if (resolvedSchema && resolvedSchema.type === 'array' && /^\d+$/.test(lastKey) && typeof resolvedSchema.arrayItemSchema !== 'object') {
        return { name: lastKey, label: `Item ${parseInt(lastKey,10)+1}`, type: resolvedSchema.arrayItemSchema as FieldType };
    }

    return resolvedSchema;
  }, []);


  useEffect(() => {
    const initialOldValue = getValueByPath(currentEntityData, fieldPath);
    setOldValue(deepClone(initialOldValue));
    setSuggestedValue(deepClone(initialOldValue)); // Initialize suggestedValue with a copy of oldValue

    const schemaForField = getFieldSchemaByPath(entitySchema, fieldPath);
    setTargetSchema(schemaForField);

    // Reset reason and evidence for new field edit
    setReason('');
    setEvidenceUrl('');

  }, [isOpen, fieldPath, currentEntityData, entitySchema, getFieldSchemaByPath]);

  const handleValueChange = (path: string, value: any) => {
    // If the target field is complex (object/array), suggestedValue itself is that complex part.
    // If simple, suggestedValue is the value.
    if (targetSchema && (targetSchema.type === 'object' || targetSchema.type === 'array')) {
      // Path here is relative to the 'suggestedValue' object (which is the item being edited)
      setSuggestedValue((prevData: any) => {
        const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
        let currentLevel = { ...prevData }; // prevData is the object/array being edited
        let dataRef = currentLevel;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          const nextKey = keys[i + 1];
          const isNextKeyArrayIndex = /^\d+$/.test(nextKey);

          if (!dataRef[key] || typeof dataRef[key] !== 'object') {
            dataRef[key] = isNextKeyArrayIndex ? [] : {};
          } else {
            dataRef[key] = Array.isArray(dataRef[key]) ? [...dataRef[key]] : { ...dataRef[key] };
          }
          dataRef = dataRef[key];
        }
        dataRef[keys[keys.length - 1]] = value;
        return currentLevel;
      });
    } else {
      // For simple fields, path is not used, value is set directly.
      setSuggestedValue(value);
    }
  };


  const handleSubmit = () => {
    onSubmit({
      fieldPath,
      suggestedValue,
      oldValue, // Send the initial old value
      reason,
      evidenceUrl,
    });
    // onOpenChange(false); // Let the parent component decide to close
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Values will be reset by useEffect when isOpen changes or other props change.
  };

  // Simplified renderField for single field or a structure if targetSchema is object/array
  // This is a placeholder. A more robust recursive renderer like in SuggestNewEntryForm
  // might be needed if we are editing complex objects/arrays directly.
  const renderFieldInput = (schema: FormFieldSchema, value: any, pathPrefix: string = "") => {
    const currentFullPath = pathPrefix ? `${pathPrefix}.${schema.name}` : schema.name;

    if (schema.type === 'object' && schema.objectSchema) {
      return (
        <div key={currentFullPath} className="space-y-3 p-3 border rounded-md">
          <h4 className="font-medium">{schema.label}</h4>
          {schema.objectSchema.map(subField =>
            renderFieldInput(subField, value && typeof value === 'object' ? value[subField.name] : undefined, currentFullPath)
          )}
        </div>
      );
    }

    if (schema.type === 'array' && schema.arrayItemSchema) {
      const items = Array.isArray(value) ? value : [];
      // For now, let's make array editing a JSON textarea to simplify, per instruction fallback.
      // A full array UI would involve add/remove buttons and rendering each item.
      return (
         <div key={currentFullPath} className="grid grid-cols-1 items-start gap-2">
          <Label htmlFor={currentFullPath} className="pt-2">
            {schema.label} (JSON Array)
          </Label>
           <Textarea
            id={currentFullPath}
            value={JSON.stringify(value, null, 2) || ''}
            onChange={(e) => {
              try {
                handleValueChange(schema.name, JSON.parse(e.target.value));
              } catch (err) {
                // handle JSON parse error, maybe set an error state
                console.error("Invalid JSON for array:", err);
              }
            }}
            className="col-span-1 min-h-[120px] font-mono text-xs"
            placeholder={schema.placeholder || `Enter JSON array for ${schema.label.toLowerCase()}`}
            required={schema.required}
          />
          <p className="text-xs text-muted-foreground col-span-1">Edit this array as a JSON string. For complex array editing, a dedicated UI will be available later.</p>
        </div>
      );
    }


    // Standard field rendering
    switch (schema.type) {
      case 'textarea':
        return (
          <Textarea
            id={currentFullPath}
            value={value || ''}
            onChange={(e) => handleValueChange(pathPrefix ? schema.name : "", e.target.value)} // if pathPrefix, means it's a subfield of suggestedValue object
            className="col-span-1 min-h-[100px]"
            placeholder={schema.placeholder || `Enter ${schema.label.toLowerCase()}`}
            required={schema.required}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={currentFullPath}
              checked={!!value}
              onCheckedChange={(checked) => handleValueChange(pathPrefix ? schema.name : "", checked)}
            />
            <Label htmlFor={currentFullPath} className="mb-0">Is Active</Label>
          </div>
        );
      case 'number':
        return (
          <Input
            id={currentFullPath}
            type="number"
            value={value || ''}
            onChange={(e) => handleValueChange(pathPrefix ? schema.name : "", parseFloat(e.target.value) || 0)}
            className="col-span-1"
            placeholder={schema.placeholder || `Enter ${schema.label.toLowerCase()}`}
            required={schema.required}
          />
        );
      default: // text, email, url, date
        return (
          <Input
            id={currentFullPath}
            type={schema.type as FieldType}
            value={value || ''}
            onChange={(e) => handleValueChange(pathPrefix ? schema.name : "", e.target.value)}
            className="col-span-1"
            placeholder={schema.placeholder || `Enter ${schema.label.toLowerCase()}`}
            required={schema.required}
          />
        );
    }
  };

  const renderFormContent = () => {
    if (!targetSchema) {
      return <p>Field schema not found for path: {fieldPath}. Please check configuration.</p>;
    }
    // If targetSchema is for a complex type (object/array), suggestedValue will hold that structure.
    // The input fields for its sub-properties will update parts of suggestedValue.
    if (targetSchema.type === 'object' && targetSchema.objectSchema) {
         return targetSchema.objectSchema.map(subField => (
            <div key={subField.name} className="grid grid-cols-4 items-start gap-4">
                 <Label htmlFor={subField.name} className="text-right pt-2">
                    {subField.label}{subField.required && '*'}
                </Label>
                <div className="col-span-3">
                    {renderFieldInput(subField, suggestedValue ? suggestedValue[subField.name] : undefined, subField.name)}
                </div>
            </div>
         ));
    }
    // For simple types or arrays (currently handled as JSON textarea by renderFieldInput)
    return (
        <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="suggestedValue" className="text-right pt-2">
                Suggested Value for {targetSchema.label}
            </Label>
            <div className="col-span-3">
                 {renderFieldInput(targetSchema, suggestedValue, "")}
            </div>
        </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Suggest Edit: {entityDisplayName || fieldPath}</DialogTitle>
          <DialogDescription>
            Field: <strong className="font-semibold">{targetSchema?.label || fieldPath}</strong>.
            Your suggestion will be reviewed before publication.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1 pr-4">
            <div className="grid gap-6 py-4 px-2">
            <div className="grid grid-cols-4 items-start gap-4 border p-4 rounded-md bg-muted/30">
                <Label htmlFor="oldValueDisplay" className="text-right pt-2 text-sm text-muted-foreground">
                Current Value
                </Label>
                <div className="col-span-3">
                {typeof oldValue === 'object' ? (
                    <Textarea id="oldValueDisplay" value={JSON.stringify(oldValue, null, 2)} disabled className="min-h-[80px] text-xs font-mono bg-background" />
                ) : (
                    <Textarea id="oldValueDisplay" value={String(oldValue ?? '')} disabled className="min-h-[60px] bg-background" />
                )}
                </div>
            </div>

            {/* Dynamic input area for suggestedValue */}
            {/* This part needs to use targetSchema to render the correct input type */}
            {/* For complex objects, this might involve recursive rendering */}
            {renderFormContent()}

            <div className="grid grid-cols-4 items-start gap-4 pt-4 border-t">
                <Label htmlFor="reason" className="text-right pt-2">
                  Reason*
                </Label>
                <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="col-span-3"
                placeholder="Why are you suggesting this change? (Required)"
                required
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
                placeholder="Optional: Link to supporting evidence"
                />
            </div>
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!reason}>
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestEditForm;
