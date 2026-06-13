"use client"

import { use, useState } from "react"
import { ShopLayout } from "@/components/shop-layout"
import { ProductCard } from "@/components/product-card"
import { getProductBySlug, relatedProducts } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { StockIndicator } from "@/components/stock-indicator"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const product = getProductBySlug(slug)
  const { add } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  if (!product) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Produit non trouvé</h1>
          <p className="mt-2 text-muted-foreground">Le produit demandé n&apos;existe pas ou a été déplacé.</p>
          <Button className="mt-6" render={<Link href="/catalogue" />}>
            Retour au catalogue
          </Button>
        </div>
      </ShopLayout>
    )
  }

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const handleAddToCart = () => {
    add(product, quantity)
    toast.success("Ajouté au panier", {
      description: `${quantity}x ${product.name} ajouté au panier.`,
    })
  }

  const related = relatedProducts(product, 4)

  return (
    <ShopLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Link */}
        <Link href="/catalogue" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="size-4" />
          Retour au catalogue
        </Link>

        {/* Product Details Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-secondary/35">
              <Image
                src={product.images[activeImage] || product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-secondary/35 transition-all ${
                      activeImage === idx ? "border-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Image src={imgUrl} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Details */}
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {product.brand}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-warning text-warning"
                        : "text-muted border-none"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span>({product.reviewCount} avis professionnels)</span>
            </div>

            <hr className="my-5 border-border/70" />

            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Prix TTC • TVA applicable</p>
            </div>

            <div className="mt-5">
              <StockIndicator product={product} />
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Description</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <hr className="my-6 border-border/70" />

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Quantity selector */}
              <div className="flex items-center rounded-xl border border-border bg-card p-1 shrink-0 w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="size-8 rounded-lg"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="size-8 rounded-lg"
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              {/* Add button */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full sm:w-auto h-10 gap-2 px-6 rounded-xl text-sm font-bold"
              >
                <ShoppingCart className="size-4" />
                Ajouter au panier
              </Button>
            </div>

            {/* Specifications Details Table */}
            {product.details && product.details.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                  Spécifications
                </h3>
                <div className="overflow-hidden rounded-xl border border-border/70">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {product.details.map((detail, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-border/50 last:border-none odd:bg-secondary/10"
                        >
                          <td className="px-4 py-2.5 font-semibold text-muted-foreground w-1/3">
                            {detail.label}
                          </td>
                          <td className="px-4 py-2.5 text-foreground">{detail.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  )
}
