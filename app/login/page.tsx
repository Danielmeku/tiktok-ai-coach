'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignUp = async () => {
    await supabase.auth.signUp({ email, password })
    alert('Check your email for confirmation!')
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/onboarding'
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">TikTok AI Coach</h1>
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={handleSignIn} className="w-1/2 bg-blue-600 text-white p-2 rounded">
            Log In
          </button>
          <button onClick={handleSignUp} className="w-1/2 bg-gray-200 text-gray-800 p-2 rounded">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}