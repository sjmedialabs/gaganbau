import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getAboutContent } from "@/lib/about-store"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"
import {
  ArrowRight,
  Building2,
  Leaf,
  ShieldCheck,
  Handshake,
  TreePine,
  Zap,
  Droplets,
  Recycle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "About | Gagan Bau GmbH",
  description:
    "Learn about our vision, corporate responsibility, and land purchase opportunities. Gagan Bau GmbH.",
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  ShieldCheck,
  Handshake,
  TreePine,
  Zap,
  Droplets,
  Recycle,
}

function getIcon(name: string) {
  return iconMap[name] ?? Building2
}

export default async function AboutPage() {
  const [about, content, properties] = await Promise.all([
    getAboutContent(),
    getHomePageContent(),
    getAllProperties(),
  ])

  const { hero, vision, mission, responsibility, landPurchase, cta } = about

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header} isTransparent={false} properties={properties} />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0">
          {hero.image && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.image}
                alt=""
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-navy/60 to-navy" />
            </>
          )}
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <span className="inline-block text-xs tracking-[0.25em] text-gold font-medium mb-4 uppercase">
            {hero.label}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif italic mb-6">
            {hero.title}
          </h1>
          <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">
              {vision.label}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-navy mb-4">
              {vision.title}
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            {vision.points.sort((a, b) => a.order - b.order).map((point) => {
              const Icon = getIcon(point.icon)
              return (
                <div
                  key={point.id}
                  className="p-8 border border-border hover:border-gold/30 hover:shadow-lg transition-all duration-500 group"
                >
                  <div className="w-14 h-14 border-2 border-gold/30 rounded-full flex items-center justify-center mb-6 group-hover:border-gold group-hover:bg-gold/5 transition-all duration-300">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-xl font-medium text-navy mb-4">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#faf6ef]">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <Leaf className="w-10 h-10 text-gold mx-auto mb-8" />
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-navy leading-snug mb-8">
            &quot;{mission.quote}&quot;
          </blockquote>
          <div className="w-16 h-px bg-gold mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{mission.caption}</p>
        </div>
      </section>

      {/* Responsibility */}
      <section className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">
                {responsibility.label}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-navy mb-6">
                {responsibility.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {responsibility.intro}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {responsibility.intro2}
              </p>
              {responsibility.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={responsibility.image}
                    alt="Sustainable development"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                </div>
              )}
            </div>
            <div className="space-y-6 lg:pt-16">
              {responsibility.initiatives.sort((a, b) => a.order - b.order).map((item) => {
                const Icon = getIcon(item.icon)
                return (
                  <div
                    key={item.id}
                    className="flex gap-5 p-6 border border-border hover:border-gold/30 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 border-2 border-gold/30 rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:bg-gold/5 transition-all">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-navy mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Land Purchase */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">
                {landPurchase.label}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-6">
                {landPurchase.title}
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">{landPurchase.intro}</p>
              <p className="text-white/60 leading-relaxed mb-8">{landPurchase.intro2}</p>
              <div className="space-y-5">
                <h3 className="text-white font-medium">What we are looking for:</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {landPurchase.lookingFor.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-gold rounded-full" />
                      </div>
                      <span className="text-sm text-white/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 lg:p-12">
              <h3 className="text-2xl font-serif italic text-white mb-6">
                {landPurchase.contactCardTitle}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {landPurchase.contactCardDescription}
              </p>
              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Address</p>
                    <p className="text-sm text-white/80">{landPurchase.contactAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Phone</p>
                    <Link
                      href={`tel:${landPurchase.contactPhone.replace(/\s/g, "")}`}
                      className="text-sm text-white/80 hover:text-gold transition-colors"
                    >
                      {landPurchase.contactPhone}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <Link
                      href={`mailto:${landPurchase.contactEmail}`}
                      className="text-sm text-white/80 hover:text-gold transition-colors"
                    >
                      {landPurchase.contactEmail}
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href={`mailto:${landPurchase.contactEmail}`}
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium btn-hover-shine transition-all w-full justify-center"
              >
                {landPurchase.contactButtonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">
            {cta.label}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif italic text-navy mb-4">{cta.title}</h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-10 py-3.5 text-sm font-medium btn-hover-shine btn-hover-lift transition-all"
            >
              {cta.projectsText}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 border border-navy text-navy px-10 py-3.5 text-sm font-medium bg-transparent hover:bg-navy hover:text-white transition-all"
            >
              {cta.galleryText}
            </Link>
          </div>
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  )
}
