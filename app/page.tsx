import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Background Gradient Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Navigation Bar */}
      <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black">
            ⚡
          </div>
          TikTok Coach AI
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-200"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-20 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          AI Growth Engine for Short-Form Creators
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Stop Guessing. <br />
          Start Going Viral <br className="hidden sm:inline" />
          <span className="text-blue-500">on TikTok.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-base sm:text-xl text-gray-400 font-normal leading-relaxed">
          Get personalized viral hooks, audience retention breakdowns, and plain-language analytics tailored specifically to your niche—driven by AI.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Get Started Free &rarr;
          </Link>
        </div>

        {/* Key Platform Stats / Social Proof */}
        <div className="pt-6 flex flex-wrap justify-center items-center gap-8 text-xs font-medium text-gray-400 border-t border-white/10 max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-sm">Instant</span> Setup
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-sm">No Credit Card</span> Required
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-sm">Powered by</span> Gemini AI
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 text-left">
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md hover:border-blue-500/50 hover:bg-white/[0.06] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4 border border-blue-500/30">
              01
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Niche-Aware Hooks
            </h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Receive proven opening scripts and scroll-stopping visual prompts tuned specifically to your core audience.
            </p>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md hover:border-blue-500/50 hover:bg-white/[0.06] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4 border border-blue-500/30">
              02
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Plain-English Audits
            </h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Skip dense charts. Clear, actionable metrics breakdown explaining exactly what content to record next and why.
            </p>
          </div>

          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md hover:border-blue-500/50 hover:bg-white/[0.06] transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold mb-4 border border-blue-500/30">
              03
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              Conversational AI Coach
            </h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Chat directly with your interactive AI mentor 24/7 to refine video concepts, captions, and viral strategy.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-xs text-gray-500 space-y-2">
        <p>&copy; {new Date().getFullYear()} TikTok Coach AI. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-gray-400">
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
