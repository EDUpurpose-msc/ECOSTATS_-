import { ReactNode } from 'react';

// Define the interface for the fields
export interface GenericFormField {
  name: string; // Name of the field (used for form identification)
  label: string; // Label to display for the field
  input: ReactNode; // The input element to render (e.g., <Input />, <Checkbox />, etc.)
}

export interface GenericFormFieldV3 {
  name: string;
  label?: string; // Optional for non-input elements
  input?: ReactNode; // The input element or other component
  type: 'input' | 'title' | 'divider' | 'checkbox'; // Specify the type of field
  required? : boolean
  notDefault? : boolean,
  initialValue? : any
}