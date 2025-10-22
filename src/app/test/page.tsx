import { TextAnimation } from '@/components/text-animation'

export default function TestPage() {
  return (
    <>
      <nav className="">
        <div id="col">
          <div id="subcol">
            <span>Greyloom</span>
          </div>
          <div id="subcol">
            <span>Home</span>
            <span>Projects</span>
            <span>About</span>
            <span>Lab</span>
          </div>
        </div>
        <div id="col">
          <span>Let's talk</span>
        </div>
      </nav>

      <section id="hero" className="min-h-screen bg-neutral-500">
        <div id="hero-img"></div>
        <div id="header">
          <TextAnimation type="words" stagger={0.1}>
            <h1 className="text-9xl font-bold">We craft identities and experiences for the bold.</h1>
          </TextAnimation>
        </div>
      </section>

      <section id="about" className="min-h-screen bg-neutral-500">
        <span>Design & Strategy for the Vision-Driven</span>

        <div id="header">
          <TextAnimation type="words" stagger={0.15} ease="bouncy">
            <h1>
              We partner with founders, innovators, and change-makers to shape brands that resonate. From first lines of
              code to global launches, we bring focus, elegance, and intent to every stage.
            </h1>
          </TextAnimation>
        </div>
      </section>

      <section id="about-image" className="min-h-screen bg-neutral-500">
        <div className="text-center">
          <TextAnimation type="chars" stagger={0.05} duration="slow" ease="elastic">
            <h2 className="text-4xl font-bold">Typewriter Effect</h2>
          </TextAnimation>
        </div>
      </section>
    </>
  )
}
