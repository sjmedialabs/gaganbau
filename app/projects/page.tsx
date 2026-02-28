import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Filter } from "lucide-react"

export const revalidate = 60
export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "All Projects | Gagan Bau GmbH",
  description: "Browse our complete portfolio of premium real estate projects including properties on sale, in planning, and our reference projects.",
}

const categoryInfo: Record<string, { title: string; color: string }> = {
  "on-sale": { title: "On Sale", color: "bg-green-100 text-green-800 border-green-200" },
  "in-planning": { title: "In Planning", color: "bg-blue-100 text-blue-800 border-blue-200" },
  "reference": { title: "Reference", color: "bg-gray-100 text-gray-800 border-gray-200" },
}

const statusLabels: Record<string, string> = {
  "ready-for-occupancy": "Ready for Occupancy",
  "sold-out": "Sold Out",
  "under-construction": "Under Construction",
  "coming-soon": "Coming Soon",
}

export default async function ProjectsPage() {
  const [homeContent, allProperties] = await Promise.all([
    getHomePageContent(),
    getAllProperties(),
  ])

// Filter only active properties
  const properties = allProperties.filter((p) => p.isActive)

  // Group properties by category for the filter section
  const onSaleCount = properties.filter((p) => p.category === "on-sale").length
  const inPlanningCount = properties.filter((p) => p.category === "in-planning").length
  const referenceCount = properties.filter((p) => p.category === "reference").length

  return (
    <main className="min-h-screen bg-background">
      <Header content={homeContent.header} isTransparent={false} properties={allProperties} />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-navy">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Our Projects
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Discover our complete portfolio of premium real estate developments. From properties currently on sale to upcoming projects and our successful completions.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground mr-2 flex-shrink-0">Filter by:</span>
            <Link href="/projects">
              <Badge 
                variant="outline" 
                className="bg-navy text-white border-navy hover:bg-navy/90 cursor-pointer"
              >
                All ({properties.length})
              </Badge>
            </Link>
            <Link href="/projects/category/on-sale">
              <Badge 
                variant="outline" 
                className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 cursor-pointer"
              >
                On Sale ({onSaleCount})
              </Badge>
            </Link>
            <Link href="/projects/category/in-planning">
              <Badge 
                variant="outline" 
                className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 cursor-pointer"
              >
                In Planning ({inPlanningCount})
              </Badge>
            </Link>
            <Link href="/projects/category/reference">
              <Badge 
                variant="outline" 
                className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 cursor-pointer"
              >
                Reference ({referenceCount})
              </Badge>
            </Link>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-serif text-navy mb-4">No Projects Available</h2>
              <p className="text-muted-foreground mb-8">
                We are working on adding new projects. Please check back soon!
              </p>
              <Link href="/">
                <Button className="bg-gold hover:bg-gold/90 text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/projects/${property.slug}`}
                  className="group block"
                >
                  <article className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-gold/30">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-80 lg:w-96 flex-shrink-0">
                        <div className="aspect-video md:aspect-auto md:h-full bg-muted overflow-hidden">
                          {property.heroImage ? (
                            <img
                              src={property.heroImage || "/placeholder.svg"}
                              alt={property.projectName}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full min-h-[200px] flex items-center justify-center">
                              <Building2 className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={categoryInfo[property.category]?.color || ""}
                            >
                              {categoryInfo[property.category]?.title || property.category}
                            </Badge>
                            <Badge variant="outline">
                              {statusLabels[property.status] || property.status}
                            </Badge>
                          </div>
                          {property.projectLogo && (
                            <img 
                              src={property.projectLogo || "/placeholder.svg"} 
                              alt={`${property.projectName} logo`}
                              className="h-8 w-auto object-contain"
                            />
                          )}
                        </div>

                        <h3 className="text-xl lg:text-2xl font-serif text-navy group-hover:text-gold transition-colors mb-2">
                          {property.projectName}
                        </h3>

                        {property.projectTagline && (
                          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                            {property.projectTagline}
                          </p>
                        )}

                        {property.specifications?.address && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {property.specifications.address}
                          </p>
                        )}

                        {property.subtitle && (
                          <p className="text-muted-foreground line-clamp-2 mb-4 flex-grow">
                            {property.subtitle}
                          </p>
                        )}

                        {/* Specifications Row */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-4">
                          {property.specifications?.rooms && (
                            <div>
                              <span className="text-muted-foreground">Rooms: </span>
                              <span className="font-medium text-navy">{property.specifications.rooms}</span>
                            </div>
                          )}
                          {property.specifications?.livingArea && (
                            <div>
                              <span className="text-muted-foreground">Area: </span>
                              <span className="font-medium text-navy">{property.specifications.livingArea}</span>
                            </div>
                          )}
                          {property.specifications?.purchasePrice && (
                            <div>
                              <span className="text-muted-foreground">Price: </span>
                              <span className="font-semibold text-navy">{property.specifications.purchasePrice}</span>
                            </div>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                          <div className="flex items-center text-gold text-sm font-medium group-hover:gap-2 transition-all">
                            View Project Details
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                          {property.specialFeatures && property.specialFeatures.length > 0 && (
                            <div className="hidden lg:flex items-center gap-2">
                              {property.specialFeatures.slice(0, 2).map((feature, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                              {property.specialFeatures.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{property.specialFeatures.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
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
