import type { Property } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PropertyExpertsProps {
  property: Property
}

export function PropertyExperts({ property }: PropertyExpertsProps) {
  if (!property.experts || property.experts.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif text-navy text-balance">
            {property.expertsTitle || "OUR EXPERTS ARE HERE FOR YOU"}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
          {property.expertsSubtitle && (
            <p className="text-muted-foreground leading-relaxed mt-4 max-w-2xl mx-auto">
              {property.expertsSubtitle}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Experts Cards */}
          <div className="lg:col-span-2 flex flex-wrap gap-8 justify-center">
            {property.experts.map((expert) => (
              <div key={expert.id} className="text-center w-48">
                <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden bg-muted border-2 border-gold/20">
                  {expert.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={expert.image || "/placeholder.svg"}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-navy/5 text-navy">
                      <span className="text-3xl font-serif">
                        {expert.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-navy text-sm">{expert.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{expert.role}</p>
              </div>
            ))}
          </div>

          {/* Description & CTA */}
          <div className="space-y-6 text-center lg:text-left">
            {property.expertsDescription && (
              <p className="text-muted-foreground leading-relaxed text-sm">
                {property.expertsDescription}
              </p>
            )}

            {property.expertsButtonText && (
              <Link href={property.expertsButtonLink || "#contact"}>
                <Button className="bg-gold hover:bg-gold-dark text-white">
                  {property.expertsButtonText}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
