import { redirect } from "next/navigation"

export default function ProjectsRedirect() {
  redirect("/admin/home-page?tab=projects")
}
