// Cover band and page icon, drawn instead of photos. Posts get the drawing of their topic tag;
// tag pages get their area's colour. Workspace shows the band and icon; Notebook shows the icon as a sketch.
import { h } from "preact"
import {
  ALT,
  AREA_DRAWINGS,
  AREA_NAME,
  HOME_DRAWINGS,
  ill,
  isPost,
  postInfo,
} from "../site-shell/shared.js"

const raw = (cls, html) => h("div", { class: cls, dangerouslySetInnerHTML: { __html: html } })

const Cover = ({ fileData }) => {
  const slug = fileData.slug
  let area = "homelab"
  let band = HOME_DRAWINGS
  let icon = "tiles"
  if (isPost(fileData)) {
    const p = postInfo(fileData)
    area = p.area
    icon = p.drawing
    band = AREA_DRAWINGS[area]
  } else if (slug.startsWith("tags/") && AREA_NAME[slug.split("/")[1]]) {
    area = slug.split("/")[1]
    band = AREA_DRAWINGS[area]
    icon = band[0]
  } else if (slug !== "index") {
    band = HOME_DRAWINGS.slice(1, 4)
  }
  return h(
    "div",
    { class: `page-cover area-${area}` },
    raw("cover-band", band.map((k, i) => ill(k, { flip: i % 2 === 1 })).join("")),
    raw("cover-icon", ill(icon, { label: ALT[icon] })),
  )
}

export const PageCover = () => Cover
