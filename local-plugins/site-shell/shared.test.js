import test from "node:test"
import assert from "node:assert"
import { ill, pathToRoot, posts, postInfo } from "./shared.js"

const file = (slug, tags, date) => ({
  slug,
  frontmatter: { title: slug, tags },
  dates: { created: new Date(date) },
  text: "word ".repeat(450),
})

test("pathToRoot", () => {
  assert.equal(pathToRoot("index"), ".")
  assert.equal(pathToRoot("posts/a"), "..")
  assert.equal(pathToRoot("tags/homelab/backups"), "../..")
})

test("postInfo maps tags to area, type, drawing and reading time", () => {
  const p = postInfo(
    file("posts/a", ["type/til", "homelab/networking", "computing/linux"], "2026-11-16"),
  )
  assert.deepEqual([p.area, p.type, p.drawing, p.minutes], ["homelab", "Tip", "rack", 3])
  assert.deepEqual(p.tags, ["homelab/networking", "computing/linux"])
  assert.equal(
    postInfo(file("posts/b", ["type/learning", "security/hardening"], "2026-11-01")).drawing,
    "lock",
  )
})

test("posts: only posts, newest first, repeated drawings mirrored in turn", () => {
  const list = posts([
    file("posts/old", ["engineering/making"], "2026-10-01"),
    file("posts/index", [], "2026-12-01"),
    file("topics", [], "2026-12-01"),
    file("posts/new", ["engineering/making"], "2026-11-01"),
  ])
  assert.deepEqual(
    list.map((p) => [p.slug, p.flip]),
    [
      ["posts/new", false],
      ["posts/old", true],
    ],
  )
})

test("ill renders a labelled or hidden svg", () => {
  assert.match(ill("lock", { label: 'A "lock"' }), /role="img" aria-label="A &quot;lock&quot;"/)
  assert.match(ill("nope"), /aria-hidden="true"/)
})
