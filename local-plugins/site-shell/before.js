// Runs in <head> before the first paint: pick the style and sidebar state so nothing flashes.
;(() => {
  const root = document.documentElement
  let style, side
  try {
    style = localStorage.getItem("blog-style")
    side = localStorage.getItem("blog-side")
  } catch {}
  root.dataset.style = style === "notebook" ? "notebook" : "workspace"
  root.classList.toggle("side-closed", side === "closed")
  // Notebook fonts; the Workspace fonts come from the Quartz theme config.
  const font = document.createElement("link")
  font.rel = "stylesheet"
  font.href =
    "https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap"
  document.head.append(font)
})()
