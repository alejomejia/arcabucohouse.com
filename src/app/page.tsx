import type { Metadata } from "next";

import { AboutArcabucoSection } from "./_components/about-arcabuco";
import { ArtisansCollabSection } from "./_components/artisans-collab";
import { HeroSection } from "./_components/hero";
import { InteriorShowcaseSection } from "./_components/interior-showcase";

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
      <AboutArcabucoSection />
      <InteriorShowcaseSection />
      <ArtisansCollabSection />
      {/* @TODO: [X] Projects section */}
      {/* @TODO: Why Arcabuco section */}
      {/* @TODO: LatinAmerican Design section */}
    </>
  )
}
