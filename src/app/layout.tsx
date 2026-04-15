import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio | Creative Developer',
  description: 'High-end scrollytelling personal portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark bg-[#121212] text-white">
      <body className={`${inter.className} min-h-screen bg-[#121212] text-white antialiased selection:bg-white/30`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <SpeedInsights />
      </body>
    </html>
  )
}
