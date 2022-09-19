/// <reference types="@cloudflare/workers-types"/>

interface WorkerRequest extends Request {
  origin: string;
  path: string;
  params: { [key: string]: string };
  query: { [key: string]: string };
  fetch: Fetch;
}

interface WorkerEnvironment {
  SECRET?: string;
  FUNCTIONS: KVNamespace;
  __STATIC_CONTENT: KVNamespace;
}

// Renamed for consistency and clarity.
type WorkerContext = ExecutionContext;

interface WorkerEvent {
  request: WorkerRequest;
  waitUntil: (promise: Promise<any>) => void;
}

// In Cloudflare Workers, this module points to a JSON manifest that
// maps asset paths to Workers KV keys generated by Workers Sites.
declare module "__STATIC_CONTENT_MANIFEST" {
  const manifest: string;
  export default manifest;
}

interface FunctionRoute {
  expression: RegExp;
  module: {[method: string]: Function } & {
    cache?: number | true
  };
}

interface FunctionConfig {
  handler: Function,
  cache?: {
    key: string,
    ttl?: number,
    preview: boolean,
    refresh: boolean
  }
}
