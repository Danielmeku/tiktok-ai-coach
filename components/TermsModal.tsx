'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TermsModalProps {
  onAccept: () => void;
}

export default function TermsModal({ onAccept }: TermsModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!agreed) return;
    setLoading(true);
    await onAccept();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome to TikTok Coach AI 👋
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 text-left leading-relaxed">
          Before getting started, please review and accept our terms regarding data usage, AI-generated suggestions, and analytics processing.
        </p>

        <div className="text-xs text-left bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border dark:border-gray-700 space-y-1">
          <p className="text-gray-500 dark:text-gray-400">By continuing, you agree to our:</p>
          <div className="flex gap-3 font-semibold text-blue-600 dark:text-blue-400">
            <Link href="/terms" target="_blank" className="underline hover:opacity-80">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" target="_blank" className="underline hover:opacity-80">
              Privacy Policy
            </Link>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer text-left pt-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>I have read and accept the Terms & Privacy Policy.</span>
        </label>

        <button
          onClick={handleConfirm}
          disabled={!agreed || loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Accept & Continue'}
        </button>
      </div>
    </div>
  );
}
