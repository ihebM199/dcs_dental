import { Star } from "lucide-react"
import { testimonials } from "@/lib/data"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          Ils nous font confiance
        </h2>
        <p className="text-sm text-muted-foreground">
          Avis de professionnels et étudiants
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < t.rating
                      ? "size-4 fill-warning text-warning"
                      : "size-4 text-muted"
                  }
                />
              ))}
            </div>
            <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
              {`"${t.text}"`}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-secondary text-xs font-semibold text-primary">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
