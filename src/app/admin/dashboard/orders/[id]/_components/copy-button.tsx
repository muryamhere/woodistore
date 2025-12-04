// This is a new file src/app/admin/dashboard/orders/[id]/_components/copy-button.tsx
'use client';

import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CopyButton({ textToCopy }: { textToCopy: string }) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied!',
      description: 'The ID has been copied to your clipboard.',
    });
  };

  return (
    <Copy
      className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
      onClick={handleCopy}
    />
  );
}
