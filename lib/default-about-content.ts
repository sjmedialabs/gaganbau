import type { AboutPageContent } from "./types"

export const defaultAboutContent: AboutPageContent = {
  id: "about",
  hero: {
    label: "Our Vision",
    title: "About Excellence",
    subtitle:
      "Driven by a vision to redefine luxury living in Munich, we pursue every project with the same unwavering commitment to quality, sustainability, and community.",
    image: "/images/pursue-hero.jpg",
  },
  vision: {
    label: "Who We Are",
    title: "Built on Vision, Driven by Values",
    points: [
      {
        id: "vp-1",
        icon: "Building2",
        title: "About Us",
        description:
          "Gagan Bau GmbH is a Munich-based premium real estate developer committed to creating residential developments that set new standards in quality, design, and sustainability. Founded on the belief that exceptional living spaces shape exceptional lives, we combine architectural innovation with meticulous craftsmanship to deliver homes that stand the test of time.",
        order: 1,
      },
      {
        id: "vp-2",
        icon: "ShieldCheck",
        title: "Our Promise",
        description:
          "Every project we undertake carries our commitment to transparency, reliability, and uncompromising quality. From the first sketch to the final handover, we maintain the highest standards and keep our partners, investors, and future residents informed at every stage.",
        order: 2,
      },
      {
        id: "vp-3",
        icon: "Handshake",
        title: "Partnerships",
        description:
          "We collaborate with leading architects, interior designers, and construction firms to ensure every development reflects a shared pursuit of excellence. Our network of trusted partners enables us to deliver consistently outstanding results across all our projects.",
        order: 3,
      },
    ],
  },
  mission: {
    quote:
      "We believe that the spaces we create today shape the communities of tomorrow. Every development is a promise of quality, sustainability, and enduring value.",
    caption: "Gagan Bau GmbH Leadership",
  },
  responsibility: {
    label: "Responsibility",
    title: "Sustainable Development",
    intro:
      "Sustainability is not an afterthought at Gagan Bau. It is woven into every decision, from site selection and material sourcing to energy systems and landscaping. We hold ourselves accountable to both current residents and future generations.",
    intro2:
      "Our commitment extends beyond our buildings. We actively support urban greening initiatives, promote biodiversity in our developments, and work with local authorities to create public spaces that benefit entire neighborhoods.",
    image: "/images/pursue-hero.jpg",
    initiatives: [
      {
        id: "si-1",
        icon: "TreePine",
        title: "Green Building Standards",
        description:
          "All new developments target KfW 40 or better energy efficiency ratings, minimizing environmental impact while maximizing resident comfort.",
        order: 1,
      },
      {
        id: "si-2",
        icon: "Zap",
        title: "Renewable Energy",
        description:
          "We integrate photovoltaic systems, heat pumps, and smart energy management into our buildings to reduce carbon footprints and energy costs.",
        order: 2,
      },
      {
        id: "si-3",
        icon: "Droplets",
        title: "Water Conservation",
        description:
          "Rainwater harvesting, greywater recycling, and water-efficient landscaping are standard features across our residential developments.",
        order: 3,
      },
      {
        id: "si-4",
        icon: "Recycle",
        title: "Sustainable Materials",
        description:
          "We prioritize responsibly sourced, recycled, and low-emission building materials to protect both the environment and the health of residents.",
        order: 4,
      },
    ],
  },
  landPurchase: {
    label: "Land Purchase",
    title: "We Are Always Looking for Land",
    intro:
      "Gagan Bau is continuously seeking prime development plots across the Munich metropolitan area. Whether you own a single parcel or a larger site, we offer a straightforward, fair, and confidential process for acquiring land with development potential.",
    intro2:
      "Our experienced acquisitions team evaluates each opportunity with care, considering zoning regulations, neighborhood context, and long-term development potential. We value relationships with landowners and ensure every transaction is transparent and mutually beneficial.",
    lookingFor: [
      "Residential zoning (WA / WR)",
      "Mixed-use development plots",
      "Inner-city infill sites",
      "Plots from 800m² upward",
      "Sites with existing buildings",
      "Suburban growth areas",
    ],
    contactCardTitle: "Get in Touch",
    contactCardDescription:
      "If you have a land opportunity to discuss or would like to learn more about partnering with Gagan Bau, please reach out to our acquisitions team.",
    contactAddress: "Munich, Germany",
    contactPhone: "+49 89 123 456",
    contactEmail: "land@gaganbau.de",
    contactButtonText: "Submit a Land Opportunity",
  },
  cta: {
    label: "Explore Our Work",
    title: "See Our Projects in Action",
    description:
      "From concept to completion, explore our portfolio of premium residential developments across Munich.",
    projectsText: "View All Projects",
    galleryText: "Browse Gallery",
  },
  updatedAt: new Date(),
}
