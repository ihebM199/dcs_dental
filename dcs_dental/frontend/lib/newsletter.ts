import { API_URL, ApiError } from "@/lib/auth"

export async function subscribeNewsletter(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/notifications/newsletter/subscribe/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>
      const message =
        (typeof record.detail === "string" && record.detail) ||
        (Array.isArray(record.email) && record.email[0]) ||
        "Impossible de s'inscrire à la newsletter."
      throw new ApiError(message)
    }
    throw new ApiError("Impossible de s'inscrire à la newsletter.")
  }
}
