import { defineConfig } from "@vscode/test-cli";
import packageJson from "./package.json" assert { type: "json" };

export default defineConfig({
  files: "out/test/**/*.test.js",
  version: packageJson.engines.vscode.replace(/^\^/, ""),
});
