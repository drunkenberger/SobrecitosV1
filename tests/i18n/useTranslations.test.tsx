import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { useTranslations } from '@/hooks/useTranslations';

function wrapper({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

describe('useTranslations', () => {
  it('changes language', async () => {
    const { result } = renderHook(() => useTranslations(), { wrapper });
    expect(result.current.currentLanguage).toBeDefined();
    await act(async () => {
      await result.current.changeLanguage('es');
    });
    expect(i18n.language).toContain('es');
  });
});

