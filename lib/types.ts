// Home Page Content Types
export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
  order: number
  isActive: boolean
}

export interface ConceptSection {
  label: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundImage?: string
}

export interface ProjectSlide {
  id: string
  label: string
  title: string
  description: string
  buttonText: string
  buttonLink: string
  images: string[]
  order: number
  isActive: boolean
}

export interface WhyChooseItem {
  id: string
  icon: string
  iconImage?: string // Uploaded icon image URL
  title: string
  description: string
  order: number
}

export interface WhyChooseSection {
  label: string
  title: string
  image: string
  items: WhyChooseItem[]
}

export interface PressItem {
  id: string
  date: string
  title: string
  link: string
  order: number
  isActive: boolean
}

export interface PressSection {
  label: string
  title: string
  viewAllLink: string
  items: PressItem[]
}

/** Blog post (managed in admin, shown on /blog and homepage blog section). */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  featured: boolean
  order: number
  isActive: boolean
}

/** Homepage blog section config (items come from blog store). */
export interface BlogSectionConfig {
  label: string
  title: string
  viewAllLink: string
}

/** Blog page hero (tagline, title, description, background image). */
export interface BlogPageHero {
  tagline: string
  title: string
  description: string
  backgroundImage: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

/** One social link in the footer: custom label, URL, and optional icon image. */
export interface SocialItem {
  label: string
  url: string
  /** Icon image URL. If empty, only the link is shown (no image, avoids broken icon). */
  icon: string
}

export interface FooterContent {
  logo: string
  companyName: string
  address: string
  phone: string
  email: string
  columns: FooterColumn[]
  /** Custom social links: label, URL, and optional icon per item. Rendered only when URL is set; icon shown only when set. */
  socialItems?: SocialItem[]
  socialIcons?: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
  copyright: string
}

export interface HeaderNav {
  label: string
  href: string
  /** When false, item is hidden from the header. Default true. */
  enabled?: boolean
  children?: { label: string; href: string }[]
}

export interface HeaderContent {
  logo: string
  navigation: HeaderNav[]
  languages: { code: string; label: string }[]
}

export type CarouselAnimation = 
  | "fade" 
  | "slide" 
  | "zoom" 
  | "flip" 
  | "kenburns"      // Slow zoom/pan cinematic effect
  | "blur"          // Blur transition
  | "cube"          // 3D cube rotation
  | "cards"         // Stacked cards effect
  | "vertical"      // Vertical slide
  | "creative"      // Scale + rotate combination
  | "parallax"      // Parallax depth effect
  | "shutters"      // Venetian blinds effect

export interface CarouselSettings {
  heroAnimation: CarouselAnimation
  projectsAnimation: CarouselAnimation
  autoPlaySpeed: number // in milliseconds
}

export interface HomePageContent {
  id: string
  header: HeaderContent
  heroSlides: HeroSlide[]
  concept: ConceptSection
  projects: ProjectSlide[]
  whyChoose: WhyChooseSection
  /** Blog section on homepage (items fetched from blog store). */
  blog: BlogSectionConfig
  footer: FooterContent
  seo: SEOData
  carouselSettings?: CarouselSettings
  updatedAt: Date
}

// About page content (editable from admin)
export interface AboutVisionPoint {
  id: string
  icon: string // lucide icon name
  title: string
  description: string
  order: number
}

export interface AboutSustainabilityItem {
  id: string
  icon: string
  title: string
  description: string
  order: number
}

export interface AboutPageContent {
  id: string
  hero: {
    label: string
    title: string
    subtitle: string
    image?: string
  }
  vision: {
    label: string
    title: string
    points: AboutVisionPoint[]
  }
  mission: {
    quote: string
    caption: string
  }
  responsibility: {
    label: string
    title: string
    intro: string
    intro2: string
    image?: string
    initiatives: AboutSustainabilityItem[]
  }
  landPurchase: {
    label: string
    title: string
    intro: string
    intro2: string
    lookingFor: string[]
    contactCardTitle: string
    contactCardDescription: string
    contactAddress: string
    contactPhone: string
    contactEmail: string
    contactButtonText: string
  }
  cta: {
    label: string
    title: string
    description: string
    projectsText: string
    galleryText: string
  }
  updatedAt: Date
}

export interface SEOData {
  metaTitle: string
  metaDescription: string
  ogImage: string
  canonicalUrl: string
  noIndex: boolean
  /** Favicon URL (optional). When set, used as site icon in browser tab. */
  favicon?: string
}

// CRM Types
export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  message: string
  pageSource: string
  status: "new" | "contacted" | "closed"
  /** Property of interest (e.g. "Linden Park", "Skyline Towers") */
  propertyInterest?: string
  /** Preferred date/time for visit (ISO string or display string) */
  scheduledVisit?: string
  createdAt: Date
  updatedAt: Date
}

