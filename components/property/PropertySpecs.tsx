import type { Property, PropertySpecItem } from "@/lib/types"
import { getSpecIcon } from "@/lib/property-icons"
import { Home, Maximize, BadgeEuro, MapPin, CalendarCheck } from "lucide-react"
import type { ReactNode } from "react"

interface PropertySpecsProps {
  property: Property
}

function SpecRowLegacy({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string | string[]
}) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-border last:border-b-0">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider min-w-[140px]">
          {label}
        </span>
        {Array.isArray(value) ? (
          <div className="space-y-0.5 sm:text-right">
            {value.map((item, i) => (
              <p key={i} className="text-base font-medium text-navy">
                {item}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-base font-medium text-navy sm:text-right">
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

function KeySpecItem({ item }: { item: PropertySpecItem }) {
  const Icon = getSpecIcon(item.icon ?? "Building2")
  return (
    <div className="flex items-start gap-4 py-5 border-b border-border last:border-b-0">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center overflow-hidden">
        {item.iconImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={item.iconImage} alt="" className="w-5 h-5 object-contain" />
        ) : (
          <Icon className="w-5 h-5 text-gold" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider block mb-1">
          {item.title}
        </span>
        <p className="text-base font-medium text-navy leading-snug">
          {item.description}
        </p>
      </div>
    </div>
  )
}

export function PropertySpecs({ property }: PropertySpecsProps) {
  const keySpecRaw = property.keySpecifications
  const keySpecItems = Array.isArray(keySpecRaw)
    ? keySpecRaw.filter((s) => s && (s.title || s.description))
    : []
  const useKeySpecItems = keySpecItems.length > 0

  const legacySpecs = property.specifications
  const hasLegacy =
    legacySpecs &&
    (legacySpecs.rooms ||
      legacySpecs.livingArea ||
      legacySpecs.purchasePrice ||
      legacySpecs.address ||
      (legacySpecs.availability && legacySpecs.availability.length > 0))

  if (!useKeySpecItems && !hasLegacy) return null

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-navy">
            KEY SPECIFICATIONS
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        {useKeySpecItems ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg border border-border shadow-sm p-6 md:p-8">
              {keySpecItems
                .filter((_, i) => i % 2 === 0)
                .map((item) => (
                  <KeySpecItem key={item.id} item={item} />
                ))}
            </div>
            <div className="bg-background rounded-lg border border-border shadow-sm p-6 md:p-8">
              {keySpecItems
                .filter((_, i) => i % 2 === 1)
                .map((item) => (
                  <KeySpecItem key={item.id} item={item} />
                ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[900px] mx-auto">
            <div className="bg-background rounded-lg border border-border shadow-sm p-6 md:p-8">
              {legacySpecs?.rooms && (
                <SpecRowLegacy
                  icon={<Home className="w-5 h-5 text-gold" />}
                  label="Rooms"
                  value={legacySpecs.rooms}
                />
              )}
              {legacySpecs?.livingArea && (
                <SpecRowLegacy
                  icon={<Maximize className="w-5 h-5 text-gold" />}
                  label="Living Area"
                  value={legacySpecs.livingArea}
                />
              )}
              {legacySpecs?.purchasePrice && (
                <SpecRowLegacy
                  icon={<BadgeEuro className="w-5 h-5 text-gold" />}
                  label="Price Range"
                  value={legacySpecs.purchasePrice}
                />
              )}
              {legacySpecs?.address && (
                <SpecRowLegacy
                  icon={<MapPin className="w-5 h-5 text-gold" />}
                  label="Address"
                  value={legacySpecs.address}
                />
              )}
              {legacySpecs?.availability && legacySpecs.availability.length > 0 && (
                <SpecRowLegacy
                  icon={<CalendarCheck className="w-5 h-5 text-gold" />}
                  label="Availability"
                  value={legacySpecs.availability}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
