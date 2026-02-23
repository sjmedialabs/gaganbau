import { NextResponse } from "next/server"
import { put, list, del } from "@vercel/blob"
import type { Property, GalleryAlbum, PropertiesContent } from "@/lib/types"

const CONTENT_FILE = "content/home-page.json"
const PROPERTIES_FILE = "content/properties.json"

// Placeholder images from Unsplash for real estate
const PLACEHOLDER_IMAGES = {
  logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=100&fit=crop&auto=format",
  heroBg: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1080&fit=crop&auto=format",
  project1: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&auto=format",
  project2: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&auto=format",
  project3: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&auto=format",
  project4: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&auto=format",
  project5: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&auto=format",
  whyChoose: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop&auto=format",
  conceptBg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&auto=format",
  showcase: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format",
  user1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format",
  user2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format",
  interior1: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop&auto=format",
  interior2: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop&auto=format",
  exterior1: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop&auto=format",
  exterior2: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop&auto=format",
}

const uploadedUrls = {
  "images/logo.png": PLACEHOLDER_IMAGES.logo,
  "images/hero-bg.png": PLACEHOLDER_IMAGES.heroBg,
  "images/project-1.png": PLACEHOLDER_IMAGES.project1,
  "images/project-2.png": PLACEHOLDER_IMAGES.project2,
  "images/project-3.png": PLACEHOLDER_IMAGES.project3,
  "images/project-4.png": PLACEHOLDER_IMAGES.project4,
  "images/project-5.png": PLACEHOLDER_IMAGES.project5,
  "images/why-choose.png": PLACEHOLDER_IMAGES.whyChoose,
  "icons/facebook.png": PLACEHOLDER_IMAGES.user1,
  "icons/twitter.png": PLACEHOLDER_IMAGES.user2,
  "icons/instagram.png": PLACEHOLDER_IMAGES.user1,
  "icons/youtube.png": PLACEHOLDER_IMAGES.user2,
  "images/placeholder-user.jpg": PLACEHOLDER_IMAGES.user1,
}

