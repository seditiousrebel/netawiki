// src/types/form-schema.ts

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
