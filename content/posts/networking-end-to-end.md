---
title: "Networking end to end, summarized"
date: 2026-11-17
tags: [type/learning, computing/networking]
description: "I wanted one short resource that explains networking from the cable to the app, so I built one around my own homelab: 14 lessons, one idea each."
---

## ⚡ In short

- Every guide I found was either a 10-minute video or a 600-page book. I wanted one short path from the cable to the app.
- So I built a study page: **14 lessons**, one idea each, with a bench to try it and an example from my own homelab.
- The idea that tied it all together: **layers**. Each one wraps the message in its own label.
- The part I use every week: a **6-step troubleshooting ladder**.

## 🗺️ The whole path in one table

| Layer | Lessons | The idea in one line |
|---|---|---|
| 🔌 Link | 1–3 | Bits travel as voltage or radio. A **switch** learns which device sits on which port |
| 🏠 IP | 4–6 | An **IP address** is a postal address. A **/24** says which part is the street. Other streets go through the **router** |
| 📇 Services | 7–8 | **DHCP** hands out addresses. **DNS** turns names into numbers |
| 🚪 Transport | 9–10 | A **port** finds the program. **NAT** lets my whole house share one public address |
| 🧅 All together | 11–14 | Layers wrap and unwrap, servers hold virtual networks, tunnels let me in, and the ladder finds faults |

## 🔌 A switch that learns

Every network card has a **MAC address**. A switch writes down which MAC is on which port. The first message to an unknown device goes to every port; after that, only to the right one.

![The switch bench: the server sends to the phone, the link to the phone lights up, and the switch table shows two learned MAC addresses](images/networking-end-to-end/switch-bench.png)

## 🏠 Same street or not?

`10.0.0.20/24` means the first 24 bits (`10.0.0`) are the street and the last 8 bits are the house: 254 devices. Same street: talk directly. Different street: go through the router.

![The subnet calculator: 10.0.0.20/24 in blue and orange bits, and 10.0.1.50 marked as a different network that needs a router](images/networking-end-to-end/subnet-bench.png)

## 🚪 NAT: a one-way door

My devices share one public address. The router keeps a note of each request going out and only lets in replies that match a note. A stranger's packet has no note, so it's dropped. That's why I never open ports on my router.

![The NAT bench: the phone visits a website, the router rewrites the address, and the reply comes back through the NAT table](images/networking-end-to-end/nat-bench.png)

## 🧅 The idea that made it click: wrapping

On the way out, each layer adds its own label (a header). The receiver peels them off in reverse.

| Step | Label added | It says |
|---|---|---|
| 1 | App data | "Please send me the page /web" |
| 2 | TCP | To port 8096 |
| 3 | IP | To the server's address |
| 4 | Ethernet / Wi-Fi | To the next device's MAC (changes at every hop) |
| 5 | Bits | 1s and 0s on the wire |

![The wrapping bench, fully wrapped: Ethernet, IP, TCP and app data labels around one request, with made-up addresses](images/networking-end-to-end/wrapping-bench.png)

## 🔥 A real outage, through the layers

My server's network card froze. Every app was still running, but all of them looked dead from my laptop at once.

- **What I saw:** at the top (apps not loading).
- **The cause:** at the bottom (the card). Nothing could get out.

Full story: [A network card that froze my whole server](network-card-froze-server).

## 🪜 The troubleshooting ladder

Climb one rung at a time and stop at the first one that fails.

| # | Question | Command | If it fails |
|---|---|---|---|
| 1 | Is my link up? | `ip -br link` | Cable, Wi-Fi or the card |
| 2 | Do I have an IP? | `ip -br addr` | DHCP |
| 3 | Can I reach my router? | `ping -c 3 192.168.1.1` (your router) | The home network |
| 4 | Can I reach the internet? | `ping -c 3 1.1.1.1` | Modem or provider |
| 5 | Do names work? | `getent hosts github.com` | DNS |
| 6 | Is the service up? | `curl -sI http://server:port` | The app |

When many things break at once, the cause is usually low and shared.

## 💡 If you're starting

- **Learn on your own network.** "That's my router" sticks better than any diagram.
- **One idea per lesson**, and play with it.
- **Spell out every acronym.** Half my confusion was NAT and DHCP that nobody expanded.

Next I'm going one level deeper with the OSI model and TryHackMe's networking rooms.
