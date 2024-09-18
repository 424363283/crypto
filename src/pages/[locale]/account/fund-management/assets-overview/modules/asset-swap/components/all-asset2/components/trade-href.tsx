import { useTrHref } from '@/core/i18n';
import { ReactNode } from 'react';

export const TradeHref = ({ href, children }: { href: string; children: (href: string) => ReactNode }) => {
  return <>{children(useTrHref({ href }).pathname)}</>;
};
