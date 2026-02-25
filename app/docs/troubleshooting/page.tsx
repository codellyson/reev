import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Troubleshooting – Reev Docs",
  description:
    "Common issues when using the Reev tracker and how to fix them.",
};

function Issue({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-zinc-800 mb-4">
      <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-white">{title}</h3>
      </div>
      <div className="px-4 py-3 text-sm text-zinc-400 space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function TroubleshootingPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">Troubleshooting</h1>
      <p className="text-zinc-400 mb-8">
        Common issues and how to resolve them.
      </p>

      {/* Tracker issues */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Tracker</h2>

        <Issue title="Script not loading">
          <p>Check that the script URL points to your Reev instance and is accessible:</p>
          <pre className="bg-zinc-900 border border-zinc-800 p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
            curl -I https://your-domain.com/reev.js
          </pre>
          <p>You should get a <code className="text-orange-400 text-xs">200</code> response. If not, make sure you&apos;ve run <code className="text-orange-400 text-xs">pnpm build</code> and the <code className="text-orange-400 text-xs">public/reev.js</code> file exists.</p>
        </Issue>

        <Issue title="No events appearing in dashboard">
          <p>Enable debug mode to see what the tracker is sending:</p>
          <pre className="bg-zinc-900 border border-zinc-800 p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
{`window.ReevConfig = {
  projectId: "your-id",
  apiUrl: "https://your-domain.com",
  debug: true
};`}
          </pre>
          <p>Open the browser console and look for <code className="text-orange-400 text-xs">[Reev]</code> log entries. Common causes:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              Wrong <code className="text-zinc-300 text-xs">projectId</code> — check it matches the dashboard
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              Wrong <code className="text-zinc-300 text-xs">apiUrl</code> — must be the full origin (including protocol)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              CORS error — the events endpoint should allow all origins by default
            </li>
          </ul>
        </Issue>

        <Issue title="Popover not showing">
          <p>Popovers appear when frustration is detected (rage click, dead link, etc.). Make sure:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              <code className="text-zinc-300 text-xs">popover: true</code> in your config (default)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              You haven&apos;t exceeded <code className="text-zinc-300 text-xs">maxPopovers</code> for the session (default 3)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              The <code className="text-zinc-300 text-xs">popoverCooldown</code> period has passed (default 30s)
            </li>
          </ul>
        </Issue>

        <Issue title="Suggestion widget not appearing">
          <p>The suggestion widget requires:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              <code className="text-zinc-300 text-xs">suggestions: true</code> in your config
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              Flow suggestions enabled in the dashboard (Flows page → toggle on)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              At least one active suggestion configured for the project
            </li>
          </ul>
          <p>If you have <code className="text-orange-400 text-xs">demoSuggestions</code> configured, the widget will use those as fallback when the API is unreachable.</p>
        </Issue>
      </section>

      {/* Dashboard issues */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Dashboard</h2>

        <Issue title="Reports page is empty">
          <p>Reports come from popover responses. If users haven&apos;t interacted with any popovers yet, the reports page will be empty. Check the events page to confirm the tracker is sending data.</p>
        </Issue>

        <Issue title="Patterns not being detected">
          <p>Patterns are auto-generated when the same issue type occurs at least 2 times on the same page URL. Make sure:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              There are <code className="text-zinc-300 text-xs">ux_feedback</code> events being sent (check the events endpoint)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              Multiple feedback entries exist for the same page and issue type
            </li>
          </ul>
        </Issue>

        <Issue title="Sitemap import returns no pages">
          <p>The sitemap import requires:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              A <code className="text-zinc-300 text-xs">website_url</code> configured in your project settings
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              A valid <code className="text-zinc-300 text-xs">sitemap.xml</code> at your site root (or referenced in <code className="text-zinc-300 text-xs">robots.txt</code>)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">-</span>
              The sitemap must be publicly accessible from your Reev server
            </li>
          </ul>
        </Issue>
      </section>

      {/* Self-hosting */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Self-hosting</h2>

        <Issue title="Database connection error">
          <p>Verify your <code className="text-orange-400 text-xs">.env</code> has the correct database URL:</p>
          <pre className="bg-zinc-900 border border-zinc-800 p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
            DATABASE_URL=postgresql://user:password@host:5432/reev
          </pre>
          <p>Make sure PostgreSQL is running and the database exists. Run migrations with <code className="text-orange-400 text-xs">pnpm db:migrate</code>.</p>
        </Issue>

        <Issue title="Build fails with missing tables">
          <p>Run the database migrations before building:</p>
          <pre className="bg-zinc-900 border border-zinc-800 p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
            pnpm db:migrate
          </pre>
        </Issue>

        <Issue title="Rate limiting issues">
          <p>The events endpoint is rate-limited to 60 requests/minute per IP. The suggest endpoint is limited to 30 requests/minute per IP. If you&apos;re hitting limits in development, the rate limiter resets automatically after the time window.</p>
        </Issue>
      </section>

      {/* Getting help */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Still stuck?</h2>
        <p className="text-sm text-zinc-400">
          Open an issue on the GitHub repository with details about your setup, the error you&apos;re seeing, and any relevant console output.
        </p>
      </section>
    </>
  );
}
