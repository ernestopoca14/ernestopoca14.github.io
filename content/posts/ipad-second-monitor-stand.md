---
title: "My iPad as a second monitor, on a 3D printed stand"
date: 2026-11-19
tags: [type/project, engineering/making, engineering/cad, computing/linux]
description: "From idea to second screen in one evening: a stand designed in code, sliced from the command line, printed in 1 h 22 min, and an old iPad working as a monitor for my Linux laptop."
---

## ⚡ In short

- **Why:** my iPad 8th gen sat in a drawer, and I was thinking about buying a second monitor. I reused the tablet instead.
- **The path:** idea → CAD in code → G-code → print → the iPad as a screen over VNC.
- **Result:** a one-piece PETG stand (1 h 22 min, 29.5 g) that fits well, and a one-click second screen.

## 💡 1. The idea

No case, a fixed angle, little plastic, one piece, no supports. The size that matters is the iPad's thickness, **7.5 mm**. My [calibration card](posts/fit-card-calibration) says a free fit needs **+0.3 mm per side**, so the slot is **8.1 mm**.

## 📐 2. CAD: the part is code

The part is a Python script in a code-based CAD tool, written and edited through my AI-assisted workflow. Round 1 was built from straight bars and plates, and I didn't like it. So the rule became **everything rounded**, and round 2 gave three ideas:

![Round 2: the ribbon, the pebble and the sled](images/ipad-second-monitor-stand/concepts_v2.png)
*Round 2: ribbon (left), pebble, sled.*

I picked the **ribbon**: one 4 mm band, 40 mm wide, bent into a lip, a backrest at 65° and a rear foot. Least plastic for how it looks.

**Preview before printing:** I look at every version in the 3D viewer, from the side and at 45°, before anything is sliced.

![Side view of the ribbon profile: lip, slot, backrest and rear foot](images/ipad-second-monitor-stand/ribbon_side.png)
*The approved profile, from the side.*

## 🧾 3. G-code from the command line

PrusaSlicer for the MINI+ and PETG: 0.2 mm layers, 4 walls, 15 % infill, 240 °C / 85 °C, no supports. The part **prints on its side**, so the layers follow the curve and the bends stay strong.

The first run failed with "All objects are outside of the print volume". `--center 90,90 --ensure-on-bed` puts it in the middle of the bed and on the plate. Then I checked the G-code: the right printer, bed probing, temperatures.

## 🖨️ 4. The print

1 h 22 min on the first try, and the iPad fits really well. Next time I'd add a soft pad underneath so it doesn't slide.

![The printed ribbon stand on a table](images/ipad-second-monitor-stand/stand-printed.jpg)
*One band of black PETG.*

## 🖥️ 5. The iPad as a second monitor

KDE Plasma 6 (Wayland) comes with `krfb-virtualmonitor`. It creates a **virtual screen** that Plasma treats like a real monitor and shares it over **VNC**. The iPad only needs a VNC viewer app.

```bash
sudo pacman -Syu krfb
krfb-virtualmonitor --name iPad --resolution 2160x1620 --port 5900 --password 1234
sudo ufw allow from 192.168.1.0/24 to any port 5900 proto tcp
```

- `pacman -Syu krfb` installs it from the official repos.
- `krfb-virtualmonitor` makes a screen at the iPad's own resolution and listens on port 5900. Pick your own password.
- `ufw allow` opens that port to the home network only. Use your own network's range.

![The laptop with the iPad in the printed stand beside it as a second screen](images/ipad-second-monitor-stand/ipad-second-screen.jpg)
*The iPad as a second screen (its screen is blurred here on purpose).*

**Three gotchas:**

1. **Tiny text:** set the virtual screen to **scale 2** in Display Settings.
2. **The screen moves** when the iPad connects. `kscreen-doctor` puts it back where I want it.
3. **No mouse pointer on the iPad:** Plasma draws it on a hardware layer that VNC doesn't see. `KWIN_FORCE_SW_CURSOR=1` in a file under `~/.config/plasma-workspace/env/` draws it into the picture after the next login.

Now it's a small script with a launcher entry, **iPad screen**: one click on, one click off.

## 🧠 Lessons

1. **Measure your printer first:** the slot was right on the first print.
2. **Say what you don't like:** "too many straight lines" turned brackets into a ribbon.
3. **Look before you print:** a 30-second preview is cheaper than a failed print.
4. **An old tablet makes a fine second screen** with what's already in KDE.
