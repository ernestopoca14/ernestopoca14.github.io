// Home page posts list. One set of items, three views (gallery, table, board) switched by CSS
// through data-view on .db-items; the Notebook style shows the same items as a dated timeline.
import { h } from "preact"
import { AREAS, TYPE_NAMES, fmtDate, ill, posts, topicName } from "../site-shell/shared.js"

const VIEWS = [
  ["gallery", "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"],
  ["table", "M4 5h16v14H4zM4 10h16M4 15h16M10 5v14"],
  ["board", "M4 5h4v14H4zM10 5h4v9h-4zM16 5h4v11h-4z"],
]
const icon = (d) =>
  h(
    "svg",
    { viewBox: "0 0 24 24", "aria-hidden": "true" },
    h("path", {
      d,
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 1.6,
      "stroke-linejoin": "round",
    }),
  )

const List = ({ fileData, allFiles }) => {
  if (fileData.slug !== "index") return null
  const list = posts(allFiles)
  const n = (pred) => list.filter(pred).length
  const chip = (f, label, count, cls) =>
    h(
      "button",
      { type: "button", "data-f": f, "aria-pressed": String(f === "area:all"), class: cls },
      h("i", { "aria-hidden": "true" }),
      label,
      count != null && h("small", null, count),
    )

  return h(
    "section",
    { class: "post-db", "aria-labelledby": "db-title" },
    h(
      "div",
      { class: "db-head" },
      h("h2", { id: "db-title" }, "Posts"),
      h(
        "div",
        { class: "db-tabs", role: "tablist", "aria-label": "View" },
        VIEWS.map(([v, d]) =>
          h(
            "button",
            {
              type: "button",
              role: "tab",
              "data-dbview": v,
              "aria-selected": String(v === "gallery"),
              tabIndex: v === "gallery" ? 0 : -1,
            },
            icon(d),
            v[0].toUpperCase() + v.slice(1),
          ),
        ),
      ),
    ),
    h(
      "div",
      { class: "db-chips", role: "group", "aria-label": "Filter posts" },
      chip("area:all", "All", null, "all"),
      AREAS.filter(([k]) => n((p) => p.area === k)).map(([k, name]) =>
        chip(
          `area:${k}`,
          name,
          n((p) => p.area === k),
          `area-${k}`,
        ),
      ),
      TYPE_NAMES.map((t) => chip(`type:${t}`, t, null, "ty")),
    ),
    h(
      "p",
      { class: "db-count", "aria-live": "polite" },
      h("span", { "data-count": "" }, list.length),
      " posts",
    ),
    h(
      "div",
      { class: "db-scroll" },
      h(
        "div",
        { class: "db-items", "data-view": "gallery" },
        h(
          "div",
          { class: "db-thead", "aria-hidden": "true" },
          ["Name", "Type", "Topic", "Tags", "Date", "Read"].map((c) => h("span", null, c)),
        ),
        TYPE_NAMES.map((t) =>
          h(
            "div",
            { class: "db-col", "data-type": t, "aria-hidden": "true" },
            h("span", { class: "tag" }, t),
            h(
              "small",
              null,
              n((p) => p.type === t),
            ),
          ),
        ),
        list.map((p) =>
          h(
            "a",
            {
              class: `db-item area-${p.area}`,
              href: `./${p.slug}`,
              "data-area": p.area,
              "data-type": p.type,
            },
            h("span", {
              class: "db-cover",
              dangerouslySetInnerHTML: { __html: ill(p.drawing, { flip: p.flip }) },
            }),
            h("span", { class: "db-title" }, p.title),
            h("span", { class: "db-desc" }, p.description),
            h("span", { class: "db-type tag" }, p.type),
            h("span", { class: "db-area tag" }, AREAS.find(([k]) => k === p.area)[1]),
            h(
              "span",
              { class: "db-tags" },
              p.tags.map((t) => h("span", { class: "tag" }, topicName(t.split("/")[1] ?? t))),
            ),
            h(
              "time",
              { class: "db-date", datetime: p.date?.toISOString().slice(0, 10) },
              fmtDate(p.date),
            ),
            h("span", { class: "db-read" }, `${p.minutes} min`),
          ),
        ),
      ),
    ),
  )
}

export const PostList = () => List
