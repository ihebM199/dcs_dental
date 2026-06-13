"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon, Search, ShoppingCart, Sun, User } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { useTheme } from "@/components/theme-provider"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/promotions", label: "Promotions" },
  { href: "/support", label: "Support" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { count } = useCart()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* top utility bar */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs">
          <p>Livraison gratuite et rapide • Paiement à la livraison</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:underline">
              Mon compte
            </Link>
            <Link href="/support" className="hover:underline">
              Aide
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        {/* mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
                aria-label="Ouvrir le menu"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>
                <BrandLogo />
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col gap-1 px-4 pb-6">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                    pathname === l.href && "bg-secondary text-primary",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-border pt-3">
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Catégories
                </p>
                {categories.slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    href={`/catalogue?cat=${c.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" aria-label="DCS Accueil" className="shrink-0">
          <BrandLogo />
        </Link>

        {/* desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname === l.href && "bg-secondary text-primary",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* search - desktop */}
        <div className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit, une marque…"
              className="pl-9"
              aria-label="Rechercher"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Changer le thème"
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
          <Button
            render={<Link href="/login" />}
            variant="ghost"
            size="icon"
            aria-label="Mon compte"
            className="hidden sm:inline-flex"
          >
            <User className="size-5" />
          </Button>
          <Button
            render={<Link href="/checkout" />}
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={`Panier, ${count} articles`}
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full bg-accent p-0 text-[10px] text-accent-foreground">
                {count}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* mobile search */}
      <div className="border-t border-border/60 px-4 py-2 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit…"
            className="h-10 pl-9"
            aria-label="Rechercher"
          />
        </div>
      </div>
    </header>
  )
}
