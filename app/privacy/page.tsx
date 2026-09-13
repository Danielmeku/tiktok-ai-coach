// app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6 text-gray-800 dark:text-gray-200">
      <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last updated: September 2026</p>

      <div className="space-y-4 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Information We Collect</h2>
        <p>
          TikTok Coach AI collects public profile metrics (such as public video view counts, likes, comments, and captions) when you enter a TikTok username.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. How Information Is Used</h2>
        <p>
          Data is fetched via rapid endpoints solely to construct performance charts and feed context to our AI coaching model to generate tailored growth suggestions.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Third-Party Services</h2>
        <p>
          We utilize third-party services including Supabase for authentication and LLM APIs for generating coaching insights. We do not sell or share personal data to third-party advertisers.
        </p>
      </div>
    </div>
  );
}
