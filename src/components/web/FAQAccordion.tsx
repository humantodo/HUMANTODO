import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export interface FAQItem {
  value: string
  title: string
  content: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  defaultOpen?: string[]
  className?: string
}

export function FAQAccordion({ items, defaultOpen = [], className }: FAQAccordionProps) {
  return (
    <Accordion defaultValue={defaultOpen} className={className}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
