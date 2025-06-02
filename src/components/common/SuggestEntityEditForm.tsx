import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import type { FormFieldSchema, FieldType } from '@/types/form-schema';
import { DynamicFormRenderer } from './form-parts/DynamicFormRenderer'; // Import the new renderer

// Helper function to deep clone (basic version) - This one is fine.
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

// Removed local FieldType and FormFieldSchema definitions

export interface SuggestEntityEditFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entityType: string;
  entitySchema: FormFieldSchema[];
  currentEntityData: Record<string, any>; 
  fieldPath?: string; // Optional: path to a specific field to edit
  entityDisplayName?: string; // Optional: For display in title
  onSubmit: (submission: {
    formData?: Record<string, any>; // For full entity
    fieldPath?: string;             // For single field
    suggestedValue?: any;           // For single field
    oldValue?: any;                 // For single field
    reason: string;
    evidenceUrl: string;
  }) => void;
}

// Helper function to safely get a value by path (copied from suggest-edit-form.tsx for robustness)
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

// Helper function to get field schema by path (copied and adapted from suggest-edit-form.tsx)
export const getFieldSchemaByPath = (entitySchemaFields: FormFieldSchema[], path: string): FormFieldSchema | null => {
  if (typeof path !== 'string') {
    console.warn('getFieldSchemaByPath called with non-string path:', path);
    return null;
  }
  if (!entitySchemaFields) {
    console.warn('getFieldSchemaByPath called with undefined entitySchemaFields.');
    return null;
  }
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let currentSchema: FormFieldSchema[] | FormFieldSchema | undefined = entitySchemaFields;
  let resolvedSchema: FormFieldSchema | null = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!currentSchema) return null;

    if (Array.isArray(currentSchema)) {
      resolvedSchema = currentSchema.find(f => f.name === key) || null;
    } else { 
      resolvedSchema = currentSchema; 
    }

    if (!resolvedSchema) return null;

    if (i < keys.length - 1) { 
      const nextKeyIsArrayIndex = /^\d+$/.test(keys[i + 1]);
      if (resolvedSchema.type === 'object' && resolvedSchema.objectSchema && !nextKeyIsArrayIndex) {
        currentSchema = resolvedSchema.objectSchema;
      } else if (resolvedSchema.type === 'array' && resolvedSchema.arrayItemSchema) {
        if (nextKeyIsArrayIndex) {
          if (typeof resolvedSchema.arrayItemSchema === 'object') {
            currentSchema = resolvedSchema.arrayItemSchema as FormFieldSchema;
          } else { 
            currentSchema = { name: keys[i+1], label: `Item ${parseInt(keys[i+1],10)+1}`, type: resolvedSchema.arrayItemSchema as FieldType };
          }
        } else { 
          if (typeof resolvedSchema.arrayItemSchema === 'object' && (resolvedSchema.arrayItemSchema as FormFieldSchema).objectSchema) {
            currentSchema = (resolvedSchema.arrayItemSchema as FormFieldSchema).objectSchema;
          } else {
            return null; 
          }
        }
      } else {
        // This was the last key segment
      }
    }
  }
  const lastKey = keys[keys.length -1];
  if (resolvedSchema && resolvedSchema.type === 'array' && /^\d+$/.test(lastKey) && typeof resolvedSchema.arrayItemSchema !== 'object') {
      return { name: lastKey, label: `Item ${parseInt(lastKey,10)+1}`, type: resolvedSchema.arrayItemSchema as FieldType };
  }
  return resolvedSchema;
};


