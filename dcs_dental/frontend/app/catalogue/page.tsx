"use client"

import { useSearchParams } from "next/navigation"
import { useState, useMemo, Suspense } from "react"
import { ShopLayout } from "@/components/shop-layout"
import { ProductCard } from "@/components/product-card"
import { products, categories, brands } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"

function CatalogueContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("cat") || ""

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [priceRange, setPriceRange] = useState<number>(10000)

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory
        ? p.category.toLowerCase() === selectedCategory.toLowerCase()
        : true
      const matchBrand = selectedBrand
        ? p.brand.toLowerCase() === selectedBrand.toLowerCase()
        : true
      const matchSearch = searchQuery
        ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      const matchPrice = p.price <= priceRange
      return matchCat && matchBrand && matchSearch && matchPrice
    })
  }, [selectedCategory, selectedBrand, searchQuery, priceRange])

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedBrand("")
    setSearchQuery("")
    setPriceRange(10000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <SlidersHorizontal className="size-4" />
                Filtres
              </h2>
              {(selectedCategory || selectedBrand || searchQuery || priceRange < 10000) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                  Effacer <X className="ml-1 size-3" />
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recherche</label>
              <div className="relative mt-1">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catégories</label>
              <div className="mt-2 flex flex-col gap-1">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    !selectedCategory ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span>Tous les produits</span>
                  <span className="text-xs opacity-75">{products.length}</span>
                </button>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category.toLowerCase() === c.slug.toLowerCase()).length
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                        selectedCategory === c.slug ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-xs opacity-75">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Brands */}
            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marques</label>
              <div className="mt-2 flex flex-col gap-1">
                <button
                  onClick={() => setSelectedBrand("")}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    !selectedBrand ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span>Toutes les marques</span>
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.name)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      selectedBrand.toLowerCase() === b.name.toLowerCase() ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prix Max ({priceRange} TND)
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || "Produits"
                : "Catalogue"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length > 1 ? "produits trouvés" : "produit trouvé"}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">Aucun produit ne correspond à vos critères de recherche.</p>
              <Button onClick={clearFilters} className="mt-4">
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CataloguePage() {
  return (
    <ShopLayout>
      <Suspense fallback={<div className="p-8 text-center">Chargement...</div>}>
        <CatalogueContent />
      </Suspense>
    </ShopLayout>
  )
}
