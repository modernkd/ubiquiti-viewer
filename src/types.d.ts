declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// CSS files
declare module "*.css";
