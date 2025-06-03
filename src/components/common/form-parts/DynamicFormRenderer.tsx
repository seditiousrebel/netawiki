import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormFieldSchema, FieldType } from '@/types/form-schema';
import { mockPoliticians, mockParties, mockCommittees, mockBills, mockConstituencies, mockElections } from '@/lib/mock-data'; // Assuming these exist

interface DynamicFormRendererProps {
  fieldSchema: FormFieldSchema;
  basePath: string;
  dataForPath: any; // Current data slice relevant for this path/schema
  onInputChange: (path: string, value: any) => void;
  // Optional prop to customize rendering for specific scenarios, e.g., single field edit root
  isSingleFieldRoot?: boolean; 
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  fieldSchema,
  basePath,
  dataForPath,
  onInputChange,
  isSingleFieldRoot = false,
}) => {
  const { name, label, type, required, placeholder, objectSchema, arrayItemSchema } = fieldSchema;
  const fullPath = basePath ? `${basePath}.${name}` : name;

  let currentValue: any;
  if (isSingleFieldRoot) {
    // For the root of a single field edit, dataForPath is the field's value itself.
    currentValue = dataForPath;
  } else {
    // For nested fields or full entity forms, extract value from dataForPath object.
    currentValue = dataForPath && typeof dataForPath === 'object' ? dataForPath[name] : undefined;
  }

  // Ensure currentValue is a string for select components if it's null or undefined,
  // as Select component expects string value. The actual onInputChange will pass the original type.
  const selectValue = currentValue === null || currentValue === undefined ? '' : String(currentValue);


  switch (type) {
    case 'select':
      return (
        <div key={fullPath} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fullPath} className="text-right">
            {label}{required && '*'}
          </Label>
          <Select
            value={selectValue}
            onValueChange={(value) => onInputChange(fullPath, value)}
            disabled={fieldSchema.disabled}
          >
            <SelectTrigger id={fullPath} className="col-span-3">
              <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(fieldSchema.options || []).map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {(fieldSchema.options || []).length === 0 && <SelectItem value="no_options_select" disabled>No options available</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      );
    case 'entity-selector':
      let entities: { id: string, name: string, [key: string]: any }[] = [];
      // console.log(`Rendering entity-selector for ${fullPath}, referencedEntityType: ${fieldSchema.referencedEntityType}`);
      if (fieldSchema.referencedEntityType === 'Politician') {
        entities = mockPoliticians;
      } else if (fieldSchema.referencedEntityType === 'Party') {
        entities = mockParties;
      } else if (fieldSchema.referencedEntityType === 'Committee') {
        entities = mockCommittees;
      } else if (fieldSchema.referencedEntityType === 'Bill') {
        entities = mockBills.map(b => ({ ...b, name: b.title })); // Adapt 'title' to 'name'
      } else if (fieldSchema.referencedEntityType === 'Constituency') {
        entities = mockConstituencies;
      } else if (fieldSchema.referencedEntityType === 'Election') {
        entities = mockElections;
      }
      // Add other entity types as needed
      // else { console.warn(`Unsupported referencedEntityType: ${fieldSchema.referencedEntityType} for ${fullPath}`); }

      return (
        <div key={fullPath} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fullPath} className="text-right">
            {label}{required && '*'}
          </Label>
          <Select
            value={selectValue} // currentValue should be the ID of the entity
            onValueChange={(value) => onInputChange(fullPath, value)} // value is the ID
            disabled={fieldSchema.disabled}
          >
            <SelectTrigger id={fullPath} className="col-span-3">
              <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {entities.map(entity => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name || entity.title} {/* Bill uses title, others use name */}
                </SelectItem>
              ))}
              {entities.length === 0 && <SelectItem value="no_options_entity_selector" disabled>No options available for {fieldSchema.referencedEntityType}</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      );
    case 'text':
    case 'url':
    case 'email':
    case 'date':
    case 'number':
      return (
        <div key={fullPath} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fullPath} className="text-right">
            {label}{required && '*'}
          </Label>
          <Input
            id={fullPath}
            type={type === 'number' ? 'number' : (type === 'date' ? 'date' : 'text')}
            value={currentValue || ''}
            onChange={(e) => onInputChange(fullPath, e.target.value)}
            className="col-span-3"
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required}
            disabled={fieldSchema.disabled}
          />
        </div>
      );
    case 'textarea':
      return (
        <div key={fullPath} className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor={fullPath} className="text-right pt-2">
            {label}{required && '*'}
          </Label>
          <Textarea
            id={fullPath}
            value={currentValue || ''}
            onChange={(e) => onInputChange(fullPath, e.target.value)}
            className="col-span-3 min-h-[100px]"
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            required={required}
            disabled={fieldSchema.disabled}
          />
        </div>
      );
    case 'boolean':
      return (
        <div key={fullPath} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fullPath} className="text-right col-span-3">
            {label}{required && '*'}
          </Label>
          <Checkbox
            id={fullPath}
            checked={!!currentValue}
            onCheckedChange={(checked) => onInputChange(fullPath, checked)}
            className="col-span-1 justify-self-start"
            disabled={fieldSchema.disabled}
          />
        </div>
      );
    case 'object':
      if (!objectSchema) {
        return <p key={fullPath} className="text-red-500">Error: objectSchema not defined for {name}</p>;
      }
      return (
        <div key={fullPath} className="space-y-4 p-4 border rounded-md">
          <h3 className="font-semibold text-lg">{label}</h3>
          {objectSchema.map(subField => (
            <DynamicFormRenderer
              key={subField.name}
              fieldSchema={subField}
              basePath={fullPath}
              dataForPath={currentValue || {}} // Pass the current object slice
              onInputChange={onInputChange}
              // isSingleFieldRoot is false for nested calls
            />
          ))}
        </div>
      );
    case 'array':
      if (!arrayItemSchema) {
        return <p key={fullPath} className="text-red-500">Error: arrayItemSchema not defined for {name}</p>;
      }
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
                const newItemPath = `${fullPath}[${items.length}]`;
                if (typeof arrayItemSchema === 'object' && arrayItemSchema.objectSchema) {
                  const newObj = arrayItemSchema.objectSchema.reduce((acc, sf) => {
                    // @ts-ignore
                    acc[sf.name] = undefined; // Or some default value based on sf.type
                    return acc;
                  }, {} as Record<string, any>);
                  onInputChange(newItemPath, newObj);
                } else {
                  onInputChange(newItemPath, ''); // Default for simple type array
                }
              }}
            >
              Add {typeof arrayItemSchema === 'object' ? arrayItemSchema.label || 'Item' : 'Item'}
            </Button>
          </div>
          {items.map((item: any, index: number) => {
            const itemPath = `${fullPath}[${index}]`;
            return (
              <div key={itemPath} className="p-3 border rounded bg-slate-50 dark:bg-slate-800 relative">
                {typeof arrayItemSchema === 'object' ? (
                  arrayItemSchema.objectSchema ? (
                    arrayItemSchema.objectSchema.map(subField => (
                      <DynamicFormRenderer
                        key={subField.name}
                        fieldSchema={subField}
                        basePath={itemPath} // Base path for fields *within* this array item
                        dataForPath={item || {}}      // Data for fields *within* this array item is the item itself
                        onInputChange={onInputChange}
                         // isSingleFieldRoot is false for nested calls
                      />
                    ))
                  ) : <p className="text-red-500">Error: objectSchema missing in arrayItemSchema for {arrayItemSchema.label}</p>
                ) : (
                  // Array of simple types
                  <div className="grid grid-cols-4 items-center gap-2">
                    <Input
                      id={itemPath}
                      type={arrayItemSchema as FieldType === 'number' ? 'number' : 'text'}
                      value={item || ''}
                      onChange={(e) => onInputChange(itemPath, e.target.value)}
                      className="col-span-3"
                      placeholder={`Enter value`}
                      disabled={fieldSchema.disabled} // Assuming disabled applies to array items too
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newItems = [...items];
                        newItems.splice(index, 1);
                        onInputChange(fullPath, newItems); // Update the whole array
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
                      onInputChange(fullPath, newItems); // Update the whole array
                    }}
                    className="mt-2"
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
      return (
        <div key={fullPath} className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={fullPath} className="text-right">
            {label}
          </Label>
          <Input
            id={fullPath}
            value={currentValue || ''}
            onChange={(e) => onInputChange(fullPath, e.target.value)}
            className="col-span-3"
            placeholder={`Unsupported field type: ${String(type)}`}
            disabled // This one is explicitly disabled by default, that's fine
          />
        </div>
      );
  }
};

export default DynamicFormRenderer;