export async function POST() {
  try {
    // Check existing blobs
    const { blobs: existingBlobs } = await list()
    
    // Create content with blob URLs
    const homeContent = {
      id: "home",
      header: {
        logo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        navigation: [
          { label: "Projects", href: "/projects" },
          { label: "Pursue", href: "/pursue" },
          { label: "Gallery", href: "/gallery" },
          { label: "Blog", href: "/blog" },
          { label: "Career", href: "/career" },
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
          backgroundImage: uploadedUrls["images/hero-bg.png"] || "/images/hero-bg.png",
          order: 1,
          isActive: true,
        },
        {
          id: "hero-2",
          title: "Building Dreams",
          subtitle: "Creating Tomorrow's Landmarks",
          buttonText: "Explore Now",
          buttonLink: "/projects",
          backgroundImage: uploadedUrls["images/project-1.png"] || "/images/project-1.png",
          order: 2,
          isActive: true,
        },
        {
          id: "hero-3",
          title: "Excellence in Design",
          subtitle: "Where Innovation Meets Elegance",
          buttonText: "Learn More",
          buttonLink: "/about",
          backgroundImage: uploadedUrls["images/project-2.png"] || "/images/project-2.png",
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
      },
      projects: [
        {
          id: "project-1",
          label: "OUR CONCURRENT PROJECTS(3D)",
          title: "ReHomes\nThe Butterfly",
          description:
            "Sprawling across 9 acres, the most spacious, densely green residential development.",
          buttonText: "Explore More",
          buttonLink: "/projects/rehomes-butterfly",
          images: [
            uploadedUrls["images/project-1.png"] || "/images/project-1.png",
            uploadedUrls["images/project-2.png"] || "/images/project-2.png",
            uploadedUrls["images/project-3.png"] || "/images/project-3.png",
          ],
          order: 1,
          isActive: true,
        },
        {
          id: "project-2",
          label: "OUR CONCURRENT PROJECTS(3D)",
          title: "The Grand\nResidence",
          description:
            "A masterpiece of modern architecture with premium amenities and sustainable design.",
          buttonText: "Explore More",
          buttonLink: "/projects/grand-residence",
          images: [
            uploadedUrls["images/project-4.png"] || "/images/project-4.png",
            uploadedUrls["images/project-5.png"] || "/images/project-5.png",
            uploadedUrls["images/project-1.png"] || "/images/project-1.png",
          ],
          order: 2,
          isActive: true,
        },
        {
          id: "project-3",
          label: "OUR CONCURRENT PROJECTS(3D)",
          title: "Skyline\nTowers",
          description:
            "Redefining urban living with panoramic views and world-class facilities.",
          buttonText: "Explore More",
          buttonLink: "/projects/skyline-towers",
          images: [
            uploadedUrls["images/project-2.png"] || "/images/project-2.png",
            uploadedUrls["images/project-3.png"] || "/images/project-3.png",
            uploadedUrls["images/project-4.png"] || "/images/project-4.png",
          ],
          order: 3,
          isActive: true,
        },
      ],
      whyChoose: {
        label: "Why Choose",
        title: "Bringing Vision, Value,\nand Luxury Together",
        image: uploadedUrls["images/why-choose.png"] || "/images/why-choose.png",
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
      press: {
        label: "Press Release",
        title: "Expert tips and insights for your property.",
        viewAllLink: "/press",
        items: [
          {
            id: "press-1",
            date: "January 20, 2026",
            title: "PRESS: 'PACIFIC SOUL' BY JAUME PLENSA AT PACIFIC GATE BY BOSA",
            link: "/press/pacific-soul",
            order: 1,
            isActive: true,
          },
          {
            id: "press-2",
            date: "December 29, 2025",
            title: "PRESS: 'PACIFIC GATE KOHN PEDERSEN FOX ASSOCIATES",
            link: "/press/pacific-gate",
            order: 2,
            isActive: true,
          },
          {
            id: "press-3",
            date: "December 10, 2025",
            title: "PRESS: PENTHOUSES RISE OVER THE PACIFIC",
            link: "/press/penthouses-pacific",
            order: 3,
            isActive: true,
          },
        ],
      },
      footer: {
        logo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        companyName: "Gagan Bau\nGmbH",
        address: "CONCEPT BAU GmbH\nHans-Cornelius-Str. 4",
        phone: "+49 (0) 89 123 456 78",
        email: "www.info@conceptbau.de",
        socialIcons: {
          facebook: uploadedUrls["icons/facebook.png"] || "/icons/facebook.png",
          twitter: uploadedUrls["icons/twitter.png"] || "/icons/twitter.png",
          instagram: uploadedUrls["icons/instagram.png"] || "/icons/instagram.png",
          youtube: uploadedUrls["icons/youtube.png"] || "/icons/youtube.png",
        },
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
            title: "Pursue",
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
        ogImage: uploadedUrls["images/hero-bg.png"] || "/images/hero-bg.png",
        canonicalUrl: "https://gaganbau.de",
        noIndex: false,
      },
      updatedAt: new Date().toISOString(),
    }
    
    // Create comprehensive properties data
    const properties: Property[] = [
      {
        id: "prop-1",
        slug: "linden-park",
        category: "on-sale",
        status: "ready-for-occupancy",
        heroImage: uploadedUrls["images/project-1.png"] || "/images/project-1.png",
        heroTitle: "MILBERTSHOFEN - AT THE HEART",
        heroSubtitle: "LINDEN.PARK",
        projectLogo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        projectName: "linden.park",
        projectTagline: "MILBERTSHOFEN | AM HART",
        subtitle: "Condominiums in Milbertshofen - Am Hart",
        specialFeaturesTitle: "Special features",
        specialFeatures: [
          "Close to nature, family-friendly and for sports enthusiasts",
          "Modern energy-efficient construction",
          "Underground parking available",
          "Private balconies and terraces"
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        videoDescription: "Take a walk with us through the land of joy, exploring spaces that bring premium living, comfort, and safety together.",
        amenities: [
          { id: "am-1", name: "Swimming Pool", icon: "Waves" },
          { id: "am-2", name: "Fitness Center", icon: "Dumbbell" },
          { id: "am-3", name: "Children Play Area", icon: "Baby" },
          { id: "am-4", name: "Landscaped Gardens", icon: "Trees" },
          { id: "am-5", name: "Underground Parking", icon: "Car" },
          { id: "am-6", name: "24/7 Security", icon: "ShieldCheck" },
          { id: "am-7", name: "Pet Zone", icon: "Dog" },
          { id: "am-8", name: "Cycling Track", icon: "Bike" },
        ],
        livingTitle: "Living near the Panzerwiese nature reserve",
        livingDescription: "Experience unmatched urban living nestled on one side, vibrant city life on the other. Your new home, where linden park (originally Am Riesenfeld) - a neighborhood community representing an attractive and picturesque place to live - like two mid-rise buildings are surrounded by a large green space with children's play area and communal gardens.",
        livingDescriptionExtended: "The modern residential complex is located on a quiet residential street in the Milbertshofen-Am Hart district - a neighborhood that is increasingly emerging from its industrial worker and field community into an attractive, modern neighborhood and continues to grow in popularity - where it stands out for its location's natural landscape of green space and the wonderful Viktoria Park Park, just above 100m to the Olympic Park, Schwabing, the Isar meadows, and the city center.",
        specifications: {
          rooms: "1.5 - 4 Zimmer",
          livingArea: "approx. 34 - 111 m²",
          purchasePrice: "369,000 € - 1,179,000 €",
          availability: ["1. BA: ready for occupancy, sold out", "2. BA: est. Q1 2027"],
          address: "Marbachstrasse 26, 80937 Munich"
        },
        constructionPhasesTitle: "ALL CONSTRUCTION PHASES",
        constructionPhases: [
          {
            id: "phase-1",
            title: "Exterior view of construction phase 2",
            image: uploadedUrls["images/project-2.png"] || "/images/project-2.png",
            description: "Modern facade with premium materials"
          },
          {
            id: "phase-2",
            title: "Exterior view of construction phase 2",
            image: uploadedUrls["images/project-3.png"] || "/images/project-3.png",
            description: "Landscaped gardens and pathways"
          },
          {
            id: "phase-3",
            title: "Exterior view of construction phase 2",
            image: uploadedUrls["images/project-4.png"] || "/images/project-4.png",
            description: "Community spaces and amenities"
          }
        ],
        locationTitle: "THE LOCATION",
        locationHighlights: [
          "Vast, protected natural landscapes on one side, vibrant big-city life on the other.",
          "Your new home in linden.park offers these advantages."
        ],
        locationDescription: "This modern residential complex is located on a quiet residential street in the Milbertshofen-Am Hart district - a neighborhood that is increasingly emerging from its industrial worker and field community into an attractive, modern neighborhood and continues to grow in popularity.",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2661.5!2d11.5683!3d48.1951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDExJzQyLjQiTiAxMcKwMzQnMDUuOSJF!5e0!3m2!1sen!2sde!4v1234567890",
        expertsTitle: "OUR EXPERTS ARE HERE FOR YOU",
        expertsSubtitle: "We would be happy to provide you with personal information and advice on the condominiums for the new construction project linden.park in Milbertshofen-Am Hart.",
        expertsDescription: "Our experienced team is ready to guide you through every step of the purchasing process.",
        expertsButtonText: "MAKE CONTACT",
        expertsButtonLink: "/contact",
        experts: [
          {
            id: "expert-1",
            name: "Friederike Muller-Bartholme",
            role: "Independent Sales Partner",
            image: uploadedUrls["images/placeholder-user.jpg"] || "/placeholder-user.jpg"
          },
          {
            id: "expert-2",
            name: "Natalie Kritcher",
            role: "Self Employed Sales Partner",
            image: uploadedUrls["images/placeholder-user.jpg"] || "/placeholder-user.jpg"
          }
        ],
        consultationTitle: "SCHEDULE A PERSONAL CONSULTATION APPOINTMENT",
        consultationPhone: "089 710 409 96",
        consultationEmail: "lindenpark@conceptbau.de",
        consultationDisclaimer: "CONCEPT BAU GmbH sales division is not a broker for us for the purpose of transmitting a request for a property. If registration occurs, sales division is entitled to a commission.",
        galleryImages: [
          uploadedUrls["images/project-1.png"] || "/images/project-1.png",
          uploadedUrls["images/project-2.png"] || "/images/project-2.png",
          uploadedUrls["images/project-3.png"] || "/images/project-3.png"
        ],
        metaTitle: "Linden Park - Premium Condominiums in Munich",
        metaDescription: "Discover luxury condominiums at Linden Park in Milbertshofen-Am Hart, Munich. 1.5 to 4 rooms, modern design, excellent location.",
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prop-2",
        slug: "skyline-towers",
        category: "on-sale",
        status: "under-construction",
        heroImage: uploadedUrls["images/project-2.png"] || "/images/project-2.png",
        heroTitle: "SCHWABING - URBAN ELEGANCE",
        heroSubtitle: "SKYLINE.TOWERS",
        projectLogo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        projectName: "Skyline Towers",
        projectTagline: "SCHWABING | MUNICH",
        subtitle: "Luxury Apartments in Schwabing",
        specialFeaturesTitle: "Special features",
        specialFeatures: [
          "Panoramic city views from every unit",
          "Rooftop infinity pool and wellness area",
          "24/7 concierge service",
          "Direct access to English Garden"
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        videoDescription: "Discover the art of elevated living where every detail is crafted to perfection, offering breathtaking views and world-class amenities.",
        amenities: [
          { id: "am-1", name: "Rooftop Pool", icon: "Waves" },
          { id: "am-2", name: "Spa & Wellness", icon: "Heart" },
          { id: "am-3", name: "Sky Lounge", icon: "Sun" },
          { id: "am-4", name: "Concierge", icon: "ShieldCheck" },
          { id: "am-5", name: "Valet Parking", icon: "Car" },
          { id: "am-6", name: "Gym Studio", icon: "Dumbbell" },
        ],
        livingTitle: "Urban living redefined",
        livingDescription: "Skyline Towers represents the pinnacle of modern urban living in Munich's most sought-after district. Each residence offers floor-to-ceiling windows, premium finishes, and smart home technology.",
        livingDescriptionExtended: "Located in the heart of Schwabing, residents enjoy immediate access to world-class dining, boutique shopping, and cultural attractions. The English Garden is just steps away, offering a perfect balance of urban convenience and natural beauty.",
        specifications: {
          rooms: "2 - 5 Zimmer",
          livingArea: "approx. 65 - 250 m²",
          purchasePrice: "750,000 € - 3,500,000 €",
          availability: ["Construction completion: Q3 2027"],
          address: "Leopoldstrasse 45, 80802 Munich"
        },
        constructionPhasesTitle: "ALL CONSTRUCTION PHASES",
        constructionPhases: [
          {
            id: "phase-1",
            title: "Foundation and structure",
            image: uploadedUrls["images/project-3.png"] || "/images/project-3.png",
            description: "State-of-the-art foundation work"
          },
          {
            id: "phase-2",
            title: "Facade installation",
            image: uploadedUrls["images/project-4.png"] || "/images/project-4.png",
            description: "Premium glass and steel facade"
          }
        ],
        locationTitle: "THE LOCATION",
        locationHighlights: [
          "Prime Schwabing location",
          "Steps from English Garden",
          "Excellent public transport connections"
        ],
        locationDescription: "Schwabing is Munich's most vibrant and cosmopolitan district, known for its artistic heritage, trendy cafes, and proximity to the English Garden.",
        mapEmbedUrl: "",
        expertsTitle: "OUR EXPERTS ARE HERE FOR YOU",
        expertsSubtitle: "Let our team guide you to your dream home in Skyline Towers.",
        expertsDescription: "With decades of combined experience in luxury real estate.",
        expertsButtonText: "SCHEDULE VIEWING",
        expertsButtonLink: "/contact",
        experts: [
          {
            id: "expert-1",
            name: "Thomas Weber",
            role: "Senior Sales Director",
            image: uploadedUrls["images/placeholder-user.jpg"] || "/images/placeholder-user.jpg"
          }
        ],
        consultationTitle: "BOOK YOUR PRIVATE VIEWING",
        consultationPhone: "089 710 409 97",
        consultationEmail: "skyline@conceptbau.de",
        consultationDisclaimer: "",
        galleryImages: [
          uploadedUrls["images/project-2.png"] || "/images/project-2.png",
          uploadedUrls["images/project-3.png"] || "/images/project-3.png"
        ],
        metaTitle: "Skyline Towers - Luxury Apartments in Schwabing",
        metaDescription: "Experience unparalleled luxury at Skyline Towers in Munich's prestigious Schwabing district.",
        isActive: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prop-3",
        slug: "garden-residence",
        category: "in-planning",
        status: "coming-soon",
        heroImage: uploadedUrls["images/project-3.png"] || "/images/project-3.png",
        heroTitle: "BOGENHAUSEN - COMING 2028",
        heroSubtitle: "GARDEN.RESIDENCE",
        projectLogo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        projectName: "Garden Residence",
        projectTagline: "BOGENHAUSEN | MUNICH",
        subtitle: "Exclusive Villas in Bogenhausen",
        specialFeaturesTitle: "Special features",
        specialFeatures: [
          "Private gardens up to 500m²",
          "Individual architect customization",
          "Underground parking for 3 vehicles",
          "Gated community with security"
        ],
        videoUrl: "",
        videoDescription: "Where exclusivity meets nature, creating a sanctuary of elegance and tranquility in the heart of Munich.",
        amenities: [
          { id: "am-1", name: "Private Gardens", icon: "Flower2" },
          { id: "am-2", name: "Gated Security", icon: "ShieldCheck" },
          { id: "am-3", name: "Wine Cellar", icon: "Coffee" },
          { id: "am-4", name: "Triple Garage", icon: "Car" },
          { id: "am-5", name: "Outdoor Pool", icon: "Waves" },
        ],
        livingTitle: "Your private retreat in the city",
        livingDescription: "Garden Residence brings the concept of villa living to Munich's prestigious Bogenhausen district. Each residence is a standalone masterpiece surrounded by lush private gardens.",
        livingDescriptionExtended: "Designed for families who value privacy and space without compromising on urban convenience. Walking distance to international schools and the Isar riverbanks.",
        specifications: {
          rooms: "5 - 7 Zimmer",
          livingArea: "approx. 200 - 400 m²",
          purchasePrice: "2,500,000 € - 6,000,000 €",
          availability: ["Sales launch: Q2 2026", "Construction start: Q4 2026"],
          address: "Prinzregentenstrasse, 81675 Munich"
        },
        constructionPhasesTitle: "PLANNED PHASES",
        constructionPhases: [
          {
            id: "phase-1",
            title: "Conceptual rendering",
            image: uploadedUrls["images/project-4.png"] || "/images/project-4.png",
            description: "Initial design concepts"
          }
        ],
        locationTitle: "THE LOCATION",
        locationHighlights: [
          "Bogenhausen - Munich's most exclusive residential area",
          "International schools nearby",
          "Direct Isar access"
        ],
        locationDescription: "Bogenhausen represents the epitome of prestigious Munich living, home to embassies, historic villas, and the city's most discerning residents.",
        mapEmbedUrl: "",
        expertsTitle: "REGISTER YOUR INTEREST",
        expertsSubtitle: "Be among the first to receive information about Garden Residence.",
        expertsDescription: "Priority access for early registrations.",
        expertsButtonText: "REGISTER NOW",
        expertsButtonLink: "/contact",
        experts: [
          {
            id: "expert-1",
            name: "Alexandra von Berg",
            role: "Luxury Properties Specialist",
            image: uploadedUrls["images/placeholder-user.jpg"] || "/images/placeholder-user.jpg"
          }
        ],
        consultationTitle: "EXPRESS YOUR INTEREST",
        consultationPhone: "089 710 409 98",
        consultationEmail: "garden@conceptbau.de",
        consultationDisclaimer: "Early registration does not constitute a reservation or commitment.",
        galleryImages: [
          uploadedUrls["images/project-3.png"] || "/images/project-3.png",
          uploadedUrls["images/project-4.png"] || "/images/project-4.png"
        ],
        metaTitle: "Garden Residence - Exclusive Villas in Bogenhausen",
        metaDescription: "Register interest for Garden Residence, exclusive villa development in Munich's prestigious Bogenhausen.",
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prop-4",
        slug: "river-view-apartments",
        category: "in-planning",
        status: "coming-soon",
        heroImage: uploadedUrls["images/project-4.png"] || "/images/project-4.png",
        heroTitle: "HAIDHAUSEN - COMING 2027",
        heroSubtitle: "RIVER.VIEW",
        projectLogo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        projectName: "River View Apartments",
        projectTagline: "HAIDHAUSEN | MUNICH",
        subtitle: "Contemporary Living by the Isar",
        specialFeaturesTitle: "Special features",
        specialFeatures: [
          "Direct Isar river views",
          "Sustainable construction with green roof",
          "Community rooftop terrace",
          "E-mobility charging stations"
        ],
        videoUrl: "",
        videoDescription: "Embrace riverside living where every sunrise paints a new masterpiece across the Isar.",
        amenities: [
          { id: "am-1", name: "Green Roof", icon: "TreePine" },
          { id: "am-2", name: "E-Charging", icon: "Zap" },
          { id: "am-3", name: "Bike Storage", icon: "Bike" },
          { id: "am-4", name: "Rooftop Terrace", icon: "Sun" },
          { id: "am-5", name: "Co-Working Space", icon: "Wifi" },
        ],
        livingTitle: "Where nature meets urban lifestyle",
        livingDescription: "River View Apartments offer a unique opportunity to live directly overlooking Munich's beloved Isar river while being in the heart of trendy Haidhausen.",
        livingDescriptionExtended: "",
        specifications: {
          rooms: "1 - 4 Zimmer",
          livingArea: "approx. 35 - 150 m²",
          purchasePrice: "350,000 € - 1,800,000 €",
          availability: ["Planning phase - Sales launch Q4 2026"],
          address: "Rosenheimer Strasse, 81667 Munich"
        },
        constructionPhasesTitle: "DEVELOPMENT TIMELINE",
        constructionPhases: [],
        locationTitle: "THE LOCATION",
        locationHighlights: [
          "Haidhausen - Munich's French Quarter",
          "Vibrant cafe and restaurant scene",
          "Excellent S-Bahn and U-Bahn access"
        ],
        locationDescription: "Haidhausen combines village charm with urban energy, featuring cobblestone streets, independent boutiques, and some of Munich's best restaurants.",
        mapEmbedUrl: "",
        expertsTitle: "STAY INFORMED",
        expertsSubtitle: "Sign up to receive project updates.",
        expertsDescription: "",
        expertsButtonText: "GET UPDATES",
        expertsButtonLink: "/contact",
        experts: [],
        consultationTitle: "CONTACT US",
        consultationPhone: "089 710 409 99",
        consultationEmail: "riverview@conceptbau.de",
        consultationDisclaimer: "",
        galleryImages: [],
        metaTitle: "River View Apartments - Coming to Haidhausen",
        metaDescription: "Contemporary apartments with Isar river views in Munich's Haidhausen district.",
        isActive: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prop-5",
        slug: "parkside-living",
        category: "reference",
        status: "sold-out",
        heroImage: uploadedUrls["images/project-5.png"] || "/images/project-5.png",
        heroTitle: "NYMPHENBURG - COMPLETED 2024",
        heroSubtitle: "PARKSIDE.LIVING",
        projectLogo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        projectName: "Parkside Living",
        projectTagline: "NYMPHENBURG | MUNICH",
        subtitle: "Completed Luxury Development",
        specialFeaturesTitle: "Project highlights",
        specialFeatures: [
          "48 luxury apartments delivered",
          "Award-winning architecture",
          "LEED Gold certified",
          "100% sold within 6 months"
        ],
        videoUrl: "",
        videoDescription: "A landmark achievement in Munich residential architecture, setting the standard for sustainable luxury living.",
        amenities: [
          { id: "am-1", name: "Landscaped Park", icon: "Trees" },
          { id: "am-2", name: "Fitness Studio", icon: "Dumbbell" },
          { id: "am-3", name: "Children Area", icon: "Baby" },
          { id: "am-4", name: "Residents Lounge", icon: "Coffee" },
        ],
        livingTitle: "A showcase of excellence",
        livingDescription: "Parkside Living stands as a testament to our commitment to quality and design excellence. All 48 units were sold before construction completion.",
        livingDescriptionExtended: "This project received the 2024 Munich Architecture Award for Residential Excellence.",
        specifications: {
          rooms: "2 - 4 Zimmer",
          livingArea: "approx. 55 - 180 m²",
          purchasePrice: "Sold Out",
          availability: ["Completed and fully occupied"],
          address: "Schlossallee 12, 80638 Munich"
        },
        constructionPhasesTitle: "PROJECT GALLERY",
        constructionPhases: [
          {
            id: "phase-1",
            title: "Completed exterior",
            image: uploadedUrls["images/project-5.png"] || "/images/project-5.png",
            description: "Award-winning facade design"
          },
          {
            id: "phase-2",
            title: "Interior showroom",
            image: uploadedUrls["images/project-1.png"] || "/images/project-1.png",
            description: "Premium interior finishes"
          }
        ],
        locationTitle: "THE LOCATION",
        locationHighlights: [
          "Adjacent to Nymphenburg Palace gardens",
          "Quiet residential neighborhood",
          "Excellent schools nearby"
        ],
        locationDescription: "Nymphenburg offers a unique blend of royal heritage and modern residential comfort, centered around the magnificent Nymphenburg Palace.",
        mapEmbedUrl: "",
        expertsTitle: "INTERESTED IN SIMILAR PROJECTS?",
        expertsSubtitle: "Contact us to learn about our upcoming developments.",
        expertsDescription: "Our portfolio continues to grow with exceptional properties.",
        expertsButtonText: "VIEW CURRENT PROJECTS",
        expertsButtonLink: "/projects",
        experts: [],
        consultationTitle: "GENERAL INQUIRIES",
        consultationPhone: "089 710 409 90",
        consultationEmail: "info@conceptbau.de",
        consultationDisclaimer: "",
        galleryImages: [
          uploadedUrls["images/project-5.png"] || "/images/project-5.png",
          uploadedUrls["images/project-1.png"] || "/images/project-1.png",
          uploadedUrls["images/project-2.png"] || "/images/project-2.png"
        ],
        metaTitle: "Parkside Living - Completed Reference Project",
        metaDescription: "Explore our award-winning Parkside Living development in Munich's Nymphenburg district.",
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "prop-6",
        slug: "central-plaza",
        category: "reference",
        status: "sold-out",
        heroImage: uploadedUrls["images/hero-bg.png"] || "/images/hero-bg.png",
        heroTitle: "MAXVORSTADT - COMPLETED 2023",
        heroSubtitle: "CENTRAL.PLAZA",
        projectLogo: uploadedUrls["images/logo.png"] || "/images/logo.png",
        projectName: "Central Plaza",
        projectTagline: "MAXVORSTADT | MUNICH",
        subtitle: "Urban Mixed-Use Development",
        specialFeaturesTitle: "Project highlights",
        specialFeatures: [
          "32 residential units + 4 retail spaces",
          "Central city location",
          "Mixed-use concept",
          "Sold out in 4 months"
        ],
        videoUrl: "",
        videoDescription: "Where culture, commerce, and community converge to create Munich's most dynamic living experience.",
        amenities: [
          { id: "am-1", name: "Retail Spaces", icon: "Utensils" },
          { id: "am-2", name: "Courtyard", icon: "Flower2" },
          { id: "am-3", name: "Smart Home", icon: "Wifi" },
          { id: "am-4", name: "Secure Parking", icon: "Car" },
        ],
        livingTitle: "Urban integration at its finest",
        livingDescription: "Central Plaza pioneered the mixed-use residential concept in Munich's Maxvorstadt, combining living, shopping, and work in one harmonious development.",
        livingDescriptionExtended: "",
        specifications: {
          rooms: "1 - 3 Zimmer",
          livingArea: "approx. 40 - 120 m²",
          purchasePrice: "Sold Out",
          availability: ["Completed Q4 2023"],
          address: "Theresienstrasse 88, 80333 Munich"
        },
        constructionPhasesTitle: "COMPLETED PROJECT",
        constructionPhases: [],
        locationTitle: "THE LOCATION",
        locationHighlights: [
          "University district",
          "Walking distance to Pinakotheken museums",
          "Vibrant student atmosphere"
        ],
        locationDescription: "Maxvorstadt is Munich's cultural heart, home to world-renowned museums, the university, and a thriving creative community.",
        mapEmbedUrl: "",
        expertsTitle: "EXPLORE MORE PROJECTS",
        expertsSubtitle: "See what we're currently developing.",
        expertsDescription: "",
        expertsButtonText: "CURRENT PROJECTS",
        expertsButtonLink: "/projects/category/on-sale",
        experts: [],
        consultationTitle: "CONTACT",
        consultationPhone: "089 710 409 90",
        consultationEmail: "info@conceptbau.de",
        consultationDisclaimer: "",
        galleryImages: [],
        metaTitle: "Central Plaza - Reference Project",
        metaDescription: "Central Plaza mixed-use development in Munich's Maxvorstadt.",
        isActive: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Create gallery albums
    const galleryAlbums: GalleryAlbum[] = [
      {
        id: "gallery-1",
        propertyId: "prop-1",
        propertyName: "Linden Park",
        coverImage: uploadedUrls["images/project-1.png"] || "/images/project-1.png",
        images: [
          { id: "img-1", url: uploadedUrls["images/project-1.png"] || "/images/project-1.png", caption: "Exterior view", order: 1 },
          { id: "img-2", url: uploadedUrls["images/project-2.png"] || "/images/project-2.png", caption: "Garden area", order: 2 },
          { id: "img-3", url: uploadedUrls["images/project-3.png"] || "/images/project-3.png", caption: "Lobby entrance", order: 3 },
          { id: "img-4", url: uploadedUrls["images/project-4.png"] || "/images/project-4.png", caption: "Sample apartment", order: 4 }
        ],
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "gallery-2",
        propertyId: "prop-2",
        propertyName: "Skyline Towers",
        coverImage: uploadedUrls["images/project-2.png"] || "/images/project-2.png",
        images: [
          { id: "img-5", url: uploadedUrls["images/project-2.png"] || "/images/project-2.png", caption: "Tower exterior", order: 1 },
          { id: "img-6", url: uploadedUrls["images/project-3.png"] || "/images/project-3.png", caption: "Penthouse view", order: 2 },
          { id: "img-7", url: uploadedUrls["images/project-5.png"] || "/images/project-5.png", caption: "Rooftop pool", order: 3 }
        ],
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "gallery-3",
        propertyId: "prop-5",
        propertyName: "Parkside Living",
        coverImage: uploadedUrls["images/project-5.png"] || "/images/project-5.png",
        images: [
          { id: "img-8", url: uploadedUrls["images/project-5.png"] || "/images/project-5.png", caption: "Completed building", order: 1 },
          { id: "img-9", url: uploadedUrls["images/project-1.png"] || "/images/project-1.png", caption: "Interior finish", order: 2 },
          { id: "img-10", url: uploadedUrls["images/why-choose.png"] || "/images/why-choose.png", caption: "Common areas", order: 3 },
          { id: "img-11", url: uploadedUrls["images/hero-bg.png"] || "/images/hero-bg.png", caption: "Night view", order: 4 },
          { id: "img-12", url: uploadedUrls["images/project-4.png"] || "/images/project-4.png", caption: "Landscaping", order: 5 }
        ],
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    // Create properties content
    const propertiesContent: PropertiesContent = {
      properties,
      galleryAlbums,
      updatedAt: new Date()
    }

    // Delete existing properties file if exists
    const existingPropertiesBlob = existingBlobs.find((b) => b.pathname === PROPERTIES_FILE)
    if (existingPropertiesBlob) {
      try {
        await del(existingPropertiesBlob.url)
        console.log("[v0] Deleted existing properties file")
      } catch (e) {
        console.log("[v0] No existing properties file to delete or delete failed:", e)
      }
    }

    // Delete existing home content file if exists
    const existingContentBlob = existingBlobs.find((b) => b.pathname === CONTENT_FILE)
    if (existingContentBlob) {
      try {
        await del(existingContentBlob.url)
        console.log("[v0] Deleted existing content file")
      } catch (e) {
        console.log("[v0] No existing content file to delete or delete failed:", e)
      }
    }

    // Save home content to blob
    const savedContent = await put(CONTENT_FILE, JSON.stringify(homeContent, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    })
    console.log("[v0] Saved home content to:", savedContent.url)

    // Save properties content to blob
    const savedProperties = await put(PROPERTIES_FILE, JSON.stringify(propertiesContent, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    })
    console.log("[v0] Saved properties to:", savedProperties.url)
    console.log("[v0] Properties count:", properties.length)
    console.log("[v0] Gallery albums count:", galleryAlbums.length)
    
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with properties and gallery",
      uploadedImages: Object.keys(uploadedUrls).length,
      propertiesCount: properties.length,
      galleryAlbumsCount: galleryAlbums.length,
      contentUrl: savedContent.url,
      propertiesUrl: savedProperties.url,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
