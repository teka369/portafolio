import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Juan David Guarin | Fullstack Developer',
  description: 'Portafolio de Juan David Guarin Romero: desarrollo fullstack con enfoque en backend, APIs, bases de datos, Next.js, Node.js y TypeScript.',
  applicationName: 'Juan David Guarin Romero · Portfolio',
  keywords: ['Juan David Guarin Romero', 'desarrollador fullstack', 'backend', 'Next.js', 'Node.js', 'TypeScript', 'NestJS', 'PostgreSQL', 'portafolio'],
  openGraph: {
    title: 'Juan David Guarin Romero | Desarrollador Fullstack',
    description: 'Proyectos, habilidades y experimentos de desarrollo de software con enfoque en backend y experiencias web.',
    type: 'website',
    locale: 'es_CO',
  },
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      },
    ],
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="portfolio-theme"
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
