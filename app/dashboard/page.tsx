'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [tiktokMetrics, setTiktokMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function loadData() {
      // Get logged-in user details
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      if (profileData?.tiktok_handle) {
        // Trigger RapidAPI fetch route
        const res = await fetch('/api/tiktok/fetch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handle: profileData.tiktok_handle }),
        })
        const result = await res.json()
        if (result.success) {
          setTiktokMetrics(result.metrics)
        }
      }
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) return <div className="p-8 text-black">Loading your TikTok metrics...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name}
        </h1>
        <p className="text-gray-600">Analyzing handle: @{profile?.tiktok_handle}</p>

        {/* Display Analyzed Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiktokMetrics.map((video) => (
            <div key={video.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <p className="font-semibold text-gray-800 line-clamp-2">{video.caption || 'No Caption'}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                <span>👁️ {video.views.toLocaleString()} views</span>
                <span>❤️ {video.likes.toLocaleString()} likes</span>
                <span>💬 {video.comments.toLocaleString()} comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
