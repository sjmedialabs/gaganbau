import type { Property } from "@/lib/types"
import { Phone, Mail, MessageCircle } from "lucide-react"

interface PropertyConsultationProps {
  property: Property
}

export function PropertyConsultation({ property }: PropertyConsultationProps) {
  const hasPhone = !!property.consultationPhone
  const hasEmail = !!property.consultationEmail
  const hasTitle = !!property.consultationTitle

  if (!hasPhone && !hasEmail && !hasTitle) return null

  return (
    <section id="contact" className="py-16 md:py-20 bg-navy">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full border-2 border-gold/30 flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-6 h-6 text-gold" />
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-white text-balance mb-2">
          {property.consultationTitle || "Schedule a Personal Consultation"}
        </h2>

        <p className="text-white/50 text-sm max-w-lg mx-auto mb-10">
          Get in touch with our team to learn more about{" "}
          {property.projectName} and schedule a private viewing.
        </p>

        <div className="w-16 h-px bg-gold mx-auto mb-10" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          {hasPhone && (
            <a
              href={`tel:${property.consultationPhone!.replace(/\s/g, "")}`}
              className="flex items-center gap-4 text-white/90 hover:text-gold transition-colors group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-gold/30 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold transition-all">
                <Phone className="w-5 h-5 text-gold" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                  Telephone
                </p>
                <p className="font-medium text-lg">
                  {property.consultationPhone}
                </p>
              </div>
            </a>
          )}

          {hasEmail && (
            <a
              href={`mailto:${property.consultationEmail}`}
              className="flex items-center gap-4 text-white/90 hover:text-gold transition-colors group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-gold/30 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold transition-all">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">
                  Email
                </p>
                <p className="font-medium text-lg">
                  {property.consultationEmail}
                </p>
              </div>
            </a>
          )}
        </div>

        {property.consultationDisclaimer && (
          <p className="text-xs text-white/30 leading-relaxed mt-12 max-w-md mx-auto">
            {property.consultationDisclaimer}
          </p>
        )}
      </div>
    </section>
  )
}
