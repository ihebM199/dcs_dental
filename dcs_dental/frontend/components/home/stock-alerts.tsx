import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { products, getStockLevel } from "@/lib/data"
import { StockIndicator } from "@/components/stock-indicator"

export function StockAlerts() {
  const lowStock = products.filter((p) => getStockLevel(p) === "low").slice(0, 3)
  if (lowStock.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border border-warning/30 bg-warning/5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="size-5 text-warning" />
          <h2 className="text-lg font-bold">Alertes stock — bientôt épuisé</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {lowStock.map((p) => (
            <Link
              key={p.id}
              href={`/produit/${p.slug}`}
              className="rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
              <p className="mb-2 text-xs text-muted-foreground">{p.brand}</p>
              <StockIndicator product={p} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
