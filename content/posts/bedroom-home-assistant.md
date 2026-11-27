---
title: "My bedroom on Home Assistant: lights, humidifier and phone widgets"
date: 2026-11-17
tags: [type/project, homelab/automation]
description: "How I moved my cheap Wi-Fi bulbs and humidifier off the cloud app, made them answer in under a second, and set the room to go warm at 6 and dim through the night."
---

## In short

- **What:** 2 ceiling bulbs, a bedside lamp and a humidifier, all cheap Wi-Fi devices, controlled from Home Assistant instead of the vendor's cloud app.
- **Result:** the lights answer in about **0.3 s**, keep working without internet, and follow the time of day: warm at 18:00, 60 % at 20:00, 40 % at 21:00, 20 % from 22:00.
- **Control:** a dashboard and buttons in my phone's Control Center.
- **Biggest lesson:** run everything locally first, and give every device a button I can reach without opening an app.

**Why I did it:** I wanted to get involved with the open home community and Home Assistant, and to build automations that make my day-to-day a bit better.

## What's in the room

| Device | What it does | How Home Assistant talks to it |
|---|---|---|
| 2 ceiling bulbs (Left, Right) | Colour + warm/cool white | Tuya Local (on my network, no cloud) |
| Bedside lamp ("Night Light") | Colour + warm/cool white | Tuya Local |
| Humidifier / aroma diffuser | Mist low/high, timers, LED, "tank empty" sensor | LocalTuya |

All four are rebranded Tuya devices. (A third ceiling bulb lost its pairing and won't reset; that one is for another day.) Out of the box they only work through the vendor's app and its cloud: every tap goes to a server abroad and back.

## Step 1: getting the bulbs off the cloud

My first setup used an integration called **LocalTuya**. It talks to each device directly, using the device's address and a secret "local key". In practice:

- Colours came out wrong (green showed as pink) and warm white did nothing, because the integration guessed the wrong mapping for these bulbs.
- When a bulb changed address, it silently dropped out.

I moved the bulbs to **Tuya Local**, a newer integration that ships ready-made profiles for many models. I added each bulb by hand (address, device ID, local key), with **no cloud login**.

- Warm white now works, from 2700 K to 6500 K, and the bulb reports its state back.
- The new lights took the **old names** in Home Assistant, so my dashboard, automations and widgets kept working without edits.
- I tested it end to end: **53 checks, 0 failures**.

To get the local keys, I made a free account on Tuya's developer website, which lists the key for each of my devices.

## Step 2: one button per colour

Instead of picking colours in a colour wheel, I made **14 small scripts**: Warm, White, and a set of colours, for the ceiling and for the lamp. Each one is a single "turn on with this colour" call.

The trick that took a while: the bulbs keep **one brightness per mode** (white or colour). Without care, switching from colour to warm made the room jump to a different brightness. Now each script resends the current brightness, so only the colour changes.

- Warm = **2700 K**, picked by eye. White = 6000 K.

## Step 3: the humidifier

The diffuser got its own buttons and two automations:

- **1 h / 3 h / 6 h** buttons: they use the device's own timer, with a Home Assistant fallback that turns it off if the timer is missed.
- **Low / High** mist, and the LED on/off.
- **Every night 21:00–22:00** it runs on its own, with the LED off so it doesn't light the room.
- **"Water ran out":** if the tank-empty sensor stays on for 30 s while it's running, Home Assistant turns it off and sends a phone alert.

![A round wood-look aroma diffuser letting out a thin line of mist, next to a bedside lamp with a glass base, glowing warm](images/bedroom-home-assistant/diffuser.jpg)
*The diffuser on my bedside table, running next to the lamp in Warm.*

## Step 4: everything on my phone

With the lights and the diffuser both in Home Assistant, they come together in one place:

![The Bedroom dashboard on a phone: Ceiling Lights and Night Light sliders, Left and Right toggles, and the Smart Diffuser with a water alert](images/bedroom-home-assistant/dashboard-phone.png)
*The Bedroom dashboard: a slider for both ceiling lights, a toggle for each, a slider for the lamp, and the diffuser with its "tank empty" alert.*

For the phone I made three "decision" scripts:

- **Ceiling - On/Off** and **Night Light - On/Off:** if any light in the set is on, turn them all off; otherwise turn them all on. One tap always does the obvious thing.
- **Bedroom - All Off:** for when I'm already in bed.

These sit in my iPhone's Control Center, next to the colour scripts and the diffuser timers. I don't even open an app.

![iPhone Control Center with two columns of buttons: Warm, White, Blue and On/Off for the ceiling and for the lamp, then Aroma and 1, 3 and 6 hour diffuser timers](images/bedroom-home-assistant/control-center.jpg)
*Control Center: ceiling on the left, lamp on the right, and the diffuser at the bottom.*

The buttons I use most: the diffuser for **1 hour** or **3 hours**, and **On/Off** for the ceiling and the lamp.

**Speed:** from the script to both ceiling lights on takes **0.3 s** inside Home Assistant. From the phone it's fastest on home Wi-Fi: the app uses the local address at home, and the remote one adds 0.3–0.6 s.

## Step 5: the room follows the evening

One automation now handles the whole evening, from 18:00 to 06:00:

| Time | Lights that are on (or that I turn on) |
|---|---|
| 18:00 | Warm 2700 K, brightness kept |
| 20:00 | Warm, **60 %** |
| 21:00 | Warm, **40 %** |
| 22:00 → 06:00 | Warm, **20 %** |

Two rules made it feel right:

- It only touches lights that are **on**. It never turns a light on by itself.
- A light I switch on later in the evening gets the same treatment, not just the ones that were on at 18:00.

## What I learned

- **Run the devices locally first.** Most "my smart lights are flaky" problems were addresses and keys, not hardware.
- **Keep the old names** when you swap an integration, and everything built on top keeps working.
- **Buttons beat apps.** The Control Center buttons are what I actually use day to day.
- **Only touch lights that are on.** The evening automation never surprises me by turning something on.

## ⏭️ What's next

- An mmWave presence sensor and a thermometer, so the humidifier can follow the room's humidity.
- A bedside box with two knobs (ceiling and lamp brightness) built with ESPHome.
- Maybe flashing one of the bulbs with ESPHome, so I can delete the vendor app for good.

Not everything went smoothly: my lights started blinking and the diffuser vanished from Home Assistant. That's its own short post: [Troubleshooting my Home Assistant](troubleshooting-home-assistant).
