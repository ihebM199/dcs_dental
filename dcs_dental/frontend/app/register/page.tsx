"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react"
import { toast } from "sonner"
import { ShopLayout } from "@/components/shop-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError, professionOptions, type Profession } from "@/lib/auth"
import { cn } from "@/lib/utils"

const selectClassName =
  "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    profession: "DENTIST" as Profession,
    password: "",
    password_confirm: "",
  })

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const session = await register(form)
      toast.success(`Compte créé ! Bienvenue ${session.user.first_name}.`)
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Impossible de créer le compte. Réessayez plus tard.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-foreground">
              Créer un compte
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Rejoignez DCS Store pour commander du matériel dentaire et
              paramédical.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="first_name"
                    required
                    placeholder="Ahmed"
                    value={form.first_name}
                    onChange={(e) => update("first_name", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="last_name">Nom</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="last_name"
                    required
                    placeholder="Ben Ali"
                    value={form.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="nom@cabinet.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+216 00 000 000"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Ville / Localisation</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  required
                  placeholder="Tunis, Tunisie"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="profession">Profession</Label>
              <div className="relative mt-1">
                <Briefcase className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="profession"
                  required
                  value={form.profession}
                  onChange={(e) =>
                    update("profession", e.target.value as Profession)
                  }
                  className={cn(selectClassName, "pl-9")}
                >
                  {professionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password_confirm">Confirmer le mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password_confirm"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={form.password_confirm}
                  onChange={(e) => update("password_confirm", e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-10 w-full rounded-xl font-bold"
            >
              {isLoading ? "Création du compte..." : "Créer mon compte"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </ShopLayout>
  )
}