// Admin User
export interface AdminUser {
  uid: string
  email: string
  displayName: string
  role: "admin" | "editor"
}

// Property Types
export type PropertyCategory = "on-sale" | "in-planning" | "reference"

export type PropertyStatus = "ready-for-occupancy" | "sold-out" | "under-construction" | "coming-soon"

export interface PropertyExpert {
  id: string
  name: string
  role: string
  image: string
}

export interface ConstructionPhase {
  id: string
  title: string
  /** Multiple images per plan. When saving, always use images[]. Legacy: image (single) is normalized to images on read. */
  images?: string[]
  /** @deprecated Use images[] instead. Normalized to images when present. */
  image?: string
  description?: string
}

export interface PropertySpecification {
  rooms: string
  livingArea: string
  purchasePrice: string
  availability: string[]
  address: string
}

/** Single spec item for hero bar (max 5) or key specs section (unlimited). */
export interface PropertySpecItem {
  id: string
  /** Lucide icon name (fallback when iconImage is not set) */
  icon?: string
  /** Uploaded icon/image URL (used in admin and on website when set) */
  iconImage?: string
  title: string
  description: string
}

export interface PropertyAmenity {
  id: string
  name: string
  icon: string // lucide icon name
}

export interface Property {
  id: string
  slug: string
  category: PropertyCategory
  status: PropertyStatus
  
  // Hero Section
  heroImage: string
  heroTitle: string // Location label e.g., "MILBERTSHOFEN - AT THE HEART"
  heroSubtitle: string // Project name e.g., "LINDEN.PARK"
  
  // Project Info
  projectLogo: string
  projectName: string
  projectTagline: string // e.g., "MILBERTSHOFEN | AM HART"
  
  // Content
  subtitle: string // e.g., "Condominiums in Milbertshofen - Am Hart"
  specialFeaturesTitle: string
  specialFeatures: string[]
  
  // Video Section
  videoUrl?: string // YouTube or video embed URL
  videoDescription?: string // Decorative text shown beside the video
  
  // Amenities
  amenities?: PropertyAmenity[]
  
  // Living Description
  livingTitle: string
  livingDescription: string
  livingDescriptionExtended?: string
  
  // Specifications (legacy: address etc. for Location)
  specifications: PropertySpecification

  // Hero specifications (below hero bar, max 5 items: icon, title, description)
  heroSpecifications?: PropertySpecItem[]

  // Key Specifications (below amenities, unlimited: icon, title, description)
  keySpecifications?: PropertySpecItem[]

  // Construction Phases
  constructionPhasesTitle: string
  constructionPhases: ConstructionPhase[]
  
  // Location
  locationTitle: string
  locationHighlights: string[]
  locationDescription: string
  mapEmbedUrl?: string
  
  // Experts
  expertsTitle: string
  expertsSubtitle: string
  expertsDescription: string
  expertsButtonText: string
  expertsButtonLink: string
  experts: PropertyExpert[]
  
  // Consultation
  consultationTitle: string
  consultationPhone: string
  consultationEmail: string
  consultationDisclaimer?: string
  
  // Gallery Images
  galleryImages: string[]
  
  // SEO
  metaTitle: string
  metaDescription: string
  
  // Status
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

// Gallery Types
export interface GalleryAlbum {
  id: string
  propertyId: string
  propertyName: string
  coverImage: string
  images: GalleryImage[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GalleryImage {
  id: string
  url: string
  caption?: string
  order: number
}

// Properties Store Content
export interface PropertiesContent {
  properties: Property[]
  galleryAlbums: GalleryAlbum[]
  updatedAt: Date
}
