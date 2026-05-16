import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { isAuthenticatedPageRequest } from '@/lib/admin/auth';
import type { CategoryConfigItem, HomePageContent } from '@/lib/admin/types';

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState<CategoryConfigItem[]>([]);
  const [homepage, setHomepage] = useState<HomePageContent>({
    en: { quote: '', subtitle: '' },
    ru: { quote: '', subtitle: '' },
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadSettings() {
    setErrorMessage('');

    const [categoriesResponse, homepageResponse] = await Promise.all([
      fetch('/api/admin/settings/categories'),
      fetch('/api/admin/settings/homepage'),
    ]);

    const categoriesPayload = await categoriesResponse.json().catch(() => ({}));
    const homepagePayload = await homepageResponse.json().catch(() => ({}));

    if (categoriesResponse.ok) {
      setCategories((categoriesPayload.categories || []).sort((a: CategoryConfigItem, b: CategoryConfigItem) => a.order - b.order));
    }
    if (homepageResponse.ok) {
      setHomepage(homepagePayload.homepage || homepage);
    }

    if (!categoriesResponse.ok || !homepageResponse.ok) {
      setErrorMessage('Failed to load settings');
    }
  }

  useEffect(() => {
    loadSettings().catch(() => setErrorMessage('Failed to load settings'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveSettings() {
    setSaving(true);
    setStatusMessage('');
    setErrorMessage('');

    const [categoriesResponse, homepageResponse] = await Promise.all([
      fetch('/api/admin/settings/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      }),
      fetch('/api/admin/settings/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homepage }),
      }),
    ]);

    if (!categoriesResponse.ok || !homepageResponse.ok) {
      const categoriesPayload = await categoriesResponse.json().catch(() => ({}));
      const homepagePayload = await homepageResponse.json().catch(() => ({}));
      setErrorMessage(categoriesPayload.error || homepagePayload.error || 'Failed to save settings');
      setSaving(false);
      return;
    }

    setSaving(false);
    setStatusMessage('Settings saved and committed to main branch');
  }

  return (
    <>
      <Head>
        <title>Admin Settings | Product Architecture</title>
      </Head>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">Homepage & Categories</h1>
              <p className="text-sm text-neutral-500 mt-1">Manage title page copy and category order</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/materials" className="text-sm px-3 py-2 border border-neutral-300 rounded-lg hover:bg-white">
                Materials
              </Link>
              <Link href="/admin" className="text-sm px-3 py-2 border border-neutral-300 rounded-lg hover:bg-white">
                Back
              </Link>
            </div>
          </div>

          <section className="bg-white border border-neutral-200 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-medium mb-4">Hero content (title page)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">EN quote</label>
                <textarea
                  rows={4}
                  value={homepage.en.quote}
                  onChange={(event) => setHomepage((prev) => ({ ...prev, en: { ...prev.en, quote: event.target.value } }))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">RU quote</label>
                <textarea
                  rows={4}
                  value={homepage.ru.quote}
                  onChange={(event) => setHomepage((prev) => ({ ...prev, ru: { ...prev.ru, quote: event.target.value } }))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">EN subtitle</label>
                <textarea
                  rows={3}
                  value={homepage.en.subtitle}
                  onChange={(event) => setHomepage((prev) => ({ ...prev, en: { ...prev.en, subtitle: event.target.value } }))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">RU subtitle</label>
                <textarea
                  rows={3}
                  value={homepage.ru.subtitle}
                  onChange={(event) => setHomepage((prev) => ({ ...prev, ru: { ...prev.ru, subtitle: event.target.value } }))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="text-lg font-medium mb-4">Categories</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="pb-2">id</th>
                    <th className="pb-2">Title EN</th>
                    <th className="pb-2">Title RU</th>
                    <th className="pb-2">Order</th>
                    <th className="pb-2">Enabled</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id} className="border-t border-neutral-100">
                      <td className="py-2 pr-2">
                        <input
                          value={category.id}
                          onChange={(event) =>
                            setCategories((prev) =>
                              prev.map((item, i) => (i === index ? { ...item, id: event.target.value } : item))
                            )
                          }
                          className="w-32 rounded border border-neutral-300 px-2 py-1"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={category.title_en}
                          onChange={(event) =>
                            setCategories((prev) =>
                              prev.map((item, i) => (i === index ? { ...item, title_en: event.target.value } : item))
                            )
                          }
                          className="w-full rounded border border-neutral-300 px-2 py-1"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          value={category.title_ru}
                          onChange={(event) =>
                            setCategories((prev) =>
                              prev.map((item, i) => (i === index ? { ...item, title_ru: event.target.value } : item))
                            )
                          }
                          className="w-full rounded border border-neutral-300 px-2 py-1"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          value={category.order}
                          onChange={(event) =>
                            setCategories((prev) =>
                              prev.map((item, i) =>
                                i === index ? { ...item, order: Number(event.target.value) || index + 1 } : item
                              )
                            )
                          }
                          className="w-20 rounded border border-neutral-300 px-2 py-1"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="checkbox"
                          checked={category.enabled}
                          onChange={(event) =>
                            setCategories((prev) =>
                              prev.map((item, i) => (i === index ? { ...item, enabled: event.target.checked } : item))
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save settings'}
            </button>
            {statusMessage ? <span className="text-sm text-green-700">{statusMessage}</span> : null}
            {errorMessage ? <span className="text-sm text-red-700">{errorMessage}</span> : null}
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
