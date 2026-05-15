'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CapybaraSprite from '@/components/capybara/CapybaraSprite'
import { Button } from '@/components/ui/button'

const COLORS = [
  { id: 'brown', label: 'Brown' },
  { id: 'tan', label: 'Tan' },
  { id: 'gray', label: 'Gray' },
  { id: 'black', label: 'Black' },
  { id: 'white', label: 'White' },
  { id: 'rust', label: 'Rust' },
]

export default function OnboardingPage() {
  const [selected, setSelected] = useState('brown')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDeploy() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ capybara_color: selected, onboarding_complete: true, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    router.push('/morning')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center space-y-2">
        <p className="text-stone-500 text-xs uppercase tracking-widest">Incoming transmission</p>
        <h1 className="text-3xl font-bold text-stone-100">Choose your operative.</h1>
        <p className="text-stone-400 text-sm">This is who you are. Choose wisely.</p>
      </div>

      <CapybaraSprite color={selected} size="lg" animated />

      <div className="grid grid-cols-3 gap-3">
        {COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === c.id
                ? 'bg-stone-100 text-stone-900'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <Button onClick={handleDeploy} disabled={loading} className="w-40 bg-stone-700 hover:bg-stone-600">
        {loading ? 'Deploying...' : 'Deploy'}
      </Button>
    </div>
  )
}
