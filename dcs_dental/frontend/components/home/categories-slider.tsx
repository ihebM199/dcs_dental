import Link from "next/link"
import {
  Boxes,
  Brush,
  Microscope,
  Scissors,
  ShieldPlus,
  Sparkles,
  Syringe,
  Stethoscope,
} from "lucide-react"
import { categories } from "@/lib/data"

const icons: Record<string, typeof Boxes> = {
  instruments: Scissors,
  consommables: Boxes,
  prothese: Brush,
  rotatifs: Sparkles,
  hygiene: ShieldPlus,
  imagerie: Microscope,
  anesthesie: Syringe,
  mobilier: Stethoscope,
}

export function CategoriesSlider() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Catégories</h2>
          <p className="text-sm text-muted-foreground">
            Trouvez rapidement ce dont vous avez besoin
          </p>
        </div>
        <Link
          href="/catalogue"
          className="text-sm font-medium text-primary hover:underline"
        >
          Tout voir
        </Link>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-8">
        {categories.map((c) => {
          const Icon = icons[c.slug] ?? Boxes
          return (
            <Link
              key={c.id}
              href={`/catalogue?cat=${c.slug}`}
              className="flex min-w-[110px] flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-6" />
              </span>
              <span className="text-xs font-semibold leading-tight text-foreground">
                {c.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {c.count} produits
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
