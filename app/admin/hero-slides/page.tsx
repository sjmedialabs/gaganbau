import { redirect } from "next/navigation"

export default function HeroSlidesRedirect() {
  redirect("/admin/home-page?tab=hero")
}
