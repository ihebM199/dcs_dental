import { fetchBrands } from "@/lib/api"

export async function BrandsStrip() {
  const brands = await fetchBrands()
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Marques partenaires
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="flex h-16 items-center justify-center rounded-xl border border-border bg-card text-base font-bold tracking-tight text-primary shadow-sm"
          >
            {b.name}
          </div>
        ))}
      </div>
    </section>
  )
}
