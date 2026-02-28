import type { Metadata } from "next"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getBlogPosts } from "@/lib/blog-store"
import { getAllProperties } from "@/lib/properties-store"
import { BlogFilterAndGrid } from "@/components/blog/BlogFilterAndGrid"

export const revalidate = 60
export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "Blog | Gagan Bau GmbH",
  description: "Insights, news, and stories from the world of premium real estate development. Stay informed with Gagan Bau GmbH.",
}

export default async function BlogPage() {
  const [content, properties, blogPosts] = await Promise.all([
    getHomePageContent(),
    getAllProperties(),
    getBlogPosts(),
  ])
  const activePosts = blogPosts.filter((p) => p.isActive).sort((a, b) => a.order - b.order)

  const featured = activePosts.find((p) => p.featured)
  const regularPosts = activePosts.filter((p) => !p.featured)

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif mb-6 animate-fade-up">
            Our Blog
          </h1>
          <p className="text-white/60 max-w-xl text-lg leading-relaxed animate-blur-in" style={{ animationDelay: "200ms" }}>
            News, perspectives, and expert insights from the world of premium real estate development.
          </p>
        </div>
      </section>

      {/* Featured Post (when All or matching category) + Category Filter + Blog Grid */}
      <BlogFilterAndGrid featured={featured} regularPosts={regularPosts} />

      {/* Newsletter CTA */}
      <section className="py-20 bg-navy">
        <div className="max-w-[700px] mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.25em] text-gold font-medium uppercase mb-4 block">Stay Connected</span>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
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
