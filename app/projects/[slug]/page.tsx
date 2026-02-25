import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getPropertyBySlug, getAllProperties } from "@/lib/properties-store"
import { PropertyHero } from "@/components/property/PropertyHero"
import { PropertyInfo } from "@/components/property/PropertyInfo"
import { PropertyVideo } from "@/components/property/PropertyVideo"
import { PropertyAmenities } from "@/components/property/PropertyAmenities"
import { PropertySpecs } from "@/components/property/PropertySpecs"
import { PropertyPhases } from "@/components/property/PropertyPhases"
import { PropertyLocation } from "@/components/property/PropertyLocation"
import { PropertyGallery } from "@/components/property/PropertyGallery"
import { PropertyConsultation } from "@/components/property/PropertyConsultation"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ slug: string }>
}

const categoryRoutes = ["on-sale", "in-planning", "reference", "category"]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (categoryRoutes.includes(slug)) return { title: "Not Found" }

  const property = await getPropertyBySlug(slug)
  if (!property) return { title: "Property Not Found" }

  return {
    title: property.metaTitle || `${property.projectName} | Gagan Bau GmbH`,
    description: property.metaDescription || property.subtitle,
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  if (categoryRoutes.includes(slug)) notFound()

  const [property, homeContent, allProperties] = await Promise.all([
    getPropertyBySlug(slug),
    getHomePageContent(),
    getAllProperties(),
  ])

  if (!property) notFound()

  return (
    <main className="min-h-screen bg-background">
      <Header
        content={homeContent.header}
        isTransparent={true}
        properties={allProperties}
      />

      {/* 1. Hero with full-width background + Key Highlights Bar */}
      <PropertyHero property={property} />

      {/* 2. Project Info - Logo, Name, Living Description, Special Features */}
      <PropertyInfo property={property} />

      {/* 3. Video Section - Decorative text + embedded video player */}
      <PropertyVideo property={property} />

      {/* 4. Amenities - Scrollable icon carousel */}
      <PropertyAmenities property={property} />

      {/* 5. Key Specifications - Table layout */}
      <PropertySpecs property={property} />

      {/* 6. Project Plans - Plan tabs + image viewer (next/prev = same plan images) */}
      <PropertyPhases property={property} />

      {/* 7. Location - Map + highlights + description */}
      <PropertyLocation property={property} />

      {/* 8. Gallery - Dense image grid + lightbox */}
      <PropertyGallery property={property} />

      {/* 9. Consultation Contact */}
      <PropertyConsultation property={property} />

      <Footer content={homeContent.footer} />
    </main>
  )
}
