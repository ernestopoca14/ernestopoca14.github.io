// Shared data and helpers for the Workspace / Notebook design: areas, drawings, posts.
// The drawings are small inline SVGs, recoloured by CSS through --i-ink, --i-a, --i-b, --i-p.

// Areas follow content/topics.md: the first part of a tag like "homelab/backups".
export const AREAS = [
  ["computing", "Computing"],
  ["security", "Security"],
  ["engineering", "Engineering & Making"],
  ["homelab", "Homelab"],
]
export const AREA_NAME = Object.fromEntries(AREAS)
const TYPES = { "type/project": "Project", "type/learning": "Learning", "type/til": "Tip" }
export const TYPE_NAMES = ["Project", "Learning", "Tip"]

export const topicName = (t) =>
  t === "cad" ? "CAD" : t.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

// Each post gets the drawing of its first matching tag, most specific first.
const DRAWING_BY_TAG = [
  ["security/hardening", "lock"],
  ["homelab/automation", "bulb"],
  ["homelab/backups", "rack"],
  ["homelab/networking", "rack"],
  ["computing/networking", "rack"],
  ["engineering/making", "nozzle"],
  ["engineering/cad", "card"],
  ["engineering/electronics", "meter"],
  ["computing/computer-science", "meter"],
  ["computing/linux", "terminal"],
]
export const AREA_DRAWINGS = {
  computing: ["terminal", "meter", "rack"],
  security: ["lock", "terminal", "rack"],
  engineering: ["nozzle", "card", "tiles"],
  homelab: ["rack", "bulb", "terminal"],
}
export const HOME_DRAWINGS = ["nozzle", "terminal", "rack", "lock", "meter"]

export const pathToRoot = (slug) =>
  slug
    .split("/")
    .slice(0, -1)
    .map(() => "..")
    .join("/") || "."

export const isPost = (f) => f.slug?.startsWith("posts/") && f.slug !== "posts/index"

/** One post as the views need it. */
export function postInfo(f) {
  const tags = f.frontmatter?.tags ?? []
  const areaTag = tags.find((t) => AREA_NAME[t.split("/")[0]])
  const date = f.dates?.created ?? f.dates?.modified
  const words = (f.text ?? "").split(/\s+/).filter(Boolean).length
  return {
    slug: f.slug,
    title: f.frontmatter?.title ?? f.slug,
    description: f.description ?? f.frontmatter?.description ?? "",
    tags: tags.filter((t) => !t.startsWith("type/")),
    type: TYPES[tags.find((t) => TYPES[t])] ?? "Project",
    area: areaTag ? areaTag.split("/")[0] : "computing",
    drawing: (DRAWING_BY_TAG.find(([t]) => tags.includes(t)) ?? [, "tiles"])[1],
    date: date ? new Date(date) : null,
    minutes: Math.max(1, Math.ceil(words / 200)),
  }
}

/** Posts, newest first; a drawing used by the post just before is mirrored so neighbours differ. */
export function posts(allFiles) {
  const list = allFiles
    .filter(isPost)
    .map(postInfo)
    .sort((a, b) => (b.date ?? 0) - (a.date ?? 0))
  const seen = {}
  for (const p of list) p.flip = (seen[p.drawing] = (seen[p.drawing] ?? -1) + 1) % 2 === 1
  return list
}

export const fmtDate = (d) =>
  d
    ? d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : ""

