import { NextResponse } from "next/server"
import { getAdminFirestore } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      message = "",
      pageSource = "/contact",
      propertyInterest,
      scheduledVisit,
    } = body as {
      name?: string
      email?: string
      phone?: string
      message?: string
      pageSource?: string
      propertyInterest?: string
      scheduledVisit?: string
    }

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    const db = getAdminFirestore()
    const now = new Date()
    const docRef = await db.collection("leads").add({
      name: name.trim(),
      email: email.trim(),
      phone: (phone || "").trim(),
      message: (message || "").trim(),
      pageSource: pageSource || "/contact",
      propertyInterest: propertyInterest?.trim() || null,
      scheduledVisit: scheduledVisit?.trim() || null,
      status: "new",
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json({
      success: true,
      id: docRef.id,
    })
  } catch (error) {
    console.error("Leads API error:", error)
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = getAdminFirestore()
    const snapshot = await db.collection("leads").orderBy("createdAt", "desc").get()
    const leads = snapshot.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        name: d.name,
        email: d.email,
        phone: d.phone ?? "",
        message: d.message ?? "",
        pageSource: d.pageSource ?? "",
        propertyInterest: d.propertyInterest ?? undefined,
        scheduledVisit: d.scheduledVisit ?? undefined,
        status: d.status ?? "new",
        createdAt: d.createdAt?.toDate?.()?.toISOString() ?? d.createdAt,
        updatedAt: d.updatedAt?.toDate?.()?.toISOString() ?? d.updatedAt,
      }
    })
    return NextResponse.json(leads)
  } catch (error) {
    console.error("Leads GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}
