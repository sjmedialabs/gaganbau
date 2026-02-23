"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  Building2,
  Filter,
} from "lucide-react"
import type { Property, PropertyCategory } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categoryLabels: Record<PropertyCategory, string> = {
  "on-sale": "On Sale",
  "in-planning": "In Planning",
  reference: "Reference",
}

const categoryColors: Record<PropertyCategory, string> = {
  "on-sale": "bg-green-100 text-green-800",
  "in-planning": "bg-blue-100 text-blue-800",
  reference: "bg-gray-100 text-gray-800",
}

const statusLabels: Record<string, string> = {
  "ready-for-occupancy": "Ready for Occupancy",
  "sold-out": "Sold Out",
  "under-construction": "Under Construction",
  "coming-soon": "Coming Soon",
}

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties")
      if (res.ok) {
        const data = await res.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error)
      toast.error("Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (property: Property) => {
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !property.isActive }),
      })

      if (res.ok) {
        setProperties(
          properties.map((p) =>
            p.id === property.id ? { ...p, isActive: !p.isActive } : p
          )
        )
        toast.success(
          `Property ${!property.isActive ? "activated" : "deactivated"}`
        )
      }
    } catch (error) {
      toast.error("Failed to update property")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/properties/${deleteId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setProperties(properties.filter((p) => p.id !== deleteId))
        toast.success("Property deleted successfully")
      } else {
        toast.error("Failed to delete property")
      }
    } catch (error) {
      toast.error("Failed to delete property")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const filteredProperties =
    categoryFilter === "all"
      ? properties
      : properties.filter((p) => p.category === categoryFilter)

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
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground mt-1">
            Manage all property listings
          </p>
        </div>
        <Link href="/admin/properties/create">
          <Button className="bg-gold hover:bg-gold/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="on-sale">On Sale</SelectItem>
                <SelectItem value="in-planning">In Planning</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredProperties.length} properties
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first property listing.
            </p>
            <Link href="/admin/properties/create">
              <Button className="bg-gold hover:bg-gold/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className={!property.isActive ? "opacity-60" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  <div className="w-32 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {property.heroImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={property.heroImage || "/placeholder.svg"}
                        alt={property.projectName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {property.projectName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {property.specifications?.address || "No address set"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={categoryColors[property.category]}>
                          {categoryLabels[property.category]}
                        </Badge>
                        <Badge variant="outline">
                          {statusLabels[property.status] || property.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                      {property.specifications?.purchasePrice && (
                        <span>{property.specifications.purchasePrice}</span>
                      )}
                      {property.specifications?.livingArea && (
                        <span>{property.specifications.livingArea}</span>
                      )}
                      {property.specifications?.rooms && (
                        <span>{property.specifications.rooms}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Active
                      </span>
                      <Switch
                        checked={property.isActive}
                        onCheckedChange={() => handleToggleActive(property)}
                      />
                    </div>

                    <Link href={`/projects/${property.slug}`} target="_blank">
                      <Button variant="outline" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Link href={`/admin/properties/edit/${property.id}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => setDeleteId(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
