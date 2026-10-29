import type { APIRoute } from "astro"
import { renderSitemap } from "../docs/lib/sitemap"

export const prerender = true

export const GET: APIRoute = ({ url }) =>
  new Response(renderSitemap(new URL(url.origin)), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
