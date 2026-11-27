// Left sidebar extras: main nav, topics list, the sidebar toggle and the Workspace | Notebook switch.
// Search and Light/dark stay Quartz's own components; CSS places them between the nav and the topics.
import { readFileSync } from "node:fs"
import { h } from "preact"
import { AREAS, isPost, pathToRoot, topicName } from "./shared.js"

const read = (f) => readFileSync(new URL(f, import.meta.url), "utf-8")
const svg = (d) =>
  h(
    "svg",
    { viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", {
      d,
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 1.8,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    }),
  )
const ICON = {
  home: "M4 11 12 4l8 7v9h-5v-6H9v6H4z",
  topics: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  timeline: "M6 3v18M6 6h12M6 12h9M6 18h12",
  chevron: "M15 6l-6 6 6 6",
}

// Thin hand-drawn wobble for the Notebook drawings (used by CSS only in that style).
const WOBBLE =
  '<filter id="wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>'

const Shell = ({ fileData, allFiles, displayClass }) => {
  const slug = fileData.slug
  const base = pathToRoot(slug)
  const link = (href, label, icon, current) =>
    h(
      "a",
      { href, class: "nav-link", "aria-current": current ? "page" : undefined },
      svg(ICON[icon]),
      h("span", null, label),
    )

  // Post count per area and per topic, from the real tags.
  const count = {}
  for (const f of allFiles.filter(isPost)) {
    const seen = new Set()
    for (const t of f.frontmatter?.tags ?? []) {
      const [area] = t.split("/")
      if (!AREAS.some(([k]) => k === area)) continue
      count[t] = (count[t] ?? 0) + 1
      if (!seen.has(area)) count[area] = (count[area] ?? 0) + 1
      seen.add(area)
    }
  }
  const tagHref = (t) => `${base}/tags/${t}`
  const here = (t) => (slug === `tags/${t}` ? "page" : undefined)

  return h(
    "div",
    { class: `site-shell ${displayClass ?? ""}` },
    h(
      "nav",
      { class: "site-nav", "aria-label": "Main" },
      link(`${base}/`, "Home", "home", slug === "index"),
      link(`${base}/topics`, "Topics", "topics", slug === "topics"),
      link(`${base}/posts/`, "Timeline", "timeline", slug === "posts/index"),
    ),
    h(
      "nav",
      { class: "site-topics", "aria-labelledby": "site-topics-h" },
      h("h2", { id: "site-topics-h" }, "Topics"),
      h(
        "ul",
        null,
        AREAS.filter(([k]) => count[k]).map(([k, name]) =>
          h(
            "li",
            { class: `area-${k}` },
            h(
              "a",
              { href: tagHref(k), "aria-current": here(k) },
              h("i", { "aria-hidden": "true" }),
              name,
              h("small", null, count[k]),
            ),
            h(
              "ul",
              null,
              Object.keys(count)
                .filter((t) => t.startsWith(`${k}/`))
                .sort()
                .map((t) =>
                  h(
                    "li",
                    null,
                    h(
                      "a",
                      { href: tagHref(t), "aria-current": here(t) },
                      topicName(t.split("/")[1]),
                      h("small", null, count[t]),
                    ),
                  ),
                ),
            ),
          ),
        ),
      ),
    ),
    h(
      "button",
      {
        class: "side-toggle",
        type: "button",
        "aria-label": "Hide sidebar",
        "aria-expanded": "true",
      },
      svg(ICON.chevron),
    ),
    h(
      "div",
      { class: "style-switch", role: "group", "aria-label": "Blog style" },
      h(
        "button",
        { type: "button", "data-set-style": "workspace", "aria-pressed": "true" },
        "Workspace",
      ),
      h(
        "button",
        { type: "button", "data-set-style": "notebook", "aria-pressed": "false" },
        "Notebook",
      ),
    ),
    h("svg", {
      width: 0,
      height: 0,
      class: "svg-defs",
      "aria-hidden": "true",
      dangerouslySetInnerHTML: { __html: WOBBLE },
    }),
  )
}

Shell.beforeDOMLoaded = read("./before.js")
Shell.afterDOMLoaded = read("./client.js")

export const SiteShell = () => Shell
