---
title: "Three AI-driven CAD tools and two slicers, one calibration card"
date: 2026-11-19
tags: [type/project, engineering/making, engineering/cad]
description: "I printed one fit-test card to learn how my Prusa MINI+ really prints holes, nuts and pins, and used it to compare three CAD tools and two slicers."
---

## ⚡ In short

- **What:** one 100 × 62 × 4 mm card that tests screw holes, nut traps, heat-set insert holes, pin fits and thin walls, three sizes each.
- **Why:** a hole drawn at 3.0 mm doesn't print at 3.0 mm. I wanted my own fit rules for my printer.
- **Bonus:** I built the same card in three CAD tools and sliced it in two slicers, to pick my default tools.
- **Result:** round holes print 0.1–0.4 mm small, hexes print exact. My rules are in the table below.

## 🛠️ Three CAD tools

| | text-to-CAD | FreeCAD + MCP | SolidCraft |
|---|---|---|---|
| Tries | 1 | 2 | 2 failed batches, then OK |
| Time to a checked card | ~25 s | ~54 s | ~90 s |
| Built-in checks | Printability check, snapshots | None | Expected volume per step |
| What I keep | A Python file in git | A `.FCStd` file | A parametric timeline |

![The same card from text-to-CAD, FreeCAD and SolidCraft, left to right](images/fit-card-calibration/fit-card-three-tools.png)
*The same card from all three tools. Only the label font differs.*

All three agree within 0.1 % on volume. FreeCAD's first card had zero volume (the engraved letters swallowed it), and SolidCraft refused a font path outside its sandbox. text-to-CAD worked first try and even warned me the small labels were too small.

**My pick:** text-to-CAD. The part is plain code I can read, change and keep in git, and it checks itself. I'll keep trying the others and new tools as they come out.

## 🔪 Two slicers

OrcaSlicer and PrusaSlicer gave the same slice for my Prusa MINI+ (PETG, 0.2 mm layers): 1 h 05 min vs 58 min, the difference being one extra wall.

**What broke:** my first PrusaSlicer run from the command line silently fell back to a generic 200 mm printer with no bed probing. Now a small script builds the full MINI profile and refuses any bed that isn't 180 × 180 mm. **Before printing a file you didn't slice by hand, open the G-code and check it.**

## 🖨️ The print

One hour of printing. A first-layer Live Z of -1.500 gave an even first layer. My PETG was wet, so it strung a lot, and the 3.2 mm labels came out unreadable.

![The printed card with two heat-set inserts pressed in, an M3 nut, an M3 bolt and the printed pin beside it](images/fit-card-calibration/fit-card-parts.jpg)
*The card after testing: two inserts set, and the parts I checked against it.*

## 📏 What fits

| Test | Result | My rule |
|---|---|---|
| M3 screw | 3.0 no · 3.2 cuts its own thread · 3.4 slides through | **3.4 mm** hole |
| M3 nut | 5.5 no · 5.7 press fit · 5.9 loose | **5.7 mm** nut trap |
| M3 heat-set insert | 4.0 and 4.2 both hold | **4.0 mm** (more grip) |
| Pin | 0.15–0.2 per side push fit · 0.3 moves freely | **0.3** free fit |

The caliper explained why: round holes 3.0 / 3.2 / 3.4 printed at 2.6 / 2.9 / 3.1, while the hexes came out exact. A slicer draws a circle as short straight lines and the plastic bulges inward on the curve, so small holes lose the most. That's also why a 4.0 mm insert hole works: it prints at about 3.7 mm, the insert's smooth part.

## 🧠 Lessons

1. **Print a fit card once per printer and filament.** One hour gave me rules for screws, nuts, inserts and pins.
2. **Holes shrink, flats don't.** Add about 0.4 mm to small round holes, nothing to hexes.
3. **Check the G-code**, not only the preview.
4. **Labels: at least 5 mm tall and 0.6 mm deep.**
5. **Keep PETG dry.**

**Next:** I used the 0.3 mm free fit for the slot of my iPad stand: [My iPad as a second monitor, on a 3D printed stand](posts/ipad-second-monitor-stand).
