declare module "react-quill" {
  import * as React from "react";
  import { CSSProperties } from "react";

  export interface Quill {
    getEditor(): any;
  }

  export interface QuillModules {
    toolbar?: (string[] | { [key: string]: any }[])[];
    [key: string]: any; // Allow additional properties
  }
  // Define the shape of the formats prop
  export interface QuillFormats {
    [key: string]: any; // Allow additional formats
  }
  export interface ReactQuillProps {
    value?: string;
    onChange?: (value: string) => void;
    modules?: QuillModules;
    formats?: QuillFormats;
    style?: CSSProperties;
    placeholder?: string; // Add placeholder property
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
