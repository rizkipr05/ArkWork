'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// ✅ Import logo sebagai modul statis dari src/app/Images
// Pastikan nama file & path persis (case-sensitive)
import ArkLogo from '@/app/Images/Ungu__1_-removebg-preview.png';

export default function SignIn() {
  const router = useRouter();
  const { signin, social } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState<'google' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signin(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSocialGoogle() {
    if (loading) return;
    setLoading('google');
    setError(null);
    try {
      await social('google', 'login');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google.');
    } finally {
      setLoading(null);
    }
  }

  function useDemo() {
    setEmail('demo@arkwork.com');
    setPassword('demo123');
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
          {/* Header + Logo */}
          <div className="px-6 pt-6 text-center">
            <Image
              src={ArkLogo}
              alt="ArkWork Logo"
              width={100}
              height={100}
              className="mx-auto mb-30 h-50 w-50 object-contain"
              priority
            />
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Sign in to ArkWork
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Demo helper */}
          <div className="mx-6 mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-blue-900">Demo Account</div>
                <div className="mt-1 space-y-0.5 text-blue-800/90">
                  <div>
                    <span className="opacity-70">Email:</span> demo@arkwork.com
                  </div>
                  <div>
                    <span className="opacity-70">Password:</span> demo123
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={useDemo}
                className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Use Demo
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">Password</span>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-slate-700"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  Remember me
                </label>
                <a className="text-sm font-medium text-blue-700 hover:underline" href="#">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="h-[1px] flex-1 bg-slate-200" />
              <span className="px-3 text-xs uppercase tracking-wider text-slate-400">or</span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </div>

            {/* Google only */}
            <button
              onClick={handleSocialGoogle}
              disabled={!!loading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              {loading === 'google' ? (
                <span className="inline-flex items-center">
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  Connecting…
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <i className="fa-brands fa-google mr-2" />
                  Continue with Google
                </span>
              )}
            </button>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-700 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
