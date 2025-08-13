'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const { signup, social } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(true);

  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // minimal password check
  const strong =
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) {
      setError('Please agree to the Terms & Privacy.');
      return;
    }
    if (pw !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signup(name.trim(), email.trim(), pw);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to sign up. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    try {
      setGoogleBusy(true);
      setError(null);
      await social('google', 'signup');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Failed to continue with Google.');
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[480px]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
          {/* Header */}
          <div className="px-6 pt-6 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 shadow" />
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Create your ArkWork account
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              It’s fast and free. Start your energy career journey.
            </p>
          </div>

          {/* Error box */}
          {error && (
            <div className="mx-6 mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="px-6 pb-6 pt-4">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">Full Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">Password</span>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 8 chars, mix Aa1"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    autoComplete="new-password"
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
                {/* strength hint */}
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className={`h-1 w-1/3 rounded ${pw.length >= 6 ? 'bg-amber-400' : 'bg-slate-200'}`}
                  />
                  <div
                    className={`h-1 w-1/3 rounded ${pw.length >= 8 ? 'bg-amber-500' : 'bg-slate-200'}`}
                  />
                  <div
                    className={`h-1 w-1/3 rounded ${strong ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">Confirm Password</span>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="Re-enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-slate-700"
                    tabIndex={-1}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirm.length > 0 && (
                  <p
                    className={`mt-1 text-xs ${
                      pw === confirm ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {pw === confirm ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </label>

              <label className="mt-1 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                I agree to the{' '}
                <a href="#" className="text-blue-700 hover:underline">
                  Terms
                </a>{' '}
                &{' '}
                <a href="#" className="text-blue-700 hover:underline">
                  Privacy
                </a>
                .
              </label>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    Creating account…
                  </>
                ) : (
                  'Create Account'
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
              type="button"
              onClick={onGoogle}
              disabled={googleBusy}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              {googleBusy ? (
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

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-blue-700 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
