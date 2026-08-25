import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-3xl space-y-6">
        {/* Badge */}
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          AI Growth Coach for Micro Creators
        </span>

        {/* Main Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Stop Guessing. Start Going Viral on TikTok.
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
          Get personalized content ideas, retention hook patterns, and plain-language analytics tailored specifically to your niche—powered by AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Sign In / Get Started
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-gray-900">Niche-Aware Hooks</h3>
            <p className="mt-1 text-sm text-gray-500">
              Receive proven opening hooks and scripts tailored to your specific viewer base.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-gray-900">Plain-English Audits</h3>
            <p className="mt-1 text-sm text-gray-500">
              No complex dashboards. Get clear instructions on what to post next and why.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-gray-900">Conversational Coach</h3>
            <p className="mt-1 text-sm text-gray-500">
              Chat directly with your AI coach to refine video concepts and captions anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
