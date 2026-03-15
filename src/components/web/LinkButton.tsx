import type { ReactNode } from 'react'
import { ExternalLinkIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { Button } from '@/components/ui/button'

interface LinkButtonProps {
  href: string
  eventName: string
  children: ReactNode
  className?: string
}

export function LinkButton({ href, eventName, children, className }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent(eventName)}
    >
      <Button variant="outline">
        <span>{children}</span>
        <ExternalLinkIcon />
      </Button>
    </a>
  )
}
