"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, RotateCcw, Truck, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

const commitments = [
  { icon: Truck, title: "Livraison gratuite", text: "Rapide partout dans le pays" },
  { icon: Wallet, title: "Paiement à la livraison", text: "Réglez à la réception" },
  { icon: RotateCcw, title: "Retour sous 15 jours", text: "Satisfait ou remboursé" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent-foreground ring-1 ring-accent/40">
            Spécialiste du matériel dentaire & paramédical
          </span>
          <h1 className="mt-4 text-pretty text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Équipez votre cabinet et laboratoire en toute confiance
          </h1>
          <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
            Des instruments aux consommables, découvrez une sélection
            professionnelle certifiée, livrée gratuitement et payable à la
            livraison.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href="/catalogue" />}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Acheter maintenant
              <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/promotions" />}
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Voir les promotions
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-primary-foreground/20"
        >
          <Image
            src="/hero-dental.png"
            alt="Matériel dentaire professionnel"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* commitments banner */}
      <div className="border-t border-primary-foreground/15 bg-primary/60 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-3">
          {commitments.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground ring-1 ring-accent/30">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="text-xs text-primary-foreground/70">{c.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
