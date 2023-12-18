import Head from 'next/head';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JainPrashuk',
  description:
    'Welcome to JainPrashuk homepage. Discover more about my journey in engineering and development. i am Third-year engineering student at Lovely Professional University in Punjab, passionate about becoming a full-stack developer. Eager to learn, apply skills to real projects, and a strong team player.',
  keywords: ['engineering student', 
  'full-stack developer', 
  'Lovely Professional University', 
  'prashuk jain', 
  'jain prashuk', 
  'ieeecislpu', 
  'chegg expert', 
  'prashuk jain lpu', 
  'front end developer', 
  'lpu', 
  'codeleagalis', 
  'jsminds', 
  'team player',],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta name="google-site-verification" content="mXc67d_o5hrbfn1Nh3NakAYEHeurLQTnPaTzP9fCo-g" />
        <meta property="og:title" content={metadata.title} />
        <link rel="canonical" href="https://jainprashuk.in"/>
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content="https://jainprashuk.in" />
        <meta name="author" content="JainPrashuk" />
        <meta name="robots" content="index, follow"/>

      </Head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
