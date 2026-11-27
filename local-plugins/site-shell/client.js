// Sidebar toggle, style switch and the home posts views. Quartz swaps the page body on SPA
// navigation, so everything is bound again on each "nav" event.
const root = document.documentElement
const save = (k, v) => {
  try {
    localStorage.setItem(k, v)
  } catch {}
}
const load = (k) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const on = (el, ev, fn) => {
  el.addEventListener(ev, fn)
  window.addCleanup(() => el.removeEventListener(ev, fn))
}

function syncShell() {
  const closed = root.classList.contains("side-closed")
  for (const b of document.querySelectorAll(".side-toggle")) {
    b.setAttribute("aria-expanded", String(!closed))
    b.setAttribute("aria-label", closed ? "Show sidebar" : "Hide sidebar")
  }
  for (const b of document.querySelectorAll("[data-set-style]"))
    b.setAttribute("aria-pressed", String(b.dataset.setStyle === root.dataset.style))
}

// Notebook: pad pictures, tables and code to whole ruled lines so the text after them stays on the rules.
function snapToRules() {
  const nb = root.dataset.style === "notebook"
  for (const el of document.querySelectorAll(
    "article img, article .table-container, article pre, article blockquote",
  )) {
    el.style.marginBottom = ""
    if (!nb) continue
    const h = el.getBoundingClientRect().height
    const pad = Math.ceil(h / 32) * 32 - h
    el.style.marginBottom = el.tagName === "IMG" ? `${pad}px` : `${pad + 32}px`
  }
}

function setView(view) {
  for (const t of document.querySelectorAll("[data-dbview]")) {
    const sel = t.dataset.dbview === view
    t.setAttribute("aria-selected", String(sel))
    t.tabIndex = sel ? 0 : -1
  }
  for (const box of document.querySelectorAll(".db-items")) box.dataset.view = view
  save("blog-view", view)
}

function filterPosts(key, value) {
  const f = { area: "all", type: "all" }
  for (const b of document.querySelectorAll("[data-f][aria-pressed=true]")) {
    const [k, v] = b.dataset.f.split(":")
    f[k] = v
  }
  f[key] = f[key] === value ? "all" : value
  for (const b of document.querySelectorAll("[data-f]")) {
    const [k, v] = b.dataset.f.split(":")
    b.setAttribute("aria-pressed", String(f[k] === v))
  }
  let shown = 0
  for (const el of document.querySelectorAll(".db-item")) {
    const ok =
      (f.area === "all" || el.dataset.area === f.area) &&
      (f.type === "all" || el.dataset.type === f.type)
    el.hidden = !ok
    shown += ok
  }
  for (const c of document.querySelectorAll("[data-count]")) c.textContent = shown
}

document.addEventListener("nav", () => {
  syncShell()
  for (const b of document.querySelectorAll(".side-toggle"))
    on(b, "click", () => {
      save("blog-side", root.classList.toggle("side-closed") ? "closed" : "open")
      syncShell()
    })
  for (const b of document.querySelectorAll("[data-set-style]"))
    on(b, "click", () => {
      root.dataset.style = b.dataset.setStyle
      save("blog-style", b.dataset.setStyle)
      syncShell()
      snapToRules()
    })

  snapToRules()
  // Re-snap whenever a picture or table changes size (lazy images, fonts, window width).
  const ro = new ResizeObserver(snapToRules)
  for (const el of document.querySelectorAll("article img, article .table-container, article pre"))
    ro.observe(el)
  window.addCleanup(() => ro.disconnect())

  // Home posts list: view tabs (arrow keys move between them) and filter chips.
  const tabs = [...document.querySelectorAll("[data-dbview]")]
  if (!tabs.length) return
  setView(load("blog-view") ?? "gallery")
  tabs.forEach((t, i) => {
    on(t, "click", () => setView(t.dataset.dbview))
    on(t, "keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
      if (!d) return
      const next = tabs[(i + d + tabs.length) % tabs.length]
      next.focus()
      setView(next.dataset.dbview)
    })
  })
  for (const b of document.querySelectorAll("[data-f]"))
    on(b, "click", () => {
      const [k, v] = b.dataset.f.split(":")
      filterPosts(k, v)
    })
})
