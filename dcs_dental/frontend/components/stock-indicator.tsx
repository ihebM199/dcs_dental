"use client"

import { motion } from "motion/react"
import { getStockLevel, stockMeta, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

export function StockIndicator({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  const level = getStockLevel(product)
  const meta = stockMeta[level]
  const pct = Math.max(6, Math.round((product.stock / product.stockMax) * 100))

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold">
        <span className={meta.colorClass}>{meta.label}</span>
        <span className="text-muted-foreground">{product.stock} en stock</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", meta.barClass)}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
