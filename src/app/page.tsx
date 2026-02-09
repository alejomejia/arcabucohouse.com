import type { Metadata } from "next"

import { HeroSection } from "./_components/hero"

export const metadata: Metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="min-h-screen bg-neutral-300" />
      <div className="min-h-screen" />
    </>
  )
}
