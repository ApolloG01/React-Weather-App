// TypeScript module declarations for importing .jsx components without explicit type definitions.
// This file prevents TS errors like "Could not find a declaration file for module './components/Loader.jsx'".

declare module "*.jsx" {
  import type { ComponentType } from "react";
  const Component: ComponentType<any>;
  export default Component;
}
