'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  return (
    <Card className="bg-stone-900 border-stone-800 text-stone-100">
      <CardHeader>
        <CardTitle className="text-2xl">You&apos;ve been selected.</CardTitle>
        <CardDescription className="text-stone-400">Begin your briefing.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-300">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              required className="bg-stone-800 border-stone-700 text-stone-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-stone-300">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6} className="bg-stone-800 border-stone-700 text-stone-100" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-stone-700 hover:bg-stone-600">
            {loading ? 'Initiating...' : 'Begin'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-stone-500">
          Already briefed?{' '}
          <Link href="/login" className="text-stone-300 underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  )
}
