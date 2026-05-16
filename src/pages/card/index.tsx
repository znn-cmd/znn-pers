import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CardIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to English version by default
    router.replace('/card/en');
  }, [router]);

  return null;
}

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: '/card/en',
      permanent: false,
    },
  };
};

