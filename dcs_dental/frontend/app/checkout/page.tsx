"use client"

import { useState } from "react"
import { ShopLayout } from "@/components/shop-layout"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"
import { coupons, roles } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CheckCircle2, ShoppingBag, Trash2, Ticket, CreditCard, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, setQty, remove, subtotal, clear } = useCart()

  // Coupon state
  const [couponCode, setCouponCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [activeCoupon, setActiveCoupon] = useState("")

  // Form states
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [profession, setProfession] = useState("Dentiste")
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    const coupon = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase())

    if (coupon) {
      setAppliedDiscount(coupon.discountPct)
      setActiveCoupon(coupon.code)
      toast.success(`Code promo appliqué ! Vous bénéficiez de -${coupon.discountPct}%`)
    } else {
      toast.error("Code promo invalide ou expiré")
    }
  }

  // Calculate pricing
  const discountAmount = (subtotal * appliedDiscount) / 100
  const deliveryFee = subtotal > 500 ? 0 : 7 // Free delivery over 500 TND, otherwise 7 TND
  const total = subtotal - discountAmount + deliveryFee

  // Checkout submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !phone || !location) {
      toast.error("Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Adresse)")
      return
    }

    // Generate simulated order ID
    const randomId = "CMD-" + Math.floor(100000 + Math.random() * 900000)
    setOrderId(randomId)
    setIsOrderPlaced(true)
    clear() // Clear the cart items
    toast.success("Votre commande a été enregistrée avec succès !")
  }

  if (isOrderPlaced) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="size-16 text-success animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground">Merci pour votre commande !</h1>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
            Votre commande <strong className="text-foreground">{orderId}</strong> a été enregistrée. Nous vous contacterons par téléphone sous peu pour confirmer les détails de livraison.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Détails de livraison</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Destinataire :</span> {fullName}</p>
              <p><span className="text-muted-foreground">Téléphone :</span> {phone}</p>
              <p><span className="text-muted-foreground">Adresse :</span> {location}</p>
              <p><span className="text-muted-foreground">Profession :</span> {profession}</p>
              <p className="pt-2 border-t border-border mt-3 text-xs text-muted-foreground flex items-center gap-1">
                <Truck className="size-4 text-primary" /> Paiement à la livraison
              </p>
            </div>
          </div>

          <Button className="mt-8 rounded-xl h-10 w-full sm:w-auto px-6 font-bold" render={<Link href="/catalogue" />}>
            Continuer mes achats
          </Button>
        </div>
      </ShopLayout>
    )
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-8">
          Mon Panier & Caisse
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <ShoppingBag className="mx-auto size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Button className="mt-6 rounded-xl" render={<Link href="/catalogue" />}>
              Explorer le catalogue
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left side: Cart Items & Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Items list */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4">Articles du panier</h2>
                <div className="divide-y divide-border/70">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/35">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-2 text-sm font-bold text-foreground leading-snug">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.product.brand}</p>
                        <div className="mt-2 flex items-center justify-between gap-4">
                          {/* Quantity selectors */}
                          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
                            <button
                              onClick={() => setQty(item.product.id, item.qty - 1)}
                              className="px-2 py-0.5 hover:bg-muted text-foreground text-sm font-bold rounded"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.product.id, item.qty + 1)}
                              className="px-2 py-0.5 hover:bg-muted text-foreground text-sm font-bold rounded"
                              disabled={item.qty >= item.product.stock}
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => remove(item.product.id)}
                            className="text-muted-foreground hover:text-destructive p-1 rounded-lg transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary">{formatPrice(item.product.price * item.qty)}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{formatPrice(item.product.price)} / u</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4">Informations de livraison</h2>
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="fullname">Nom & Prénom <span className="text-destructive">*</span></Label>
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
                      <Label htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
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
                    <Label htmlFor="location">Adresse complète <span className="text-destructive">*</span></Label>
                    <Input
                      id="location"
                      required
                      placeholder="Cabinet Dentaire, Bloc B Esc 2, Av. Habib Bourguiba, Tunis"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Summary & Promo Code */}
            <div className="space-y-6">
              {/* Summary card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-4">Récapitulatif</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Remise ({appliedDiscount}%)</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span className="font-semibold text-foreground">
                      {deliveryFee === 0 ? "Gratuit" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <hr className="border-border/70 my-2" />

                  <div className="flex justify-between text-base font-black">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="size-4 text-primary shrink-0" />
                    <span>Paiement 100% sécurisé à la livraison</span>
                  </div>
                  <Button
                    type="submit"
                    form="checkout-form"
                    className="w-full h-11 rounded-xl text-sm font-bold mt-2"
                  >
                    Valider la commande
                  </Button>
                </div>
              </div>

              {/* Promo code card */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
                  <Ticket className="size-4 text-primary" /> Appliquer un code promo
                </h3>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    placeholder="Ex: DCS10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Button type="submit" variant="secondary" className="h-9 text-xs px-3">
                    Appliquer
                  </Button>
                </form>
                {activeCoupon && (
                  <p className="text-xs text-success font-semibold mt-2">
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
