import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getPropertiesByCategory, getAllProperties } from "@/lib/properties-store"
import type { PropertyCategory } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2 } from "lucide-react"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{ category: string }>
}

const validCategories = ["on-sale", "in-planning", "reference"]

const categoryInfo: Record<string, { title: string; description: string }> = {
  "on-sale": {
    title: "Properties On Sale",
    description: "Discover our current portfolio of premium properties available for purchase.",
  },
  "in-planning": {
    title: "Properties In Planning",
    description: "Explore our upcoming developments and secure your unit early.",
  },
  "reference": {
    title: "Reference Projects",
    description: "Browse through our successfully completed projects.",
  },
}

const statusLabels: Record<string, string> = {
  "ready-for-occupancy": "Ready for Occupancy",
  "sold-out": "Sold Out",
  "under-construction": "Under Construction",
  "coming-soon": "Coming Soon",
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params

  if (!validCategories.includes(category)) {
    return { title: "Not Found" }
  }

  const info = categoryInfo[category]
  return {
    title: `${info.title} | Gagan Bau GmbH`,
    description: info.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params

  if (!validCategories.includes(category)) {
    notFound()
  }

  const [properties, homeContent, allProperties] = await Promise.all([
    getPropertiesByCategory(category as PropertyCategory),
    getHomePageContent(),
    getAllProperties(),
  ])

  const info = categoryInfo[category]

  return (
    <main className="min-h-screen bg-background">
      <Header content={homeContent.header} isTransparent={false} properties={allProperties} />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-navy">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            {info.title}
          </h1>
          <p className="text-white/70 max-w-2xl">
            {info.description}
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-serif text-navy mb-4">No Properties Yet</h2>
              <p className="text-muted-foreground mb-8">
                We are working on new projects in this category. Check back soon!
              </p>
              <Link href="/">
                <Button className="bg-gold hover:bg-gold/90 text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/projects/${property.slug}`}
                  className="group"
                >
                  <article className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="aspect-video bg-muted overflow-hidden">
                      {property.heroImage ? (
                        <img
                          src={property.heroImage || "/placeholder.svg"}
                          alt={property.projectName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-serif text-navy group-hover:text-gold transition-colors">
                          {property.projectName}
                        </h3>
                        <Badge variant="outline" className="flex-shrink-0">
                          {statusLabels[property.status] || property.status}
                        </Badge>
                      </div>

                      {property.specifications?.address && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {property.specifications.address}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        {property.specifications?.livingArea && (
                          <span>{property.specifications.livingArea}</span>
                        )}
                        {property.specifications?.rooms && (
                          <span>{property.specifications.rooms}</span>
                        )}
                      </div>

                      {property.specifications?.purchasePrice && (
                        <p className="font-semibold text-navy mb-4">
                          {property.specifications.purchasePrice}
                        </p>
                      )}

                      <div className="flex items-center text-gold text-sm font-medium group-hover:gap-2 transition-all">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer content={homeContent.footer} />
    </main>
  )
}
