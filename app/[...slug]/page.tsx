import Link from "next/link"
import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"
import { getHomePageContent } from "@/lib/content-store"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params
  const content = await getHomePageContent()
  
  // Format the page title from slug
  const pageTitle = slug
    .join(" / ")
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <main className="min-h-screen flex flex-col">
      <Header content={content.header} isTransparent={false} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <span className="inline-block text-xs tracking-[0.2em] text-gold font-medium mb-4 uppercase animate-fade-down">
            Page
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif mb-6 animate-fade-up">
            {pageTitle}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto animate-blur-in" style={{ animationDelay: '200ms' }}>
            This page is currently under construction. Please check back soon for updates.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 lg:py-28 bg-white flex-1">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-2xl md:text-3xl text-navy font-normal mb-6">
              Coming Soon
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are working hard to bring you this content. In the meantime, feel free to explore our other pages or contact us for more information.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Link 
              href="/"
              className="group p-8 border border-border rounded-lg hover:border-gold hover:shadow-lg transition-all duration-300 animate-flip-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-navy mb-2 group-hover:text-gold transition-colors">Home</h3>
              <p className="text-sm text-muted-foreground">Return to our main page</p>
            </Link>

            <Link 
              href="/#projects"
              className="group p-8 border border-border rounded-lg hover:border-gold hover:shadow-lg transition-all duration-300 animate-flip-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-navy mb-2 group-hover:text-gold transition-colors">Our Projects</h3>
              <p className="text-sm text-muted-foreground">View our developments</p>
            </Link>

            <Link 
              href="/#contact"
              className="group p-8 border border-border rounded-lg hover:border-gold hover:shadow-lg transition-all duration-300 animate-flip-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-navy mb-2 group-hover:text-gold transition-colors">Contact Us</h3>
              <p className="text-sm text-muted-foreground">Get in touch with us</p>
            </Link>
          </div>

          {/* CTA */}
          <div className="text-center animate-zoom-in" style={{ animationDelay: '400ms' }}>
            <Link
              href="/"
              className="inline-block bg-gold hover:bg-gold-dark text-white px-8 py-3 text-sm font-medium btn-hover-shine btn-hover-lift transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer content={content.footer} />
    </main>
  )
}
