import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// VD: "Sep 15, 2026" — dùng chung cho mọi nơi hiển thị publish date.
export function formatDate(iso: string | null, fallback = '') {
  if (!iso) return fallback;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
