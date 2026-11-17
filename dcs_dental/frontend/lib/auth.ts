export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://dcs-dental-backend.onrender.com"

export type Profession =
  | "DENTIST"
  | "DENTAL_PROSTHETIST"
  | "PROSTHESIS_STUDENT"
  | "DENTAL_MEDICINE_STUDENT"

export const professionOptions: { value: Profession; label: string }[] = [
  { value: "DENTIST", label: "Dentiste" },
  { value: "DENTAL_PROSTHETIST", label: "Prothésiste dentaire" },
  {
    value: "PROSTHESIS_STUDENT",
    label: "Étudiant en prothèse dentaire",
  },
  {
    value: "DENTAL_MEDICINE_STUDENT",
    label: "Étudiant en médecine dentaire",
  },
]

export interface AuthUser {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  location: string
  profession: Profession
  profession_display: string
  role: string
  role_display: string
  avatar: string | null
  date_joined: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

export interface RegisterPayload {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  phone: string
  location: string
  profession: Profession
}

export interface LoginPayload {
  email: string
  password: string
}

export class ApiError extends Error {
  fieldErrors: Record<string, string[]>

  constructor(message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.name = "ApiError"
    this.fieldErrors = fieldErrors
  }
}

function parseApiError(data: unknown): ApiError {
  if (!data || typeof data !== "object") {
    return new ApiError("Une erreur est survenue.")
  }

  const record = data as Record<string, unknown>
  const fieldErrors: Record<string, string[]> = {}
  const messages: string[] = []

  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value)) {
      const texts = value.filter((item) => typeof item === "string") as string[]
      if (texts.length) fieldErrors[key] = texts
    } else if (typeof value === "string") {
      messages.push(value)
    }
  }

  const message =
    messages[0] ??
    Object.values(fieldErrors).flat()[0] ??
    "Une erreur est survenue."

  return new ApiError(message, fieldErrors)
}

async function authRequest<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw parseApiError(data)
  }

  return data as T
}

export function registerUser(payload: RegisterPayload) {
  return authRequest<AuthSession>("/api/v1/accounts/register/", payload)
}

export function loginUser(payload: LoginPayload) {
  return authRequest<AuthSession>("/api/v1/accounts/login/", payload)
}

export const AUTH_STORAGE_KEY = "dcs-auth"

export function loadStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession | null) {
  if (typeof window === "undefined") return
  if (session) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function getStoredAccessToken(): string | null {
  return loadStoredSession()?.tokens.access ?? null
}

export async function refreshAccessToken(): Promise<AuthSession | null> {
  const session = loadStoredSession()
  if (!session?.tokens.refresh) return null

  const response = await fetch(`${API_URL}/api/v1/accounts/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: session.tokens.refresh }),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok || !data || typeof data !== "object" || !("access" in data)) {
    return null
  }

  const nextSession: AuthSession = {
    ...session,
    tokens: {
      access: String((data as { access: string }).access),
      refresh: String((data as { refresh?: string }).refresh ?? session.tokens.refresh),
    },
  }
  saveSession(nextSession)
  return nextSession
}

export async function fetchProfile(): Promise<AuthUser> {
  return authFetch<AuthUser>("/api/v1/accounts/profile/")
}

async function requestWithAuth<T>(
  path: string,
  options: RequestInit = {},
  accessToken: string,
): Promise<Response> {
  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${accessToken}`)
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })
}

export async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const session = loadStoredSession()
  if (!session?.tokens.access) {
    throw new ApiError("Vous devez être connecté.")
  }

  let response = await requestWithAuth(path, options, session.tokens.access)

  if (response.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      response = await requestWithAuth(path, options, refreshed.tokens.access)
    }
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      saveSession(null)
      throw new ApiError(
        "Votre session a expiré. Veuillez vous reconnecter.",
      )
    }
    throw parseApiError(data)
  }

  return data as T
}
