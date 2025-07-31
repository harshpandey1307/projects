'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

// Validation schema
const loginSchema = z.object({
  serialNumber: z.string().min(1, 'Serial number is required').min(3, 'Serial number must be at least 3 characters'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  otp: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSendOTP = async () => {
    const { serialNumber, mobileNumber } = getValues();
    
    if (!serialNumber || !mobileNumber) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serialNumber, mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      
      setStep('otp');
      setOtpSent(true);
      setCountdown(30);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Show success message with OTP in development
      if (data.otp && process.env.NODE_ENV === 'development') {
        alert(`${t('messages.otpSent')} - OTP: ${data.otp}`);
      } else {
        alert(t('messages.otpSent'));
      }
    } catch (error: any) {
      alert(error.message || t('messages.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const { serialNumber, mobileNumber } = getValues();
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serialNumber, mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }
      
      setCountdown(30);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Show success message with OTP in development
      if (data.otp && process.env.NODE_ENV === 'development') {
        alert(`${t('messages.otpSent')} - OTP: ${data.otp}`);
      } else {
        alert(t('messages.otpSent'));
      }
    } catch (error: any) {
      alert(error.message || t('messages.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: LoginFormData) => {
    if (step === 'credentials') {
      await handleSendOTP();
    } else {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serialNumber: data.serialNumber,
            mobileNumber: data.mobileNumber,
            otp: data.otp,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to verify OTP');
        }
        
        // Store token in localStorage
        if (responseData.token) {
          localStorage.setItem('auth_token', responseData.token);
        }
        
        alert(t('messages.loginSuccess'));
        onSubmit({ ...data, ...responseData });
      } catch (error: any) {
        alert(error.message || t('messages.error'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {step === 'credentials' && (
        <>
          {/* Serial Number Input */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.serialNumber')}
            </label>
            <input
              {...register('serialNumber')}
              type="text"
              id="serialNumber"
              className="input-field"
              placeholder={t('login.serialPlaceholder')}
            />
            {errors.serialNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>
            )}
          </div>

          {/* Mobile Number Input */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.mobileNumber')}
            </label>
            <input
              {...register('mobileNumber')}
              type="tel"
              id="mobileNumber"
              className="input-field"
              placeholder={t('login.mobilePlaceholder')}
              maxLength={10}
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Sending...</span>
              </div>
            ) : (
              t('login.sendOtp')
            )}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          {/* OTP Input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.verifyOtp')}
            </label>
            <input
              {...register('otp')}
              type="text"
              id="otp"
              className="input-field text-center text-lg tracking-widest"
              placeholder={t('login.otpPlaceholder')}
              maxLength={6}
              autoComplete="one-time-code"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={countdown > 0 || isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400"
            >
              {countdown > 0 ? `${t('login.resendOtp')} (${countdown}s)` : t('login.resendOtp')}
            </button>
          </div>

          {/* Verify OTP Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Verifying...</span>
              </div>
            ) : (
              t('login.login')
            )}
          </button>

          {/* Back to credentials */}
          <button
            type="button"
            onClick={() => setStep('credentials')}
            className="btn-secondary w-full"
          >
            Back
          </button>
        </>
      )}
    </form>
  );
}