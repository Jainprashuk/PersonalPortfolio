import Head from 'next/head';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JainPrashuk',
  description:
    'Third-year engineering student at Lovely Professional University in Punjab, passionate about becoming a full-stack developer. Eager to learn, apply skills to real projects, and a strong team player.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="google-site-verification" content="mXc67d_o5hrbfn1Nh3NakAYEHeurLQTnPaTzP9fCo-g" />
        
        {/* You can add more metadata here like OpenGraph tags, Twitter cards, etc. */}
      </Head>

      

      <body className={inter.className}>{children}</body>
    </html>
  );  
}
