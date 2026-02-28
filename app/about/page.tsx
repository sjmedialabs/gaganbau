import type { Metadata } from "next"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getAboutContent } from "@/lib/about-store"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"
import {
  Building2,
  Leaf,
  ShieldCheck,
  Handshake,
  TreePine,
  Zap,
  Droplets,
  Recycle,
} from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "About | Gagan Bau GmbH",
  description:
    "Learn about our vision and corporate responsibility. Gagan Bau GmbH.",
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

  const { hero, vision, mission, responsibility } = about

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif mb-6">
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
            <h2 className="text-3xl md:text-4xl font-serif text-navy mb-4">
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
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif text-navy leading-snug mb-8">
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
              <h2 className="text-3xl md:text-4xl font-serif text-navy mb-6">
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

      <Footer content={content.footer} />
    </main>
  )
}
