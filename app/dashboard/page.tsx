'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [tiktokMetrics, setTiktokMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchDashboardData() {
      try {
        setLoading(true)

        // 1. Get current logged-in user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          setErrorMsg('Failed to load authenticated user.')
          setLoading(false)
          return
        }

        // 2. Retrieve user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError || !profileData) {
          setErrorMsg('Profile data not found in Supabase.')
          setLoading(false)
          return
        }

        setProfile(profileData)

        // 3. Trigger RapidAPI fetch route if handle exists
        if (profileData.tiktok_handle) {
          const res = await fetch('/api/tiktok/fetch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ handle: profileData.tiktok_handle }),
          })

          const result = await res.json()

          if (!res.ok || result.error) {
            setErrorMsg(result.error || 'Failed to fetch TikTok data.')
          } else if (result.metrics) {
            setTiktokMetrics(result.metrics)
          }
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">Loading your TikTok analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || 'Creator'}
          </h1>
          <p className="text-gray-600">
            Analyzing handle: <span className="font-semibold text-blue-600">@{profile?.tiktok_handle}</span>
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Video Cards Grid */}
        {tiktokMetrics.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tiktokMetrics.map((video) => (
              <div
                key={video.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="line-clamp-2 font-semibold text-gray-800">
                  {video.caption}
                </p>
                <div className="mt-4 flex gap-4 text-sm text-gray-600">
                  <span>👁️ {Number(video.views).toLocaleString()} views</span>
                  <span>❤️ {Number(video.likes).toLocaleString()} likes</span>
                  <span>💬 {Number(video.comments).toLocaleString()} comments</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !errorMsg && (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              No videos found for @{profile?.tiktok_handle}.
            </div>
          )
        )}
      </div>
    </div>
  )
}
