import { build } from "esbuild";
import { readFileSync } from "fs";
import { join } from "path";

async function buildTracker() {
  try {
    const currentDir = process.cwd();
    const trackerDir = currentDir.endsWith("tracker") ? currentDir : join(currentDir, "tracker");
    const publicDir = currentDir.endsWith("tracker") ? join(currentDir, "..", "public") : join(currentDir, "public");

    await build({
      entryPoints: [join(trackerDir, "index.ts")],
      bundle: true,
      minify: true,
      format: "iife",
      globalName: "Reev",
      outfile: join(publicDir, "tracker.js"),
      target: "es2015",
      external: [],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    });

    console.log("Tracker built successfully to public/tracker.js");
  } catch (error) {
    console.error("Failed to build tracker:", error);
    process.exit(1);
  }
}

buildTracker();

