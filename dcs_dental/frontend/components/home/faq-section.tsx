import { faqs } from "@/lib/data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold sm:text-2xl">Questions fréquentes</h2>
        <p className="text-sm text-muted-foreground">
          Tout ce que vous devez savoir avant de commander
        </p>
      </div>
      <Accordion openMultiple={false} className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm font-semibold">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
