import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { isAuthenticatedPageRequest } from '@/lib/admin/auth';

export default function AdminHomePage() {
  async function onLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <>
      <Head>
        <title>Admin | Product Architecture</title>
      </Head>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900">Content Admin</h1>
              <p className="text-neutral-500 mt-1">Manage materials and homepage settings</p>
            </div>
            <button
              onClick={onLogout}
              className="text-sm px-4 py-2 rounded-lg border border-neutral-300 hover:bg-white"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link
              href="/admin/materials"
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 transition-colors"
            >
              <h2 className="text-xl font-medium text-neutral-900 mb-2">Materials</h2>
              <p className="text-sm text-neutral-600">
                Create and edit posts in `articles`, `roasts`, `analytics` for `en/ru`.
              </p>
            </Link>

            <Link
              href="/admin/settings"
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-400 transition-colors"
            >
              <h2 className="text-xl font-medium text-neutral-900 mb-2">Homepage & Categories</h2>
              <p className="text-sm text-neutral-600">
                Update hero content and category order/visibility on homepage.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!isAuthenticatedPageRequest(ctx)) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
};
