"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, Plus, Trash2, Loader2, Eye } from "lucide-react"
import type { BlogPost, BlogPageHero } from "@/lib/types"
import { defaultBlogPosts } from "@/lib/default-blog-posts"
import { defaultBlogHero } from "@/lib/default-blog-hero"
import { ImageUpload } from "@/components/admin/ImageUpload"

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "post"
}

function newPost(): BlogPost {
  const id = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  return {
    id,
    slug: `new-post-${id.slice(-6)}`,
    title: "New Blog Post",
    excerpt: "",
    category: "News",
    author: "Gagan Bau Team",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    readTime: "5 min read",
    image: "",
    featured: false,
    order: 0,
    isActive: true,
  }
}

export default function BlogEditor() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [hero, setHero] = useState<BlogPageHero>(defaultBlogHero)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/blog")
        if (res.ok) {
          const data = await res.json()
          setPosts(Array.isArray(data.posts) ? data.posts : defaultBlogPosts)
          if (data.hero && typeof data.hero.tagline === "string") {
            setHero(data.hero)
          }
        } else {
          setPosts(defaultBlogPosts)
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error)
        setPosts(defaultBlogPosts)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const seen = new Set<string>()
      const postsToSave = posts.map((p) => {
        let slug = (p.slug || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        if (!slug) slug = slugify(p.title || "post")
        let finalSlug = slug
        let n = 0
        while (seen.has(finalSlug)) {
          n += 1
          finalSlug = `${slug}-${n}`
        }
        seen.add(finalSlug)
        return { ...p, slug: finalSlug }
      })
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: postsToSave, hero }),
      })
      if (res.ok) {
        toast.success("Blog saved successfully!")
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err?.error || "Failed to save changes")
      }
    } catch (error) {
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const addPost = () => {
    const next = newPost()
    const minOrder = posts.length ? Math.min(...posts.map((p) => p.order), 0) : 0
    setPosts([{ ...next, order: minOrder - 1 }, ...posts])
  }

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  const sortedPosts = [...posts].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground mt-1">
            Manage blog posts shown on the blog page and home page
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/blog" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              View Blog
            </a>
          </Button>
          <Button variant="outline" onClick={addPost}>
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold-dark text-white">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog page hero</CardTitle>
          <CardDescription>
            Tagline, title, description and background image for the /blog page header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={hero.tagline}
                onChange={(e) => setHero({ ...hero, tagline: e.target.value })}
                placeholder="Insights & Stories"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="Our Blog"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
              placeholder="News, perspectives..."
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Background image</Label>
            <ImageUpload
              label="Hero background"
              value={hero.backgroundImage}
              onChange={(url) => setHero({ ...hero, backgroundImage: url })}
              folder="blog"
              aspectRatio="video"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blog section on home page</CardTitle>
          <CardDescription>
            The homepage shows the first 5 active posts here. To change the section title and label, use Home Page → Blog tab in the admin.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Posts</h2>
        {sortedPosts.map((post) => (
          <Card key={post.id} className={!post.isActive ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{post.title || "Untitled"}</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={post.isActive}
                    onCheckedChange={(checked) => updatePost(post.id, { isActive: checked })}
                  />
                  <span className="text-xs text-muted-foreground">Active</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePost(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={post.title}
                    onChange={(e) => {
                      const title = e.target.value
                      const slug = !post.slug || post.slug === "new-post" || post.slug.startsWith("new-post-")
                        ? slugify(title || "post")
                        : post.slug
                      updatePost(post.id, { title, slug })
                    }}
                    placeholder="Post title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL slug</Label>
                  <Input
                    value={post.slug}
                    onChange={(e) => updatePost(post.id, { slug: e.target.value.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    placeholder="auto-from-title"
                  />
                  <p className="text-xs text-muted-foreground">
                    Post URL: /blog/{post.slug || "…"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={post.excerpt}
                  onChange={(e) => updatePost(post.id, { excerpt: e.target.value })}
                  placeholder="Short summary..."
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={post.category}
                    onChange={(e) => updatePost(post.id, { category: e.target.value })}
                    placeholder="e.g. Sustainability"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    value={post.author}
                    onChange={(e) => updatePost(post.id, { author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    value={post.date}
                    onChange={(e) => updatePost(post.id, { date: e.target.value })}
                    placeholder="January 15, 2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Read time</Label>
                  <Input
                    value={post.readTime}
                    onChange={(e) => updatePost(post.id, { readTime: e.target.value })}
                    placeholder="5 min read"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Image</Label>
                  <ImageUpload
                    label="Post image"
                    value={post.image}
                    onChange={(url) => updatePost(post.id, { image: url })}
                    folder="blog"
                    aspectRatio="video"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={post.featured}
                      onCheckedChange={(checked) => updatePost(post.id, { featured: checked })}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={post.order}
                      onChange={(e) => updatePost(post.id, { order: Number.parseInt(e.target.value, 10) || 0 })}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
