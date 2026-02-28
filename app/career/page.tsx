import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"
import {
  MapPin,
  Briefcase,
  Clock,
  ArrowRight,
  Building2,
  Heart,
  GraduationCap,
  Users,
  Trophy,
  Leaf,
} from "lucide-react"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Career | Gagan Bau GmbH",
  description:
    "Join the Gagan Bau team. Explore career opportunities in premium real estate development, architecture, project management, and more.",
}

const openPositions = [
  {
    id: "1",
    title: "Senior Project Manager",
    department: "Project Management",
    location: "Munich, Germany",
    type: "Full-time",
    description:
      "Lead end-to-end delivery of luxury residential developments, coordinating architects, contractors, and internal teams to achieve exceptional results on time and on budget.",
  },
  {
    id: "2",
    title: "Architect / Design Lead",
    department: "Design & Architecture",
    location: "Munich, Germany",
    type: "Full-time",
    description:
      "Shape the future of premium living spaces. Lead the architectural vision for our upcoming residential projects, working closely with renowned external firms.",
  },
  {
    id: "3",
    title: "Sales & Marketing Manager",
    department: "Sales",
    location: "Munich, Germany",
    type: "Full-time",
    description:
      "Drive our brand presence and property sales strategy. Build relationships with high-net-worth clients and develop compelling marketing campaigns for new developments.",
  },
  {
    id: "4",
    title: "Construction Site Supervisor",
    department: "Construction",
    location: "Munich, Germany",
    type: "Full-time",
    description:
      "Oversee day-to-day operations on active construction sites, ensuring adherence to quality standards, safety protocols, and project timelines.",
  },
  {
    id: "5",
    title: "Finance & Controlling Analyst",
    department: "Finance",
    location: "Munich, Germany",
    type: "Full-time",
    description:
      "Support financial planning, budgeting, and controlling for real estate projects. Prepare investment analyses and monitor project profitability.",
  },
]

const cultureValues = [
  {
    icon: Trophy,
    title: "Excellence",
    description: "We hold ourselves to the highest standards in everything we deliver, from design to construction to client experience.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Great developments are built by great teams. We foster an environment where every voice matters and ideas flourish.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "We are committed to building a greener future, integrating sustainable practices into every project we undertake.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Real estate is more than bricks and mortar. We are driven by a genuine passion for creating spaces people love to call home.",
  },
]

const benefits = [
  "Competitive salary and performance bonuses",
  "Flexible working arrangements",
  "Professional development budget",
  "Company pension scheme",
  "Team events and company retreats",
  "Modern office in central Munich",
  "Public transport allowance",
  "Health and wellness programs",
]

export default async function CareerPage() {
  const [content, properties] = await Promise.all([
    getHomePageContent(),
    getAllProperties(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header} isTransparent={false} properties={properties} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/career-hero.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <span className="inline-block text-xs tracking-[0.25em] text-gold font-medium mb-4 uppercase animate-fade-down">
            Join Our Team
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif mb-6 animate-fade-up">
            Build Your Future With Us
          </h1>
          <p className="text-white/60 max-w-2xl text-lg leading-relaxed animate-blur-in" style={{ animationDelay: "200ms" }}>
            At Gagan Bau, we do not just build premium residences. We build careers. Join a team of passionate professionals who are reshaping the Munich skyline.
          </p>
          <div className="flex items-center gap-4 mt-10 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <a href="#positions" className="bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium btn-hover-shine transition-all">
              View Open Positions
            </a>
            <a href="#culture" className="border border-white/30 hover:border-gold text-white px-8 py-3 text-sm font-medium bg-transparent hover:bg-white/5 transition-all">
              Our Culture
            </a>
          </div>
        </div>
      </section>

      {/* Culture Values */}
      <section id="culture" className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-serif text-navy mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our culture is the foundation of everything we build. These values guide our decisions, shape our team, and define the standard of our work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <div
                key={value.title}
                className="text-center p-8 border border-border hover:border-gold/30 hover:shadow-lg transition-all duration-500 group animate-flip-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 border-2 border-gold/30 rounded-full flex items-center justify-center group-hover:border-gold group-hover:bg-gold/5 transition-all duration-300">
                  <value.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-lg font-medium text-navy mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">Benefits</span>
              <h2 className="text-3xl md:text-4xl font-serif text-navy mb-6">
                Why Gagan Bau?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We invest in our people just as we invest in our projects. From career growth to day-to-day wellbeing, here is what you can expect when you join the team.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 animate-fade-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-gold rounded-full" />
                    </div>
                    <span className="text-sm text-navy">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/career-hero.jpg"
                  alt="Team collaboration at Gagan Bau"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-navy p-6 max-w-[220px]">
                <div className="text-3xl font-serif text-gold mb-1">50+</div>
                <p className="text-white/70 text-sm">Talented professionals across 8 departments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-serif text-navy mb-4">Open Positions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our current openings and find the role that matches your ambition. We are always looking for talented individuals who share our vision.
            </p>
          </div>

          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div
                key={position.id}
                className="group border border-border hover:border-gold/30 hover:shadow-md transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-navy group-hover:text-gold transition-colors">
                          {position.title}
                        </h3>
                        <span className="text-xs bg-gold/10 text-gold px-3 py-1">
                          {position.department}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 lg:mb-0 max-w-2xl">
                        {position.description}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {position.type}
                        </span>
                      </div>
                      <Link
                        href={`/career/${position.id}`}
                        className="inline-flex items-center gap-2 text-sm text-gold font-medium hover:gap-3 transition-all"
                      >
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speculative Application CTA */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-[700px] mx-auto px-6 text-center relative z-10">
          <GraduationCap className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Don't See Your Dream Role?
          </h2>
          <p className="text-white/60 leading-relaxed mb-8">
            We are always open to exceptional talent. Send us your speculative application and tell us how you would contribute to the Gagan Bau vision.
          </p>
          <Link
            href="mailto:careers@gaganbau.de"
            className="inline-block bg-gold hover:bg-gold-dark text-white px-10 py-3.5 text-sm font-medium btn-hover-shine btn-hover-lift transition-all"
          >
            Send Your Application
          </Link>
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  )
}
