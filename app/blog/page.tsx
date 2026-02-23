import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Blog | Gagan Bau GmbH",
  description: "Insights, news, and stories from the world of premium real estate development. Stay informed with Gagan Bau GmbH.",
}

const blogPosts = [
  {
    id: "1",
    slug: "sustainable-luxury-living",
    title: "The Future of Sustainable Luxury Living in Munich",
    excerpt: "Discover how modern building techniques and sustainable materials are reshaping the luxury real estate landscape in Munich, creating homes that are as kind to the environment as they are beautiful to live in.",
    category: "Sustainability",
    author: "Gagan Bau Team",
    date: "January 15, 2026",
    readTime: "6 min read",
    image: "/images/blog-hero.jpg",
    featured: true,
  },
  {
    id: "2",
    slug: "munich-real-estate-trends-2026",
    title: "Munich Real Estate Market Trends for 2026",
    excerpt: "An in-depth analysis of the Munich property market, key neighborhoods to watch, and investment opportunities in the coming year.",
    category: "Market Insights",
    author: "Gagan Bau Team",
    date: "January 8, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop&auto=format",
    featured: false,
  },
  {
    id: "3",
    slug: "interior-design-trends",
    title: "Interior Design Trends Shaping Premium Residences",
    excerpt: "From biophilic design to smart home integration, explore the interior trends that define contemporary luxury living spaces.",
    category: "Design",
    author: "Gagan Bau Team",
    date: "December 20, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop&auto=format",
    featured: false,
  },
  {
    id: "4",
    slug: "community-building-in-residential",
    title: "Building Communities, Not Just Residences",
    excerpt: "How thoughtful urban planning and shared amenities create vibrant communities within residential developments.",
    category: "Community",
    author: "Gagan Bau Team",
    date: "December 12, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop&auto=format",
    featured: false,
  },
  {
    id: "5",
    slug: "energy-efficient-construction",
    title: "Energy Efficiency in Modern Construction: A Deep Dive",
    excerpt: "Exploring the latest technologies and methodologies that make new buildings dramatically more energy-efficient without compromising comfort.",
    category: "Sustainability",
    author: "Gagan Bau Team",
    date: "November 28, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop&auto=format",
    featured: false,
  },
  {
    id: "6",
    slug: "choosing-right-neighborhood",
    title: "How to Choose the Right Neighborhood in Munich",
    excerpt: "A comprehensive guide to Munich's most desirable neighborhoods, from family-friendly suburbs to vibrant urban districts.",
    category: "Guide",
    author: "Gagan Bau Team",
    date: "November 15, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop&auto=format",
    featured: false,
  },
]

export default async function BlogPage() {
  const content = await getHomePageContent()
  const properties = await getAllProperties()

  const featured = blogPosts.find((p) => p.featured)
  const regularPosts = blogPosts.filter((p) => !p.featured)

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header} isTransparent={false} properties={properties} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <span className="inline-block text-xs tracking-[0.25em] text-gold font-medium mb-4 uppercase animate-fade-down">
            Insights & Stories
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif italic mb-6 animate-fade-up">
            Our Blog
          </h1>
          <p className="text-white/60 max-w-xl text-lg leading-relaxed animate-blur-in" style={{ animationDelay: "200ms" }}>
            News, perspectives, and expert insights from the world of premium real estate development.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="py-16 lg:py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="grid lg:grid-cols-2 gap-0 bg-background border border-border overflow-hidden hover:border-gold/30 hover:shadow-xl transition-all duration-500">
                <div className="aspect-video lg:aspect-auto lg:min-h-[420px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image || "/placeholder.svg"}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-14">
                  <span className="text-xs tracking-[0.2em] text-gold font-medium uppercase mb-4">
                    Featured Article
                  </span>
                  <span className="inline-block text-xs bg-gold/10 text-gold px-3 py-1 mb-5 w-fit">
                    {featured.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif text-navy group-hover:text-gold transition-colors mb-4 leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-5 text-xs text-muted-foreground mb-8">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {featured.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {featured.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm text-gold font-medium group-hover:gap-3 transition-all">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="border-y border-border bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-6 py-4 overflow-x-auto text-sm">
            <button type="button" className="text-navy font-medium border-b-2 border-gold pb-1 whitespace-nowrap">All Posts</button>
            <button type="button" className="text-muted-foreground hover:text-navy transition-colors whitespace-nowrap">Market Insights</button>
            <button type="button" className="text-muted-foreground hover:text-navy transition-colors whitespace-nowrap">Sustainability</button>
            <button type="button" className="text-muted-foreground hover:text-navy transition-colors whitespace-nowrap">Design</button>
            <button type="button" className="text-muted-foreground hover:text-navy transition-colors whitespace-nowrap">Community</button>
            <button type="button" className="text-muted-foreground hover:text-navy transition-colors whitespace-nowrap">Guide</button>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article
                  className="bg-background border border-border overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-500 h-full flex flex-col animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-block text-xs bg-gold/10 text-gold px-3 py-1 mb-4 w-fit">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-serif text-navy group-hover:text-gold transition-colors mb-3 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-navy">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">Stay Connected</span>
          <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-4">
            Never Miss an Update
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Subscribe to receive the latest insights, project announcements, and exclusive real estate content directly in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-gold transition-colors"
            />
            <button type="button" className="bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium btn-hover-shine transition-all whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  )
}
