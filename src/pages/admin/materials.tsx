import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import PostImage, { InlineImage } from '@/components/PostImage';
import { isAuthenticatedPageRequest } from '@/lib/admin/auth';
import type { CategoryConfigItem, ContentLocale, MaterialListItem, PostFrontmatter } from '@/lib/admin/types';
import { normalizeSlug } from '@/lib/admin/slug';

interface EditorState {
  category: string;
  slug: string;
  locale: ContentLocale;
  frontmatter: PostFrontmatter;
  content: string;
}

interface PreviewState {
  frontmatter: PostFrontmatter;
  mdxSource: MDXRemoteSerializeResult;
}

function buildDefaultEditorState(): EditorState {
  const today = new Date().toISOString().slice(0, 10);
  return {
    category: 'articles',
    slug: '',
    locale: 'en',
    frontmatter: {
      title: '',
      date: today,
      excerpt: '',
      tags: [],
      lang: 'en',
      image: null,
      published: true,
    },
    content: '',
  };
}

export default function AdminMaterialsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [materials, setMaterials] = useState<MaterialListItem[]>([]);
  const [categories, setCategories] = useState<CategoryConfigItem[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocale, setFilterLocale] = useState<'all' | ContentLocale>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editor, setEditor] = useState<EditorState>(buildDefaultEditorState);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [previewSignature, setPreviewSignature] = useState('');

  const currentSignature = useMemo(
    () =>
      JSON.stringify({
        category: editor.category,
        slug: normalizeSlug(editor.slug),
        locale: editor.locale,
        frontmatter: editor.frontmatter,
        content: editor.content,
      }),
    [editor]
  );

  const canSave = previewSignature === currentSignature && !saving && !previewLoading;

  async function loadCategories() {
    const response = await fetch('/api/admin/settings/categories');
    if (!response.ok) {
      return;
    }
    const payload = await response.json();
    const sorted = [...(payload.categories || [])].sort((a, b) => a.order - b.order);
    setCategories(sorted);
  }

  async function loadMaterials() {
    setLoading(true);
    setErrorMessage('');
    const params = new URLSearchParams();
    if (filterCategory) params.set('category', filterCategory);
    if (filterLocale !== 'all') params.set('locale', filterLocale);
    if (searchQuery.trim()) params.set('query', searchQuery.trim());

    const response = await fetch(`/api/admin/materials?${params.toString()}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setErrorMessage(payload.error || 'Failed to load materials');
      setLoading(false);
      return;
    }

    setMaterials(payload.materials || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories().catch(() => {
      setCategories([]);
    });
  }, []);

  useEffect(() => {
    loadMaterials().catch(() => {
      setErrorMessage('Failed to load materials');
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterLocale]);

  async function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadMaterials();
  }

  async function loadMaterialForEditing(item: MaterialListItem) {
    setStatusMessage('');
    setErrorMessage('');
    const params = new URLSearchParams({
      category: item.category,
      slug: item.slug,
      locale: item.locale,
    });

    const response = await fetch(`/api/admin/materials/item?${params.toString()}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setErrorMessage(payload.error || 'Failed to open material');
      return;
    }

    setEditor({
      category: payload.material.category,
      slug: payload.material.slug,
      locale: payload.material.locale,
      frontmatter: payload.material.frontmatter,
      content: payload.material.content,
    });
    setPreview(null);
    setPreviewSignature('');
  }

  function createNewMaterial() {
    setEditor(buildDefaultEditorState());
    setPreview(null);
    setPreviewSignature('');
    setStatusMessage('Creating a new draft');
    setErrorMessage('');
  }

  async function runPreview() {
    setPreviewLoading(true);
    setErrorMessage('');
    setStatusMessage('');
    const response = await fetch('/api/admin/materials/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: editor.category,
        slug: editor.slug,
        locale: editor.locale,
        frontmatter: {
          ...editor.frontmatter,
          lang: editor.locale,
          tags: editor.frontmatter.tags,
        },
        content: editor.content,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const joined = Array.isArray(payload.errors) ? payload.errors.join(', ') : payload.error || 'Preview failed';
      setErrorMessage(joined);
      setPreviewLoading(false);
      return;
    }

    setPreview(payload.preview);
    setPreviewSignature(currentSignature);
    setPreviewLoading(false);
    setStatusMessage('Preview is up-to-date. You can save now.');
  }

  async function saveMaterial() {
    setSaving(true);
    setStatusMessage('');
    setErrorMessage('');
    const normalizedSlug = normalizeSlug(editor.slug);

    const response = await fetch('/api/admin/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: editor.category,
        slug: normalizedSlug,
        locale: editor.locale,
        frontmatter: {
          ...editor.frontmatter,
          lang: editor.locale,
        },
        content: editor.content,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setErrorMessage(payload.error || (payload.errors || []).join(', ') || 'Save failed');
      setSaving(false);
      return;
    }

    setEditor((prev) => ({ ...prev, slug: payload.slug || normalizedSlug }));
    setStatusMessage(`Saved to ${payload.path}`);
    setSaving(false);
    await loadMaterials();
  }

  function updateFrontmatter<K extends keyof PostFrontmatter>(key: K, value: PostFrontmatter[K]) {
    setEditor((prev) => ({
      ...prev,
      frontmatter: {
        ...prev.frontmatter,
        [key]: value,
      },
    }));
  }

  return (
    <>
      <Head>
        <title>Admin Materials | Product Architecture</title>
      </Head>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">Materials</h1>
              <p className="text-sm text-neutral-500 mt-1">Preview is required before every save</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/settings" className="text-sm px-3 py-2 border border-neutral-300 rounded-lg hover:bg-white">
                Settings
              </Link>
              <Link href="/admin" className="text-sm px-3 py-2 border border-neutral-300 rounded-lg hover:bg-white">
                Back
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-5 bg-white border border-neutral-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Posts table</h2>
                <button onClick={createNewMaterial} className="text-sm px-3 py-2 rounded-lg bg-neutral-900 text-white">
                  New material
                </button>
              </div>

              <form onSubmit={onSearchSubmit} className="space-y-3 mb-4">
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={filterCategory}
                    onChange={(event) => setFilterCategory(event.target.value)}
                    className="rounded-lg border border-neutral-300 px-2 py-2 text-sm"
                  >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.id}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterLocale}
                    onChange={(event) => setFilterLocale(event.target.value as 'all' | ContentLocale)}
                    className="rounded-lg border border-neutral-300 px-2 py-2 text-sm"
                  >
                    <option value="all">All locales</option>
                    <option value="en">en</option>
                    <option value="ru">ru</option>
                  </select>
                  <button type="submit" className="rounded-lg border border-neutral-300 text-sm hover:bg-neutral-100">
                    Apply
                  </button>
                </div>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search title or slug"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </form>

              <div className="overflow-auto border border-neutral-200 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-100 text-neutral-600">
                    <tr>
                      <th className="text-left px-2 py-2">slug</th>
                      <th className="text-left px-2 py-2">title</th>
                      <th className="text-left px-2 py-2">category</th>
                      <th className="text-left px-2 py-2">lang</th>
                      <th className="text-left px-2 py-2">date</th>
                      <th className="text-left px-2 py-2">status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="px-2 py-3 text-neutral-500" colSpan={6}>
                          Loading...
                        </td>
                      </tr>
                    ) : materials.length === 0 ? (
                      <tr>
                        <td className="px-2 py-3 text-neutral-500" colSpan={6}>
                          No materials
                        </td>
                      </tr>
                    ) : (
                      materials.map((item) => (
                        <tr
                          key={`${item.category}-${item.slug}-${item.locale}`}
                          className="border-t border-neutral-100 cursor-pointer hover:bg-neutral-50"
                          onClick={() => loadMaterialForEditing(item)}
                        >
                          <td className="px-2 py-2">{item.slug}</td>
                          <td className="px-2 py-2 max-w-44 truncate">{item.title}</td>
                          <td className="px-2 py-2">{item.category}</td>
                          <td className="px-2 py-2">{item.locale}</td>
                          <td className="px-2 py-2">{item.date}</td>
                          <td className="px-2 py-2">{item.published ? 'published' : 'draft'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="xl:col-span-7 bg-white border border-neutral-200 rounded-xl p-5">
              <h2 className="text-lg font-medium mb-4">Editor</h2>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Category</label>
                  <select
                    value={editor.category}
                    onChange={(event) => setEditor((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-lg border border-neutral-300 px-2 py-2 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.id}
                      </option>
                    ))}
                    {!categories.length ? <option value="articles">articles</option> : null}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Locale</label>
                  <select
                    value={editor.locale}
                    onChange={(event) => {
                      const locale = event.target.value as ContentLocale;
                      setEditor((prev) => ({
                        ...prev,
                        locale,
                        frontmatter: { ...prev.frontmatter, lang: locale },
                      }));
                    }}
                    className="w-full rounded-lg border border-neutral-300 px-2 py-2 text-sm"
                  >
                    <option value="en">en</option>
                    <option value="ru">ru</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs text-neutral-600 mb-1">Slug</label>
                <input
                  value={editor.slug}
                  onChange={(event) => setEditor((prev) => ({ ...prev, slug: event.target.value }))}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="trust-architecture"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Title</label>
                  <input
                    value={editor.frontmatter.title}
                    onChange={(event) => updateFrontmatter('title', event.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Date</label>
                  <input
                    type="date"
                    value={editor.frontmatter.date}
                    onChange={(event) => updateFrontmatter('date', event.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs text-neutral-600 mb-1">Excerpt</label>
                <input
                  value={editor.frontmatter.excerpt}
                  onChange={(event) => updateFrontmatter('excerpt', event.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Tags (comma separated)</label>
                  <input
                    value={editor.frontmatter.tags.join(', ')}
                    onChange={(event) =>
                      updateFrontmatter(
                        'tags',
                        event.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean)
                      )
                    }
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-600 mb-1">Image URL (optional)</label>
                  <input
                    value={editor.frontmatter.image || ''}
                    onChange={(event) => updateFrontmatter('image', event.target.value || null)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={Boolean(editor.frontmatter.published)}
                    onChange={(event) => updateFrontmatter('published', event.target.checked)}
                  />
                  Published
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-neutral-600 mb-1">Body (MDX)</label>
                <textarea
                  value={editor.content}
                  onChange={(event) => setEditor((prev) => ({ ...prev, content: event.target.value }))}
                  rows={12}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono"
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={runPreview}
                  disabled={previewLoading}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-sm hover:bg-neutral-100 disabled:opacity-60"
                >
                  {previewLoading ? 'Building preview...' : 'Preview'}
                </button>
                <button
                  onClick={saveMaterial}
                  disabled={!canSave}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                {!canSave ? (
                  <span className="text-xs text-amber-700">Preview must match current changes before save</span>
                ) : null}
              </div>

              {statusMessage ? <p className="text-sm text-green-700 mb-2">{statusMessage}</p> : null}
              {errorMessage ? <p className="text-sm text-red-700 mb-2">{errorMessage}</p> : null}

              {preview ? (
                <div className="mt-6 border-t border-neutral-200 pt-4">
                  <h3 className="text-base font-medium text-neutral-900 mb-3">Preview</h3>
                  <p className="text-sm text-neutral-500 mb-1">{preview.frontmatter.date}</p>
                  <h4 className="text-2xl font-light text-neutral-900 mb-2">{preview.frontmatter.title}</h4>
                  <p className="text-sm text-neutral-600 mb-4">{preview.frontmatter.excerpt}</p>
                  <div className="prose-custom">
                    <MDXRemote
                      {...preview.mdxSource}
                      components={{
                        PostImage,
                        InlineImage,
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </section>
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
