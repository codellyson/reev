import { build } from "esbuild";
import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const TYPE_DEFS = `
interface ReevConfig {
  projectId: string;
  apiUrl?: string;
  rageClick?: boolean;
  deadLink?: boolean;
  brokenImage?: boolean;
  formFrustration?: boolean;
  popover?: boolean;
  popoverTheme?: 'dark' | 'light';
  maxPopupsPerSession?: number;
  popoverCooldown?: number;
  debug?: boolean;
}

declare global {
  interface Window {
    Reev: typeof import("./index");
  }
}

export {};
`;

async function buildReev() {
  try {
    const currentDir = process.cwd();
    const srcDir = currentDir.endsWith("reevjs") ? currentDir : join(currentDir, "reevjs");
    const distDir = join(srcDir, "dist");
    const publicDir = currentDir.endsWith("reevjs") ? join(currentDir, "..", "public") : join(currentDir, "public");

    // Ensure dist/ exists
    mkdirSync(distDir, { recursive: true });

    // Build the IIFE bundle
    await build({
      entryPoints: [join(srcDir, "index.ts")],
      bundle: true,
      minify: true,
      format: "iife",
      globalName: "Reev",
      outfile: join(distDir, "reev.js"),
      target: "es2015",
      external: [],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
    });

    // Write type declarations
    writeFileSync(join(distDir, "index.d.ts"), TYPE_DEFS.trim() + "\n");

    // Copy to Next.js public folder for the dashboard to serve
    copyFileSync(join(distDir, "reev.js"), join(publicDir, "reev.js"));

    console.log("reev.js built successfully → dist/reev.js + public/reev.js");
  } catch (error) {
    console.error("Failed to build reev.js:", error);
    process.exit(1);
  }
}

buildReev();
