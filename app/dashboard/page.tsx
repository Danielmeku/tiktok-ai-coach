'use client';

import { useState, useEffect } from 'react';
import AnalyticsView from '@/components/AnalyticsView';
import { LayoutDashboard, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'analytics'>('videos');
  const [videos, setVideos] = useState([]);

  // Fetch videos from your API or Supabase here...

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      {/* Header & Tab Navigator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold">TikTok Analytics Dashboard</h1>
          <p className="text-sm text-gray-400">Track video performance and audience metrics</p>
        </div>

        {/* Navigator Buttons */}
        <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-xl space-x-1">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'videos'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Video List</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics Charts</span>
          </button>
        </div>
      </div>

      {/* Dynamic Tab Content */}
      {activeTab === 'videos' ? (
        <div>
          {/* Your existing Video List / Table Component goes here */}
        </div>
      ) : (
        <AnalyticsView videos={videos} />
      )}
    </div>
  );
}
