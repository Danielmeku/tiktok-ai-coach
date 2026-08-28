"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { BarChart2, LineChart as LineIcon, PieChart as PieIcon } from "lucide-react";

interface VideoData {
  id: string;
  title?: string;
  desc?: string;
  date?: string;
  created_at?: string;
  views?: number;
  playCount?: number;
  likes?: number;
  diggCount?: number;
  shares?: number;
  shareCount?: number;
  comments?: number;
  commentCount?: number;
}

const COLORS = ["#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6"];

export default function AnalyticsView({ videos = [] }: { videos?: VideoData[] }) {
  const [activeTab, setActiveTab] = useState<"line" | "bar" | "pie">("line");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  // Fix SSR hydration issues with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format and normalize video data to support multiple API schema formats
  const normalizedVideos = useMemo(() => {
    return (videos || []).map((v, index) => ({
      id: v.id || `video-${index}`,
      title: v.title || v.desc || `Video #${index + 1}`,
      date: v.date || v.created_at || `Item ${index + 1}`,
      views: Number(v.views ?? v.playCount ?? 0),
      likes: Number(v.likes ?? v.diggCount ?? 0),
      shares: Number(v.shares ?? v.shareCount ?? 0),
      comments: Number(v.comments ?? v.commentCount ?? 0),
    }));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (selectedVideoId === "all") return normalizedVideos;
    return normalizedVideos.filter((v) => v.id === selectedVideoId);
  }, [normalizedVideos, selectedVideoId]);

  // Dynamic Pie Data (excludes 0 values)
  const pieData = useMemo(() => {
    const totalLikes = filteredVideos.reduce((acc, v) => acc + v.likes, 0);
    const totalShares = filteredVideos.reduce((acc, v) => acc + v.shares, 0);
    const totalComments = filteredVideos.reduce((acc, v) => acc + v.comments, 0);
    const totalViews = filteredVideos.reduce((acc, v) => acc + v.views, 0);

    const raw = [
      { name: "Views", value: totalViews },
      { name: "Likes", value: totalLikes },
      { name: "Shares", value: totalShares },
      { name: "Comments", value: totalComments },
    ];

    // Remove metrics with zero counts to prevent empty pie renders
    return raw.filter((item) => item.value > 0);
  }, [filteredVideos]);

  if (!mounted) return <div className="h-72 w-full bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-800 space-y-6 my-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Performance metrics breakdown
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedVideoId}
            onChange={(e) => setSelectedVideoId(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none"
          >
            <option value="all">All Videos ({normalizedVideos.length})</option>
            {normalizedVideos.map((vid) => (
              <option key={vid.id} value={vid.id}>
                {vid.title.length > 20 ? vid.title.substring(0, 20) + "..." : vid.title}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("line")}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "line" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" : "text-gray-500"
              }`}
            >
              <LineIcon className="w-4 h-4 inline mr-1" /> Trend
            </button>
            <button
              onClick={() => setActiveTab("bar")}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "bar" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" : "text-gray-500"
              }`}
            >
              <BarChart2 className="w-4 h-4 inline mr-1" /> Bar
            </button>
            <button
              onClick={() => setActiveTab("pie")}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "pie" ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" : "text-gray-500"
              }`}
            >
              <PieIcon className="w-4 h-4 inline mr-1" /> Pie
            </button>
          </div>
        </div>
      </div>

      <div className="h-72 w-full min-h-[280px]">
        {filteredVideos.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No video data available to render charts.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "line" ? (
              <LineChart data={filteredVideos}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={3} name="Views" />
                <Line type="monotone" dataKey="likes" stroke="#EC4899" strokeWidth={2} name="Likes" />
              </LineChart>
            ) : activeTab === "bar" ? (
              <BarChart data={filteredVideos}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="title" fontSize={12} tickFormatter={(v) => (v ? v.substring(0, 10) + "..." : "")} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="likes" fill="#EC4899" radius={[4, 4, 0, 0]} name="Likes" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                  {pieData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
