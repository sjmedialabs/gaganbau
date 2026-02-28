import type { HomePageContent } from "./types"

export const defaultHomeContent: HomePageContent = {
  id: "home",
  header: {
    logo: "/images/logo.png",
    navigation: [
      { label: "Projects", href: "/projects", enabled: true },
      { label: "About", href: "/about", enabled: true },
      { label: "Gallery", href: "/gallery", enabled: true },
      { label: "Blog", href: "/blog", enabled: true },
      { label: "Contact", href: "/contact", enabled: true },
    ],
    languages: [
      { code: "EN", label: "English" },
      { code: "DE", label: "Deutsch" },
    ],
  },
  heroSlides: [
    {
      id: "hero-1",
      title: "Rising With Vision",
      subtitle: "Your Next Level of Living",
      buttonText: "Discover More",
      buttonLink: "/projects",
      backgroundImage: "/images/hero-bg.png",
      order: 1,
      isActive: true,
    },
    {
      id: "hero-2",
      title: "Building Dreams",
      subtitle: "Creating Tomorrow's Landmarks",
      buttonText: "Explore Now",
      buttonLink: "/projects",
      backgroundImage: "/images/project-1.png",
      order: 2,
      isActive: true,
    },
    {
      id: "hero-3",
      title: "Excellence in Design",
      subtitle: "Where Innovation Meets Elegance",
      buttonText: "Learn More",
      buttonLink: "/about",
      backgroundImage: "/images/project-2.png",
      order: 3,
      isActive: true,
    },
  ],
  concept: {
    label: "OUR CONCEPT",
    title: "Luxury living where comfort meets timeless style, effortlessly",
    description:
      "Silverstein Properties presents Brooklyn Tower, the borough's only supertall. Boldly designed by SHoP with artfully crafted interiors by Gachot, Brooklyn Tower offers studio-to-four bedroom luxury condominium residences. Immediate occupancy available.",
    buttonText: "Know More",
    buttonLink: "/about",
    backgroundImage: "/images/concept-bg.jpg",
  },
  projects: [
    {
      id: "project-1",
      label: "OUR CONCURRENT PROJECTS",
      title: "ReHomes\nThe Butterfly",
      description:
        "Sprawling across 9 acres, the most spacious, densely green residential development.",
      buttonText: "Explore More",
      buttonLink: "/projects/rehomes-butterfly",
      images: ["/images/project-showcase.png", "/images/project-2.png", "/images/project-3.png"],
      order: 1,
      isActive: true,
    },
    {
      id: "project-2",
      label: "OUR CONCURRENT PROJECTS",
      title: "The Grand\nResidence",
      description:
        "A masterpiece of modern architecture with premium amenities and sustainable design.",
      buttonText: "Explore More",
      buttonLink: "/projects/grand-residence",
      images: ["/images/project-4.png", "/images/project-5.png", "/images/project-1.png"],
      order: 2,
      isActive: true,
    },
    {
      id: "project-3",
      label: "OUR CONCURRENT PROJECTS",
      title: "Skyline\nTowers",
      description:
        "Redefining urban living with panoramic views and world-class facilities.",
      buttonText: "Explore More",
      buttonLink: "/projects/skyline-towers",
      images: ["/images/project-2.png", "/images/project-3.png", "/images/project-4.png"],
      order: 3,
      isActive: true,
    },
  ],
  whyChoose: {
    label: "Why Choose",
    title: "Bringing Vision, Value,\nand Luxury Together",
    image: "/images/why-choose.png",
    items: [
      {
        id: "item-1",
        icon: "experience",
        title: "EXPERIENCE\nDECADES",
        description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        order: 1,
      },
      {
        id: "item-2",
        icon: "satisfaction",
        title: "SATISFACTION\nRATE",
        description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        order: 2,
      },
      {
        id: "item-3",
        icon: "projects",
        title: "PROJECTS\nSUCCESS",
        description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        order: 3,
      },
      {
        id: "item-4",
        icon: "decades",
        title: "EXPERIENCE\nDECADES",
        description: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        order: 4,
      },
    ],
  },
  blog: {
    label: "Blog",
    title: "Insights and stories from the world of premium real estate.",
    viewAllLink: "/blog",
  },
  footer: {
    logo: "/images/logo.png",
    companyName: "Gagan Bau\nGmbH",
    address: "CONCEPT BAU GmbH\nHans-Cornelius-Str. 4",
    phone: "+49 (0) 89 123 456 78",
    email: "www.info@conceptbau.de",
    columns: [
      {
        title: "Quick Links",
        links: [
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "Career", href: "/career" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Projects",
        links: [
          { label: "On-going", href: "/projects?status=ongoing" },
          { label: "Completed", href: "/projects?status=completed" },
          { label: "Upcoming", href: "/projects?status=upcoming" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Responsibility", href: "/responsibility" },
          { label: "Land purchase", href: "/land-purchase" },
        ],
      },
    ],
    socialLinks: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
    copyright: "©Gaganbaugmbh - ALL RIGHTS RESERVED",
  },
  seo: {
    metaTitle: "Gagan Bau GmbH - Rising With Vision",
    metaDescription:
      "Luxury living where comfort meets timeless style. Discover premium residential developments by Gagan Bau GmbH.",
    ogImage: "/images/hero-bg.png",
    canonicalUrl: "https://gaganbau.de",
    noIndex: false,
    favicon: "",
  },
  carouselSettings: {
    heroAnimation: "fade",
    projectsAnimation: "fade",
    autoPlaySpeed: 6000,
  },
  updatedAt: new Date(),
}
