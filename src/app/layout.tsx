
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ParticleBackground } from '@/components/ParticleBackground';
import { HotkeyHint } from '@/components/HotkeyHint';

export const metadata: Metadata = {
  metadataBase: new URL('https://aarushkmalhotra.github.io/'),
  title: "Aarush's Portfolio – Developer Portfolio",
  description: 'A developer portfolio built with Next.js and Tailwind CSS.',
  icons: {
    icon: '/portrait.jpg',
  },
};

const ThemeInitializer = () => {
  const script = `
    (function() {
      function getTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      const theme = getTheme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitializer />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <ParticleBackground intensity="medium" />
          <div className="flex flex-col min-h-screen relative z-10">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
            <ScrollToTop />
            <HotkeyHint />
          </div>
        </Providers>
      </body>
    </html>
  );
}
