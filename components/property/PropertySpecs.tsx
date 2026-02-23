import type { Property } from "@/lib/types"
import { Home, Maximize, BadgeEuro, MapPin, CalendarCheck } from "lucide-react"
import type { ReactNode } from "react"

interface PropertySpecsProps {
  property: Property
}

function SpecRow({
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

export function PropertySpecs({ property }: PropertySpecsProps) {
  const specs = property.specifications
  if (!specs) return null

  const hasContent =
    specs.rooms ||
    specs.livingArea ||
    specs.purchasePrice ||
    specs.address ||
    (specs.availability && specs.availability.length > 0)

  if (!hasContent) return null

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-navy">
            KEY SPECIFICATIONS
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="bg-background rounded-lg border border-border shadow-sm p-6 md:p-8">
          {specs.rooms && (
            <SpecRow
              icon={<Home className="w-5 h-5 text-gold" />}
              label="Rooms"
              value={specs.rooms}
            />
          )}
          {specs.livingArea && (
            <SpecRow
              icon={<Maximize className="w-5 h-5 text-gold" />}
              label="Living Area"
              value={specs.livingArea}
            />
          )}
          {specs.purchasePrice && (
            <SpecRow
              icon={<BadgeEuro className="w-5 h-5 text-gold" />}
              label="Price Range"
              value={specs.purchasePrice}
            />
          )}
          {specs.address && (
            <SpecRow
              icon={<MapPin className="w-5 h-5 text-gold" />}
              label="Address"
              value={specs.address}
            />
          )}
          {specs.availability && specs.availability.length > 0 && (
            <SpecRow
              icon={<CalendarCheck className="w-5 h-5 text-gold" />}
              label="Availability"
              value={specs.availability}
            />
          )}
        </div>
      </div>
    </section>
  )
}
