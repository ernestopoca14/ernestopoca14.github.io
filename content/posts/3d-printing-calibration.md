---
title: "3D Printing Calibration: Ten tiles and a card"
date: 2026-11-25
tags: [type/project, engineering/making]
description: "Ten small test tiles and one design card, one setting at a time: what I printed, what I saw, and the rules I kept."
---

## Why

My first [calibration card](posts/fit-card-calibration) told me what **fits**: holes, nuts, press fits. It didn't tell me what **looks good**, or what my printer can print **without supports**. I wanted both before designing real parts.

## Setup

- Prusa MINI+, 0.4 mm nozzle, textured PEI sheet
- Black PETG at 240 °C nozzle / 85 °C bed, from a spool open for months and **not dried**
- One base PrusaSlicer profile (0.2 mm layers), sliced from the command line by my AI-assisted workflow

## Strategy

**Change one setting per print.** Every test tile is the same 36 × 36 × 8 mm block, with:
- a flat top (shine, ironing)
- a rounded top edge (layer steps)
- a 10 mm hole (round circles)
- round corners (seam, texture)

A separate **design card** tests overhangs, bridges and small text.

![Ten black PETG test tiles laid out in rows, each with a hole and a rounded top edge](images/3d-printing-calibration/tiles-row.jpg)
*All ten tiles. Same shape, one setting changed on each.*

## What I printed and what I saw

| # | Change | What I saw |
|---|---|---|
| 1 | Base, 0.2 mm layers | Decent |
| 2 | Ironing 15 % | The PETG smeared |
| 3 | Concentric top | Rings only suit round tops |
| 4 | Fuzzy skin | Fine on flat walls, messy on the curve |
| 5 | 0.12 mm layers | Best quality, +33 % time |
| 6 | Arc fitting off | No visible change |
| 7 | Half speed | Very good, +40 % time |
| 8 | 0.28 mm layers | Fastest (13 min), coarse top |
| 9 | 0.16 mm + slow outer wall | Very good, 19 min |
| 10 | 0.12 mm + slow outer wall | Very good, 23 min |
| Card | Overhangs 30–70°, bridges 10–40 mm, text 3–6 mm | Overhangs clean to 60°, every bridge sagged, no text readable (1 h 32 min, 35 g) |

![Two test tiles side by side: a smooth top on the left, coarser lines on the right](images/3d-printing-calibration/tile5-vs-tile8.jpg)
*Tile 5 (0.12 mm layers, left) next to tile 8 (0.28 mm, right).*

![Design card with overhang pillars, bridges and small raised and cut text](images/3d-printing-calibration/design-card.jpg)
*The design card: overhangs on the left, bridges on the right, the unreadable "Ab8" text in front.*

## What I selected

**Tiles 1, 5, 9 and 10.** My favourite is **tile 5 (0.12 mm layers)**.


## Rules I'm keeping

| Rule | Why |
|---|---|
| Overhangs up to **60°** need no supports | 30/45/60 were clean, 70 drooped |
| Avoid bridges; if needed, **≤ 20 mm** | Every span sagged |
| No small text: label by shape, or **≥ 8 mm and ≥ 1 mm deep** on a top face | 3–6 mm text was unreadable |
| Thin layers or slow outer walls for anything visible | Tiles 5, 7, 9, 10 |

## Lessons

1. **One change at a time** teaches more than one perfect print.
2. **Gentler is better:** thinner layers and slower walls beat every trick.
3. **Dry the filament first.** The smears, strings and sagging bridges all point at the wet spool.
4. **Test text before designing labels.**

**Next:** dry the PETG, reprint the bridges with the fan at 100 %, and a bigger text test.
