import { CheckIcon, CopyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { trackEvent } from '@/lib/analytics'

export function CopyButton({ text, eventName }: { text: string; eventName?: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({
    onCopy: () => {
      if (eventName) {
        trackEvent(eventName)
      }
    }
  })

  return (
    <Button variant="outline" size="xs" onClick={() => copyToClipboard(text)}>
      {isCopied ? <CheckIcon /> : <CopyIcon />} {text}
    </Button>
  )
}
