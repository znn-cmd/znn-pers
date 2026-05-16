import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';

interface HeaderProps {
  t: any;
}

export default function Header({ t }: HeaderProps) {
  const router = useRouter();
  const { locale, asPath } = router;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    router.push(asPath, asPath, { locale: newLocale });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Logo />

          <button
            onClick={switchLocale}
            className="text-sm font-normal hover:opacity-60 transition-opacity"
            aria-label="Switch language"
          >
            {locale === 'en' ? 'RU' : 'EN'}
          </button>
        </div>
      </nav>
    </motion.header>
  );
}

