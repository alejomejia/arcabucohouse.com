import { Carousel } from '@/components/from-template/carousel'
import { ThreeItemGrid } from '@/components/from-template/grid/three-items'
import Footer from '@/components/from-template/layout/footer'

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
}

export default function HomePage() {
  return (
    <>
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  )
}
