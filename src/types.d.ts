declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// CSS files
declare module "*.css";

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
