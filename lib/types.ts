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

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterContent {
  logo: string
  companyName: string
  address: string
  phone: string
  email: string
  columns: FooterColumn[]
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
  press: PressSection
  footer: FooterContent
  seo: SEOData
  carouselSettings?: CarouselSettings
  updatedAt: Date
}

export interface SEOData {
  metaTitle: string
  metaDescription: string
  ogImage: string
  canonicalUrl: string
  noIndex: boolean
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
  image: string
  description?: string
}

export interface PropertySpecification {
  rooms: string // e.g., "1.5 - 4 Zimmer"
  livingArea: string // e.g., "approx. 34 - 111 m²"
  purchasePrice: string // e.g., "369,000 € - 1,179,000 €"
  availability: string[] // e.g., ["1. BA: ready for occupancy, sold out", "2. BA: est. Q1 2027"]
  address: string
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
  
  // Specifications
  specifications: PropertySpecification
  
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
