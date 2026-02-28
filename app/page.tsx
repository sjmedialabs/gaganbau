import { Header } from "@/components/home/Header"
import { HeroSlider } from "@/components/home/HeroSlider"
import { ConceptSection } from "@/components/home/ConceptSection"
import { ProjectsSlider } from "@/components/home/ProjectsSlider"
import { WhyChooseSection } from "@/components/home/WhyChooseSection"
import { BlogSection } from "@/components/home/BlogSection"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getBlogPosts } from "@/lib/blog-store"
import { getAllProperties } from "@/lib/properties-store"

export const dynamic = "force-dynamic"
/** Use Node.js runtime so Firebase/data fetching work (Edge would 500). */
export const runtime = "nodejs"

export default async function HomePage() {
  const content = await getHomePageContent()
  const properties = await getAllProperties()
  const blogPosts = await getBlogPosts()
  const blogItems = blogPosts
    .filter((p) => p.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((p) => ({
      date: p.date,
      title: p.title,
      link: `/blog/${p.slug}`,
    }))

  return (
    <main>
      <Header content={content.header} isTransparent={true} properties={properties} />
      <HeroSlider
        slides={content.heroSlides}
        animation={content.carouselSettings?.heroAnimation}
        autoPlaySpeed={content.carouselSettings?.autoPlaySpeed}
      />
      <ConceptSection content={content.concept} />
      <ProjectsSlider
        projects={content.projects}
        animation={content.carouselSettings?.projectsAnimation}
        autoPlaySpeed={content.carouselSettings?.autoPlaySpeed}
      />
      <WhyChooseSection content={content.whyChoose} />
      <BlogSection content={content.blog} items={blogItems} />
      <Footer content={content.footer} />
    </main>
  )
}
