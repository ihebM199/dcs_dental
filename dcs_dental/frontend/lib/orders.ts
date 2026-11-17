import { authFetch } from "@/lib/auth"

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"

export const ORDER_STATUS_OPTIONS: {
  value: OrderStatus
  label: string
}[] = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "SHIPPING", label: "En livraison" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
]

export interface OrderItem {
  id: number
  product: number | null
  product_name: string
  product_price: string
  quantity: number
  subtotal: string
}

export interface Order {
  id: number
  order_number: string
  user: number
  user_email: string
  user_name: string
  status: string
  status_display: string
  total_amount: string
  discount_amount: string
  final_amount: string
  shipping_address: string
  shipping_phone: string
  notes: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

interface PaginatedOrders {
  count: number
  next: string | null
  previous: string | null
  results: Order[]
}

export interface CreateOrderPayload {
  items: { product_id: number; quantity: number }[]
  shipping_address: string
  shipping_phone: string
  notes?: string
  promo_code?: string
}

export async function fetchOrders(): Promise<Order[]> {
  const data = await authFetch<PaginatedOrders | Order[]>("/api/v1/orders/")
  return Array.isArray(data) ? data : data.results ?? []
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return authFetch<Order>("/api/v1/orders/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<Order> {
  return authFetch<Order>(`/api/v1/orders/${orderId}/update_status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export function formatOrderDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatOrderItemsSummary(items: OrderItem[]): string {
  return items
    .map((item) => `${item.quantity}x ${item.product_name}`)
    .join(", ")
}
