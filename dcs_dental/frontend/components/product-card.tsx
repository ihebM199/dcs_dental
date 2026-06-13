"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"
import { motion } from "motion/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StockIndicator } from "@/components/stock-indicator"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/data"

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <Link
        href={`/produit/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-secondary/50"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-accent text-accent-foreground">Nouveau</Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <Link href={`/produit/${product.slug}`} className="mt-0.5">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-warning text-warning" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-2">
          <StockIndicator product={product} />
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-extrabold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>
          <Button
            size="icon"
            className="size-9 shrink-0 rounded-xl"
            aria-label={`Ajouter ${product.name} au panier`}
            onClick={() => {
              add(product)
              toast.success("Ajouté au panier", { description: product.name })
            }}
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
