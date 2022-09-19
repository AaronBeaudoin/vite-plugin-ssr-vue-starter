import fileSystem from "fs";
import esbuild from "esbuild";
import chalk from "chalk";

(async _ => {
  const root = __dirname.replace(/\/wrangler$/, "");
  fileSystem.mkdirSync(`${root}/dist/omelette/`, { recursive: true });

  await esbuild.build({
    platform: "browser",
    conditions: ["worker"],
    target: "es2020",
    format: "esm",
    bundle: true,
    minify: true,
    
    entryPoints: [`${root}/wrangler/worker/entrypoint.ts`],
    outfile: `${root}/dist/omelette/worker.mjs`,
    allowOverwrite: true,
  
    // `vite-plugin-ssr` uses some Node.js APIs that must be polyfilled
    // when bundling for edge functions since they are not available there.
    plugins: [(await import("@esbuild-plugins/node-modules-polyfill")).NodeModulesPolyfillPlugin()],
  
    // Defining these are required when using `esbuild`, otherwise we get runtime errors.
    // https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
    define: { __VUE_OPTIONS_API__: "true", __VUE_PROD_DEVTOOLS__: "false" },
  
    // This module is generated by Cloudflare Workers Sites during deployment.
    external: ["__STATIC_CONTENT_MANIFEST"]
  });
  
  const stat = fileSystem.statSync(`${root}/dist/omelette/worker.mjs`);
  console.log(`${chalk.blue('BUILD')} worker.mjs ${stat.size / 1000} KB`);
})();
