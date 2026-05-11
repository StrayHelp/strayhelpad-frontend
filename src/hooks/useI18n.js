import { useMemo } from 'react';
import { useSettingsContext } from '../context/SettingsContext';
import { normalizeLanguageCode, translate, translateLiteral } from '../utils/translations';

export function useI18n() {
  const { settings } = useSettingsContext();
  const language = normalizeLanguageCode(settings?.system?.defaultLanguage);

  const t = useMemo(() => {
    return (key, fallback) => translate(language, key, fallback);
  }, [language]);

  const tl = useMemo(() => {
    return (text) => translateLiteral(language, text);
  }, [language]);

  return { language, t, tl };
}
