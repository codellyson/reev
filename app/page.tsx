"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  MousePointerClick,
  Unlink,
  ImageOff,
  TextCursorInput,
  Code,
  Eye,
  MessageSquare,
  Terminal,
  Clock,
  Monitor,
  Layers,
  Check,
  X,
  Fingerprint,
  Route,
  Sparkles,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Logo } from "@/app/components/logo";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 h-14 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      style={{
        backgroundColor: scrolled ? "rgba(9, 9, 11, 0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid #27272a" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background-color 0.2s, border-bottom 0.2s, backdrop-filter 0.2s",
      }}
    >
      <div className="flex items-center justify-between h-full px-6 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center text-white hover:opacity-80 transition-opacity">
          <Logo className="text-white" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/setup">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease, delay: 0 }}
        >
          <Badge variant="success" size="sm" className="mb-6">
            Open-source UX feedback tool
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          Stop guessing why users leave.
          <br />
          <span className="text-orange-400">Start hearing why.</span>
        </motion.h1>

        <motion.p
          className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
        >
          Reev detects user frustration in real-time &mdash; rage clicks, broken
          links, dead images, form struggles &mdash; and asks them what went
          wrong, right then and there. You get their actual words, not another
          heatmap.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4 mb-20"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
        >
          <Link href="/setup">
            <Button variant="primary" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <a href="#demo">
            <Button variant="secondary" size="lg">
              Try the Demo
              <ArrowDown className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </motion.div>

        {/* Mock popover visual */}
        <motion.div
          className="relative max-w-md mx-auto"
          initial="hidden"
          animate="visible"
          variants={scaleUp}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
        >
          {/* Simulated page element */}
          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <p className="text-sm text-zinc-500 mb-4">
              Your website&apos;s checkout page
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 bg-zinc-800 border border-zinc-700 flex-1" />
              <div className="relative">
                <button className="h-10 px-6 bg-orange-500 text-zinc-900 text-sm font-semibold cursor-default flex items-center">
                  Submit Order
                </button>
                {/* Rage click ripples */}
                <div className="absolute inset-0 border-2 border-amber-400 animate-pulse opacity-60" />
              </div>
            </div>
          </div>

          {/* Mock popover */}
          <div className="mt-2 bg-white border border-zinc-200 w-[310px] mx-auto text-left shadow-sm">
            <div className="h-[3px] bg-amber-500" />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl leading-none">&#128548;</span>
                <div>
                  <p className="text-[13px] font-semibold text-zinc-900">
                    Not working?
                  </p>
                  <p className="text-[12px] text-zinc-500 leading-snug mt-1">
                    We noticed you clicked multiple times. What were you
                    expecting to happen?
                  </p>
                </div>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-2 mb-3">
                <p className="text-[12px] text-zinc-500 italic">
                  The button doesn&apos;t respond after I enter my card...
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center py-[7px] border border-zinc-200 text-[12px] text-zinc-500">
                  Dismiss
                </div>
                <div className="flex-1 text-center py-[7px] bg-amber-500 text-[12px] text-zinc-900 font-medium">
                  Send
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-600 mt-4">
            A contextual popover appears the moment frustration is detected
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-20 px-6 border-t border-zinc-800/50">
      <AnimatedSection className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Analytics tell you what happened. Not why.
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            You know users bounce. You know they don&apos;t convert. But you
            don&apos;t know what frustrated them &mdash; because no one asks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800">
          {/* Left: What you see today */}
          <div className="bg-zinc-950 p-8">
            <div className="flex items-center gap-2 mb-6">
              <X className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-semibold text-zinc-300">
                What you see today
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                {
                  icon: Eye,
                  text: '"72% bounce rate on /checkout" — but why?',
                },
                {
                  icon: MousePointerClick,
                  text: "Heatmap shows clicks on a button — did it work?",
                },
                {
                  icon: Layers,
                  text: '"Average session: 1m 42s" — were they confused or done?',
                },
                {
                  icon: Route,
                  text: "Funnel shows 30% drop at step 3 — what happened there?",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-zinc-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-500">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: What Reev gives you */}
          <div className="bg-zinc-950 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Check className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">
                What Reev gives you
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                {
                  icon: MessageSquare,
                  text: '"The submit button doesn\'t respond after I enter my card" — exact words',
                },
                {
                  icon: Terminal,
                  text: "Console errors, DOM snapshot, and user breadcrumbs attached",
                },
                {
                  icon: Fingerprint,
                  text: "Device, browser, time on page — full context for every report",
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="how-it-works" className="py-20 px-6 border-t border-zinc-800/50">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            How it works
          </h2>
          <p className="text-zinc-400">
            Three steps. No build tools. No npm install. Just a script tag.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Add one script tag",
              description: (
                <>
                  Drop it before <code className="text-orange-400 text-xs font-mono">&lt;/body&gt;</code>. That&apos;s the entire integration.
                </>
              ),
              content: (
                <pre className="bg-zinc-950 border border-zinc-800 p-3 text-xs font-mono overflow-x-auto">
                  <code>
                    <span className="text-zinc-500">&lt;</span>
                    <span className="text-orange-400">script</span>
                    <span className="text-zinc-500">&gt;</span>
                    {"\n"}
                    <span className="text-zinc-300">{"!function(c,s){"}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-amber-400">window</span>
                    <span className="text-zinc-300">.ReevConfig=c;</span>
                    {"\n"}
                    {"  "}
                    <span className="text-zinc-300">{"s=document.createElement(\"script\");"}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-zinc-300">{"s.src=\"/reev.js\";"}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-zinc-300">{"document.head.appendChild(s)"}</span>
                    {"\n"}
                    <span className="text-zinc-300">{"}({"}</span>
                    <span className="text-amber-400">projectId</span>
                    <span className="text-zinc-500">:</span>
                    <span className="text-zinc-300">&quot;your-id&quot;</span>
                    <span className="text-zinc-300">{"});"}</span>
                    {"\n"}
                    <span className="text-zinc-500">&lt;/</span>
                    <span className="text-orange-400">script</span>
                    <span className="text-zinc-500">&gt;</span>
                  </code>
                </pre>
              ),
            },
            {
              step: "2",
              title: "Reev watches for frustration",
              description: "The tracker runs silently, detecting four types of user frustration in real-time:",
              content: (
                <ul className="space-y-2">
                  {[
                    { icon: MousePointerClick, label: "Rage clicks", color: "text-amber-400" },
                    { icon: Unlink, label: "Dead links", color: "text-red-400" },
                    { icon: ImageOff, label: "Broken images", color: "text-orange-400" },
                    { icon: TextCursorInput, label: "Form frustration", color: "text-blue-400" },
                  ].map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                      <span className="text-sm text-zinc-300">{item.label}</span>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              step: "3",
              title: "Users tell you what\u2019s wrong",
              description: "A non-intrusive popover anchored to the element asks what happened. Users respond because it\u2019s relevant to what they just experienced.",
              content: (
                <div className="bg-zinc-950 border border-zinc-800 p-3">
                  <p className="text-xs text-zinc-500 mb-1">User wrote:</p>
                  <p className="text-sm text-zinc-300 italic">
                    &quot;The coupon code field won&apos;t accept my discount code, it just clears every time.&quot;
                  </p>
                </div>
              ),
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="bg-zinc-900/50 border border-zinc-800 p-6"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.12 }}
            >
              <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-orange-400">{card.step}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                {card.description}
              </p>
              {card.content}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetectionTypes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const detections = [
    {
      icon: MousePointerClick,
      title: "Rage Clicks",
      borderColor: "border-amber-500/20",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400",
      badgeVariant: "warning" as const,
      description:
        "Catches when a user frantically clicks the same button or link because nothing is happening. A clear sign of a broken or unresponsive element.",
      howItWorks:
        "Watches buttons, links, and clickable elements. If the same one gets clicked 3+ times in rapid succession, Reev knows something is wrong.",
      example:
        'A user clicks your "Submit Order" button 5 times because the payment processor is hanging and nothing visible happens.',
    },
    {
      icon: Unlink,
      title: "Dead Links",
      borderColor: "border-red-500/20",
      bgColor: "bg-red-500/10",
      iconColor: "text-red-400",
      badgeVariant: "error" as const,
      description:
        "Automatically checks every link on your page as soon as it loads. Broken links get flagged before any user even clicks them.",
      howItWorks:
        "Quietly verifies all your internal links in the background. If one leads to a 404 or error page, a warning badge appears right on the link.",
      example:
        'Your navigation has a link to "/pricing" that broke after a deploy. Users see a warning badge on the link before they even click it.',
    },
    {
      icon: ImageOff,
      title: "Broken Images",
      borderColor: "border-orange-500/20",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-400",
      badgeVariant: "success" as const,
      description:
        "Detects images that fail to load — whether from missing files, server errors, or CDN outages. Users see an indicator and can report the issue.",
      howItWorks:
        "Scans all images on the page and monitors for load failures. Broken images get an indicator badge so they don't go unnoticed.",
      example:
        "A product photo on your catalog page fails because the image CDN is down. Users see an indicator badge on the broken image.",
    },
    {
      icon: TextCursorInput,
      title: "Form Frustration",
      borderColor: "border-blue-500/20",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      badgeVariant: "info" as const,
      description:
        "Spots when a user keeps typing into a field, deleting everything, and starting over. A clear pattern of confusion or unclear validation.",
      howItWorks:
        "Monitors form fields for the \"type, delete, retype\" cycle. When it happens repeatedly in a short time, Reev steps in to ask what's confusing.",
      example:
        'A user types their email, gets a vague validation error, clears the field, and retypes it differently — three times. The popover asks "What\'s confusing?"',
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-zinc-800/50">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Four frustration signals. Zero manual setup.
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Each detection runs automatically. No configuration needed.
            Everything works out of the box with sensible defaults.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800">
          {detections.map((d, i) => (
            <motion.div
              key={i}
              className="bg-zinc-950 p-8"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 ${d.bgColor} flex items-center justify-center`}
                >
                  <d.icon className={`h-5 w-5 ${d.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {d.title}
                  </h3>
                  <Badge variant={d.badgeVariant} size="sm">
                    Automatic
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                {d.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  How it works
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {d.howItWorks}
                </p>
              </div>

              <div className={`border-l-2 ${d.borderColor} pl-3`}>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                  Example
                </p>
                <p className="text-sm text-zinc-300 italic leading-relaxed">
                  {d.example}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnrichedReports() {
  return (
    <section className="py-20 px-6 border-t border-zinc-800/50">
      <AnimatedSection className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Every report comes with context
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Reev doesn&apos;t just collect a message. It captures everything you
            need to understand and reproduce the issue.
          </p>
        </div>

        {/* Mock report card */}
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800">
          {/* Report header */}
          <div className="p-5 border-b border-zinc-800">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="warning" size="sm">
                rage_click
              </Badge>
              <span className="text-xs text-zinc-500">
                <Monitor className="h-3 w-3 inline mr-1" />
                Desktop
              </span>
              <span className="text-xs text-zinc-500">Chrome</span>
              <span className="text-xs text-zinc-500">
                <Clock className="h-3 w-3 inline mr-1" />
                47s on page
              </span>
              <span className="text-xs text-zinc-600 ml-auto">
                2 minutes ago
              </span>
            </div>
            <div className="border-l-2 border-amber-500/30 pl-3">
              <p className="text-sm text-zinc-300 italic">
                &quot;The submit button doesn&apos;t respond after I enter my
                card details. I clicked it like 5 times.&quot;
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-5 border-b border-zinc-800">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
              <span>
                <span className="text-zinc-600">Page:</span>{" "}
                <span className="font-mono text-zinc-400">/checkout</span>
              </span>
              <span>
                <span className="text-zinc-600">Element:</span>{" "}
                <span className="font-mono text-zinc-400">
                  button.btn-submit
                </span>
              </span>
              <span>
                <span className="text-zinc-600">Clicks:</span>{" "}
                <span className="text-zinc-400">5 in 1.2s</span>
              </span>
            </div>
          </div>

          {/* Context panel */}
          <div className="p-5 space-y-4">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Attached Context
            </p>

            {/* Console errors */}
            <div className="flex items-start gap-3">
              <Terminal className="h-4 w-4 text-zinc-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-zinc-400 mb-1">Console errors</p>
                <pre className="bg-zinc-950 border border-zinc-800 p-2 text-xs font-mono text-red-400 overflow-x-auto">
                  POST /api/payments 500 (Internal Server Error){"\n"}
                  Uncaught TypeError: Cannot read properties of null
                </pre>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-start gap-3">
              <Route className="h-4 w-4 text-zinc-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-zinc-400 mb-1">
                  User breadcrumbs (last 5 actions)
                </p>
                <div className="space-y-1 text-xs font-mono text-zinc-500">
                  <p>
                    <span className="text-zinc-600">click</span> &rarr;
                    input#card-number
                  </p>
                  <p>
                    <span className="text-zinc-600">click</span> &rarr;
                    input#expiry
                  </p>
                  <p>
                    <span className="text-zinc-600">click</span> &rarr;
                    input#cvv
                  </p>
                  <p>
                    <span className="text-zinc-600">click</span> &rarr;
                    button.btn-submit{" "}
                    <span className="text-amber-400">(x5 rage)</span>
                  </p>
                  <p>
                    <span className="text-zinc-600">navigate</span> &rarr;
                    /checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features list below the card */}
        <div className="max-w-2xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: MessageSquare, label: "User's own words" },
            { icon: Code, label: "DOM snapshot" },
            { icon: Terminal, label: "Console errors" },
            { icon: Route, label: "Action breadcrumbs" },
            { icon: Monitor, label: "Device & browser" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
              <item.icon className="h-3.5 w-3.5 text-orange-400" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}

function Integration() {
  return (
    <section className="py-20 px-6 border-t border-zinc-800/50">
      <AnimatedSection className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            One line. That&apos;s it.
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            No npm install. No build step. No framework lock-in. Just add a
            script tag and Reev starts working immediately.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <pre className="bg-zinc-900 border border-zinc-800 p-5 text-sm font-mono overflow-x-auto">
            <code>
              <span className="text-zinc-500">&lt;</span>
              <span className="text-orange-400">script</span>
              <span className="text-zinc-500">&gt;</span>
              {"\n"}
              <span className="text-zinc-300">{"!function(c, s) {"}</span>
              {"\n"}
              {"  "}
              <span className="text-amber-400">window</span>
              <span className="text-zinc-300">.ReevConfig = c;</span>
              {"\n"}
              {"  "}
              <span className="text-zinc-300">{"s = document.createElement(\"script\");"}</span>
              {"\n"}
              {"  "}
              <span className="text-zinc-300">{"s.src = \"https://your-domain.com/reev.js\";"}</span>
              {"\n"}
              {"  "}
              <span className="text-zinc-300">{"document.head.appendChild(s);"}</span>
              {"\n"}
              <span className="text-zinc-300">{"}({"}</span>
              {"\n"}
              {"  "}
              <span className="text-amber-400">projectId</span>
              <span className="text-zinc-500">: </span>
              <span className="text-zinc-300">&quot;your-project-id&quot;</span>
              <span className="text-zinc-500">,</span>
              {"\n"}
              {"  "}
              <span className="text-amber-400">apiUrl</span>
              <span className="text-zinc-500">: </span>
              <span className="text-zinc-300">&quot;https://your-domain.com&quot;</span>
              {"\n"}
              <span className="text-zinc-300">{"});"}</span>
              {"\n"}
              <span className="text-zinc-500">&lt;/</span>
              <span className="text-orange-400">script</span>
              <span className="text-zinc-500">&gt;</span>
            </code>
          </pre>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Configuration options
              </h4>
              <ul className="space-y-2">
                {[
                  "Toggle each detection type on/off",
                  "Choose dark or light popover theme",
                  "Set max popovers per session",
                  "Configure cooldown between popovers",
                  "Enable debug logging",
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <Check className="h-3.5 w-3.5 text-orange-400" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">
                Works with everything
              </h4>
              <ul className="space-y-2">
                {[
                  "React, Vue, Svelte, Angular",
                  "Next.js, Nuxt, SvelteKit",
                  "Plain HTML — no framework needed",
                  "Any backend or static site",
                  "Self-hosted — your data stays yours",
                ].map((text, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-zinc-400"
                  >
                    <Check className="h-3.5 w-3.5 text-orange-400" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

function LiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="demo" className="py-20 px-6 border-t border-zinc-800/50">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
        >
          <Badge variant="warning" size="sm" className="mb-4">
            Live on this page
          </Badge>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Try it right now
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            The Reev tracker is running on this page. Interact with the elements
            below to trigger real detections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800">
          {[
            {
              icon: MousePointerClick,
              iconColor: "text-amber-400",
              title: "Rage Clicks",
              description: "Click this button rapidly 3+ times.",
              content: (
                <button
                  className="h-10 px-6 bg-orange-500 text-zinc-900 text-sm font-semibold cursor-pointer hover:bg-orange-400 transition-colors w-full"
                  style={{ cursor: "pointer" }}
                >
                  Submit Order
                </button>
              ),
            },
            {
              icon: Unlink,
              iconColor: "text-red-400",
              title: "Dead Links",
              description: "This link points to a 404 page \u2014 look for the badge.",
              content: (
                <a
                  href="/this-page-does-not-exist"
                  className="text-sm text-blue-400 underline underline-offset-2"
                >
                  Go to pricing page &rarr;
                </a>
              ),
            },
            {
              icon: ImageOff,
              iconColor: "text-orange-400",
              title: "Broken Images",
              description: "These images fail to load \u2014 look for the indicator badge.",
              content: (
                <div className="flex gap-3">
                  <img
                    src="/broken-product-photo.jpg"
                    alt="Product"
                    className="w-16 h-16 border border-dashed border-zinc-700 bg-zinc-900 object-cover"
                  />
                  <img
                    src="/broken-hero-banner.png"
                    alt="Banner"
                    className="w-16 h-16 border border-dashed border-zinc-700 bg-zinc-900 object-cover"
                  />
                </div>
              ),
            },
            {
              icon: TextCursorInput,
              iconColor: "text-blue-400",
              title: "Form Frustration",
              description: "Type something, select all + delete, repeat twice.",
              content: (
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full h-10 px-3 bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                />
              ),
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className="bg-zinc-950 p-8"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeUp}
              transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                <h3 className="text-sm font-semibold text-white">{card.title}</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                {card.description}
              </p>
              {card.content}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAFooter() {
  return (
    <section className="py-24 px-6 border-t border-zinc-800/50">
      <AnimatedSection className="max-w-3xl mx-auto text-center">
        <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Your users are frustrated right now.
          <br />
          Find out why.
        </h2>
        <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
          Add Reev to your site in under a minute. Get your first feedback
          report the same day.
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Link href="/setup">
            <Button variant="primary" size="lg">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/reports">
            <Button variant="secondary" size="lg">
              View Demo Reports
            </Button>
          </Link>
        </div>
        <p className="text-xs text-zinc-600">
          Free to use. No credit card required.
        </p>
      </AnimatedSection>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 bg-grid">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <DetectionTypes />
      <LiveDemo />
      <EnrichedReports />
      <Integration />
      <CTAFooter />

      {/* Load the actual tracker on this page */}
      <Script
        id="reev-loader"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `!function(c,s){window.ReevConfig=c;s=document.createElement("script");s.src="/reev.js";document.head.appendChild(s)}({projectId:"landing-page-demo",apiUrl:window.location.origin,popover:true,popoverTheme:"light"});`,
        }}
      />
    </div>
  );
}
