export function resolveLocale(language) {
  const code = String(language || '').toLowerCase();
  if (code === 'fil' || code === 'tl') return 'fil-PH';
  if (code === 'es') return 'es-ES';
  return 'en-US';
}

export function resolveTimeZone(timezone) {
  return timezone || 'Asia/Manila';
}

export function formatDate(value, settings, options = {}) {
  const locale = resolveLocale(settings?.system?.defaultLanguage);
  const timeZone = resolveTimeZone(settings?.system?.timezone);
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
    ...options
  });
}

export function formatNumber(value, settings, options = {}) {
  const locale = resolveLocale(settings?.system?.defaultLanguage);
  return Number(value || 0).toLocaleString(locale, options);
}

export function formatCurrency(value, settings) {
  const locale = resolveLocale(settings?.system?.defaultLanguage);
  const currency = 'PHP';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}
