"use client"

import React from "react"

import { useState } from "react"
import type { HomePageContent } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface PropertyFooterSectionProps {
  homeContent: HomePageContent
}

export function PropertyFooterSection({ homeContent }: PropertyFooterSectionProps) {
  const [email, setEmail] = useState("")
  const footer = homeContent?.footer

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    // Newsletter subscription logic would go here
    setEmail("")
    alert("Thank you for subscribing!")
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* WE BUILD VALUE Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-navy mb-8">
            WE BUILD VALUE
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-navy mb-4">CONCEPT</h3>
            <p className="text-sm text-muted-foreground">
              {footer?.address || "Munich, Germany"}
            </p>
          </div>

          {/* Projects Links */}
          <div>
            <h3 className="font-semibold text-navy mb-4">Projects</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects/on-sale" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  On sale
                </Link>
              </li>
              <li>
                <Link href="/projects/in-planning" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  In planning
                </Link>
              </li>
              <li>
                <Link href="/projects/reference" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  References
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-semibold text-navy mb-4">About</h3>
            <ul className="space-y-2">
              {footer?.columns?.[2]?.links?.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              )) || (
                <>
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-gold transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Blog & Contact */}
          <div>
            <h3 className="font-semibold text-navy mb-4">Blog</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Latest Posts
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-navy">Newsletter</h3>
              <p className="text-sm text-muted-foreground">
                Never miss an attractive real estate offers
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-64"
                required
              />
              <Button type="submit" className="bg-gold hover:bg-gold/90 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
