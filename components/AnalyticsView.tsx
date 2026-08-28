```tsx
"use client";

import React, { useMemo, useState } from "react";
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
import {
  BarChart2,
  LineChart as LineIcon,
  PieChart as PieIcon,
} from "lucide-react";

interface VideoData {
  id: string;

  title?: string;
  desc?: string;

  date?: string;
  created_at?: string;

  views?: number;
  playCount?: number;
  viewCount?: number;
  view_count?: number;

  likes?: number;
  diggCount?: number;
  likeCount?: number;
  like_count?: number;

  shares?: number;
  shareCount?: number;
  share_count?: number;

  comments?: number;
  commentCount?: number;
  comment_count?: number;
}

interface NormalizedVideo {
  id: string;
  title: string;
  date: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

const COLORS = [
  "#3B82F6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
];

export default function AnalyticsView({
  videos = [],
}: {
  videos?: VideoData[];
}) {
  const [activeTab, setActiveTab] = useState<"line" | "bar" | "pie">(
    "line"
  );

  const [selectedVideoId, setSelectedVideoId] =
    useState<string>("all");

  /*
   * Normalize different API response formats
   */
  const normalizedVideos = useMemo<NormalizedVideo[]>(() => {
    return (videos || []).map((video, index) => ({
      id: video.id || `video-${index}`,

      title:
        video.title ||
        video.desc ||
        `Video #${index + 1}`,

      date:
        video.date ||
        video.created_at ||
        `Video ${index + 1}`,

      views: Number(
        video.views ??
          video.playCount ??
          video.viewCount ??
          video.view_count ??
          0
      ),

      likes: Number(
        video.likes ??
          video.diggCount ??
          video.likeCount ??
          video.like_count ??
          0
      ),

      shares: Number(
        video.shares ??
          video.shareCount ??
          video.share_count ??
          0
      ),

      comments: Number(
        video.comments ??
          video.commentCount ??
          video.comment_count ??
          0
      ),
    }));
  }, [videos]);

  /*
   * Filter selected video
   */
  const filteredVideos = useMemo(() => {
    if (selectedVideoId === "all") {
      return normalizedVideos;
    }

    return normalizedVideos.filter(
      (video) => video.id === selectedVideoId
    );
  }, [normalizedVideos, selectedVideoId]);

  /*
   * Pie chart data
   */
  const pieData = useMemo(() => {
    const totalViews = filteredVideos.reduce(
      (sum, video) => sum + video.views,
      0
    );

    const totalLikes = filteredVideos.reduce(
      (sum, video) => sum + video.likes,
      0
    );

    const totalShares = filteredVideos.reduce(
      (sum, video) => sum + video.shares,
      0
    );

    const totalComments = filteredVideos.reduce(
      (sum, video) => sum + video.comments,
      0
    );

    return [
      {
        name: "Views",
        value: totalViews,
      },
      {
        name: "Likes",
        value: totalLikes,
      },
      {
        name: "Shares",
        value: totalShares,
      },
      {
        name: "Comments",
        value: totalComments,
      },
    ].filter((item) => item.value > 0);
  }, [filteredVideos]);

  /*
   * Debug information
   *
   * Open browser console to see whether
   * your API is actually providing data.
   */
  console.log("Analytics videos:", videos);
  console.log("Normalized videos:", normalizedVideos);
  console.log("Filtered videos:", filteredVideos);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-800 space-y-6 my-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">

        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Analytics Overview
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Performance metrics breakdown
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

          {/* Video selector */}
          <select
            value={selectedVideoId}
            onChange={(event) =>
              setSelectedVideoId(event.target.value)
            }
            className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Videos ({normalizedVideos.length})
            </option>

            {normalizedVideos.map((video) => (
              <option
                key={video.id}
                value={video.id}
              >
                {video.title.length > 30
                  ? video.title.substring(0, 30) + "..."
                  : video.title}
              </option>
            ))}
          </select>

          {/* Chart type buttons */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">

            {/* Line */}
            <button
              type="button"
              onClick={() => setActiveTab("line")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "line"
                  ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              <LineIcon className="w-4 h-4 inline mr-1" />
              Trend
            </button>

            {/* Bar */}
            <button
              type="button"
              onClick={() => setActiveTab("bar")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "bar"
                  ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              <BarChart2 className="w-4 h-4 inline mr-1" />
              Bar
            </button>

            {/* Pie */}
            <button
              type="button"
              onClick={() => setActiveTab("pie")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "pie"
                  ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              <PieIcon className="w-4 h-4 inline mr-1" />
              Pie
            </button>

          </div>
        </div>
      </div>

      {/* ================= CHART AREA ================= */}

      <div
        className="w-full"
        style={{ height: "360px" }}
      >
        {filteredVideos.length === 0 ? (

          /* Empty state */
          <div className="h-full flex flex-col items-center justify-center text-gray-400">

            <BarChart2 className="w-10 h-10 mb-3 opacity-40" />

            <p className="text-sm">
              No video data available to render charts.
            </p>

            <p className="text-xs mt-1">
              Make sure your API is returning video analytics data.
            </p>

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            {/* ================= LINE CHART ================= */}

            {activeTab === "line" && (
              <LineChart
                data={filteredVideos}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />

                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                />

                <YAxis
                  fontSize={12}
                  tick={{ fill: "#6B7280" }}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Views"
                />

                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Likes"
                />

                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Shares"
                />

                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Comments"
                />

              </LineChart>
            )}

            {/* ================= BAR CHART ================= */}

            {activeTab === "bar" && (
              <BarChart
                data={filteredVideos}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 50,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />

                <XAxis
                  dataKey="title"
                  fontSize={11}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  tickFormatter={(value) => {
                    if (!value) return "";

                    return value.length > 15
                      ? value.substring(0, 15) + "..."
                      : value;
                  }}
                />

                <YAxis
                  fontSize={12}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="views"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  name="Views"
                />

                <Bar
                  dataKey="likes"
                  fill="#EC4899"
                  radius={[4, 4, 0, 0]}
                  name="Likes"
                />

                <Bar
                  dataKey="shares"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  name="Shares"
                />

                <Bar
                  dataKey="comments"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  name="Comments"
                />

              </BarChart>
            )}

            {/* ================= PIE CHART ================= */}

            {activeTab === "pie" && (
              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${
                      percent !== undefined
                        ? (percent * 100).toFixed(1)
                        : "0"
                    }%`
                  }
                  labelLine
                >

                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            )}

          </ResponsiveContainer>
        )}
      </div>

      {/* ================= DATA SUMMARY ================= */}

      {filteredVideos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">

          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Views
            </p>

            <p className="text-lg font-bold text-blue-600">
              {filteredVideos
                .reduce(
                  (sum, video) => sum + video.views,
                  0
                )
                .toLocaleString()}
            </p>
          </div>

          <div className="bg-pink-50 dark:bg-pink-950/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Likes
            </p>

            <p className="text-lg font-bold text-pink-600">
              {filteredVideos
                .reduce(
                  (sum, video) => sum + video.likes,
                  0
                )
                .toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Shares
            </p>

            <p className="text-lg font-bold text-green-600">
              {filteredVideos
                .reduce(
                  (sum, video) => sum + video.shares,
                  0
                )
                .toLocaleString()}
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Comments
            </p>

            <p className="text-lg font-bold text-orange-600">
              {filteredVideos
                .reduce(
                  (sum, video) => sum + video.comments,
                  0
                )
                .toLocaleString()}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
```
