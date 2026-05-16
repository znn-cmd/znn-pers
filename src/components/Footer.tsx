import Link from 'next/link';
import { motion } from 'framer-motion';

interface FooterProps {
  t: any;
}

export default function Footer({ t }: FooterProps) {
  const socialLinks = [
    { name: 'Telegram', href: 'https://t.me/nnzaitsev', icon: 'T' },
    { name: 'Instagram', href: 'https://www.instagram.com/zaitsevnn/', icon: 'I' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/zaitsevn/', icon: 'L' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="border-t border-neutral-200 mt-24"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-sm text-neutral-500">
            {t.footer.copyright}
          </p>

          <div className="flex items-center space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                aria-label={link.name}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

