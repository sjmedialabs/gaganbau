"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Save, Plus, Trash2, Loader2 } from "lucide-react"
import { defaultHomeContent } from "@/lib/default-content"
import type { ProjectSlide, HomePageContent } from "@/lib/types"
import { ImageUpload } from "@/components/admin/ImageUpload"

export default function ProjectsEditor() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [projects, setProjects] = useState<ProjectSlide[]>(defaultHomeContent.projects)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content/home")
        if (res.ok) {
          const data = await res.json()
          setContent(data)
          setProjects(data.projects || defaultHomeContent.projects)
        }
      } catch (error) {
        console.error("Failed to fetch content:", error)
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
        projects,
      }

      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      })

      if (res.ok) {
        toast.success("Projects saved successfully!")
      } else {
        toast.error("Failed to save changes")
      }
    } catch (error) {
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    )
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
    setProjects(projects.map((project) => (project.id === id ? { ...project, ...updates } : project)))
  }

  const deleteProject = (id: string) => {
    if (projects.length <= 1) {
      toast.error("You must have at least one project")
      return
    }
    setProjects(projects.filter((project) => project.id !== id))
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
    const newImages = project.images.filter((_, i) => i !== imageIndex)
    updateProject(projectId, { images: newImages })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects Slider</h1>
          <p className="text-muted-foreground mt-1">
            Manage the projects section on your home page
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gold hover:bg-gold-dark text-white">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects
          .sort((a, b) => a.order - b.order)
          .map((project, index) => (
            <Card key={project.id} className={!project.isActive ? "opacity-60" : ""}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Project {index + 1}: {project.title.split('\n')[0]}</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${project.id}`} className="text-sm">
                        Active
                      </Label>
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
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={project.label}
                      onChange={(e) => updateProject(project.id, { label: e.target.value })}
                      placeholder="OUR CONCURRENT PROJECTS(3D)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Order</Label>
                    <Input
                      type="number"
                      value={project.order}
                      onChange={(e) => updateProject(project.id, { order: Number.parseInt(e.target.value) || 1 })}
                      min={1}
                      className="w-24"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title (use \n for line break)</Label>
                    <Textarea
                      value={project.title}
                      onChange={(e) => updateProject(project.id, { title: e.target.value })}
                      placeholder="ReHomes\nThe Butterfly"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      placeholder="Project description..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={project.buttonText}
                      onChange={(e) => updateProject(project.id, { buttonText: e.target.value })}
                      placeholder="Explore More"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Link</Label>
                    <Input
                      value={project.buttonLink}
                      onChange={(e) => updateProject(project.id, { buttonLink: e.target.value })}
                      placeholder="/projects/project-slug"
                    />
                  </div>
                </div>

                {/* Images */}
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeProjectImage(project.id, imageIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => addProjectImage(project.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add image
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
