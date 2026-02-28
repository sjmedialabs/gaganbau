import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog-store"
import { getAllProperties } from "@/lib/properties-store"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

export const revalidate = 60
export const runtime = "nodejs"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: "Post not found | Gagan Bau GmbH" }
  return {
    title: `${post.title} | Blog | Gagan Bau GmbH`,
    description: post.excerpt || undefined,
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.filter((p) => p.slug && p.isActive).map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [content, properties, post] = await Promise.all([
    getHomePageContent(),
    getAllProperties(),
    getBlogPostBySlug(slug),
  ])

  if (!post || !post.isActive) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header} isTransparent={false} properties={properties} />

      {/* Back link */}
      <div className="border-b border-border bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-[900px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <span className="inline-block text-xs tracking-[0.2em] text-gold font-medium uppercase mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-navy mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </span>
        </div>

        {post.image && (
          <div className="aspect-video rounded-lg overflow-hidden mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-lg leading-relaxed">{post.excerpt}</p>
        </div>
      </article>

      <Footer content={content.footer} />
    </main>
  )
}
