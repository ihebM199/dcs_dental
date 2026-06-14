"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"
import { toast } from "sonner"
import { ShopLayout } from "@/components/shop-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const session = await login({ email, password })
      toast.success(`Connexion réussie ! Bienvenue ${session.user.first_name}.`)
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Impossible de se connecter. Réessayez plus tard.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-foreground">
              Connexion professionnelle
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Accédez à votre compte DCS Store pour suivre vos commandes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="nom@cabinet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <button
                  type="button"
                  className="text-xs font-semibold text-primary hover:underline"
                  onClick={() => toast.info("Fonctionnalité bientôt disponible")}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-6 h-10 w-full rounded-xl font-bold"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Créer un compte
            </Link>
          </p>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            En vous connectant, vous acceptez nos conditions générales
            d&apos;utilisation.
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
