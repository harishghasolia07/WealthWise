'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowRight, BarChart3, Wallet, PiggyBank, TrendingUp, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-3 sm:h-16 sm:py-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight">WealthWise</span>
            </div>
            <div className="flex items-center flex-wrap justify-end gap-2 sm:gap-4">
              <ThemeToggle />
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium h-8 sm:h-9 px-3 sm:px-4 border border-border hover:bg-secondary/50 transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium h-8 sm:h-9 px-3 sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Launch App
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium h-8 sm:h-9 px-3 sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Launch App
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-sm mb-6">
              <span className="text-muted-foreground">Simple. Smart. Secure.</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Take control of your
              <span className="block text-primary">financial future</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track expenses, manage budgets, and gain insights into your spending habits — all in one beautiful dashboard.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
                >
                  Sign In to Start
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </SignedIn>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 border border-border hover:bg-secondary/50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                Powerful features to help you manage your money smarter.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Visual Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Beautiful charts and graphs that make understanding your finances effortless.
                </p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Transaction Tracking</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Log and categorize every transaction with powerful filtering and search.
                </p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <PiggyBank className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Budget Management</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set monthly budgets per category and track your progress in real-time.
                </p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Insights</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI-powered insights that highlight spending patterns and opportunities.
                </p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Admin and viewer roles to control who can modify your financial data.
                </p>
              </div>
              <div className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Export & Reports</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Export your data as CSV or JSON for further analysis and record keeping.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-secondary/50 to-secondary/30 p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Ready to take charge?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Start tracking your finances today and see where your money goes.
              </p>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-md text-base font-medium h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                <Wallet className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium">WealthWise</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for smarter personal finance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
