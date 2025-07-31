import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Define supported locales for Indian languages
export const locales = ['en', 'hi', 'mr', 'gu', 'te', 'ta', 'kn', 'ml', 'bn', 'pa'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});