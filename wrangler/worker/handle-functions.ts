import { getParsedUrl } from "./helpers";
import { Environment } from "./types";

// @ts-ignore
// Manifest is generated by `/wrangler/build.ts`.
import functionManifest from "../_manifest";

export async function handleFunctionRoute(
  request: Request,
  env: Environment,
  context: ExecutionContext
) {
  const url = getParsedUrl(request);
  if (!url.path.startsWith("/fn")) return null;
  if (!(url.path in functionManifest)) return new Response(null, { status: 404 });

  const path = url.path as keyof typeof functionManifest;
  const functionConfig = functionManifest[path] as { [method: string]: Function };
  const functionResult = await functionConfig[request.method.toLowerCase()](url.query);

  return new Response(functionResult?.data, {
    status: 200,
    headers: {
      "Content-Type": functionResult?.contentType || "text/plain",
      "X-Data-Cache": "PREVIEW"
    }
  });
}

export default {
  async fetch(request: Request, env: Environment, context: ExecutionContext) {
    let response = await handleFunctionRoute(request, env, context);
    if (!response) response = new Response("INVALID_ROUTE", { status: 500 });
    return response;
  }
};
