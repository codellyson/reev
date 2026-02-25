import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started – Reev Docs",
  description:
    "Install Reev in under a minute with a single script tag. Works with any framework or plain HTML.",
};

export default function GettingStartedPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">Getting Started</h1>
      <p className="text-zinc-400 mb-8">
        Add Reev to any website with one script tag. No npm install, no build step.
      </p>

      {/* Step 1 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">1. Create a project</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Sign up and create a project from the dashboard. You&apos;ll get a <code className="text-orange-400 text-xs bg-zinc-900 px-1.5 py-0.5">projectId</code>.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">2. Add the script tag</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Paste this before <code className="text-orange-400 text-xs bg-zinc-900 px-1.5 py-0.5">&lt;/body&gt;</code> on every page:
        </p>
        <pre className="bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono text-zinc-300 overflow-x-auto mb-3">
{`<script>
!function(c,s){
  window.ReevConfig=c;
  s=document.createElement("script");
  s.src="https://your-domain.com/reev.js";
  document.head.appendChild(s)
}({
  projectId: "your-project-id",
  apiUrl: "https://your-domain.com"
});
</script>`}
        </pre>
        <p className="text-xs text-zinc-500">
          Replace <code className="text-zinc-400">your-domain.com</code> with where you host Reev and <code className="text-zinc-400">your-project-id</code> with your actual project ID.
        </p>
      </section>

      {/* Step 3 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">3. That&apos;s it</h2>
        <p className="text-sm text-zinc-400 mb-4">
          Reev starts detecting frustration immediately. No further configuration required. It will:
        </p>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            Detect rage clicks on buttons and links
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            Scan for broken links and dead images
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            Watch for form frustration patterns
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            Show a contextual popover asking users what went wrong
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            Send reports to your dashboard with full context
          </li>
        </ul>
      </section>

      {/* Framework snippets */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">Framework examples</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-2">Next.js (App Router)</h3>
            <pre className="bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono text-zinc-300 overflow-x-auto">
{`// app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          id="reev"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: \`!function(c,s){window.ReevConfig=c;
              s=document.createElement("script");
              s.src="/reev.js";
              document.head.appendChild(s)
            }({projectId:"YOUR_ID",apiUrl:location.origin})\`
          }}
        />
      </body>
    </html>
  );
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-2">Plain HTML</h3>
            <pre className="bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono text-zinc-300 overflow-x-auto">
{`<!-- Before </body> -->
<script>
!function(c,s){
  window.ReevConfig=c;
  s=document.createElement("script");
  s.src="https://your-domain.com/reev.js";
  document.head.appendChild(s)
}({
  projectId: "YOUR_ID",
  apiUrl: "https://your-domain.com"
});
</script>`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-2">React (Vite / CRA)</h3>
            <pre className="bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono text-zinc-300 overflow-x-auto">
{`// Add to index.html before </body>
<script>
!function(c,s){
  window.ReevConfig=c;
  s=document.createElement("script");
  s.src="https://your-domain.com/reev.js";
  document.head.appendChild(s)
}({
  projectId: "YOUR_ID",
  apiUrl: "https://your-domain.com"
});
</script>`}
            </pre>
          </div>
        </div>
      </section>

      {/* Self hosting */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Self-hosting</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Reev is fully self-hosted. Your data stays on your server. You need:
        </p>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            Node.js 18+
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            PostgreSQL database
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            Environment variables (see <code className="text-zinc-300 text-xs bg-zinc-900 px-1.5 py-0.5">.env.example</code>)
          </li>
        </ul>
        <pre className="bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono text-zinc-300 overflow-x-auto mt-4">
{`git clone https://github.com/your-org/reev.git
cd reev
pnpm install
cp .env.example .env   # fill in your DB credentials
pnpm db:migrate
pnpm build
pnpm start`}
        </pre>
      </section>
    </>
  );
}
