import type { Language } from '../i18n/config';

const CV_PDF: Record<Language, string> = {
  de: '/CV-RobertStickler-DE.pdf',
  en: '/CV-RobertStickler-EN.pdf',
};

/**
 * Opens the print-optimized CV in a new tab and triggers the print dialog.
 * Falls back to the prebuilt PDF when the popup is blocked.
 */
export function downloadCV(lang: Language): void {
  const colorScheme = document.documentElement.getAttribute('data-color-scheme') || 'green';
  const printWindow = window.open(`/cv-a4.html?color=${colorScheme}&lang=${lang}`, '_blank');

  if (!printWindow) {
    window.location.href = CV_PDF[lang];
    return;
  }

  printWindow.addEventListener('load', () => {
    setTimeout(() => printWindow.print(), 300);
  });
}
