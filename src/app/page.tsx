import type { Metadata } from "next"


import { Hero } from "./_components/hero"

export const metadata: Metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="min-h-screen bg-neutral-300" />
      <div className="min-h-screen" />
      <div className="min-h-screen bg-neutral-300" />
      <div className="min-h-screen" />
      <div className="min-h-screen bg-neutral-300" />
    </>
  )
}
