import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { CartProvider } from '@/components/cart-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'DCS Store — Matériel dentaire & paramédical',
    template: '%s | DCS Store',
  },
  description:
    "Boutique en ligne de matériel dentaire et paramédical pour dentistes, prothésistes et étudiants. Livraison gratuite, paiement à la livraison et retour sous 15 jours.",
  keywords: [
    'matériel dentaire',
    'paramédical',
    'prothèse dentaire',
    'instruments dentaires',
    'DCS',
  ],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1b2d' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${manrope.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster position="top-center" richColors />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
