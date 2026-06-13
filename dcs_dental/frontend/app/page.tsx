import { ShopLayout } from "@/components/shop-layout"
import { Hero } from "@/components/home/hero"
import { CategoriesSlider } from "@/components/home/categories-slider"
import { ProductSection } from "@/components/home/product-section"
import { StockAlerts } from "@/components/home/stock-alerts"
import { Testimonials } from "@/components/home/testimonials"
import { BrandsStrip } from "@/components/home/brands-strip"
import { FaqSection } from "@/components/home/faq-section"
import { Newsletter } from "@/components/home/newsletter"
import { fetchProducts } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const products = await fetchProducts()
  const bestSellers = products.filter((p) => p.isBestSeller)
  const promos = products.filter((p) => p.isPromo)
  const newArrivals = products.filter((p) => p.isNew)

  return (
    <ShopLayout>
      <Hero />
      <CategoriesSlider />
      <ProductSection
        title="Meilleures ventes"
        subtitle="Les produits préférés des professionnels"
        products={bestSellers}
        href="/catalogue"
      />
      <ProductSection
        title="Promotions"
        subtitle="Offres à durée limitée"
        products={promos}
        href="/promotions"
        accent
      />
      <ProductSection
        title="Nouveautés"
        subtitle="Les dernières arrivées en stock"
        products={newArrivals}
        href="/catalogue"
      />
      <StockAlerts />
      <Testimonials />
      <BrandsStrip />
      <FaqSection />
      <Newsletter />
    </ShopLayout>
  )
}
