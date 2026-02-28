import React from "react"
import type { Metadata } from "next"
import { Jost, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import { getHomePageContent } from "@/lib/content-store"
import "./globals.css"

/** Use Node.js runtime so Firebase Admin and data fetching work (Edge would 500). */
export const runtime = "nodejs"

// Jost for headings and body text
const jost = Jost({ 
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600", "700"],
});

// Cormorant Garamond for elegant banner/hero titles (replaces Aurallia)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
});

const defaultMetadata: Metadata = {
  title: 'Gagan Bau GmbH - Rising With Vision',
  description: 'Luxury living where comfort meets timeless style. Discover premium residential developments by Gagan Bau GmbH.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getHomePageContent()
    const seo = content?.seo
    const favicon = (seo?.favicon ?? '').trim()
    if (!favicon) return defaultMetadata
    return {
      ...defaultMetadata,
      icons: { icon: favicon, apple: favicon },
    }
  } catch {
    return defaultMetadata
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.variable} ${cormorant.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
