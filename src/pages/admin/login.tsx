import { FormEvent, useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { isAuthenticatedPageRequest } from '@/lib/admin/auth';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || 'Login failed');
      setLoading(false);
      return;
    }

    window.location.href = '/admin';
  }

  return (
    <>
      <Head>
        <title>Admin Login | Product Architecture</title>
      </Head>
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Admin Panel</h1>
          <p className="text-sm text-neutral-500 mb-6">Sign in with the admin password</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-700"
                autoComplete="current-password"
                required
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (isAuthenticatedPageRequest(ctx)) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
