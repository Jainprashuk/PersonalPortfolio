import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://jainprashuk.in'),
  title: {
    default: 'Prashuk Jain | Full Stack Developer',
    template: '%s | Prashuk Jain',
  },
  description:
    'Official portfolio of Prashuk Jain – Full Stack Developer skilled in MERN, Next.js, Angular, and scalable web applications. Passionate about building impactful digital experiences.',
  keywords: [
    'Prashuk Jain',
    'Full Stack Developer',
    'MERN Developer',
    'React Developer',
    'Next.js Developer',
    'Angular Developer',
    'Node.js Developer',
    'Portfolio',
    'Frontend Developer',
    'Backend Developer',
  ],
  authors: [{ name: 'Prashuk Jain' }],
  creator: 'Prashuk Jain',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://jainprashuk.in',
  },
  openGraph: {
    title: 'Prashuk Jain | Full Stack Developer',
    description:
      'Explore the portfolio of Prashuk Jain – Full Stack Developer building scalable web applications with modern technologies.',
    url: 'https://jainprashuk.in',
    siteName: 'Prashuk Jain Portfolio',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prashuk Jain | Full Stack Developer',
    description:
      'Full Stack Developer specializing in MERN, Next.js & Angular.',
  },
  verification: {
    google: 'mXc67d_o5hrbfn1Nh3NakAYEHeurLQTnPaTzP9fCo-g',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vos366gwob");
          `}
        </Script>

        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
