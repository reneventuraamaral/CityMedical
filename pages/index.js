import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Redireciona para login
  }, []);

  return <p>Redirecionando...</p>;
}

