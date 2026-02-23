import type { Property } from "@/lib/types"
import { Check } from "lucide-react"

interface PropertyInfoProps {
  property: Property
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const hasLiving = property.livingTitle || property.livingDescription || property.livingDescriptionExtended
  const hasFeatures = property.specialFeatures && property.specialFeatures.length > 0
  const hasLogo = !!property.projectLogo

  if (!hasLiving && !hasFeatures && !hasLogo) return null

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Project Identity */}
        <div className="flex flex-col items-center text-center mb-16">
          {property.projectLogo && (
            <div className="w-40 h-40 mb-6 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={property.projectLogo || "/placeholder.svg"}
                alt={`${property.projectName} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-navy text-balance">
            {property.projectName}
          </h2>
          {property.projectTagline && (
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs mt-3 font-medium">
              {property.projectTagline}
            </p>
          )}
          <div className="w-20 h-px bg-gold mt-6" />
        </div>

        {/* Two column layout: Left description, Right features */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left - Living Description */}
          {hasLiving && (
            <div className="space-y-6">
              {property.livingTitle && (
                <h3 className="text-2xl md:text-3xl font-serif text-navy leading-tight">
                  {property.livingTitle}
                </h3>
              )}
              {property.livingDescription && (
                <p className="text-muted-foreground leading-relaxed text-base">
                  {property.livingDescription}
                </p>
              )}
              {property.livingDescriptionExtended && (
                <p className="text-muted-foreground leading-relaxed text-base">
                  {property.livingDescriptionExtended}
                </p>
              )}
            </div>
          )}

          {/* Right - Special Features */}
          {hasFeatures && (
            <div className="lg:border-l lg:border-border lg:pl-12">
              <h3 className="text-xl md:text-2xl font-serif text-navy mb-6">
                {property.specialFeaturesTitle || "Special Features"}
              </h3>
              <div className="space-y-4">
                {property.specialFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-foreground leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
