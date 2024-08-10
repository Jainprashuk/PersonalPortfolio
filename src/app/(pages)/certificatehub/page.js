'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReactMinds() {
  const router = useRouter();

  useEffect(() => {
    console.log('Redirecting to cerificate hub component');

    // Perform redirection to the external URL
    window.location.href = 'https://certificate-hub.vercel.app/';
  }, [router]);

  return null; // No UI for this route
}
