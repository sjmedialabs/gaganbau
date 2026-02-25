"use client"

import type { Property } from "@/lib/types"
import { MapPin, Check } from "lucide-react"

interface PropertyLocationProps {
  property: Property
}

export function PropertyLocation({ property }: PropertyLocationProps) {

  const hasContent =
    property.locationTitle ||
    (property.locationHighlights && property.locationHighlights.length > 0) ||
    property.locationDescription ||
    property.mapEmbedUrl ||
    property.specifications?.address

  if (!hasContent) return null

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-navy">
            {property.locationTitle || "THE LOCATION"}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Location Details (2 of 5 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Card */}
            {property.specifications?.address && (
              <div className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      Project Address
                    </p>
                    <p className="text-navy font-semibold text-lg">
                      {property.specifications.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Location Highlights */}
            {property.locationHighlights &&
              property.locationHighlights.length > 0 && (
                <div className="bg-background rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-navy mb-5 text-sm uppercase tracking-wider">
                    Nearby Highlights
                  </h3>
                  <div className="space-y-3">
                    {property.locationHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center mt-0.5">
                          <Check className="w-3.5 h-3.5 text-gold" />
                        </div>
                        <p className="text-foreground text-sm leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Location Description */}
            {property.locationDescription && (
              <div className="bg-background rounded-lg border border-border p-6">
                <h3 className="font-semibold text-navy mb-4 text-sm uppercase tracking-wider">
                  About the Neighbourhood
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                  {property.locationDescription}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Map (3 of 5 cols) */}
          <div className="lg:col-span-3">
            {property.mapEmbedUrl ? (
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px] w-full rounded-lg overflow-hidden border border-border bg-muted">
                <iframe
                  src={property.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${property.projectName}`}
                  className="w-full h-full"
                />
              </div>
            ) : (
              /* No map URL - show a placeholder with address */
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px] w-full rounded-lg overflow-hidden border border-border bg-navy/5 flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="w-12 h-12 text-gold/40 mb-4" />
                <p className="text-navy font-medium text-lg mb-1">
                  {property.specifications?.address || property.projectName}
                </p>
                <p className="text-muted-foreground text-sm">
                  Map will appear here once a Google Maps embed URL is added
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
