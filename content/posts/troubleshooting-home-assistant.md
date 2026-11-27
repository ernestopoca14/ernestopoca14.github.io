---
title: "Troubleshooting my Home Assistant: blinking lights and a missing diffuser"
date: 2026-11-17
tags: [type/project, homelab/automation]
description: "My lights blinked every time I used the wall switch, and my diffuser vanished from Home Assistant. The cause of each, and the fix."
---

Two problems from my bedroom setup ([My bedroom on Home Assistant](bedroom-home-assistant)), and how I fixed them.

## Blinking lights at the wall switch

**What I saw:** I flipped the wall switch and the ceiling lights went on, off, on, off. It felt very chaotic, like being in the middle of a cyber attack in my own bedroom.

**The cause:** two automations fighting.

| Automation | Its job | That night |
|---|---|---|
| Warm on wall switch | Light comes on → make it warm | Turned the lights on |
| Power outage recovery | Lights come on while I'm away → power cut → turn them off | Turned them straight off |

Home Assistant thought I was away: my phone's last location was hours old and about 700 m from home. The automation's history (its trace) showed which rule fired and why.

**The fix:** a real power cut turns on **every** bulb at once, including the lamp on another plug. The wall switch only controls the ceiling. So the recovery automation now only acts if the ceiling **and** the lamp all came on within 40 seconds.

## The diffuser that vanished

**What I saw:** the diffuser showed "Unavailable" for about a week.

**Dead end:** I assumed Home Assistant had the wrong address. I mixed up devices in the router's client list and chased the wrong one. The diffuser had been at the same address all along.

**The cause:** Tuya devices are controlled locally with a secret **local key**. Pairing a device again in the app gives it a **new** key, and Home Assistant still had the old one.

**The fix:**
1. Paired the diffuser again in the Tuya app.
2. Logged in to the Tuya cloud once from Home Assistant (a code from the app plus a QR scan) and read the new key.
3. Put the new key into the integration. Same entity names, so the timer buttons and the "Water ran out" alert came back with no edits.

## What I learned

- **Phone GPS is a guess.** A room presence sensor (mmWave radar) is next.
- **An automation that turns things off should check one more fact** before it acts.
- **New pairing means a new key.** Check the key before the address.
- **One app per device**, or the keys drift apart.
