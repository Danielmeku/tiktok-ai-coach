"use client";

import { useState } from "react";
import AnalyticsView from "@/components/AnalyticsView";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"videos" | "analytics">("analytics");
  const [videos, setVideos] = useState<any[]>([]);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTikTokData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tiktok/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to fetch metrics");
      }

      // Populate state so AnalyticsView receives the data
      setVideos(data.metrics || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Fetch Form */}
      <form onSubmit={fetchTikTokData} className="flex gap-3 max-w-md">
        <input
          type="text"
          placeholder="Enter TikTok Handle (e.g. @username)"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Fetch Stats"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Tab Navigation Buttons */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-4">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "analytics"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Analytics Charts
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "videos"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          All Videos ({videos.length})
        </button>
      </div>

      {/* Dynamic Tab Content */}
      {activeTab === "analytics" ? (
        <AnalyticsView videos={videos} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid) => (
            <div key={vid.id} className="p-4 border dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
              <p className="font-medium text-sm line-clamp-2">{vid.title}</p>
              <div className="mt-4 flex justify-between text-xs text-gray-500">
                <span>👁️ {vid.views.toLocaleString()}</span>
                <span>❤️ {vid.likes.toLocaleString()}</span>
                <span>💬 {vid.comments.toLocaleString()}</span>
                <span>🔁 {vid.shares.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