const ILL = {
  nozzle: [
    ['rect x="98" y="8" width="44" height="30" rx="3"', "b"],
    ['path d="M98 16h44M98 23h44M98 30h44"', "t"],
    ['rect x="90" y="40" width="60" height="26" rx="3"', "a"],
    ['circle cx="138" cy="53" r="4"', "k"],
    ['path d="M90 50c-14 0-18-8-30-8s-18 6-28 2"', "k"],
    ['path d="M108 66h24l-6 16h-12z"', "b"],
    ['path d="M115 82h10l-3 7h-4z"', "p"],
    ['path d="M120 90c0 7-2 11-8 12"', "s"],
    ['rect x="30" y="129" width="180" height="9" rx="4.5"', "b"],
    ['rect x="30" y="120" width="180" height="9" rx="4.5"', "b"],
    ['rect x="30" y="111" width="180" height="9" rx="4.5"', "b"],
    ['rect x="30" y="102" width="84" height="9" rx="4.5"', "a"],
    ['path d="M14 142h212"', "k"],
    [
      'path d="M24 142l-6 8M40 142l-6 8M56 142l-6 8M72 142l-6 8M88 142l-6 8M104 142l-6 8M120 142l-6 8M136 142l-6 8M152 142l-6 8M168 142l-6 8M184 142l-6 8M200 142l-6 8M216 142l-6 8"',
      "t",
    ],
    ['path d="M54 74h22M60 82h16"', "t"],
    ['path d="M160 58h20M174 52l7 6-7 6"', "k"],
  ],
  tiles: [
    ['rect x="22" y="30" width="34" height="34" rx="6"', "b"],
    ['circle cx="39" cy="45" r="6"', "p"],
    ['path d="M28 61.0h22M28 58.6h22"', "t"],
    ['rect x="62" y="30" width="34" height="34" rx="6"', "b"],
    ['circle cx="79" cy="45" r="6"', "p"],
    ['rect x="102" y="30" width="34" height="34" rx="6"', "b"],
    ['circle cx="119" cy="45" r="6"', "p"],
    ['rect x="142" y="30" width="34" height="34" rx="6"', "b"],
    ['circle cx="159" cy="45" r="6"', "p"],
    ['path d="M148 61.0h22M148 58.6h22M148 56.2h22"', "t"],
    ['rect x="182" y="30" width="34" height="34" rx="6"', "a"],
    ['circle cx="199" cy="45" r="6"', "p"],
    ['path d="M188 61.0h22M188 58.6h22M188 56.2h22M188 53.8h22"', "t"],
    ['rect x="22" y="82" width="34" height="34" rx="6"', "b"],
    ['circle cx="39" cy="97" r="6"', "p"],
    ['path d="M28 113.0h22M28 110.6h22"', "t"],
    ['rect x="62" y="82" width="34" height="34" rx="6"', "b"],
    ['circle cx="79" cy="97" r="6"', "p"],
    ['path d="M68 113.0h22M68 110.6h22M68 108.2h22M68 105.8h22"', "t"],
    ['rect x="102" y="82" width="34" height="34" rx="6"', "b"],
    ['circle cx="119" cy="97" r="6"', "p"],
    ['path d="M108 113.0h22"', "t"],
    ['rect x="142" y="82" width="34" height="34" rx="6"', "b"],
    ['circle cx="159" cy="97" r="6"', "p"],
    ['path d="M148 113.0h22M148 110.6h22M148 108.2h22"', "t"],
    ['rect x="182" y="82" width="34" height="34" rx="6"', "b"],
    ['circle cx="199" cy="97" r="6"', "p"],
    ['path d="M188 113.0h22M188 110.6h22M188 108.2h22M188 105.8h22"', "t"],
    ['path d="M197 18c18 1 31 13 30 31s-15 29-31 28-30-12-29-29 15-31 35-27"', "s"],
    ['path d="M22 138h194"', "k"],
    [
      'path d="M22.0 138v5M31.7 138v3M41.4 138v3M51.1 138v3M60.8 138v3M70.5 138v5M80.2 138v3M89.9 138v3M99.6 138v3M109.3 138v3M119.0 138v5M128.7 138v3M138.4 138v3M148.1 138v3M157.8 138v3M167.5 138v5M177.2 138v3M186.9 138v3M196.6 138v3M206.3 138v3M216.0 138v5"',
      "t",
    ],
  ],
  terminal: [
    ['rect x="26" y="20" width="188" height="120" rx="9"', "b"],
    ['path d="M26 40h188"', "k"],
    ['circle cx="40" cy="30" r="3.5"', "a"],
    ['circle cx="52" cy="30" r="3.5"', "k"],
    ['circle cx="64" cy="30" r="3.5"', "k"],
    ['path d="M42 57l8 6-8 6"', "k"],
    ['path d="M58 63h64"', "k"],
    ['path d="M130 63h30"', "s"],
    ['path d="M42 80h110M42 91h86M42 102h128"', "t"],
    ['path d="M42 115l8 6-8 6"', "k"],
    ['rect class="blink" x="58" y="114" width="10" height="14" rx="1.5"', "A"],
  ],
  rack: [
    ['rect x="66" y="12" width="96" height="134" rx="7"', "b"],
    ['rect x="76" y="24" width="76" height="20" rx="3"', "p"],
    ['circle cx="85" cy="34" r="2.8"', "A"],
    ['circle cx="94" cy="34" r="2.8"', "k"],
    ['path d="M110 28v12M116 28v12M122 28v12M128 28v12M134 28v12M140 28v12"', "t"],
    ['rect x="76" y="52" width="76" height="20" rx="3"', "p"],
    ['circle cx="85" cy="62" r="2.8"', "A"],
    ['circle cx="94" cy="62" r="2.8"', "k"],
    ['path d="M110 56v12M116 56v12M122 56v12M128 56v12M134 56v12M140 56v12"', "t"],
    ['rect x="76" y="80" width="76" height="20" rx="3"', "p"],
    ['circle cx="85" cy="90" r="2.8"', "k"],
    ['circle cx="94" cy="90" r="2.8"', "k"],
    ['path d="M110 84v12M116 84v12M122 84v12M128 84v12M134 84v12M140 84v12"', "t"],
    ['rect x="76" y="108" width="76" height="20" rx="3"', "p"],
    ['circle cx="85" cy="118" r="2.8"', "A"],
    ['circle cx="94" cy="118" r="2.8"', "k"],
    ['path d="M110 112v12M116 112v12M122 112v12M128 112v12M134 112v12M140 112v12"', "t"],
    ['path d="M78 146v7M150 146v7"', "k"],
    ['path d="M152 34c26 0 22 40 40 46s14 40 2 58"', "k"],
    ['path d="M152 90c22 0 12 34 38 38s24-4 34 0"', "s"],
    ['rect x="186" y="136" width="16" height="11" rx="2"', "a"],
  ],
  meter: [
    ['rect x="40" y="14" width="78" height="132" rx="14"', "a"],
    ['rect x="50" y="26" width="58" height="30" rx="4"', "p"],
    ['path d="M64 32v18M76 32h12v9H76v9h12"', "k"],
    ['circle cx="70" cy="50" r="1.2"', "k"],
    ['circle cx="79" cy="90" r="17"', "p"],
    ['path d="M79 90l9-11"', "k"],
    ['path d="M79 68v-4M99 90h4M59 90h-4"', "t"],
    ['circle cx="64" cy="130" r="5"', "p"],
    ['circle cx="94" cy="130" r="5"', "p"],
    ['path d="M64 135c0 22 60 22 109-28"', "k"],
    ['path d="M94 135c6 18 80 20 125-27"', "s"],
    ['path d="M170 106l7-26 6 1.6-7 26z"', "b"],
    ['path d="M180 80l2-7"', "k"],
    ['path d="M216 108l3-27 6 .6-3 27z"', "a"],
    ['path d="M222 81l.5-8"', "k"],
    ['path d="M150 72h32l3-6 6 12 6-12 6 12 6-12 3 6h10"', "k"],
  ],
  lock: [
    ['path d="M92 74V54a28 28 0 0 1 56 0v20"', "k"],
    ['path d="M102 74V55a18 18 0 0 1 36 0v19"', "t"],
    ['rect x="78" y="72" width="84" height="70" rx="10"', "a"],
    ['path d="M120 94a7 7 0 0 1 4 12.7l2 11.3h-12l2-11.3a7 7 0 0 1 4-12.7z"', "p"],
    ['path d="M88 132h28"', "t"],
    ['circle cx="198" cy="58" r="13"', "b"],
    ['circle cx="198" cy="58" r="4"', "k"],
    ['path d="M198 71v54M198 112h9v6h-9M198 121h6"', "k"],
    ['path d="M44 132h22M50 140h12"', "t"],
  ],
  pliers: [
    ['path d="M113 60L100 14q5-7 12-2l11 48z"', "b"],
    ['path d="M124 60l8-48q7-4 11 3l-8 45z"', "b"],
    ['path d="M114 70C102 96 86 120 72 147l12 5c14-26 30-50 38-80z"', "a"],
    ['path d="M126 70c8 30 22 54 34 82l12-5C158 120 140 96 129 66z"', "a"],
    ['circle cx="120" cy="64" r="7"', "p"],
    ['path d="M76 152c-8 4-6 10 1 9"', "s"],
    [
      'path d="M101.0 85.0l13 -4M96.9 92.6l13 -4M92.8 100.2l13 -4M88.7 107.8l13 -4M84.6 115.4l13 -4M80.5 123.0l13 -4M76.4 130.6l13 -4M72.3 138.2l13 -4M68.2 145.8l13 -4"',
      "t",
    ],
    [
      'path d="M126.0 81.0l13 4M130.1 88.6l13 4M134.2 96.2l13 4M138.3 103.8l13 4M142.4 111.4l13 4M146.5 119.0l13 4M150.6 126.6l13 4M154.7 134.2l13 4M158.8 141.8l13 4"',
      "t",
    ],
  ],
  bulb: [
    ['path d="M120 16a34 34 0 0 0-20 61c6 5 8 10 8 16h24c0-6 2-11 8-16a34 34 0 0 0-20-61z"', "a"],
    ['rect x="106" y="96" width="28" height="22" rx="4"', "b"],
    ['path d="M106 103h28M106 110h28"', "t"],
    ['path d="M114 118h12l-3 7h-6z"', "k"],
    ['path d="M112 68l4-12 4 12 4-12 4 12M116 80v14M124 80v14"', "s"],
    ['path d="M166 36a22 22 0 0 1 22 22M166 22a36 36 0 0 1 36 36"', "k"],
    ['circle cx="167" cy="57" r="3"', "A"],
    ['path d="M64 52h-14M72 26l-10-8M72 78l-10 8"', "t"],
  ],
  compare: [
    ['path d="M24 130V58q0-8 8-8h58q22 0 22 22v58z"', "b"],
    [
      'path d="M30 60h60M30 63h60M30 66h60M30 69h60M30 72h70M30 75h70M30 78h70M30 81h70M30 84h70M30 87h70M30 90h70M30 93h70M30 96h70M30 99h70M30 102h70M30 105h70M30 108h70M30 111h70M30 114h70M30 117h70M30 120h70M30 123h70M30 126h70"',
      "t",
    ],
    ['path d="M128 130V58q0-8 8-8h54v8h8v8h6v10h4v54z"', "a"],
    [
      'path d="M134 66h56M134 74h62M134 82h62M134 90h62M134 98h62M134 106h62M134 114h62M134 122h62"',
      "t",
    ],
    ['path d="M14 130h212"', "k"],
    ['circle cx="68" cy="146" r="8"', "p"],
    ['circle cx="168" cy="146" r="8"', "p"],
  ],
  card: [
    ['rect x="16" y="116" width="208" height="18" rx="3"', "b"],
    ['path d="M22 116l8 -34h8l-8 34z"', "a"],
    ['path d="M44 116l16 -34h8l-16 34z"', "a"],
    ['path d="M68 116l26 -34h8l-26 34z"', "a"],
    ['path d="M96 116l36 -34h8l-36 34z"', "b"],
    ['path d="M132 82c3 4 1 8 4 12"', "s"],
    ['rect x="156" y="76" width="8" height="40"', "b"],
    ['rect x="206" y="76" width="8" height="40"', "b"],
    ['path d="M164 78q21 14 42 0v6q-21 14-42 0z"', "a"],
    ['path d="M34 126c3-5 5 5 8 0s5 5 8 0M58 126c3-5 5 5 8 0M76 126c3-5 5 5 8 0"', "s"],
  ],
}
const NUMS = {
  compare:
    '<text class="n" x="68" y="150.5" text-anchor="middle">5</text><text class="n" x="168" y="150.5" text-anchor="middle">8</text>',
}
export const ALT = {
  nozzle: "Drawing of a 3D printer nozzle laying a fresh layer",
  tiles: "Drawing of ten calibration tiles in a grid, tile 5 circled",
  terminal: "Drawing of a terminal window with a shell prompt",
  rack: "Drawing of a small server box with cables",
  meter: "Drawing of a multimeter probing a resistor",
  lock: "Drawing of a padlock and a key",
  pliers: "Drawing of mini pliers with wrapped handles",
  bulb: "Drawing of a Wi-Fi light bulb",
  compare: "Drawing of two tiles side by side: fine layers on tile 5, coarse steps on tile 8",
  card: "Drawing of the design card: leaning overhangs on the left, a sagging bridge on the right",
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

/** SVG markup for one drawing: a fill layer (offset) under an outline layer. */
export function ill(key, { label = "", flip = false, cls = "ill" } = {}) {
  const parts = ILL[key] ?? ILL.tiles
  const fills = parts
    .filter(([, r]) => "abp".includes(r))
    .map(([m, r]) => `<${m} class="${r}"/>`)
    .join("")
  const lines = parts.map(([m, r]) => `<${m} class="${"abp".includes(r) ? "k" : r}"/>`).join("")
  const fl = flip ? ' transform="translate(240 0) scale(-1 1)"' : ""
  const aria = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'
  return `<svg class="${cls}" viewBox="0 0 240 160" ${aria}><g${fl}><g class="fl">${fills}</g><g class="ol">${lines}</g>${NUMS[key] ?? ""}</g></svg>`
}
