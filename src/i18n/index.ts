/**
 * Agape — i18n entry point.
 *
 * Components import `useTranslations` and `detectLocale` from here,
 * not from `./messages` directly. This indirection gives us a single
 * import path to change if we ever swap catalogs (e.g., move to a
 * content-collection-driven catalog).
 */

export {
  detectLocale,
  useTranslations,
  t,
  MESSAGES,
  DEFAULT_LOCALE,
} from './messages';

export type { Locale } from './messages';