export const SuggestEntityEditForm: React.FC<SuggestEntityEditFormProps> = ({
  isOpen,
  onOpenChange,
  entityType,
  entitySchema,
  currentEntityData,
  onSubmit,
  fieldPath, // New prop
  entityDisplayName, // New prop
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [oldValue, setOldValue] = useState<any>(null); // For single field edit
  const [targetSchema, setTargetSchema] = useState<FormFieldSchema | null>(null); // For single field edit

  useEffect(() => {
    if (!isOpen) return;

    if (!currentEntityData) {
      console.warn("SuggestEntityEditForm: currentEntityData is undefined.");
      return;
    }
    if (!entitySchema) {
      console.warn("SuggestEntityEditForm: entitySchema is undefined.");
      return;
    }

    if (fieldPath) {
      const schema = getFieldSchemaByPath(entitySchema, fieldPath);
      setTargetSchema(schema);
      const currentFieldValue = getValueByPath(currentEntityData, fieldPath);
      setOldValue(deepClone(currentFieldValue));
      // Initialize formData with only the specific field's value for editing
      const initialFieldValue = deepClone(currentFieldValue);
      setFormData(initialFieldValue);
    } else {
      // Full entity edit mode
      setFormData(deepClone(currentEntityData) || {});
      setTargetSchema(null); // Ensure targetSchema is cleared for full entity mode
      setOldValue(null); // Ensure oldValue is cleared
    }
    setReason('');
    setEvidenceUrl('');
  }, [isOpen, fieldPath, currentEntityData, entitySchema]);


  const handleInputChange = (path: string, value: any) => {
    if (fieldPath && targetSchema) {
      // Single field edit mode
      if (targetSchema.type === 'object' || targetSchema.type === 'array') {
        // formData is an object or array; path is relative to it.
        // Example: fieldPath = "contact", targetSchema.type = "object"
        // formData = { email: "...", phone: "..." }
        // A change to email input calls handleInputChange("email", "new@example.com")
        // path = "email"
        setFormData((prevData: any) => {
          const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
          // prevData is the current state of the single field (e.g., the contact object)
          let currentLevel = deepClone(prevData); 
          // Ensure currentLevel is an object if it's not, and keys exist
          if (typeof currentLevel !== 'object' && keys.length > 0) {
             // This case should ideally be prevented by correct initialization of formData
             // For example, if editing an optional object field that is currently null.
             currentLevel = /^\d+$/.test(keys[0]) ? [] : {};
          }
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
        // formData is a simple value (e.g. string, number, boolean)
        // path from renderFormField for a simple type will be fieldSchema.name
        // So, we just update formData to the new value.
        setFormData(value);
      }
    } else {
      // Full entity edit mode: path is relative to the root entity object
      setFormData((prevData:any) => {
        const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
        let currentLevel = { ...prevData };
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

        const lastKey = keys[keys.length - 1];
        dataRef[lastKey] = value;
        return currentLevel;
      });
    }
  };


  const handleSubmit = () => {
    if (fieldPath) {
      onSubmit({
        fieldPath,
        suggestedValue: formData, // formData now holds the value of the single field
        oldValue,
        reason,
        evidenceUrl,
      });
    } else {
      onSubmit({ formData, reason, evidenceUrl });
    }
    // Reset form state
    if (fieldPath && currentEntityData) {
        const currentFieldValue = getValueByPath(currentEntityData, fieldPath);
        setFormData(deepClone(currentFieldValue));
    } else if (currentEntityData) {
        setFormData(deepClone(currentEntityData));
    } else {
        setFormData({});
    }
    setReason('');
    setEvidenceUrl('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form state based on mode
    if (fieldPath && currentEntityData) {
        const currentFieldValue = getValueByPath(currentEntityData, fieldPath);
        setOldValue(deepClone(currentFieldValue));
        setFormData(deepClone(currentFieldValue));
    } else if (currentEntityData) {
        setFormData(deepClone(currentEntityData) || {});
    } else {
        setFormData({});
    }
    setReason('');
    setEvidenceUrl('');
  };

  // Local renderFormField removed, will use DynamicFormRenderer

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {fieldPath && targetSchema
              ? `Suggest Edit: ${entityDisplayName || entityType} - ${targetSchema.label}`
              : `Suggest Edits for ${entityType}`}
          </DialogTitle>
          <DialogDescription>
            {fieldPath && targetSchema
              ? `Propose a change for the field "${targetSchema.label}". Your suggestion will be reviewed.`
              : `Propose changes to the details of this ${entityType.toLowerCase()}. Your suggestions will be reviewed.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fieldPath && targetSchema ? (
            <>
              {/* Display Current Value for single field edit */}
              <div className="grid grid-cols-4 items-start gap-4 p-2 rounded-md bg-muted/20">
                <Label htmlFor="oldValueDisplay" className="text-right pt-2 text-sm text-muted-foreground">
                  Current Value
                </Label>
                <div className="col-span-3">
                  {typeof oldValue === 'object' && oldValue !== null ? (
                    <Textarea id="oldValueDisplay" value={JSON.stringify(oldValue, null, 2)} disabled className="min-h-[60px] text-xs font-mono bg-background/70" />
                  ) : (
                    <Textarea id="oldValueDisplay" value={String(oldValue ?? '')} disabled className="min-h-[40px] bg-background/70" />
                  )}
                </div>
              </div>
              {/* Render only the specific field.
                  - Pass targetSchema as the schema.
                  - Pass '' as basePath because formData is the value of this field.
                  - Pass formData itself as dataForPath.
                  However, renderFormField expects dataForPath to be an object where it can lookup fieldSchema.name.
                  So, if formData is the direct value (e.g. string), we need to wrap it or handle it.
                  If targetSchema.type is 'object' or 'array', formData itself is the object/array.
                  If targetSchema.type is a simple type, formData is the value.
                  The `renderFormField` needs to be called such that `currentValue` is correctly derived.
                  If targetSchema is {name: "fieldName", label: "Field Name", type: "text"},
                  and formData is "current text value" (simple type),
                  the call is renderFormField(targetSchema, '', "current text value").
                  Inside renderFormField: fieldSchema=targetSchema, basePath='', dataForPath="current text value".
                  currentValue logic: fieldPath is active, basePath is '', name is "fieldName", targetSchema.name is "fieldName".
                  So, currentValue = dataForPath = "current text value". This is correct.
                  Input onChange calls handleInputChange("fieldName", newValue).
                  In handleInputChange: targetSchema.type is 'text', so setFormData(newValue). Correct.

                  If targetSchema is {name: "address", type: "object", objectSchema: [...]},
                  and formData is { street: "...", city: "..." } (object type),
                  the call is DynamicFormRenderer with fieldSchema=targetSchema, basePath='', dataForPath=formData, isSingleFieldRoot=true.
                  Inside DynamicFormRenderer for "address" schema:
                    currentValue = dataForPath = { street: "...", city: "..." }. Correct.
                  This "address" field will then recursively call DynamicFormRenderer for "street".
                  e.g. DynamicFormRenderer with fieldSchema=streetSchema, basePath="address", dataForPath=currentValue (the address object), isSingleFieldRoot=false.
                  Inside DynamicFormRenderer for "street":
                    currentValue = dataForPath[streetSchema.name] = addressObject["street"]. Correct.
                  Input onChange calls handleInputChange("address.street", newValue). This path is correct.
              */}
              <DynamicFormRenderer
                fieldSchema={targetSchema}
                basePath=""
                dataForPath={formData}
                onInputChange={handleInputChange}
                isSingleFieldRoot={true} 
              />
            </>
          ) : (
            // Full entity edit: render all fields from entitySchema
            entitySchema.map((field) => (
              <DynamicFormRenderer
                key={field.name}
                fieldSchema={field}
                basePath=""
                dataForPath={formData}
                onInputChange={handleInputChange}
                // isSingleFieldRoot is false by default
              />
            ))
          )}

          {/* Fixed fields for reason and evidence */}
          <div className="grid grid-cols-4 items-start gap-4 pt-4 border-t mt-4">
            <Label htmlFor="reason" className="text-right pt-2 font-semibold">
              Reason for Changes*
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3 min-h-[80px]"
              placeholder="Describe the changes you are proposing and why they are necessary. (Required)"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="evidenceUrl" className="text-right font-semibold">
              Evidence URL (Optional)
            </Label>
            <Input
              id="evidenceUrl"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="col-span-3"
              placeholder="Link to official page, news article, etc."
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
            // Evidence URL is now optional, so remove from disabled logic
            disabled={!reason /* Add other required fields from schema if needed */}
          >
            Submit Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestEntityEditForm;
