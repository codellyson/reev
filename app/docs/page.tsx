import type { Metadata } from "next";
import Link from "next/link";
import { Rocket, Settings, Code, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation – Reev",
  description:
    "Reev documentation. Learn how to install, configure, and use the open-source UX feedback tracker.",
  openGraph: {
    title: "Documentation – Reev",
    description:
      "Learn how to install, configure, and use Reev — the open-source UX feedback tracker.",
  },
};

const SECTIONS = [
  {
    href: "/docs/getting-started",
    icon: Rocket,
    title: "Getting Started",
    description: "Install Reev with one script tag. Takes under a minute.",
  },
  {
    href: "/docs/configuration",
    icon: Settings,
    title: "Configuration",
    description: "All options for detection, popovers, themes, and suggestions.",
  },
  {
    href: "/docs/api-reference",
    icon: Code,
    title: "API Reference",
    description: "REST endpoints for events, reports, flows, and analytics.",
  },
  {
    href: "/docs/troubleshooting",
    icon: AlertCircle,
    title: "Troubleshooting",
    description: "Common issues and how to fix them.",
  },
];

export default function DocsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-white mb-2">Documentation</h1>
      <p className="text-zinc-400 mb-10">
        Everything you need to add Reev to your site and start collecting UX feedback.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group block p-5 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <s.icon className="h-5 w-5 text-orange-400 mb-3" />
            <h2 className="text-sm font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
              {s.title}
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {s.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-5 bg-zinc-900/30 border border-zinc-800">
        <h3 className="text-sm font-semibold text-white mb-2">Quick install</h3>
        <pre className="text-xs font-mono text-zinc-400 overflow-x-auto">
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
      </div>
    </>
  );
}
