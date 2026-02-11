"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { FormField, Input } from "@/app/components/ui/form-field";
import { Logo } from "@/app/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 bg-grid">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-block mb-8 text-white">
              <Logo />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">
              Sign in to your account
            </h1>
            <p className="text-sm text-zinc-400">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <FormField label="Email address" error={error}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </FormField>
                <FormField label="Password">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </FormField>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                <p className="text-center text-sm text-zinc-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
