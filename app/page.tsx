"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const FEATURES = [
  {
    emoji: "👤",
    title: "Employee Profiles",
    description:
      "Keep everything about your employees in one place, including personal details, emergency contacts, and important documents.",
  },
  {
    emoji: "🏢",
    title: "Team Structure",
    description:
      "Structure your company into departments and teams so everyone knows exactly who they report to.",
  },
  {
    emoji: "✍️",
    title: "Leave Management",
    description:
      "Time-off requests take seconds, and balances update automatically with no spreadsheets or endless emails.",
  },
  {
    emoji: "✅",
    title: "Approval Workflows",
    description:
      "Leave requests reach the right people automatically. No chasing emails, no missed approvals.",
  },
  {
    emoji: "🔔",
    title: "Instant Notifications",
    description:
      "Everyone stays in the loop. Get notified the moment something needs your attention.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#e8e8e5]">
      <header className="absolute top-0 right-0 left-0 z-20 flex items-center justify-between px-8 py-6">
        <Link href="/">
          <span className="text-xl font-bold text-white drop-shadow-md">
            Apex<span className="text-emerald-400">HR</span>
          </span>
        </Link>
        <Link href="/register-tenant">
          <Button
            size="sm"
            className="border-none bg-white font-semibold text-emerald-700 shadow-md hover:bg-emerald-50"
          >
            Register a Company
          </Button>
        </Link>
      </header>

      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-position-[center_top] px-6 text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1800&auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 z-0 bg-black/50" />

        <div className="relative z-10 flex max-w-3xl flex-col items-center">
          <span className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs tracking-widest text-white uppercase backdrop-blur-sm">
            HR made simple
          </span>

          <h1
            className="mb-5 leading-tight font-black text-white drop-shadow-lg"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
          >
            Your people are your{" "}
            <span className="text-emerald-400">greatest asset.</span>
          </h1>

          <p className="mb-9 max-w-xl text-lg leading-relaxed text-white/80">
            Take care of your team with Apex HR by managing profiles, tracking
            leave, and keeping everyone in sync effortlessly.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-12 border-none bg-emerald-500 px-9 text-base font-bold text-white shadow-lg hover:bg-emerald-600"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-white/10 px-9 text-base text-white backdrop-blur-sm hover:border-white hover:bg-white/20"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex flex-col items-center bg-[#e8e8e5] px-6 py-24 text-center">
        <h2 className="mb-2 text-2xl font-extrabold text-gray-800">
          Built for teams that move fast
        </h2>
        <p className="mb-12 max-w-sm text-sm text-gray-600">
          Simple, powerful tools that work the way your team does.
        </p>

        <div
          className="grid w-full max-w-4xl gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-300 bg-[#f0f0ed] p-6 text-left shadow-sm transition-all duration-300 hover:border-emerald-400 hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{f.emoji}</div>
              <h3 className="mb-2 text-sm font-bold text-gray-800">
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-300 bg-[#e8e8e5] py-6 text-center text-xs text-gray-500">
        ApexHR
      </footer>
    </div>
  );
}
