import type { APIRoute } from "astro"
import { renderLlmsTxt } from "../docs/lib/llms"

export const prerender = true

export const GET: APIRoute = ({ url }) =>
  new Response(renderLlmsTxt(new URL(url.origin)), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
