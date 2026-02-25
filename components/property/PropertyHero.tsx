import type { Property } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Building2 } from "lucide-react"
import { getSpecIcon } from "@/lib/property-icons"

interface PropertyHeroProps {
  property: Property
}

const statusLabels: Record<string, string> = {
  "ready-for-occupancy": "Ready for Occupancy",
  "sold-out": "Sold Out",
  "under-construction": "Under Construction",
  "coming-soon": "Coming Soon",
}

const statusColors: Record<string, string> = {
  "ready-for-occupancy": "bg-emerald-500/90 text-white",
  "sold-out": "bg-red-500/90 text-white",
  "under-construction": "bg-gold/90 text-white",
  "coming-soon": "bg-navy-light/90 text-white",
}

export function PropertyHero({ property }: PropertyHeroProps) {
  const heroRaw = property.heroSpecifications
  const heroSpecs = Array.isArray(heroRaw) ? heroRaw.filter((s) => s && (s.title || s.description)) : []
  const legacySpecs = property.specifications
  const useHeroSpecs = heroSpecs.length > 0

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[520px] flex items-end">
        <div className="absolute inset-0">
          {property.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={property.heroImage || "/placeholder.svg"}
              alt={property.projectName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-navy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 w-full">
          <div className="space-y-4 max-w-2xl">
            <span
              className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm ${statusColors[property.status] || "bg-muted text-foreground"}`}
            >
              {statusLabels[property.status] || property.status}
            </span>

            {property.heroTitle && (
              <p className="text-white/70 text-sm uppercase tracking-[0.2em] font-sans">
                {property.heroTitle}
              </p>
            )}

            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight text-balance">
              {property.heroSubtitle || property.projectName}
            </h1>

            {property.subtitle && (
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                {property.subtitle}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="outline"
                className="border-white/50 text-white hover:bg-white hover:text-navy gap-2 bg-transparent text-sm"
              >
                <Download className="w-4 h-4" />
                Download Brochure
              </Button>
              <Button asChild className="bg-gold hover:bg-gold-dark text-white gap-2 text-sm">
                <Link href="/contact">
                  <Building2 className="w-4 h-4" />
                  Schedule Visit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Specifications Bar */}
      {(useHeroSpecs || (legacySpecs && (legacySpecs.rooms || legacySpecs.livingArea || legacySpecs.purchasePrice || legacySpecs.address || (legacySpecs.availability?.length ?? 0) > 0))) && (
        <section className="relative z-20 -mt-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="bg-background rounded-lg shadow-xl border border-border/60">
              {useHeroSpecs ? (
                <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-border">
                  {heroSpecs.slice(0, 5).map((item) => {
                    const Icon = getSpecIcon(item.icon ?? "Building2")
                    return (
                      <div key={item.id} className="flex flex-col items-center gap-2 p-5 md:p-6">
                        {item.iconImage ? (
                          <span className="w-8 h-8 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.iconImage} alt="" className="w-8 h-8 object-contain" />
                          </span>
                        ) : (
                          <Icon className="w-5 h-5 text-gold" />
                        )}
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          {item.title}
                        </span>
                        <span className="text-sm font-semibold text-navy text-center leading-tight">
                          {item.description}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                (() => {
                  const HomeIcon = getSpecIcon("Home")
                  const MaximizeIcon = getSpecIcon("Maximize")
                  const BadgeEuroIcon = getSpecIcon("BadgeEuro")
                  const MapPinIcon = getSpecIcon("MapPin")
                  const CalendarIcon = getSpecIcon("CalendarCheck")
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y md:divide-y-0 divide-border">
                      {legacySpecs?.rooms && (
                        <div className="flex flex-col items-center gap-2 p-5 md:p-6">
                          <HomeIcon className="w-5 h-5 text-gold" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Rooms</span>
                          <span className="text-sm font-semibold text-navy text-center leading-tight">{legacySpecs.rooms}</span>
                        </div>
                      )}
                      {legacySpecs?.livingArea && (
                        <div className="flex flex-col items-center gap-2 p-5 md:p-6">
                          <MaximizeIcon className="w-5 h-5 text-gold" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Living Area</span>
                          <span className="text-sm font-semibold text-navy text-center leading-tight">{legacySpecs.livingArea}</span>
                        </div>
                      )}
                      {legacySpecs?.purchasePrice && (
                        <div className="flex flex-col items-center gap-2 p-5 md:p-6">
                          <BadgeEuroIcon className="w-5 h-5 text-gold" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Price Range</span>
                          <span className="text-sm font-semibold text-navy text-center leading-tight">{legacySpecs.purchasePrice}</span>
                        </div>
                      )}
                      {legacySpecs?.address && (
                        <div className="flex flex-col items-center gap-2 p-5 md:p-6">
                          <MapPinIcon className="w-5 h-5 text-gold" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Location</span>
                          <span className="text-sm font-semibold text-navy text-center leading-tight">{legacySpecs.address}</span>
                        </div>
                      )}
                      {legacySpecs?.availability && legacySpecs.availability.length > 0 && (
                        <div className="flex flex-col items-center gap-2 p-5 md:p-6 col-span-2 md:col-span-1">
                          <CalendarIcon className="w-5 h-5 text-gold" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Availability</span>
                          <span className="text-sm font-semibold text-navy text-center leading-tight">{legacySpecs.availability[0]}</span>
                        </div>
                      )}
                    </div>
                  )
                })()
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
