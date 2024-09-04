'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Cypherquiz() {
  const router = useRouter();

  useEffect(() => {
    console.log('Redirecting to code leagalist component');

    // Perform redirection to the external URL
    window.location.href = 'https://cypher-quiz-frontend.vercel.app/';
  }, [router]);

  return null; // No UI for this route
}
