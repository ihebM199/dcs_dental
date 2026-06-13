"use client"

import { useState } from "react"
import { ShopLayout } from "@/components/shop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login logic
    setTimeout(() => {
      setIsLoading(false)
      if (email === "admin@dcsstore.tn" && password === "AdminDCS2026!") {
        toast.success("Connexion réussie ! Bienvenue Admin.")
        router.push("/dashboard")
      } else if (email && password) {
        toast.success("Connexion réussie ! Bienvenue dans votre espace.")
        router.push("/dashboard")
      } else {
        toast.error("Veuillez remplir les informations de connexion.")
      }
    }, 1000)
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-foreground">Connexion professionnelle</h1>
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Mot de passe</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline font-semibold"
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
              className="w-full h-10 rounded-xl font-bold mt-6"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            En vous connectant, vous acceptez nos conditions générales d&apos;utilisation.
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
