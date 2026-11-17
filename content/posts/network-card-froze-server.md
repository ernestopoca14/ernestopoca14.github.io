---
title: "A network card that froze my whole server"
date: 2026-11-16
tags: [type/til, homelab/networking, computing/linux]
description: My home server vanished from the network for 40 minutes while still running; the fix was one ethtool line.
---

## 🧊 The problem

On 2026-10-21, from 13:05 to about 13:45, my whole home server dropped off the network. Every app, every container, the Proxmox web UI: all gone. But the server wasn't down. It had been up for 4 days and never crashed.

The kernel log showed the same line every 2 seconds:

```
e1000e ... nic0: Detected Hardware Unit Hang
```

The server is a Dell OptiPlex 7060 Micro. Its built-in Intel network card uses the `e1000e` driver, and that card is known to freeze under load.

My own monitoring couldn't tell me. Uptime Kuma runs on the same box, so when the network died, it died too. An outside check (healthchecks.io) is what alerted me.

## 🔧 The fix

The card has "offload" features: it does part of the work of cutting and joining network packets itself. Turning those off makes the CPU do that work instead. At home speeds, I don't notice the cost.

```bash
ethtool -K nic0 tso off gso off gro off
```

- `ethtool -K` changes a network card's features.
- `tso`, `gso`, `gro` are the three offloads: TCP segmentation, generic segmentation and generic receive.

That only lasts until the next reboot. To make it permanent, I added it under the card in `/etc/network/interfaces`:

```
iface nic0 inet manual
        post-up /usr/sbin/ethtool -K nic0 tso off gso off gro off
```

`post-up` runs the command every time the interface comes up. I also replugged the cable.

## ✅ The result

- The audit a few days later counted **511 hangs**, all on 2026-10-21, before the fix.
- **0 hangs since**, also after two kernel updates and reboots. I checked again on 2026-11-16.

## 🧠 What I learned

- "Server is down" and "server is off the network" are different problems. Check `uptime` first.
- Monitoring on the same box can't tell you the box is unreachable. You need one check from outside.
- If it ever comes back: swap the cable or router port, then a USB or PCIe network card.
