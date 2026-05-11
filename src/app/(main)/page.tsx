import type { Metadata } from "next";

import { AboutArcabucoSection } from "./_components/about-arcabuco";
import { HeroSection } from "./_components/hero";
import { InteriorShowcaseSection } from "./_components/interior-showcase";

// TODO(seo): Validate the description copy with marketing — current draft
//   covers what we sell, audience, and the handcrafted/Latin-American
//   differentiator. Replace if a tighter line is approved.
// TODO(seo): Add `openGraph.images` once a 1200×630 social card is produced
//   (target path: /public/og-image.jpg). Once added, also set
//   `twitter.site` to the brand handle.
export const metadata: Metadata = {
  description:
    'Discover handcrafted home décor and artisan goods from Latin America. Curated rugs, lighting, furniture, and decorative objects made by skilled Latin American artisans. Shop Arcabuco House.',
  openGraph: {
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutArcabucoSection />
      <InteriorShowcaseSection />
      {/* <ArtisansCollabSection /> */}
      {/* @TODO: [X] Projects section */}
      {/* @TODO: Why Arcabuco section */}
      {/* @TODO: LatinAmerican Design section */}
    </>
  )
}
