"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, User, Filter } from "lucide-react"
import type { BlogPost } from "@/lib/types"

interface BlogFilterAndGridProps {
  featured: BlogPost | undefined
  regularPosts: BlogPost[]
}

export function BlogFilterAndGrid({ featured, regularPosts }: BlogFilterAndGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const set = new Set<string>()
    regularPosts.forEach((p) => p.category?.trim() && set.add(p.category.trim()))
    if (featured?.category?.trim()) set.add(featured.category.trim())
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [regularPosts, featured])

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return regularPosts
    return regularPosts.filter((p) => (p.category || "").trim() === selectedCategory)
  }, [regularPosts, selectedCategory])

  const showFeatured =
    featured &&
    (!selectedCategory || (featured.category || "").trim() === selectedCategory)

  return (
    <>
      {/* Featured Post - only when All or matching category */}
      {showFeatured && (
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

      {/* Category Filter - dynamic from post categories */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center gap-3 py-5">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
              <Filter className="w-4 h-4 text-gold" />
              Filter by:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === null
                    ? "bg-gold text-white shadow-sm"
                    : "bg-background border border-border text-muted-foreground hover:border-gold/50 hover:text-navy"
                }`}
              >
                All Posts
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-gold text-white shadow-sm"
                      : "bg-background border border-border text-muted-foreground hover:border-gold/50 hover:text-navy"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {selectedCategory && (
              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article
                  className="bg-background border border-border overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-500 h-full flex flex-col animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
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
          {filteredPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No posts in this category.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
