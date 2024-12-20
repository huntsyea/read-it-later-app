import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const WORDS_PER_MINUTE = 200;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateReadingTime(content: string): number {
  if (!content) return 0;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / WORDS_PER_MINUTE);
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;

  // Remove potentially dangerous elements and attributes
  const dangerous = div.querySelectorAll('script, iframe, object, embed, form');
  dangerous.forEach(el => el.remove());

  // Remove dangerous attributes
  const elements = div.getElementsByTagName('*');
  for (const el of elements) {
    const attrs = el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if (attr.name.startsWith('on') || // Remove event handlers
          (attr.name === 'href' && attr.value.startsWith('javascript:'))) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return div.innerHTML;
}