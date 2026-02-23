import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
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
  title: "Pursue | Gagan Bau GmbH",
  description:
    "Learn about our vision, corporate responsibility, and land purchase opportunities. Pursue excellence with Gagan Bau GmbH.",
}

const visionPoints = [
  {
    icon: Building2,
    title: "About Us",
    description:
      "Gagan Bau GmbH is a Munich-based premium real estate developer committed to creating residential developments that set new standards in quality, design, and sustainability. Founded on the belief that exceptional living spaces shape exceptional lives, we combine architectural innovation with meticulous craftsmanship to deliver homes that stand the test of time.",
  },
  {
    icon: ShieldCheck,
    title: "Our Promise",
    description:
      "Every project we undertake carries our commitment to transparency, reliability, and uncompromising quality. From the first sketch to the final handover, we maintain the highest standards and keep our partners, investors, and future residents informed at every stage.",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    description:
      "We collaborate with leading architects, interior designers, and construction firms to ensure every development reflects a shared pursuit of excellence. Our network of trusted partners enables us to deliver consistently outstanding results across all our projects.",
  },
]

const sustainabilityInitiatives = [
  {
    icon: TreePine,
    title: "Green Building Standards",
    description: "All new developments target KfW 40 or better energy efficiency ratings, minimizing environmental impact while maximizing resident comfort.",
  },
  {
    icon: Zap,
    title: "Renewable Energy",
    description: "We integrate photovoltaic systems, heat pumps, and smart energy management into our buildings to reduce carbon footprints and energy costs.",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    description: "Rainwater harvesting, greywater recycling, and water-efficient landscaping are standard features across our residential developments.",
  },
  {
    icon: Recycle,
    title: "Sustainable Materials",
    description: "We prioritize responsibly sourced, recycled, and low-emission building materials to protect both the environment and the health of residents.",
  },
]

export default async function PursuePage() {
  const content = await getHomePageContent()
  const properties = await getAllProperties()

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header} isTransparent={false} properties={properties} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/pursue-hero.jpg"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 to-navy" />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <span className="inline-block text-xs tracking-[0.25em] text-gold font-medium mb-4 uppercase animate-fade-down">
            Our Vision
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif italic mb-6 animate-fade-up">
            Pursue Excellence
          </h1>
          <p className="text-white/60 max-w-2xl text-lg leading-relaxed animate-blur-in" style={{ animationDelay: "200ms" }}>
            Driven by a vision to redefine luxury living in Munich, we pursue every project with the same unwavering commitment to quality, sustainability, and community.
          </p>
        </div>
      </section>

      {/* About / Vision Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-serif italic text-navy mb-4">
              Built on Vision, Driven by Values
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            {visionPoints.map((point, index) => (
              <div
                key={point.title}
                className="p-8 border border-border hover:border-gold/30 hover:shadow-lg transition-all duration-500 group animate-fade-up"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="w-14 h-14 border-2 border-gold/30 rounded-full flex items-center justify-center mb-6 group-hover:border-gold group-hover:bg-gold/5 transition-all duration-300">
                  <point.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-medium text-navy mb-4">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-[#faf6ef]">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <Leaf className="w-10 h-10 text-gold mx-auto mb-8" />
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif italic text-navy leading-snug mb-8">
            "We believe that the spaces we create today shape the communities of tomorrow. Every development is a promise of quality, sustainability, and enduring value."
          </blockquote>
          <div className="w-16 h-px bg-gold mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Gagan Bau GmbH Leadership</p>
        </div>
      </section>

      {/* Responsibility / Sustainability */}
      <section className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">
                Responsibility
              </span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-navy mb-6">
                Sustainable Development
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sustainability is not an afterthought at Gagan Bau. It is woven into every decision, from site selection and material sourcing to energy systems and landscaping. We hold ourselves accountable to both current residents and future generations.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our commitment extends beyond our buildings. We actively support urban greening initiatives, promote biodiversity in our developments, and work with local authorities to create public spaces that benefit entire neighborhoods.
              </p>
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/pursue-hero.jpg"
                  alt="Sustainable development"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              </div>
            </div>
            <div className="space-y-6 lg:pt-16">
              {sustainabilityInitiatives.map((initiative, index) => (
                <div
                  key={initiative.title}
                  className="flex gap-5 p-6 border border-border hover:border-gold/30 hover:shadow-md transition-all duration-300 group animate-fade-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 border-2 border-gold/30 rounded-full flex items-center justify-center flex-shrink-0 group-hover:border-gold group-hover:bg-gold/5 transition-all">
                    <initiative.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-navy mb-2">{initiative.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{initiative.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Land Purchase */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">
                Land Purchase
              </span>
              <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-6">
                We Are Always Looking for Land
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Gagan Bau is continuously seeking prime development plots across the Munich metropolitan area. Whether you own a single parcel or a larger site, we offer a straightforward, fair, and confidential process for acquiring land with development potential.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Our experienced acquisitions team evaluates each opportunity with care, considering zoning regulations, neighborhood context, and long-term development potential. We value relationships with landowners and ensure every transaction is transparent and mutually beneficial.
              </p>

              <div className="space-y-5">
                <h3 className="text-white font-medium">What we are looking for:</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Residential zoning (WA / WR)",
                    "Mixed-use development plots",
                    "Inner-city infill sites",
                    "Plots from 800m\u00B2 upward",
                    "Sites with existing buildings",
                    "Suburban growth areas",
                  ].map((item) => (
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

            {/* Contact Card */}
            <div className="bg-white/5 border border-white/10 p-10 lg:p-12">
              <h3 className="text-2xl font-serif italic text-white mb-6">
                Get in Touch
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                If you have a land opportunity to discuss or would like to learn more about partnering with Gagan Bau, please reach out to our acquisitions team.
              </p>
              <div className="space-y-5 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Address</p>
                    <p className="text-sm text-white/80">Munich, Germany</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Phone</p>
                    <Link href="tel:+4989123456" className="text-sm text-white/80 hover:text-gold transition-colors">
                      +49 89 123 456
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <Link href="mailto:land@gaganbau.de" className="text-sm text-white/80 hover:text-gold transition-colors">
                      land@gaganbau.de
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href="mailto:land@gaganbau.de"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium btn-hover-shine transition-all w-full justify-center"
              >
                Submit a Land Opportunity
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Projects */}
      <section className="py-20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">Explore Our Work</span>
          <h2 className="text-3xl md:text-4xl font-serif italic text-navy mb-4">See Our Projects in Action</h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            From concept to completion, explore our portfolio of premium residential developments across Munich.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-10 py-3.5 text-sm font-medium btn-hover-shine btn-hover-lift transition-all"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 border border-navy text-navy px-10 py-3.5 text-sm font-medium bg-transparent hover:bg-navy hover:text-white transition-all"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  )
}
