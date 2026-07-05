import { create } from 'zustand'
import type { Profile, Plan } from '@/types'

interface AppState {
  profile: Profile | null
  plans: Plan[]
  loading: boolean
  error: string | null
  setProfile: (p: Profile | null) => void
  setPlans: (p: Plan[]) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  plans: [],
  loading: false,
  error: null,
  setProfile: (profile) => set({ profile }),
  setPlans: (plans) => set({ plans }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ profile: null, plans: [], loading: false, error: null }),
}))
