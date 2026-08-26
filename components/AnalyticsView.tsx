"use client";

import React, { useState, useMemo } from "react";
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
  title: string;
  date: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

const COLORS = ["#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6"];

export default function AnalyticsView({ videos }: { videos: VideoData[] }) {
  const [activeTab, setActiveTab] = useState<"line" | "bar" | "pie">("line");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("all");

  const filteredVideos = useMemo(() => {
    if (selectedVideoId === "all") return videos;
    return videos.filter((v) => v.id === selectedVideoId);
  }, [videos, selectedVideoId]);

  const pieData = useMemo(() => {
    const totalLikes = filteredVideos.reduce((acc, v) => acc + (v.likes || 0), 0);
    const totalShares = filteredVideos.reduce((acc, v) => acc + (v.shares || 0), 0);
    const totalComments = filteredVideos.reduce((acc, v) => acc + (v.comments || 0), 0);

    return [
      { name: "Likes", value: totalLikes },
      { name: "Shares", value: totalShares },
      { name: "Comments", value: totalComments },
    ];
  }, [filteredVideos]);

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
            <option value="all">All Videos</option>
            {videos.map((vid) => (
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

      <div className="h-72 w-full">
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
              <XAxis dataKey="title" fontSize={12} tickFormatter={(v) => v.substring(0, 8) + "..."} />
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
      </div>
    </div>
  );
}
