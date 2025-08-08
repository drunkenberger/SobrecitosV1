import '@testing-library/jest-dom';
import { vi } from 'vitest';

// i18n: ensure config is loaded for components using translations
import './src/i18n/config';

// Suppress noisy console during tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ReactDOM.render is no longer supported') ||
      args[0].includes('No authenticated user') ||
      args[0].includes('Cloud storage is required'))
  ) {
    return;
  }
  originalError(...args);
};

// Provide minimal translations backend stub to avoid network calls in tests
const originalFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : (input as URL).toString();
  if (url.includes('/locales/')) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (originalFetch) {
    return originalFetch(input as any, init);
  }
  throw new Error('fetch not available');
}) as typeof fetch;

// Polyfills for Radix UI + jsdom pointer events
if (typeof (globalThis as any).PointerEvent === 'undefined') {
  (globalThis as any).PointerEvent = class PointerEvent extends Event {} as any;
}

if (!(Element.prototype as any).hasPointerCapture) {
  (Element.prototype as any).hasPointerCapture = () => false;
}

if (!(Element.prototype as any).setPointerCapture) {
  (Element.prototype as any).setPointerCapture = () => {};
}

if (!(Element.prototype as any).releasePointerCapture) {
  (Element.prototype as any).releasePointerCapture = () => {};
}

// Mock Radix-based Select to a simple native <select> to avoid jsdom pointer/portal issues
vi.mock('@/components/ui/select', async () => {
  const React = await import('react');
  const Select = ({ value, onValueChange, children }: any) => (
    React.createElement('select', {
      'aria-label': 'language-select',
      value,
      onChange: (e: any) => onValueChange?.(e.target.value)
    }, children)
  );
  const SelectTrigger = ({ children }: any) => React.createElement(React.Fragment, null, children);
  const SelectContent = ({ children }: any) => React.createElement(React.Fragment, null, children);
  const SelectItem = ({ value, children }: any) => React.createElement('option', { value }, children);
  const SelectValue = ({ placeholder }: any) => React.createElement('span', null, placeholder);
  return { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
});

