"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  fetchProfile,
  loadStoredSession,
  loginUser,
  registerUser,
  saveSession,
  type AuthSession,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/auth"

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<AuthSession>
  register: (payload: RegisterPayload) => Promise<AuthSession>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const stored = loadStoredSession()
      if (!stored) {
        setIsLoading(false)
        return
      }

      try {
        const profile = await fetchProfile()
        setSession({
          ...stored,
          user: profile,
        })
      } catch {
        saveSession(null)
        setSession(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isLoading,
      async login(payload) {
        const next = await loginUser(payload)
        setSession(next)
        saveSession(next)
        return next
      },
      async register(payload) {
        const next = await registerUser(payload)
        setSession(next)
        saveSession(next)
        return next
      },
      logout() {
        setSession(null)
        saveSession(null)
      },
    }),
    [session, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
