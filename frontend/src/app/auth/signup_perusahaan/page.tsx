'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/hooks/useAuth';
import Logo from '@/app/Images/Ungu__1_-removebg-preview.png';

type MaybeFn<T extends (...args: any[]) => any> = T | undefined;

interface SignupCompanyPayload {
  companyName: string;
  email: string;
  password: string;
  website?: string;
}

interface Auth {
  signup: (name: string, email: string, password: string) => Promise<void>;
  social: (provider: 'google', intent?: 'signup' | 'signin') => Promise<void>;
  signupCompany?: MaybeFn<(payload: SignupCompanyPayload) => Promise<void>>;
}

export default function Page() {
  const t = useTranslations('companySignup');
  const router = useRouter();

  const { signup, social, signupCompany } = useAuth() as Auth;

  // form state
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [website, setWebsite] = useState('');

  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(true);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strong =
    pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw);

  function normalizeUrl(u: string) {
    const v = u.trim();
    if (!v) return '';
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    if (!agree) {
      setError(t('error.agree'));
      return;
    }
    if (pw !== confirm) {
      setError(t('error.mismatch'));
      return;
    }
    if (company.trim().length < 2) {
      setError(t('error.company'));
      return;
    }

    try {
      setBusy(true);
      setError(null);

      const payload: SignupCompanyPayload = {
        companyName: company.trim(),
        email: email.trim(),
        password: pw,
        website: normalizeUrl(website),
      };

      if (typeof signupCompany === 'function') {
        await signupCompany(payload);
      } else {
        await signup(payload.companyName, payload.email, payload.password);
      }

      router.push('/company/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ?? t('error.default');
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[540px]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl">
          {/* Header */}
          <div className="px-6 pt-6 text-center">
            <Image
              src={Logo}
              alt="Company Logo"
              width={100}
              height={100}
              className="mx-auto mb-6 h-20 w-20 object-contain"
              priority
            />
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {t('title')}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{t('subtitle')}</p>
          </div>

          {/* Error box */}
          {error && (
            <div
              className="mx-6 mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="px-6 pb-6 pt-4" noValidate>
            <div className="grid grid-cols-1 gap-4">
              {/* Company */}
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">
                  {t('form.company')}
                </span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  placeholder={t('placeholder.company')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  autoComplete="organization"
                />
              </label>

              {/* Email */}
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">
                  {t('form.email')}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder={t('placeholder.email')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  inputMode="email"
                />
              </label>

              {/* Website */}
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">
                  {t('form.website')}
                </span>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder={t('placeholder.website')}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  inputMode="url"
                  autoComplete="url"
                />
              </label>

              {/* Password */}
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">
                  {t('form.password')}
                </span>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    minLength={8}
                    placeholder={t('placeholder.password')}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-slate-700"
                    tabIndex={-1}
                    aria-label={t('form.togglePw')}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="mt-1 flex items-center gap-2" aria-hidden="true">
                  <div
                    className={`h-1 w-1/3 rounded ${
                      pw.length >= 6 ? 'bg-amber-400' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`h-1 w-1/3 rounded ${
                      pw.length >= 8 ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                  />
                  <div
                    className={`h-1 w-1/3 rounded ${
                      strong ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                </div>
              </label>

              {/* Confirm */}
              <label className="block">
                <span className="mb-1 block text-xs text-slate-600">
                  {t('form.confirm')}
                </span>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder={t('placeholder.confirm')}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500 hover:text-slate-700"
                    tabIndex={-1}
                    aria-label={t('form.toggleConfirm')}
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {confirm.length > 0 && (
                  <p
                    className={`mt-1 text-xs ${
                      pw === confirm ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {pw === confirm ? t('match.ok') : t('match.no')}
                  </p>
                )}
              </label>

              {/* Agree */}
              <label className="mt-1 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-700 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-700 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    {t('creating')}
                  </>
                ) : (
                  t('createBtn')
                )}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              {t('haveAccount')}{' '}
              <Link
                href="/auth/company/signin"
                className="font-medium text-blue-700 hover:underline"
              >
                {t('signIn')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
