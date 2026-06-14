"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiError } from "@/lib/auth"
import {
  ORDER_STATUS_OPTIONS,
  formatOrderDate,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/orders"
import { cn, formatPrice } from "@/lib/utils"

const selectClassName =
  "flex h-9 w-full min-w-[140px] rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

interface OrderCardProps {
  order: Order
  adminView?: boolean
  onUpdated?: (order: Order) => void
}

export function OrderCard({
  order,
  adminView = false,
  onUpdated,
}: OrderCardProps) {
  const [expanded, setExpanded] = useState(adminView)
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setStatus(order.status as OrderStatus)
  }, [order.status])

  const hasStatusChange = status !== order.status

  const handleStatusUpdate = async () => {
    setIsSaving(true)
    try {
      const updated = await updateOrderStatus(order.id, status)
      onUpdated?.(updated)
      toast.success(`Statut mis à jour : ${updated.status_display}`)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Impossible de mettre à jour le statut.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-foreground">{order.order_number}</span>
            <span className="text-xs text-muted-foreground">
              {formatOrderDate(order.created_at)}
            </span>
          </div>
          {adminView && (
            <p className="mt-1 text-xs text-muted-foreground">
              Client : {order.user_name} ({order.user_email})
            </p>
          )}
          <p className="mt-1 text-sm font-semibold text-primary">
            Total : {formatPrice(Number(order.final_amount))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {adminView ? (
            <>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className={selectClassName}
                aria-label="Statut de la commande"
              >
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                disabled={!hasStatusChange || isSaving}
                onClick={handleStatusUpdate}
                className="h-9"
              >
                {isSaving ? "..." : "Enregistrer"}
              </Button>
            </>
          ) : (
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-foreground">
              {order.status_display}
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Masquer les détails" : "Voir les détails"}
          >
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </div>

      <div className={cn("p-4", !expanded && "hidden")}>
        <h4 className="mb-3 text-sm font-bold text-foreground">
          Articles commandés
        </h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Sous-total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product_name}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(Number(item.product_price))}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPrice(Number(item.subtotal))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-secondary/40 p-3">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
              <MapPin className="size-4 text-primary" /> Livraison
            </p>
            <p className="text-muted-foreground">{order.shipping_address}</p>
          </div>
          <div className="rounded-lg bg-secondary/40 p-3">
            <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
              <Phone className="size-4 text-primary" /> Contact
            </p>
            <p className="text-muted-foreground">{order.shipping_phone}</p>
            {order.notes && (
              <p className="mt-2 text-xs text-muted-foreground">
                Notes : {order.notes}
              </p>
            )}
          </div>
        </div>

        {Number(order.discount_amount) > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Remise appliquée : -{formatPrice(Number(order.discount_amount))}
          </p>
        )}
      </div>
    </div>
  )
}
