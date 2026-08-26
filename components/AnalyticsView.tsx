'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface VideoData {
  id: string;
  title: string;
  created_at: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

const PIE_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

export default function AnalyticsView({ videos }: { videos: VideoData[] }) {
  const [selectedVideoId, setSelectedVideoId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('all');

  // 1. Filter videos by date & selected video
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    if (timeRange !== 'all') {
      const days = timeRange === '7d' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((v) => new Date(v.created_at) >= cutoff);
    }

    if (selectedVideoId !== 'all') {
      result = result.filter((v) => v.id === selectedVideoId);
    }

    return result.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [videos, timeRange, selectedVideoId]);

  // 2. Format Line Chart Data (Performance over time)
  const lineChartData = useMemo(() => {
    return filteredVideos.map((v) => ({
      date: new Date(v.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      title: v.title,
      Views: v.views,
      Likes: v.likes,
    }));
  }, [filteredVideos]);

  // 3. Format Bar Chart Data (Comparison across videos)
  const barChartData = useMemo(() => {
    return filteredVideos.slice(0, 10).map((v) => ({
      name: v.title.length > 15 ? `${v.title.substring(0, 15)}...` : v.title,
      Likes: v.likes,
      Comments: v.comments,
      Shares: v.shares,
    }));
  }, [filteredVideos]);

  // 4. Format Pie Chart Data (Engagement Distribution)
  const pieChartData = useMemo(() => {
    const totalLikes = filteredVideos.reduce((acc, v) => acc + (v.likes || 0), 0);
    const totalComments = filteredVideos.reduce((acc, v) => acc + (v.comments || 0), 0);
    const totalShares = filteredVideos.reduce((acc, v) => acc + (v.shares || 0), 0);

    return [
      { name: 'Likes', value: totalLikes },
      { name: 'Comments', value: totalComments },
      { name: 'Shares', value: totalShares },
    ].filter((item) => item.value > 0);
  }, [filteredVideos]);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-gray-900 p-4 rounded-xl border border-gray-800">
        {/* Time Range Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Time Window:</span>
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Video Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Video:</span>
          <select
            value={selectedVideoId}
            onChange={(e) => setSelectedVideoId(e.target.value)}
            className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg text-xs px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Videos Aggregate</option>
            {videos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Views & Likes Over Time */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Views & Likes Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Views" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="Likes" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Engagement Distribution */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Engagement Distribution</h3>
          <div className="h-72 w-full">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No engagement data for selected filters.
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart: Video Interaction Comparison */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Interaction Breakdown per Video
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                />
                <Legend />
                <Bar dataKey="Likes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Comments" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Shares" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
