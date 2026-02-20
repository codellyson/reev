export interface FrameworkStep {
  text: string;
}

export interface FrameworkSnippet {
  id: string;
  label: string;
  filename: string;
  getCode: (projectId: string, trackerUrl: string, apiUrl: string) => string;
  steps: FrameworkStep[];
  note: string;
}

export const frameworkSnippets: FrameworkSnippet[] = [
  {
    id: "html",
    label: "HTML",
    filename: "index.html",
    getCode: (projectId, trackerUrl, apiUrl) =>
      [
        "<!-- Add before </body> -->",
        "<script>",
        "!function(c, s) {",
        "  window.ReevConfig = c;",
        '  s = document.createElement("script");',
        `  s.src = "${trackerUrl}";`,
        "  document.head.appendChild(s);",
        "}({",
        `  projectId: "${projectId}",`,
        `  apiUrl: "${apiUrl}"`,
        "});",
        "</script>",
      ].join("\n"),
    steps: [
      { text: "Copy the tracking code above" },
      { text: "Paste it before the </body> tag in your HTML" },
      { text: "Deploy your website" },
      { text: "Check your dashboard — events appear within 30 seconds" },
    ],
    note: "Works with any static site, WordPress, or server-rendered HTML.",
  },
  {
    id: "nextjs",
    label: "Next.js",
    filename: "app/layout.tsx",
    getCode: (projectId, trackerUrl, apiUrl) =>
      [
        'import Script from "next/script";',
        "",
        "// Add inside your <body> in the root layout",
        "<Script",
        '  id="reev-tracker"',
        '  strategy="afterInteractive"',
        "  dangerouslySetInnerHTML={{",
        "    __html: `!function(c,s){",
        "      window.ReevConfig=c;",
        '      s=document.createElement("script");',
        `      s.src="${trackerUrl}";`,
        "      document.head.appendChild(s)",
        `    }({projectId:"${projectId}",apiUrl:"${apiUrl}"})\`,`,
        "  }}",
        "/>",
      ].join("\n"),
    steps: [
      { text: "Open your root layout (app/layout.tsx)" },
      { text: 'Import Script from "next/script"' },
      { text: "Add the <Script> component before the closing </body>" },
      { text: "Deploy and check your dashboard" },
    ],
    note: "Do NOT use a raw <script> tag in JSX — React will not execute it. Use the Next.js Script component instead.",
  },
  {
    id: "react",
    label: "React",
    filename: "src/App.tsx",
    getCode: (projectId, trackerUrl, apiUrl) =>
      [
        'import { useEffect } from "react";',
        "",
        "function ReevTracker() {",
        "  useEffect(() => {",
        "    (window as any).ReevConfig = {",
        `      projectId: "${projectId}",`,
        `      apiUrl: "${apiUrl}",`,
        "    };",
        '    const s = document.createElement("script");',
        `    s.src = "${trackerUrl}";`,
        "    document.head.appendChild(s);",
        "  }, []);",
        "",
        "  return null;",
        "}",
        "",
        "// Add <ReevTracker /> to your App component",
      ].join("\n"),
    steps: [
      { text: "Create a ReevTracker component (or add the useEffect to your root component)" },
      { text: "Render <ReevTracker /> inside your App" },
      { text: "The script loads once on mount" },
      { text: "Deploy and check your dashboard" },
    ],
    note: 'Alternatively, paste the HTML <script> tag directly into public/index.html before </body>.',
  },
  {
    id: "vue",
    label: "Vue",
    filename: "App.vue",
    getCode: (projectId, trackerUrl, apiUrl) =>
      [
        "<script setup>",
        '  import { onMounted } from "vue";',
        "",
        "  onMounted(() => {",
        "    window.ReevConfig = {",
        `      projectId: "${projectId}",`,
        `      apiUrl: "${apiUrl}",`,
        "    };",
        '    const s = document.createElement("script");',
        `    s.src = "${trackerUrl}";`,
        "    document.head.appendChild(s);",
        "  });",
        "</script>",
      ].join("\n"),
    steps: [
      { text: "Add the onMounted hook to your root component (App.vue)" },
      { text: "The tracker loads once when the app mounts" },
      { text: "Deploy and check your dashboard" },
    ],
    note: "Alternatively, paste the HTML <script> tag into index.html before </body>.",
  },
  {
    id: "svelte",
    label: "Svelte",
    filename: "+layout.svelte",
    getCode: (projectId, trackerUrl, apiUrl) =>
      [
        "<script>",
        '  import { onMount } from "svelte";',
        "",
        "  onMount(() => {",
        "    window.ReevConfig = {",
        `      projectId: "${projectId}",`,
        `      apiUrl: "${apiUrl}",`,
        "    };",
        '    const s = document.createElement("script");',
        `    s.src = "${trackerUrl}";`,
        "    document.head.appendChild(s);",
        "  });",
        "</script>",
      ].join("\n"),
    steps: [
      { text: "Add onMount to your root layout (+layout.svelte)" },
      { text: "The tracker loads once when the layout mounts" },
      { text: "Deploy and check your dashboard" },
    ],
    note: "For SvelteKit, use src/routes/+layout.svelte. For plain Svelte, use App.svelte.",
  },
];
