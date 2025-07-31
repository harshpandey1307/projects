import { useTranslations } from 'next-intl';
import LanguageSelector from '@/components/LanguageSelector';
import LoginForm from '@/components/LoginForm';

export default function HomePage() {
  const t = useTranslations();

  const handleLogin = (data: any) => {
    console.log('Login successful:', data);
    // Here you would typically redirect to the main store or dashboard
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header with Language Selector */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('app.title')}
            </h1>
            <p className="text-blue-100 text-sm">
              {t('app.welcome')}
            </p>
          </div>
          <LanguageSelector />
        </div>

        {/* Login Card */}
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('login.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('login.subtitle')}
            </p>
          </div>

          <LoginForm onSubmit={handleLogin} />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-blue-100">
            © 2024 Spare Parts Store. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}