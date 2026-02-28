import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"
import { getAllGalleryAlbums } from "@/lib/properties-store"
import { GalleryGrid } from "@/components/gallery/GalleryGrid"

export const revalidate = 60
export const runtime = "nodejs"

export const metadata = {
  title: "Gallery | Property Photo Albums",
  description: "Browse our collection of property photos and project galleries",
}

export default async function GalleryPage() {
  const [content, properties, albums] = await Promise.all([
    getHomePageContent(),
    getAllProperties(),
    getAllGalleryAlbums(),
  ])

  // Filter only active albums with images
  const activeAlbums = albums.filter((album) => album.isActive && album.images.length > 0)

  return (
    <main className="min-h-screen bg-background">
      <Header content={content.header} isTransparent={false} properties={properties} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            Project Gallery
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Explore our portfolio of completed and ongoing projects through stunning
            photography showcasing the quality and craftsmanship of our developments.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {activeAlbums.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No galleries available yet</p>
              <p className="text-muted-foreground mt-2">
                Check back soon for project photos
              </p>
            </div>
          ) : (
            <GalleryGrid albums={activeAlbums} />
          )}
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  )
}
