import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/data"

export function ProductSection({
  title,
  subtitle,
  products,
  href = "/catalogue",
  accent = false,
}: {
  title: string
  subtitle?: string
  products: Product[]
  href?: string
  accent?: boolean
}) {
  if (products.length === 0) return null
  return (
    <section
      className={
        accent ? "bg-secondary/40 py-8" : "py-8"
      }
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <Link
            href={href}
            className="shrink-0 text-sm font-medium text-primary hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
