"use client"

import { useState } from "react"
import { ShopLayout } from "@/components/shop-layout"
import { faqs } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react"

export default function SupportPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Message envoyé !", {
        description: "Notre équipe de support vous contactera dans les plus brefs délais.",
      })
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }, 1000)
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Centre de Support & Aide
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
            Vous avez des questions sur nos produits, la livraison ou votre commande ? Notre équipe est là pour vous accompagner.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone className="size-5" />
            </div>
            <h3 className="mt-3 font-bold text-foreground">Téléphone</h3>
            <p className="mt-1 text-sm text-muted-foreground">+216 71 000 000</p>
            <p className="text-xs text-muted-foreground mt-0.5">Lun - Ven, 8h30 - 17h30</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <h3 className="mt-3 font-bold text-foreground">Email</h3>
            <p className="mt-1 text-sm text-muted-foreground">support@dcs-store.tn</p>
            <p className="text-xs text-muted-foreground mt-0.5">Réponse en moins de 24h</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageSquare className="size-5" />
            </div>
            <h3 className="mt-3 font-bold text-foreground">Adresse</h3>
            <p className="mt-1 text-sm text-muted-foreground">Centre Urbain Nord, Tunis</p>
            <p className="text-xs text-muted-foreground mt-0.5">Sur rendez-vous uniquement</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* FAQ Accordion */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" /> Questions Fréquentes (FAQ)
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border border-border bg-card px-4 py-1"
                >
                  <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-3">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">Envoyer un message</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="contact-name">Nom complet</Label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email professionnel</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="nom@cabinet.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact-subject">Sujet / Motif</Label>
                <Input
                  id="contact-subject"
                  required
                  placeholder="Ex: Question technique, Livraison..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contact-message">Votre message</Label>
                <Textarea
                  id="contact-message"
                  required
                  placeholder="Expliquez en détail votre demande..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl font-bold pt-1"
              >
                {isSubmitting ? "Envoi..." : "Envoyer la demande"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
