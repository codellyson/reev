"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, BarChart } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-semibold text-black mb-4">
            Reev
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Record and replay user sessions. See exactly what users do on your website.
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center group">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-base">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Record Sessions
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lightweight JavaScript tracks user interactions automatically
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-base">
                <BarChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Watch Replays
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                See pixel-perfect replays of user sessions with timeline controls
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-base">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Fix Issues
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Identify pain points and improve your website experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

