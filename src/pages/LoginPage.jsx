import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import strayHelpLogo from '../assets/StrayHelp-Logo-2.png';
import api from '../services/api';
import { useI18n } from '../hooks/useI18n';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t, tl } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('super-admin');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatAdminName = (value) => {
    if (!value) return tl('Admin User');
    const namePart = value.split('@')[0] || value;
    return namePart
      .replace(/[._-]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim();

      const response = await api.post('/auth/login', {
        email: normalizedEmail,
        password
      });

      const user = response.data?.user || {};
      const token = response.data?.token;
      const backendRole = String(user.role || '').toLowerCase();
      const normalizedRole =
        backendRole === 'it_admin'
          ? 'it-admin'
          : backendRole === 'super_admin' || backendRole === 'admin'
            ? 'super-admin'
            : '';

      if (!token || !normalizedRole) {
        setError(tl('This account cannot access the admin portal.'));
        return;
      }

      if (normalizedRole !== role) {
        const readableRole = normalizedRole === 'it-admin' ? 'IT Admin' : 'Super Admin';
        setError(`This account is ${readableRole}. Select the correct role.`);
        return;
      }

      window.localStorage.setItem('authToken', token);
      window.localStorage.setItem('adminName', user.name || formatAdminName(user.email || normalizedEmail));
      window.localStorage.setItem('adminEmail', user.email || normalizedEmail);
      window.localStorage.setItem('adminRole', normalizedRole);

      const redirectPath = normalizedRole === 'it-admin' ? '/it-admin/dashboard' : '/dashboard';
      navigate(redirectPath);
    } catch (loginError) {
      setError(loginError.response?.data?.message || loginError.message || tl('Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fafaf8] via-[#f4f6f2] to-[#f8f8f4] lg:flex">
      <section className="flex min-h-[34vh] w-full items-center justify-center px-6 py-10 sm:px-10 lg:min-h-screen lg:w-1/2 lg:px-16">
        <div className="w-full max-w-xl">
          <div className="mb-12 flex flex-col items-start gap-4">
            <img
              src={strayHelpLogo}
              alt="StrayHelp logo"
              className="h-16 w-auto max-w-none object-contain sm:h-20 lg:h-24"
            />
            <p className="text-sm uppercase tracking-[0.35em] text-[#77806d]">{t('adminPortal', 'Admin Portal')}</p>
          </div>

          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-[#77806d] sm:text-5xl">
            {tl('Efficiently Manage Organizations, Donations, and Reports')}
          </h2>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#77806d] sm:text-lg">
            {tl('StrayHelp Admin Portal helps streamline organization management, track donations, monitor rescue reports, and support better care for stray animals.')}
          </p>
        </div>
      </section>

      <section className="flex min-h-[66vh] w-full items-center justify-center px-6 py-10 sm:px-10 lg:min-h-screen lg:w-1/2 lg:px-16">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,#77806d_0%,#66715b_100%)] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)] sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-white/10" />

          <div className="relative z-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/85">
                  {t('secureAdminAccess', 'Secure Admin Access')}
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">{t('login', 'Login')}</h1>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">{tl('Sign in to your StrayHelp admin account.')}</p>
              </div>
              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:flex">
                ⌘
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-white">{t('role', 'Admin Role')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('super-admin')}
                    className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                      role === 'super-admin'
                        ? 'border-white bg-white/20 text-white'
                        : 'border-white/20 bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    {tl('Super Admin')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('it-admin')}
                    className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                      role === 'it-admin'
                        ? 'border-white bg-white/20 text-white'
                        : 'border-white/20 bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    {tl('IT Admin')}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">{t('emailAddress', 'Email Address')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tl('Enter your email address')}
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-[#333333] shadow-[0_1px_0_rgba(255,255,255,0.65)_inset] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/35"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">{t('password', 'Password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tl('Enter your password')}
                  className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-sm text-[#333333] shadow-[0_1px_0_rgba(255,255,255,0.65)_inset] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/35"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#77806d] shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition duration-200 hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.14)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? t('signingIn', 'Signing in…') : t('signIn', 'Sign In')}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-white/80">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-black">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span>{tl('Protected login for authorized staff only.')}</span>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};