"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShopLayout } from "@/components/shop-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  ShoppingBag,
  LogOut,
  CheckCircle,
  Package,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    location: "",
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        profession: user.profession_display,
        location: user.location,
      })
    }
  }, [user])

  const orders = [
    {
      id: "CMD-829103",
      date: "12 Juin 2026",
      status: "Livré",
      items: "1x Micromoteur électrique sans fil",
      total: "1 290 TND",
    },
    {
      id: "CMD-720194",
      date: "04 Mai 2026",
      status: "Livré",
      items: "2x Composite photopolymérisable, 1x Kit fraises diamantées",
      total: "785 TND",
    },
  ]

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    toast.success("Profil mis à jour avec succès !")
  }

  const handleLogout = () => {
    logout()
    toast.success("Déconnexion réussie.")
    router.push("/")
  }

  if (isLoading || !user) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">
          Chargement de votre espace...
        </div>
      </ShopLayout>
    )
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Mon Espace Personnel
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gérez votre profil professionnel et suivez vos achats.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-fit gap-1.5 text-xs"
          >
            <LogOut className="size-4 text-destructive" /> Déconnexion
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                <User className="size-5 text-primary" /> Mon Profil
              </h2>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Nom & Prénom</Label>
                    <Input
                      id="edit-name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Téléphone</Label>
                    <Input
                      id="edit-phone"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-location">Localisation</Label>
                    <Input
                      id="edit-location"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" size="sm" className="w-full">
                      Enregistrer
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="w-full"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="size-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <hr className="border-border/70" />

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-4 shrink-0 text-primary" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="size-4 shrink-0 text-primary" />
                      <span>{profile.profession}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4 shrink-0 text-primary" />
                      <span>{profile.location}</span>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="mt-4 w-full"
                  >
                    Modifier mes informations
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                <ShoppingBag className="size-5 text-primary" /> Historique des
                commandes
              </h2>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Package className="mb-2 size-10" />
                  <p>Vous n&apos;avez pas encore passé de commande.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-border p-4 transition-colors hover:border-muted-foreground/30"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-sm">
                        <div>
                          <span className="font-bold text-foreground">
                            {order.id}
                          </span>
                          <span className="ml-3 text-xs text-muted-foreground">
                            {order.date}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                          <CheckCircle className="size-3.5 fill-success/15" />{" "}
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <div className="truncate text-muted-foreground">
                          {order.items}
                        </div>
                        <div className="shrink-0 font-bold text-primary">
                          {order.total}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
