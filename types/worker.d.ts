interface Environment {
  SECRET?: string,
  DATA: KVNamespace,
  __STATIC_CONTENT: KVNamespace
}

// In Cloudflare Workers, this module points to a JSON manifest
// mapping asset request paths to keys generated by Workers Sites.
declare module "__STATIC_CONTENT_MANIFEST" {
  const manifest: string;
  export default manifest;
}
