"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PropertyOption {
  id: string
  projectName: string
  slug: string
}

interface ContactFormProps {
  pageSource?: string
  properties?: PropertyOption[]
}

export function ContactForm({ pageSource = "/contact", properties: propsProperties }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    propertyInterest: "",
    visitDate: null as Date | null,
    visitTime: "",
  })
  const [properties, setProperties] = useState<PropertyOption[]>(propsProperties ?? [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (propsProperties?.length) return
    fetch("/api/properties")
      .then((res) => res.ok ? res.json() : { properties: [] })
      .then((data) => setProperties(data.properties ?? []))
      .catch(() => setProperties([]))
  }, [propsProperties])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const scheduledVisit =
        formData.visitDate && formData.visitTime
          ? `${format(formData.visitDate, "yyyy-MM-dd")} ${formData.visitTime}`
          : formData.visitDate
            ? format(formData.visitDate, "yyyy-MM-dd")
            : undefined

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          pageSource,
          propertyInterest: formData.propertyInterest || undefined,
          scheduledVisit,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(data.error || "Something went wrong. Please try again.")
        return
      }

      toast.success("Thank you! We'll get back to you soon.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        propertyInterest: "",
        visitDate: null,
        visitTime: "",
      })
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+49 123 456 7890"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Looks for? (Property)</Label>
        <Select
          value={formData.propertyInterest || "none"}
          onValueChange={(v) => setFormData({ ...formData, propertyInterest: v === "none" ? "" : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a property" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select a property</SelectItem>
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.projectName}>
                {p.projectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Schedule a visit</Label>
        <div className="flex flex-wrap gap-3 items-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full sm:w-[200px] justify-start text-left font-normal",
                  !formData.visitDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.visitDate ? format(formData.visitDate, "PPP") : "Pick date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.visitDate ?? undefined}
                onSelect={(d) => setFormData({ ...formData, visitDate: d ?? null })}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex-1 min-w-[120px] space-y-2">
            <Label htmlFor="visitTime" className="text-muted-foreground text-xs">Time</Label>
            <Input
              id="visitTime"
              type="time"
              value={formData.visitTime}
              onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we help you?"
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-dark text-white"
      >
        {loading ? "Sending..." : "Submit"}
      </Button>
    </form>
  )
}
