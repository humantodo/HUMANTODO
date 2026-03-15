import { useRef } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { trackEvent } from '@/lib/analytics'

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
  const previousOpenItems = useRef(new Set(defaultOpen))

  return (
    <Accordion
      defaultValue={defaultOpen}
      className={className}
      onValueChange={(value) => {
        const nextValues = Array.isArray(value) ? value : value ? [value] : []
        const nextSet = new Set(nextValues)

        nextValues.forEach((itemValue) => {
          if (!previousOpenItems.current.has(itemValue)) {
            const item = items.find((faqItem) => faqItem.value === itemValue)
            trackEvent(`Homepage: FAQ Opened - ${item?.title ?? itemValue}`)
          }
        })

        previousOpenItems.current = nextSet
      }}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
