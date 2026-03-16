'use client'

import { CinemaScroll, type MarqueeImage } from '@/components/effects/cinema-scroll'

const MARQUEE_IMAGES: MarqueeImage[] = [
  { src: '/cinema-scroll/img-1.jpg', alt: 'Arcabuco landscape 1' },
  { src: '/cinema-scroll/img-2.jpg', alt: 'Arcabuco landscape 2' },
  { src: '/cinema-scroll/img-3.jpg', alt: 'Arcabuco landscape 3' },
  { src: '/cinema-scroll/img-4.jpg', alt: 'Arcabuco landscape 4' },
  { src: '/cinema-scroll/img-5.jpg', alt: 'Arcabuco landscape 5' },
  { src: '/cinema-scroll/img-6.jpg', alt: 'Arcabuco landscape 6' },
  { src: '/cinema-scroll/img-7.jpg', alt: 'Arcabuco landscape 7' },
  { src: '/cinema-scroll/img-8.jpg', alt: 'Arcabuco landscape 8' },
  { src: '/cinema-scroll/img-9.jpg', alt: 'Arcabuco landscape 9' },
  { src: '/cinema-scroll/img-10.jpg', alt: 'Arcabuco landscape 10' },
  { src: '/cinema-scroll/img-11.jpg', alt: 'Arcabuco landscape 11' },
  { src: '/cinema-scroll/img-12.jpg', alt: 'Arcabuco landscape 12' },
  { src: '/cinema-scroll/img-13.jpg', alt: 'Arcabuco landscape 13' },
]

export function ArtisansCollabSection() {
  return (
    <CinemaScroll>
      <CinemaScroll.Marquee images={MARQUEE_IMAGES} pinImageIndex={6} />
      <CinemaScroll.Panels>
        <CinemaScroll.Panel>
          <CinemaScroll.Panel.Content>
            <p className="w-3/4 text-[2.25rem] font-medium leading-snug tracking-tight max-[1000px]:w-full max-[1000px]:text-2xl">
              A landscape in constant transition, where every shape, sound, and shadow refuses to
              stay still. What seems stable begins to dissolve, and what fades returns again in a
              new form.
            </p>
          </CinemaScroll.Panel.Content>
          <CinemaScroll.Panel.Image
            src="/cinema-scroll/slide-1.jpg"
            alt="Arcabuco landscape slide 1"
          />
        </CinemaScroll.Panel>
        <CinemaScroll.Panel>
          <CinemaScroll.Panel.Content>
            <p className="w-3/4 text-[2.25rem] font-medium leading-snug tracking-tight max-[1000px]:w-full max-[1000px]:text-2xl">
              The rhythm of motion carries us forward into spaces that feel familiar yet remain
              undefined. Each shift is subtle, yet together they remind us that nothing we see is
              ever permanent.
            </p>
          </CinemaScroll.Panel.Content>
          <CinemaScroll.Panel.Image
            src="/cinema-scroll/slide-2.jpg"
            alt="Arcabuco landscape slide 2"
          />
        </CinemaScroll.Panel>
      </CinemaScroll.Panels>
    </CinemaScroll>
  )
}
