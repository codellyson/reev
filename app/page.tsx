"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, BarChart } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 bg-grid">
      <div className="max-w-5xl mx-auto px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-semibold text-white mb-4">
            Reev
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Lightweight UX insights. See exactly what users do on your website.
          </p>
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link href="/setup">
              <Button variant="primary" size="lg">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 mt-20">
            <div className="bg-zinc-950 p-8 text-center group">
              <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Track Events
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Lightweight JavaScript tracks user interactions automatically
              </p>
            </div>

            <div className="bg-zinc-950 p-8 text-center group">
              <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BarChart className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                View Analytics
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                See page performance, scroll depth, and user behavior patterns
              </p>
            </div>

            <div className="bg-zinc-950 p-8 text-center group">
              <div className="w-12 h-12 bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ArrowRight className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Fix Issues
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Identify pain points and improve your website experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
