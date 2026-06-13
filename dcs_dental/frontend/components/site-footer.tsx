import Link from "next/link"
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { categories } from "@/lib/data"

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Votre fournisseur de confiance en matériel dentaire et paramédical
            pour dentistes, prothésistes et étudiants.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-success">
            <ShieldCheck className="size-4" />
            Produits certifiés
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Catégories
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalogue?cat=${c.slug}`}
                  className="hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Informations
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/promotions" className="hover:text-primary">
                Promotions
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-primary">
                Service après-vente
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-primary">
                Suivi de commande
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-primary">
                Espace administrateur
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> +216 70 000 000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-primary" /> contact@dcs-store.tn
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Tunis, Tunisie
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DCS Store. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
