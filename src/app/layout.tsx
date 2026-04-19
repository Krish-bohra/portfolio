import type { Metadata } from 'next'
import { Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dancing = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing', weight: ['700'] })

export const metadata: Metadata = {
  title: 'Portfolio | Creative Developer',
  description: 'High-end scrollytelling personal portfolio',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark bg-[#121212] text-white">
      <body className={`${inter.variable} ${dancing.variable} ${inter.className} min-h-screen bg-[#121212] text-white antialiased selection:bg-white/30 overflow-x-hidden w-full relative`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <SpeedInsights />
      </body>
    </html>
  )
}
