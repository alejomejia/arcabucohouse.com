import type { Metadata } from "next"

import { HeroSection } from "./_components/hero"
import { SpotlightSection } from "./_components/spotlight"

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
      <SpotlightSection />
      <div className="min-h-screen bg-neutral-300" />
      <div className="min-h-screen" />
      <div className="min-h-screen bg-neutral-300" />
      <div className="min-h-screen" />
      <div className="min-h-screen bg-neutral-300" />
    </>
  )
}
