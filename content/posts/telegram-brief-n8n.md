---
title: "A morning brief and weekly report in Telegram with n8n"
date: 2026-11-04
tags: [type/project, homelab/automation]
cssclasses: [phone-shots]
description: Two self-hosted n8n workflows send me a short morning brief every day and a homelab health report every Sunday, so I don't have to open five dashboards.
---

## 🤔 Why

My homelab has a lot of dashboards: Proxmox, Uptime Kuma, Grafana, GitHub, n8n. I didn't want to open each one every day. I also wanted to start the day with the weather, my calendar and my spending so far this month. So now two messages come to me:

| Message | When | What's in it |
|---|---|---|
| ☀️ **Morning brief** | Every day, 07:00 | Weather, UV, air quality, my calendar, tasks, spending this month |
| 📊 **Weekly report** | Sunday, 09:00 | Monitors, backups, disk space, server updates, failed automations, update PRs, top 3 actions |

Both run in **n8n**, a self-hosted automation tool, on my home server. Both post to one Telegram group with **topics**: ☀️ Brief, 📊 Weekly and 🚨 Alerts. Each kind of message has its own thread.

## 🧩 How the weekly report works

![Every Sunday the weekly report reads four sources, one code step builds the message, and it goes to Telegram](images/telegram-brief-n8n/pipeline-weekly.svg)

- Each source is one HTTP request node.
- One **Code node** turns everything into a short HTML message.
- If a source fails, the report still goes out and says "no data" for that part, instead of failing silently.

**Least privilege.** The report reads Proxmox with its own user and an **auditor role**: it can read, never change anything. The brief reads my notes with a GitHub token limited to **one repo, read-only**, with an expiry date.

## ☀️ What the brief shows

- **Weather** for my area: morning, afternoon, night (Open-Meteo, free, no key).
- **Sun and UV**: sunrise, sunset, UV peak and the hours to cover up.
- **Air quality**: AQI, PM2.5, PM10, ozone, Sahara dust.
- **Sky**: moon phase, planets in the evening, meteor showers.
- **My day**: calendar events, today's tasks from my notes, spending this month.

No pollen: no free source covers Costa Rica, hopefully this changes in the future.

![The morning brief in Telegram, with made-up data](images/telegram-brief-n8n/morning-brief-example.png)
*An example morning brief. The events, tasks and amounts are made up.*

## 📊 What the report shows

- **Monitors** up/down, with a trend against last week (↑↓).
- **Backups**: last week's backup runs, plus the "I'm alive" pings from each nightly backup job.
- **Disk %** for every storage, with ⚠️ from 80 %.
- **Server**: pending updates, certificate days left, uptime.
- **n8n**: failures per workflow.
- **Update PRs**: merged and still open, each marked 🔴 major, 🟡 minor or 🟢 patch.
- **Top 3** actions at the end, picked by rule: a down monitor beats a failed backup, which beats a full disk, and so on.

![The weekly report in Telegram, with made-up data](images/telegram-brief-n8n/weekly-report-example.png)
*An example weekly report. The data is made up; the layout is the real one, made by the workflow's own code.*

## ✂️ Making it short

The first version was far too long. Six small rounds later: one line per area, tables in monospace so they line up on a phone, and the long lists folded into expandable quotes.

## 💥 What broke

- **Expired Google tokens**: Google login tokens expired every 7 days while the app was in "Testing". Publishing it fixed that.
- **Missing monitors**: after the monitoring app restarted, the report quietly showed fewer monitors. Now it shows them as **"no data"** instead of hiding them.

## 🧠 Lessons

- A message that comes to me beats a dashboard I have to open.
- Give each automation its own read-only credential.
- "Missing" is not the same as "fine". Make the report say when it doesn't know.
