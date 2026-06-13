"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground sm:px-10">
        <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-accent/20 ring-1 ring-accent/40">
          <Mail className="size-6 text-accent-foreground" />
        </span>
        <h2 className="text-balance text-xl font-bold sm:text-2xl">
          Recevez nos offres et nouveautés
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-primary-foreground/80">
          Inscrivez-vous à la newsletter pour ne manquer aucune promotion sur le
          matériel dentaire et paramédical.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!email) return
            toast.success("Inscription confirmée", {
              description: "Merci, vous recevrez bientôt nos offres.",
            })
            setEmail("")
          }}
          className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            aria-label="Adresse e-mail"
            className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60"
          />
          <Button
            type="submit"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            S&apos;inscrire
          </Button>
        </form>
      </div>
    </section>
  )
}
