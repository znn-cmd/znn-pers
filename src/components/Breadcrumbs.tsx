import Link from 'next/link';
import { useRouter } from 'next/router';
import { getTranslations } from '@/lib/i18n';

interface BreadcrumbsProps {
  items?: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter();
  const { locale } = router;
  const t = getTranslations(locale || 'en');

  const breadcrumbs = items || [
    { label: t.nav.home, href: '/' },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-neutral-500">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-neutral-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}


