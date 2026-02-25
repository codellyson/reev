import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuration – Reev Docs",
  description:
    "All configuration options for the Reev tracker: detection toggles, popover theme, suggestion widget, and more.",
};

function OptionRow({
  name,
  type,
  def,
  desc,
}: {
  name: string;
  type: string;
  def: string;
  desc: string;
}) {
  return (
    <tr className="border-b border-zinc-800/50">
      <td className="py-2.5 pr-4 align-top">
        <code className="text-orange-400 text-xs">{name}</code>
      </td>
      <td className="py-2.5 pr-4 align-top text-xs text-zinc-500">{type}</td>
      <td className="py-2.5 pr-4 align-top text-xs text-zinc-500 font-mono">{def}</td>
      <td className="py-2.5 align-top text-xs text-zinc-400">{desc}</td>
    </tr>
  );
}

export default function ConfigurationPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">Configuration</h1>
      <p className="text-zinc-400 mb-8">
        All options are passed via <code className="text-orange-400 text-xs bg-zinc-900 px-1.5 py-0.5">window.ReevConfig</code>. Everything has sensible defaults.
      </p>

      {/* Full config example */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-3">Full example</h2>
        <pre className="bg-zinc-900 border border-zinc-800 p-4 text-xs font-mono text-zinc-300 overflow-x-auto">
{`window.ReevConfig = {
  // Required
  projectId: "your-project-id",
  apiUrl: "https://your-domain.com",

  // Detection toggles
  rageClick: true,
  deadLink: true,
  brokenImage: true,
  formFrustration: true,

  // Popover
  popover: true,
  popoverTheme: "dark",      // "dark" | "light"
  maxPopovers: 3,            // per session
  popoverCooldown: 30000,    // ms between popovers

  // Suggestion widget
  suggestions: true,

  // Debug
  debug: false,
};`}
        </pre>
      </section>

      {/* Options table */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">Options reference</h2>

        <h3 className="text-sm font-medium text-zinc-300 mb-3">Required</h3>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="pb-2 text-xs font-semibold text-zinc-400">Option</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Type</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Default</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <OptionRow name="projectId" type="string" def="—" desc="Your project ID from the dashboard." />
              <OptionRow name="apiUrl" type="string" def="—" desc="Base URL of your Reev instance." />
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium text-zinc-300 mb-3">Detection</h3>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="pb-2 text-xs font-semibold text-zinc-400">Option</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Type</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Default</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <OptionRow name="rageClick" type="boolean" def="true" desc="Detect rage clicks on buttons and links." />
              <OptionRow name="deadLink" type="boolean" def="true" desc="Scan for links that return 404." />
              <OptionRow name="brokenImage" type="boolean" def="true" desc="Detect images that fail to load." />
              <OptionRow name="formFrustration" type="boolean" def="true" desc="Detect type-delete-retype patterns in form fields." />
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium text-zinc-300 mb-3">Popover</h3>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="pb-2 text-xs font-semibold text-zinc-400">Option</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Type</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Default</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <OptionRow name="popover" type="boolean" def="true" desc="Show contextual popovers when frustration is detected." />
              <OptionRow name="popoverTheme" type="string" def='"dark"' desc='"dark" or "light" theme for the popover UI.' />
              <OptionRow name="maxPopovers" type="number" def="3" desc="Maximum popovers shown per session." />
              <OptionRow name="popoverCooldown" type="number" def="30000" desc="Milliseconds between popovers." />
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium text-zinc-300 mb-3">Suggestions</h3>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="pb-2 text-xs font-semibold text-zinc-400">Option</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Type</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Default</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <OptionRow name="suggestions" type="boolean" def="false" desc="Enable the navigation suggestion widget." />
              <OptionRow name="demoSuggestions" type="array" def="[]" desc="Fallback suggestions when the API is unreachable." />
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-medium text-zinc-300 mb-3">Other</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="pb-2 text-xs font-semibold text-zinc-400">Option</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Type</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Default</th>
                <th className="pb-2 text-xs font-semibold text-zinc-400">Description</th>
              </tr>
            </thead>
            <tbody>
              <OptionRow name="debug" type="boolean" def="false" desc="Log tracker events to the browser console." />
            </tbody>
          </table>
        </div>
      </section>

      {/* Dashboard config */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Dashboard settings</h2>
        <p className="text-sm text-zinc-400 mb-3">
          Some settings are controlled from the dashboard UI rather than the script config:
        </p>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            <strong className="text-zinc-300">Flow suggestions</strong> — enable/disable, display mode (frustration / always), widget position, theme
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            <strong className="text-zinc-300">Project URL</strong> — used for sitemap import and link validation
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-400 mt-0.5">•</span>
            <strong className="text-zinc-300">Auto-discover</strong> — automatically generate flow suggestions from user navigation patterns
          </li>
        </ul>
      </section>
    </>
  );
}
