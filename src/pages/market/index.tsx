import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MarketIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to English version by default
    router.replace('/market/en');
  }, [router]);

  return null;
}

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: '/market/en',
      permanent: false,
    },
  };
};

