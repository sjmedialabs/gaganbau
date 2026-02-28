import type { Metadata } from "next"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { ContactForm } from "@/components/ContactForm"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"
import { MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export const revalidate = 60
export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "Contact Us | Gagan Bau GmbH",
  description: "Get in touch with Gagan Bau GmbH. Schedule a visit, inquire about our properties, or send us a message.",
}

export default async function ContactPage() {
  const [content, properties] = await Promise.all([
    getHomePageContent(),
    getAllProperties(),
  ])

  const propertyOptions = properties
    .filter((p) => p.isActive)
    .map((p) => ({ id: p.id, projectName: p.projectName, slug: p.slug }))

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header} isTransparent={false} properties={properties} />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-navy">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Schedule a visit, inquire about a property, or send us a message. We&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-serif text-navy mb-2">Send us a message</h2>
                <p className="text-muted-foreground mb-6">
                  Fill in the form below and we&apos;ll respond within one business day.
                </p>
                <ContactForm pageSource="/contact" properties={propertyOptions} />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-serif text-navy mb-4">Get in touch</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Prefer to call or email? Use the details below. For property viewings, we recommend using the form so we can schedule a time that works for you.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-0.5">Address</p>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">
                        {content.footer.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-0.5">Phone</p>
                      <Link
                        href={`tel:${content.footer.phone.replace(/\s/g, "")}`}
                        className="text-muted-foreground text-sm hover:text-gold transition-colors"
                      >
                        {content.footer.phone}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-0.5">Email</p>
                      <Link
                        href={`mailto:${content.footer.email}`}
                        className="text-muted-foreground text-sm hover:text-gold transition-colors"
                      >
                        {content.footer.email}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Submissions from this form are sent to our CRM. Our team will review your inquiry and contact you shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  )
}
