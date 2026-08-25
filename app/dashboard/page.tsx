'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (!error) setProfile(data)
      }
    }
    loadProfile()
  }, [])

  if (!profile) return <div className="p-6 text-black">Loading profile...</div>

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold text-gray-900">{profile.full_name}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Handle</p>
            <p className="font-semibold text-gray-900">@{profile.tiktok_handle}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Niche</p>
            <p className="font-semibold text-gray-900">{profile.niche}</p>
          </div>
        </div>
      </div>
    </div>
  )
}