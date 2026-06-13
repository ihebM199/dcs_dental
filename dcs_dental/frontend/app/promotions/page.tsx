"use client"

import { useState, useEffect } from "react"
import { ShopLayout } from "@/components/shop-layout"
import { ProductCard } from "@/components/product-card"
import { fetchProducts, fetchCoupons } from "@/lib/api"
import type { Product, Coupon } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Tag, Calendar } from "lucide-react"

export default function PromotionsPage() {
  const [productsList, setProductsList] = useState<Product[]>([])
  const [couponsList, setCouponsList] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [p, c] = await Promise.all([
          fetchProducts(),
          fetchCoupons()
        ])
        setProductsList(p)
        setCouponsList(c)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const promoProducts = productsList.filter((p) => p.isPromo || p.oldPrice)

  if (loading) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">
          Chargement des promotions...
        </div>
      </ShopLayout>
    )
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Offres Promotionnelles
          </h1>
          <p className="mt-2 text-muted-foreground">
            Profitez de réductions exceptionnelles sur notre matériel dentaire de qualité professionnelle.
          </p>
        </div>

        {/* Coupons banner section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Tag className="size-5 text-primary" /> Codes de réduction disponibles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {couponsList.map((c) => (
              <div
                key={c.code}
                className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-lg font-bold text-primary tracking-wide bg-primary/10 border border-primary/20 rounded px-2.5 py-1">
                      {c.code}
                    </span>
                    <p className="mt-3 font-semibold text-foreground text-sm">{c.description}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-extrabold text-sm px-2 py-1">
                    -{c.discountPct}%
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>Expire le : {c.expires}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Products */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">Produits en Promotion</h2>
          {promoProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Aucune promotion active pour le moment. Revenez bientôt !
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {promoProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ShopLayout>
  )
}
