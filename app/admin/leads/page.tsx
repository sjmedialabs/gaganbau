"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Search, Trash2, Eye, Download, RefreshCw } from "lucide-react"
import type { Lead } from "@/lib/types"

function parseLead(d: { id: string; createdAt?: string; updatedAt?: string; [k: string]: unknown }): Lead {
  return {
    ...d,
    createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
    updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(),
  } as Lead
}

const statusColors = {
  new: "bg-green-100 text-green-800 border-green-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/leads")
      const data = await res.json().catch(() => [])
      const list = Array.isArray(data) ? data : data.leads ?? []
      setLeads(list.map((d: Record<string, unknown> & { id: string }) => parseLead(d)))
    } catch {
      toast.error("Failed to load leads")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Filter and sort leads
  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.message.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      }
      return a.createdAt.getTime() - b.createdAt.getTime()
    })

  const updateLeadStatus = (id: string, status: Lead["status"]) => {
    setLeads(
      leads.map((lead) =>
        lead.id === id ? { ...lead, status, updatedAt: new Date() } : lead
      )
    )
    toast.success(`Lead status updated to ${status}`)
  }

  const deleteLead = (id: string) => {
    setLeads(leads.filter((lead) => lead.id !== id))
    toast.success("Lead deleted successfully")
  }

  const exportLeads = () => {
    const csv = [
      ["Name", "Email", "Phone", "Message", "Page Source", "Property", "Scheduled Visit", "Status", "Date"].join(","),
      ...filteredLeads.map((lead) =>
        [
          `"${lead.name}"`,
          lead.email,
          lead.phone,
          `"${(lead.message || "").replace(/"/g, '""')}"`,
          lead.pageSource,
          (lead as Lead & { propertyInterest?: string }).propertyInterest ?? "",
          (lead as Lead & { scheduledVisit?: string }).scheduledVisit ?? "",
          lead.status,
          lead.createdAt.toISOString(),
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Leads exported successfully")
  }

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    closed: leads.filter((l) => l.status === "closed").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM / Leads</h1>
          <p className="text-muted-foreground mt-1">
            Manage contact form submissions and leads
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={exportLeads} className="bg-gold hover:bg-gold-dark text-white">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">New</p>
            <p className="text-3xl font-bold text-green-600">{stats.new}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Contacted</p>
            <p className="text-3xl font-bold text-blue-600">{stats.contacted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Closed</p>
            <p className="text-3xl font-bold text-gray-600">{stats.closed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "newest" | "oldest")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Page Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No leads found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {lead.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{lead.email}</p>
                        <p className="text-muted-foreground">{lead.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[120px] truncate" title={lead.propertyInterest}>
                      {lead.propertyInterest || "—"}
                    </TableCell>
                    <TableCell className="text-sm max-w-[140px] truncate text-muted-foreground" title={lead.scheduledVisit}>
                      {lead.scheduledVisit || "—"}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {lead.pageSource}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={lead.status}
                        onValueChange={(value) => updateLeadStatus(lead.id, value as Lead["status"])}
                      >
                        <SelectTrigger className={`w-[120px] h-8 ${statusColors[lead.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {lead.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteLead(lead.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLead.name}</DialogTitle>
                <DialogDescription>
                  Submitted on{" "}
                  {selectedLead.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedLead.email}`} className="text-gold hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${selectedLead.phone}`} className="text-gold hover:underline">
                      {selectedLead.phone}
                    </a>
                  </div>
                </div>
                {(selectedLead as Lead & { propertyInterest?: string }).propertyInterest && (
                  <div>
                    <p className="text-sm text-muted-foreground">Property of interest</p>
                    <p className="font-medium">{(selectedLead as Lead & { propertyInterest?: string }).propertyInterest}</p>
                  </div>
                )}
                {(selectedLead as Lead & { scheduledVisit?: string }).scheduledVisit && (
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled visit</p>
                    <p className="font-medium">{(selectedLead as Lead & { scheduledVisit?: string }).scheduledVisit}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Page Source</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {selectedLead.pageSource}
                  </code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <p className="text-sm bg-muted p-4 rounded-lg">{selectedLead.message || "—"}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={statusColors[selectedLead.status]}>
                      {selectedLead.status}
                    </Badge>
                  </div>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) => {
                      updateLeadStatus(selectedLead.id, value as Lead["status"])
                      setSelectedLead({ ...selectedLead, status: value as Lead["status"] })
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
