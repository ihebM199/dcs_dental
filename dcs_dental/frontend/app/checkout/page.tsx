"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  CreditCard,
  ShoppingBag,
  Ticket,
  Trash2,
  Truck,
} from "lucide-react"
import { toast } from "sonner"
import { ShopLayout } from "@/components/shop-layout"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { ApiError } from "@/lib/auth"
import { validateCoupon } from "@/lib/api"
import { createOrder } from "@/lib/orders"
import { roles } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { items, setQty, remove, subtotal, clear } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [activeCoupon, setActiveCoupon] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [profession, setProfession] = useState("Dentiste")
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Connectez-vous pour passer commande.")
      router.replace("/login?next=/checkout")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (user) {
      setFullName(user.full_name)
      setPhone(user.phone)
      setLocation(user.location)
      setProfession(user.profession_display)
    }
  }, [user])

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const coupon = await validateCoupon(couponCode)
      if (coupon && coupon.isValid) {
        setAppliedDiscount(coupon.discountPct)
        setActiveCoupon(coupon.code)
        toast.success(
          `Code promo appliqué ! Vous bénéficiez de -${coupon.discountPct}%`,
        )
      } else {
        toast.error("Code promo invalide ou expiré")
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Code promo invalide ou expiré"
      toast.error(message)
    }
  }

  const discountAmount = (subtotal * appliedDiscount) / 100
  const deliveryFee = subtotal > 500 ? 0 : 7
  const total = subtotal - discountAmount + deliveryFee

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Connectez-vous pour passer commande.")
      router.push("/login?next=/checkout")
      return
    }

    if (!fullName || !phone || !location) {
      toast.error(
        "Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Adresse)",
      )
      return
    }

    const invalidItems = items.filter((item) => !/^\d+$/.test(item.product.id))
    if (invalidItems.length > 0) {
      toast.error(
        "Certains produits du panier ne sont pas valides. Videz le panier et ajoutez des produits depuis le catalogue.",
      )
      return
    }

    setIsSubmitting(true)

    try {
      const notes = [
        `Destinataire: ${fullName}`,
        `Profession: ${profession}`,
        deliveryFee > 0 ? `Frais de livraison: ${deliveryFee} TND` : "",
      ]
        .filter(Boolean)
        .join(" | ")

      const order = await createOrder({
        items: items.map((item) => ({
          product_id: Number(item.product.id),
          quantity: item.qty,
        })),
        shipping_address: location,
        shipping_phone: phone,
        notes,
        promo_code: activeCoupon || undefined,
      })

      setOrderId(order.order_number)
      setIsOrderPlaced(true)
      clear()
      toast.success("Votre commande a été enregistrée avec succès !")
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Impossible d'enregistrer la commande. Réessayez plus tard.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center text-muted-foreground">
          Chargement...
        </div>
      </ShopLayout>
    )
  }

  if (isOrderPlaced) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="size-16 animate-bounce text-success" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Merci pour votre commande !
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Votre commande{" "}
            <strong className="text-foreground">{orderId}</strong> a été
            enregistrée. Nous vous contacterons par téléphone sous peu pour
            confirmer les détails de livraison.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
            <h3 className="mb-4 font-bold text-foreground">
              Détails de livraison
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Destinataire :</span>{" "}
                {fullName}
              </p>
              <p>
                <span className="text-muted-foreground">Téléphone :</span>{" "}
                {phone}
              </p>
              <p>
                <span className="text-muted-foreground">Adresse :</span>{" "}
                {location}
              </p>
              <p>
                <span className="text-muted-foreground">Profession :</span>{" "}
                {profession}
              </p>
              <p className="mt-3 flex items-center gap-1 border-t border-border pt-2 text-xs text-muted-foreground">
                <Truck className="size-4 text-primary" /> Paiement à la livraison
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              className="h-10 rounded-xl px-6 font-bold"
              render={<Link href="/dashboard" />}
            >
              Voir mes commandes
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl px-6 font-bold"
              render={<Link href="/catalogue" />}
            >
              Continuer mes achats
            </Button>
          </div>
        </div>
      </ShopLayout>
    )
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-foreground">
          Mon Panier & Caisse
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <ShoppingBag className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Button className="mt-6 rounded-xl" render={<Link href="/catalogue" />}>
              Explorer le catalogue
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-foreground">
                  Articles du panier
                </h2>
                <div className="divide-y divide-border/70">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/35">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                          {item.product.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.product.brand}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-4">
                          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                setQty(item.product.id, item.qty - 1)
                              }
                              className="rounded px-2 py-0.5 text-sm font-bold text-foreground hover:bg-muted"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-semibold">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQty(item.product.id, item.qty + 1)
                              }
                              className="rounded px-2 py-0.5 text-sm font-bold text-foreground hover:bg-muted"
                              disabled={item.qty >= item.product.stock}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(item.product.id)}
                            className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold text-primary">
                          {formatPrice(item.product.price * item.qty)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {formatPrice(item.product.price)} / u
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-foreground">
                  Informations de livraison
                </h2>
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="fullname">
                      Nom & Prénom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fullname"
                      required
                      placeholder="Dr. Ahmed Ben Ali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="phone">
                        Téléphone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+216 98 765 432"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession / Spécialité</Label>
                      <select
                        id="profession"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">
                      Adresse complète <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="location"
                      required
                      placeholder="Cabinet Dentaire, Av. Habib Bourguiba, Tunis"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-foreground">
                  Récapitulatif
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Remise ({appliedDiscount}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Frais de livraison
                    </span>
                    <span className="font-semibold text-foreground">
                      {deliveryFee === 0 ? "Gratuit" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <hr className="my-2 border-border/70" />

                  <div className="flex justify-between text-base font-black">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="size-4 shrink-0 text-primary" />
                    <span>Paiement 100% sécurisé à la livraison</span>
                  </div>
                  <Button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="mt-2 h-11 w-full rounded-xl text-sm font-bold"
                  >
                    {isSubmitting ? "Enregistrement..." : "Valider la commande"}
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <Ticket className="size-4 text-primary" /> Appliquer un code promo
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    placeholder="Ex: DCS10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                  >
                    Appliquer
                  </Button>
                </form>
                {activeCoupon && (
                  <p className="mt-2 text-xs font-semibold text-success">
                    Code &ldquo;{activeCoupon}&rdquo; actif (-{appliedDiscount}%)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  )
}
