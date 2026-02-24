import { Header } from "@/components/home/Header"
import { HeroSlider } from "@/components/home/HeroSlider"
import { ConceptSection } from "@/components/home/ConceptSection"
import { ProjectsSlider } from "@/components/home/ProjectsSlider"
import { WhyChooseSection } from "@/components/home/WhyChooseSection"
import { PressSection } from "@/components/home/PressSection"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"
import { getAllProperties } from "@/lib/properties-store"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Get content from Firestore (returns default content if not found)
  const content = await getHomePageContent()
  const properties = await getAllProperties()

  return (
    <main>
      <Header content={content.header} isTransparent={true} properties={properties} />
      <HeroSlider 
        slides={content.heroSlides} 
        animation={content.carouselSettings?.heroAnimation}
        autoPlaySpeed={content.carouselSettings?.autoPlaySpeed}
      />
      <ProjectsSlider 
        projects={content.projects}
        animation={content.carouselSettings?.projectsAnimation}
        autoPlaySpeed={content.carouselSettings?.autoPlaySpeed}
      />
      <ConceptSection content={content.concept} />
      <WhyChooseSection content={content.whyChoose} />
      <PressSection content={content.press} />
      <Footer content={content.footer} />
    </main>
  )
}
