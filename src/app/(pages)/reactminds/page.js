'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReactMinds() {
  const router = useRouter();

  useEffect(() => {
    console.log('Redirecting to React Minds component');

    // Perform redirection to the external URL
    window.location.href = 'https://react-minds.vercel.app/';
  }, [router]);

  return null; // No UI for this route
}
