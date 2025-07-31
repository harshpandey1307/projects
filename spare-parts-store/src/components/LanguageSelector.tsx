'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronDownIcon, GlobeIcon } from '@heroicons/react/24/outline';
import { locales } from '@/i18n';

const languageNames = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  gu: 'ગુજરાતી',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  bn: 'বাংলা',
  pa: 'ਪੰਜਾਬੀ'
};

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');

  const currentLocale = pathname.split('/')[1] || 'en';

  const switchLanguage = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <GlobeIcon className="w-5 h-5" />
        <span>{languageNames[currentLocale as keyof typeof languageNames]}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <div className="py-1" role="menu">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentLocale === locale ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                role="menuitem"
              >
                {languageNames[locale as keyof typeof languageNames]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}