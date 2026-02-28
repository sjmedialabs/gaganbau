"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, Eye, Loader2, Plus, Trash2, GripVertical } from "lucide-react"
import { defaultHomeContent } from "@/lib/default-content"
import type { ConceptSection, FooterContent, HeaderContent, WhyChooseSection, HomePageContent, CarouselSettings, CarouselAnimation, BlogSectionConfig, HeroSlide, ProjectSlide } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/ImageUpload"

export default function HomePageEditor() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [header, setHeader] = useState<HeaderContent>(defaultHomeContent.header)
  const [concept, setConcept] = useState<ConceptSection>(defaultHomeContent.concept)
  const [whyChoose, setWhyChoose] = useState<WhyChooseSection>(defaultHomeContent.whyChoose)
  const [footer, setFooter] = useState<FooterContent>(defaultHomeContent.footer)
  const [blog, setBlog] = useState<BlogSectionConfig>(defaultHomeContent.blog)
  const [carouselSettings, setCarouselSettings] = useState<CarouselSettings>(
    defaultHomeContent.carouselSettings || { heroAnimation: "fade", projectsAnimation: "fade", autoPlaySpeed: 6000 }
  )
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHomeContent.heroSlides)
  const [projects, setProjects] = useState<ProjectSlide[]>(defaultHomeContent.projects)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const validTabs = ["header", "concept", "whychoose", "blog", "hero", "projects", "carousel", "footer"]
  const [activeTab, setActiveTab] = useState(() =>
    tabParam && validTabs.includes(tabParam) ? tabParam : "header"
  )
  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) setActiveTab(tabParam)
  }, [tabParam])

  // Fetch content on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content/home")
        if (res.ok) {
          const data = await res.json()
          setContent(data)
          setHeader(data.header)
          setConcept(data.concept)
          setWhyChoose(data.whyChoose)
          setFooter(data.footer)
          if (data.blog) setBlog(data.blog)
          if (data.carouselSettings) {
            setCarouselSettings(data.carouselSettings)
          }
          if (data.heroSlides?.length) setHeroSlides(data.heroSlides)
          if (data.projects?.length) setProjects(data.projects)
        }
      } catch (error) {
        console.error("Failed to fetch content:", error)
        toast.error("Failed to load content")
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedContent = {
        ...content,
        header,
        concept,
        whyChoose,
        blog,
        footer,
        carouselSettings,
        heroSlides,
        projects,
      }
      
      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      })
      
      if (res.ok) {
        toast.success("Changes saved successfully!")
      } else {
        toast.error("Failed to save changes")
      }
    } catch (error) {
      toast.error("Failed to save changes")
} finally {
        setSaving(false)
    }
  }

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `hero-${Date.now()}`,
      title: "New Slide",
      subtitle: "Enter subtitle here",
      buttonText: "Learn More",
      buttonLink: "/",
      backgroundImage: "",
      order: heroSlides.length + 1,
      isActive: true,
    }
    setHeroSlides([...heroSlides, newSlide])
  }
  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides(heroSlides.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }
  const deleteSlide = (id: string) => {
    if (heroSlides.length <= 1) {
      toast.error("You must have at least one hero slide")
      return
    }
    setHeroSlides(heroSlides.filter((s) => s.id !== id))
  }

  const addProject = () => {
    const newProject: ProjectSlide = {
      id: `project-${Date.now()}`,
      label: "OUR CONCURRENT PROJECTS(3D)",
      title: "New Project\nName",
      description: "Enter project description here.",
      buttonText: "Explore More",
      buttonLink: "/projects/new-project",
      images: [""],
      order: projects.length + 1,
      isActive: true,
    }
    setProjects([...projects, newProject])
  }
  const updateProject = (id: string, updates: Partial<ProjectSlide>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }
  const deleteProject = (id: string) => {
    if (projects.length <= 1) {
      toast.error("You must have at least one project")
      return
    }
    setProjects(projects.filter((p) => p.id !== id))
  }
  const updateProjectImage = (projectId: string, imageIndex: number, value: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return
    const newImages = [...project.images]
    if (imageIndex >= newImages.length) newImages.length = imageIndex + 1
    newImages[imageIndex] = value
    updateProject(projectId, { images: newImages })
  }
  const addProjectImage = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return
    updateProject(projectId, { images: [...project.images, ""] })
  }
  const removeProjectImage = (projectId: string, imageIndex: number) => {
    const project = projects.find((p) => p.id === projectId)
    if (!project || project.images.length <= 1) return
    updateProject(projectId, { images: project.images.filter((_, i) => i !== imageIndex) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Home Page Editor</h1>
          <p className="text-muted-foreground mt-1">
            Manage all sections of your home page
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </a>
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold-dark text-white">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="header">Header/Logo</TabsTrigger>
          <TabsTrigger value="concept">Our Concept</TabsTrigger>
          <TabsTrigger value="whychoose">Why Choose</TabsTrigger>
          <TabsTrigger value="blog">Blog Section</TabsTrigger>
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="projects">Projects Slider</TabsTrigger>
          <TabsTrigger value="carousel">Carousel Settings</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Header Section */}
        <TabsContent value="header">
          <Card>
            <CardHeader>
              <CardTitle>Header / Navigation</CardTitle>
              <CardDescription>
                Edit header logo and navigation links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Logo"
                  value={header.logo}
                  onChange={(url) => setHeader({ ...header, logo: url })}
                  folder="branding"
                  aspectRatio="auto"
                />
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload your company logo. Recommended size: 200x60px or similar aspect ratio.
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Navigation Items</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Order is determined by position (1 = first). Use the arrows to reorder. Toggle <strong>Enabled</strong> to show or hide an item on the site; disabled items stay in the list but are hidden in the header.
                </p>
                <div className="space-y-4">
                  {header.navigation.map((item, index) => (
                    <div
                      key={`nav-${index}`}
                      className={`flex gap-2 md:gap-4 items-center flex-wrap p-3 rounded-lg border ${item.enabled === false ? "opacity-60 bg-muted/30" : ""}`}
                    >
                      <span className="text-sm text-muted-foreground w-6 shrink-0">{index + 1}.</span>
                      <Input
                        value={item.label}
                        onChange={(e) => {
                          const newNav = [...header.navigation]
                          newNav[index] = { ...item, label: e.target.value }
                          setHeader({ ...header, navigation: newNav })
                        }}
                        placeholder="Enter label"
                        className="flex-1 min-w-[100px]"
                      />
                      <Input
                        value={item.href}
                        onChange={(e) => {
                          const newNav = [...header.navigation]
                          newNav[index] = { ...item, href: e.target.value }
                          setHeader({ ...header, navigation: newNav })
                        }}
                        placeholder="Enter path"
                        className="flex-1 min-w-[100px]"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`nav-enabled-${index}`} className="text-xs text-muted-foreground whitespace-nowrap">Enabled</Label>
                          <Switch
                            id={`nav-enabled-${index}`}
                            checked={item.enabled !== false}
                            onCheckedChange={(checked) => {
                              const newNav = [...header.navigation]
                              newNav[index] = { ...item, enabled: checked }
                              setHeader({ ...header, navigation: newNav })
                            }}
                            title={item.enabled === false ? "Enable" : "Disable"}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === 0}
                          onClick={() => {
                            const newNav = [...header.navigation]
                            ;[newNav[index - 1], newNav[index]] = [newNav[index], newNav[index - 1]]
                            setHeader({ ...header, navigation: newNav })
                          }}
                          title="Move up"
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === header.navigation.length - 1}
                          onClick={() => {
                            const newNav = [...header.navigation]
                            ;[newNav[index], newNav[index + 1]] = [newNav[index + 1], newNav[index]]
                            setHeader({ ...header, navigation: newNav })
                          }}
                          title="Move down"
                        >
                          ↓
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            const newNav = header.navigation.filter((_, i) => i !== index)
                            setHeader({ ...header, navigation: newNav })
                          }}
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    setHeader({
                      ...header,
                      navigation: [...header.navigation, { label: "New link", href: "/", enabled: true }],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add nav item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Concept Section */}
        <TabsContent value="concept">
          <Card>
            <CardHeader>
              <CardTitle>Our Concept Section</CardTitle>
              <CardDescription>
                Edit the main concept section that appears after the hero
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="concept-label">Section Label</Label>
                  <Input
                    id="concept-label"
                    value={concept.label}
                    onChange={(e) => setConcept({ ...concept, label: e.target.value })}
                    placeholder="Enter section label"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concept-title">Title</Label>
                  <Input
                    id="concept-title"
                    value={concept.title}
                    onChange={(e) => setConcept({ ...concept, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="concept-description">Description</Label>
                  <Textarea
                    id="concept-description"
                    value={concept.description}
                    onChange={(e) => setConcept({ ...concept, description: e.target.value })}
                    placeholder="Enter description"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="concept-button">Button Text</Label>
                    <Input
                      id="concept-button"
                      value={concept.buttonText}
                      onChange={(e) => setConcept({ ...concept, buttonText: e.target.value })}
                      placeholder="Enter button text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concept-link">Button Link</Label>
                    <Input
                      id="concept-link"
                      value={concept.buttonLink}
                      onChange={(e) => setConcept({ ...concept, buttonLink: e.target.value })}
                      placeholder="Enter button link"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Background Image (Parallax)</h3>
                <ImageUpload
                  label="Background Image"
                  value={concept.backgroundImage || ""}
                  onChange={(url) => setConcept({ ...concept, backgroundImage: url })}
                  folder="backgrounds"
                  aspectRatio="video"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This image will be displayed with a parallax scrolling effect. Recommended size: 1920x1080px or larger.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Why Choose Section */}
        <TabsContent value="whychoose">
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Section</CardTitle>
              <CardDescription>
                Edit the "Why Choose Us" section with features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="why-label">Section Label</Label>
                    <Input
                      id="why-label"
                      value={whyChoose.label}
                      onChange={(e) => setWhyChoose({ ...whyChoose, label: e.target.value })}
                      placeholder="Enter section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="why-title">Title</Label>
                    <Textarea
                      id="why-title"
                      value={whyChoose.title}
                      onChange={(e) => setWhyChoose({ ...whyChoose, title: e.target.value })}
                      placeholder="Enter title"
                      rows={2}
                    />
                  </div>
                </div>
                <ImageUpload
                  label="Section Image"
                  value={whyChoose.image}
                  onChange={(url) => setWhyChoose({ ...whyChoose, image: url })}
                  folder="sections"
                  aspectRatio="video"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Feature Items</h3>
                <div className="grid gap-6">
                  {whyChoose.items.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Feature {index + 1}</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <ImageUpload
                          label="Icon Image"
                          value={item.iconImage || ""}
                          onChange={(url) => {
                            const newItems = [...whyChoose.items]
                            newItems[index] = { ...item, iconImage: url }
                            setWhyChoose({ ...whyChoose, items: newItems })
                          }}
                          folder="icons"
                          aspectRatio="square"
                        />
                        <div className="md:col-span-2 space-y-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...whyChoose.items]
                                newItems[index] = { ...item, title: e.target.value }
                                setWhyChoose({ ...whyChoose, items: newItems })
                              }}
                              placeholder="Enter card title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...whyChoose.items]
                                newItems[index] = { ...item, description: e.target.value }
                                setWhyChoose({ ...whyChoose, items: newItems })
                              }}
                              placeholder="Enter description"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Section */}
        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Blog Section (Home Page)</CardTitle>
              <CardDescription>
                Configure the blog section label and title shown on the home page. Blog posts are managed under Admin → Blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Section Label</Label>
                  <Input
                    value={blog.label}
                    onChange={(e) => setBlog({ ...blog, label: e.target.value })}
                    placeholder="Enter section title"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={blog.title}
                    onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>View All Link</Label>
                  <Input
                    value={blog.viewAllLink}
                    onChange={(e) => setBlog({ ...blog, viewAllLink: e.target.value })}
                    placeholder="Enter link"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Slides */}
        <TabsContent value="hero" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={addSlide}>
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </div>
          <div className="space-y-4">
            {heroSlides
              .sort((a, b) => a.order - b.order)
              .map((slide, index) => (
                <Card key={slide.id} className={!slide.isActive ? "opacity-60" : ""}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                        <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${slide.id}`} className="text-sm">Active</Label>
                          <Switch
                            id={`active-${slide.id}`}
                            checked={slide.isActive}
                            onCheckedChange={(checked) => updateSlide(slide.id, { isActive: checked })}
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteSlide(slide.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-6">
                      <ImageUpload
                        label="Background Image"
                        value={slide.backgroundImage}
                        onChange={(url) => updateSlide(slide.id, { backgroundImage: url })}
                        folder="hero"
                        aspectRatio="video"
                      />
                      <div className="md:col-span-2 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={slide.title} onChange={(e) => updateSlide(slide.id, { title: e.target.value })} placeholder="Enter title" />
                          </div>
                          <div className="space-y-2">
                            <Label>Subtitle</Label>
                            <Input value={slide.subtitle} onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })} placeholder="Enter subtitle" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input value={slide.buttonText} onChange={(e) => updateSlide(slide.id, { buttonText: e.target.value })} placeholder="Enter button text" />
                          </div>
                          <div className="space-y-2">
                            <Label>Button Link</Label>
                            <Input value={slide.buttonLink} onChange={(e) => updateSlide(slide.id, { buttonLink: e.target.value })} placeholder="Enter button link" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Order</Label>
                          <Input type="number" value={slide.order} onChange={(e) => updateSlide(slide.id, { order: Number.parseInt(e.target.value) || 1 })} min={1} className="w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Projects Slider */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={addProject}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
          <div className="space-y-6">
            {projects
              .sort((a, b) => a.order - b.order)
              .map((project, index) => (
                <Card key={project.id} className={!project.isActive ? "opacity-60" : ""}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Project {index + 1}: {project.title.split("\n")[0]}</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`active-${project.id}`} className="text-sm">Active</Label>
                          <Switch
                            id={`active-${project.id}`}
                            checked={project.isActive}
                            onCheckedChange={(checked) => updateProject(project.id, { isActive: checked })}
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteProject(project.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input value={project.label} onChange={(e) => updateProject(project.id, { label: e.target.value })} placeholder="Enter section title" />
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input type="number" value={project.order} onChange={(e) => updateProject(project.id, { order: Number.parseInt(e.target.value) || 1 })} min={1} className="w-24" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title (use \n for line break)</Label>
                        <Textarea value={project.title} onChange={(e) => updateProject(project.id, { title: e.target.value })} placeholder="Enter project names" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={project.description} onChange={(e) => updateProject(project.id, { description: e.target.value })} placeholder="Enter description" rows={2} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input value={project.buttonText} onChange={(e) => updateProject(project.id, { buttonText: e.target.value })} placeholder="Enter button text" />
                      </div>
                      <div className="space-y-2">
                        <Label>Button Link</Label>
                        <Input value={project.buttonLink} onChange={(e) => updateProject(project.id, { buttonLink: e.target.value })} placeholder="Enter button link" />
                      </div>
                    </div>
                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Project Images (at least 1)</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.images.map((_, imageIndex) => (
                          <div key={imageIndex} className="relative">
                            <ImageUpload
                              label={`Image ${imageIndex + 1}`}
                              value={project.images[imageIndex] || ""}
                              onChange={(url) => updateProjectImage(project.id, imageIndex, url)}
                              folder="projects"
                              aspectRatio="video"
                            />
                            {project.images.length > 1 && (
                              <Button type="button" variant="ghost" size="icon" className="absolute top-0 right-0 h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeProjectImage(project.id, imageIndex)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => addProjectImage(project.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Carousel Settings */}
        <TabsContent value="carousel">
          <Card>
            <CardHeader>
              <CardTitle>Carousel Animation Settings</CardTitle>
              <CardDescription>
                Configure animation effects for the hero and projects carousels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Hero Slider Animation</Label>
                  <Select
                    value={carouselSettings.heroAnimation}
                    onValueChange={(value: CarouselAnimation) => 
                      setCarouselSettings({ ...carouselSettings, heroAnimation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select animation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Fade - Smooth opacity</SelectItem>
                      <SelectItem value="slide">Slide - Horizontal</SelectItem>
                      <SelectItem value="zoom">Zoom - Scale effect</SelectItem>
                      <SelectItem value="flip">Flip - 3D rotation</SelectItem>
                      <SelectItem value="kenburns">Ken Burns - Cinematic pan/zoom</SelectItem>
                      <SelectItem value="blur">Blur - Defocus transition</SelectItem>
                      <SelectItem value="cube">Cube - 3D cube rotation</SelectItem>
                      <SelectItem value="cards">Cards - Stacked cards</SelectItem>
                      <SelectItem value="vertical">Vertical - Up/down slide</SelectItem>
                      <SelectItem value="creative">Creative - Scale + rotate</SelectItem>
                      <SelectItem value="parallax">Parallax - Depth effect</SelectItem>
                      <SelectItem value="shutters">Shutters - Blinds effect</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Animation effect for the main hero banner carousel
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Projects Slider Animation</Label>
                  <Select
                    value={carouselSettings.projectsAnimation}
                    onValueChange={(value: CarouselAnimation) => 
                      setCarouselSettings({ ...carouselSettings, projectsAnimation: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select animation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Fade - Smooth opacity</SelectItem>
                      <SelectItem value="slide">Slide - Horizontal</SelectItem>
                      <SelectItem value="zoom">Zoom - Scale effect</SelectItem>
                      <SelectItem value="flip">Flip - 3D rotation</SelectItem>
                      <SelectItem value="kenburns">Ken Burns - Cinematic pan/zoom</SelectItem>
                      <SelectItem value="blur">Blur - Defocus transition</SelectItem>
                      <SelectItem value="cube">Cube - 3D cube rotation</SelectItem>
                      <SelectItem value="cards">Cards - Stacked cards</SelectItem>
                      <SelectItem value="vertical">Vertical - Up/down slide</SelectItem>
                      <SelectItem value="creative">Creative - Scale + rotate</SelectItem>
                      <SelectItem value="parallax">Parallax - Depth effect</SelectItem>
                      <SelectItem value="shutters">Shutters - Blinds effect</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Animation effect for the "Our Concurrent Projects" carousel
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-2 max-w-md">
                  <Label>Auto-Play Speed (milliseconds)</Label>
                  <Input
                    type="number"
                    min="2000"
                    max="15000"
                    step="500"
                    value={carouselSettings.autoPlaySpeed}
                    onChange={(e) => 
                      setCarouselSettings({ ...carouselSettings, autoPlaySpeed: parseInt(e.target.value) || 6000 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Time between automatic slide transitions. Recommended: 5000-8000ms (5-8 seconds)
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Animation Effects Guide</h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Fade</div>
                    <p className="text-xs text-muted-foreground">Classic smooth opacity transition</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Slide</div>
                    <p className="text-xs text-muted-foreground">Horizontal left/right movement</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Zoom</div>
                    <p className="text-xs text-muted-foreground">Scale in from larger size</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium text-sm mb-1">Flip</div>
                    <p className="text-xs text-muted-foreground">3D Y-axis rotation</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Ken Burns</div>
                    <p className="text-xs text-muted-foreground">Cinematic slow pan & zoom effect</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Blur</div>
                    <p className="text-xs text-muted-foreground">Defocus blur with scale</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Cube</div>
                    <p className="text-xs text-muted-foreground">3D rotating cube effect</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Cards</div>
                    <p className="text-xs text-muted-foreground">Stacked cards pop-up</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Vertical</div>
                    <p className="text-xs text-muted-foreground">Up/down slide transition</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Creative</div>
                    <p className="text-xs text-muted-foreground">Combined scale + rotate</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Parallax</div>
                    <p className="text-xs text-muted-foreground">Depth movement effect</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gold/5">
                    <div className="font-medium text-sm mb-1">Shutters</div>
                    <p className="text-xs text-muted-foreground">Venetian blinds reveal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Section */}
        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer Section</CardTitle>
              <CardDescription>
                Edit footer content, logo, and social links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Footer Logo"
                  value={footer.logo || ""}
                  onChange={(url) => setFooter({ ...footer, logo: url })}
                  folder="branding"
                  aspectRatio="auto"
                />
                <div className="space-y-2">
                  <Label htmlFor="footer-company">Company Name</Label>
                  <Textarea
                    id="footer-company"
                    value={footer.companyName}
                    onChange={(e) => setFooter({ ...footer, companyName: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="footer-address">Address</Label>
                  <Textarea
                    id="footer-address"
                    value={footer.address}
                    onChange={(e) => setFooter({ ...footer, address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footer-phone">Phone</Label>
                    <Input
                      id="footer-phone"
                      value={footer.phone}
                      onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footer-email">Email</Label>
                    <Input
                      id="footer-email"
                      value={footer.email}
                      onChange={(e) => setFooter({ ...footer, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Social Links</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Facebook URL</Label>
                    <Input
                      value={footer.socialLinks.facebook}
                      onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, facebook: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter URL</Label>
                    <Input
                      value={footer.socialLinks.twitter}
                      onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, twitter: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input
                      value={footer.socialLinks.instagram}
                      onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, instagram: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube URL</Label>
                    <Input
                      value={footer.socialLinks.youtube}
                      onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, youtube: e.target.value } })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Social Icons (Upload custom icons)</h3>
                <div className="grid gap-4 md:grid-cols-4">
                  <ImageUpload
                    label="Facebook Icon"
                    value={footer.socialIcons?.facebook || ""}
                    onChange={(url) => setFooter({ ...footer, socialIcons: { ...footer.socialIcons, facebook: url } })}
                    folder="icons"
                    aspectRatio="square"
                  />
                  <ImageUpload
                    label="Twitter Icon"
                    value={footer.socialIcons?.twitter || ""}
                    onChange={(url) => setFooter({ ...footer, socialIcons: { ...footer.socialIcons, twitter: url } })}
                    folder="icons"
                    aspectRatio="square"
                  />
                  <ImageUpload
                    label="Instagram Icon"
                    value={footer.socialIcons?.instagram || ""}
                    onChange={(url) => setFooter({ ...footer, socialIcons: { ...footer.socialIcons, instagram: url } })}
                    folder="icons"
                    aspectRatio="square"
                  />
                  <ImageUpload
                    label="YouTube Icon"
                    value={footer.socialIcons?.youtube || ""}
                    onChange={(url) => setFooter({ ...footer, socialIcons: { ...footer.socialIcons, youtube: url } })}
                    folder="icons"
                    aspectRatio="square"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="footer-copyright">Copyright Text</Label>
                  <Input
                    id="footer-copyright"
                    value={footer.copyright}
                    onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
