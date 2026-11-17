import {
  products as mockProducts,
  categories as mockCategories,
  brands as mockBrands,
  coupons as mockCoupons,
  type Product,
  type Category,
  type Brand,
  type Coupon,
} from "./data"

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://dcs-dental-backend.onrender.com"

/**
 * Format image URL properly.
 * Prepends the backend host if the URL is relative.
 */
export function formatImageUrl(url: string | null): string {
  if (!url) return "/placeholder.svg"
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }
  // Ensure the relative URL starts with a slash
  const cleanUrl = url.startsWith("/") ? url : `/${url}`
  return `${API_URL}${cleanUrl}`
}

/**
 * Maps a backend product object to the frontend Product interface.
 */
export function mapBackendProduct(p: any): Product {
  let brandName = ""
  if (p.brand && typeof p.brand === "object") {
    brandName = p.brand.name || ""
  } else if (p.brand) {
    brandName = String(p.brand)
  }

  let categorySlug = ""
  if (p.category && typeof p.category === "object") {
    categorySlug = p.category.slug || ""
  } else if (p.category) {
    categorySlug = String(p.category)
  } else if (p.category_slug) {
    categorySlug = String(p.category_slug)
  }

  // Handle images
  let imageUrls: string[] = []
  if (p.images && Array.isArray(p.images)) {
    imageUrls = p.images.map((imgObj: any) => formatImageUrl(imgObj.image))
  }

  const mainImage = formatImageUrl(
    p.primary_image || (p.images?.[0]?.image ?? null),
  )
  if (imageUrls.length === 0) {
    imageUrls = [mainImage]
  }

  return {
    id: String(p.id),
    name: p.name || "",
    slug: p.slug || "",
    brand: brandName,
    category: categorySlug,
    price: Number(p.price) || 0,
    oldPrice: p.old_price ? Number(p.old_price) : undefined,
    rating: Number(p.rating) || 0,
    reviewCount: Number(p.review_count) || 0,
    stock: Number(p.stock) || 0,
    stockMax: Number(p.stock_max) || 100,
    image: mainImage,
    images: imageUrls,
    description: p.description || "",
    details: Array.isArray(p.details)
      ? p.details.map((d: any) => ({
          label: d.label || "",
          value: d.value || "",
        }))
      : [],
    isNew: Boolean(p.is_new),
    isPromo: Boolean(p.is_promo),
    isBestSeller: Boolean(p.is_best_seller),
  }
}

/**
 * Maps a backend category object to the frontend Category interface.
 */
export function mapBackendCategory(c: any): Category {
  return {
    id: String(c.id),
    name: c.name || "",
    slug: c.slug || "",
    count: Number(c.product_count) || 0,
  }
}

/**
 * Maps a backend brand object to the frontend Brand interface.
 */
export function mapBackendBrand(b: any): Brand {
  return {
    id: String(b.id),
    name: b.name || "",
  }
}

/**
 * Maps a backend coupon object to the frontend Coupon interface.
 */
export function mapBackendCoupon(c: any): Coupon {
  return {
    code: c.code || "",
    description: c.description || "",
    discountPct: Number(c.discount_percentage) || 0,
    expires: c.expires_at ? c.expires_at.split("T")[0] : "",
  }
}

/* --- API Requests with Fallbacks --- */

export async function fetchProducts(filters?: {
  category?: string
  brand?: string
  search?: string
}): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams()
    if (filters?.category) queryParams.append("category__slug", filters.category)
    if (filters?.brand) queryParams.append("brand__name", filters.brand)
    if (filters?.search) queryParams.append("search", filters.search)

    const url = `${API_URL}/api/v1/products/?${queryParams.toString()}`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch products")

    const data = await res.json()
    const results = Array.isArray(data) ? data : data.results || []
    return results.map(mapBackendProduct)
  } catch (error) {
    console.error("API error fetching products, falling back to mock:", error)
    return mockProducts
  }
}

export async function fetchProductBySlug(slug: string): Promise<(Product & { relatedProductsList?: Product[] }) | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${slug}/`, { cache: "no-store" })
    if (!res.ok) throw new Error("Product not found")

    const data = await res.json()
    const product = mapBackendProduct(data) as any
    if (data.related_products && Array.isArray(data.related_products)) {
      product.relatedProductsList = data.related_products.map(mapBackendProduct)
    }
    return product
  } catch (error) {
    console.error(`API error fetching product ${slug}, falling back to mock:`, error)
    const mock = mockProducts.find((p) => p.slug === slug)
    if (mock) {
      const mockRelated = mockProducts.filter((x) => x.id !== mock.id && x.category === mock.category).slice(0, 4)
      return { ...mock, relatedProductsList: mockRelated }
    }
    return null
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/categories/`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch categories")

    const data = await res.json()
    const results = Array.isArray(data) ? data : data.results || []
    return results.map(mapBackendCategory)
  } catch (error) {
    console.error("API error fetching categories, falling back to mock:", error)
    return mockCategories
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/brands/`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch brands")

    const data = await res.json()
    const results = Array.isArray(data) ? data : data.results || []
    return results.map(mapBackendBrand)
  } catch (error) {
    console.error("API error fetching brands, falling back to mock:", error)
    return mockBrands
  }
}

export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/promotions/`, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch coupons")

    const data = await res.json()
    const results = Array.isArray(data) ? data : data.results || []
    return results.map(mapBackendCoupon)
  } catch (error) {
    console.error("API error fetching coupons, falling back to mock:", error)
    return mockCoupons
  }
}

export async function validateCoupon(code: string): Promise<{
  code: string
  description: string
  discountPct: number
  isValid: boolean
} | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/promotions/validate/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => null)
      const msg = errData?.code?.[0] || errData?.non_field_errors?.[0] || "Code promo invalide"
      throw new Error(msg)
    }

    const data = await res.json()
    return {
      code: data.code,
      description: data.description,
      discountPct: Number(data.discount_percentage) || 0,
      isValid: Boolean(data.is_valid),
    }
  } catch (error: any) {
    console.error("API error validating coupon:", error)
    // Try to find in mock list as fallback
    const mock = mockCoupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase())
    if (mock) {
      return {
        code: mock.code,
        description: mock.description,
        discountPct: mock.discountPct,
        isValid: true,
      }
    }
    throw error // Re-throw the validation error to be displayed in toast
  }
}
