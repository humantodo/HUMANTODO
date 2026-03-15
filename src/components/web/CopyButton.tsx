import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function CopyButton({ text }: { text: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button variant="outline" size="xs" onClick={() => copyToClipboard(text)}>
      {isCopied ? <CheckIcon /> : <CopyIcon />} {text}
    </Button>
  );
}
