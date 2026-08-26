"use client";

import { useState } from "react";
import AnalyticsView from "@/components/AnalyticsView";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"videos" | "analytics">("analytics");
  const [videos, setVideos] = useState<any[]>([]); // Your fetched video array

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
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
          All Videos
        </button>
      </div>

      {/* Dynamic Tab Content */}
      {activeTab === "analytics" ? (
        <AnalyticsView videos={videos || []} />
      ) : (
        <div>
          {/* Your existing Video List / Cards go here */}
        </div>
      )}
    </div>
  );
}
