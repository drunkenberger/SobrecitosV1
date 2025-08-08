import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('allows selecting a different language', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );

    const select = screen.getByLabelText('language-select');
    fireEvent.change(select, { target: { value: 'es' } });
    await waitFor(() => expect(i18n.language).toContain('es'));
  });
});

