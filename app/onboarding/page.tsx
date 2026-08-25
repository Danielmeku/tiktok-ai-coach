'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function OnboardingPage() {
  const [fullName, setFullName] = useState('')
  const [handle, setHandle] = useState('')
  const [niche, setNiche] = useState('')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("You must be logged in.")
      return
    }

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      tiktok_handle: handle,
      niche: niche
    })

    if (error) alert(error.message)
    else window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen p-4 flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Profile Setup</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input className="w-full border p-2 rounded mt-1 text-black" onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">TikTok Handle</label>
          <input className="w-full border p-2 rounded mt-1 text-black" onChange={(e) => setHandle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Niche</label>
          <input className="w-full border p-2 rounded mt-1 text-black" placeholder="e.g. Fitness, Tech, Gaming" onChange={(e) => setNiche(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-black text-white p-2 rounded font-medium hover:bg-gray-800">
          Save & Continue
        </button>
      </form>
    </div>
  )
}