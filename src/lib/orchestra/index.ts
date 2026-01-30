type Orchestra = Record<string, gsap.TimelineVars>

const DEFAULT_DELAY = 0.25

export const orchestraNavigation: Orchestra = {
  logo: {
    duration: 0.5,
    delay: DEFAULT_DELAY,
    stagger: 0.05,
    ease: "gentleSlow",
  },
  progressBar: {
    duration: 1,
    ease: "power3.inOut",
  },
  menu: {
    duration: 0.5,
    delay: DEFAULT_DELAY * 2,
    stagger: 0.05,
    ease: "gentleSlow",
  },
  cart: {
    duration: 0.5,
    delay: DEFAULT_DELAY * 3,
    stagger: 0.05,
    ease: "gentleSlow",
  }
}

export const orchestraHomeHero: Orchestra = {
  header: {
    duration: 1,
    delay: 1,
    ease: "gentleSlow",
    stagger: 0.15,
  },
  footer: {
    duration: 1,
    delay: 0.25,
    ease: "gentleSlow",
    stagger: 0.075,
  }
}

export const orchestraMenuOverlay: Orchestra = {
  menuList: {
    delay: DEFAULT_DELAY,
    defaults: { ease:"gentleSlow" }
  },
  topText: {
    duration: 1,
    delay: DEFAULT_DELAY * 2,
    stagger: 0.1,
    ease: "gentleSlow",
  },
  imageStack: {
    delay: DEFAULT_DELAY * 3,
    duration: 1,
  },
  footerTexts: {
    duration: 1.5,
    delay: DEFAULT_DELAY,
    ease: "gentleSlow",
    stagger: 0.05,
  },
  backgroundVideo: {
    delay: DEFAULT_DELAY * 3,
    duration: 1.5,
  }
}

export const orchestraHome: Orchestra = {}
