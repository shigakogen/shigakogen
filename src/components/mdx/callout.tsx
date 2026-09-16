import { AlertTriangle, Info, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
} as const;

type CalloutType = keyof typeof ICONS;

export function Callout({ type = 'info', children }: { type?: CalloutType; children: ReactNode }) {
  const Icon = ICONS[type];

  return (
    <div className="bg-surface border-border my-6 flex gap-3 rounded-lg border p-4">
      <Icon className="text-accent-strong mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
    </div>
  );
}
