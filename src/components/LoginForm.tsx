'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { sendOtpToEmail, verifyOtpCode } from '@/lib/authService';
import { IconMail, IconShieldCheck } from '@tabler/icons-react';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();


  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const error = await sendOtpToEmail(email);
    setIsLoading(false);
    if (error) {
      setMessage('Failed to send code.');
    } else {
      setMessage('Check your email for the 6-digit code.');
      setStep('code');
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const error = await verifyOtpCode(email, code);
    setIsLoading(false);
    if (error) {
      setMessage('Invalid code.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-10 sm:p-12 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-black font-sans">
            Start your journey
          </h1>
          <p className="mt-2 text-gray-700 text-sm">
            Sign in with your email to continue
          </p>
        </div>
  
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-0 focus:border-black text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : (
                <>
                  <IconMail size={20} />
                  Send Code
                </>
              )}
            </button>
          </form>
        )}
  
        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Verification Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-0 focus:border-black text-black"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : (
              <>
                <IconShieldCheck size={20} />
                Verify Code
              </>
            )}
            </button>
          </form>
        )}
  
        {message && (
          <p className="text-center text-green-700 font-medium text-sm">{message}</p>
        )}
      </div>
    </div>
  );
  
}
