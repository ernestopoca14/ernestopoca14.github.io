---
title: "Networking end to end, summarized"
date: 2026-11-17
tags: [type/learning, computing/networking]
description: "I wanted one short resource that explains networking from the cable to the app, so I built one around my own homelab: 14 lessons, one idea each."
---

I run a small homelab, and I kept hitting words I only half understood: bridge, subnet, NAT, tunnel. Every guide I found was either a 10-minute video that skipped the middle, or a 600-page book. I wanted one resource that goes **end to end**, from the electricity in a cable to a web page on my phone, and stays short.

So I built one. It's 14 short lessons, from the bits on the wire to the app. Each has one big idea, a bench where I can try it (send frames through a switch, split a subnet, wrap a request layer by layer), an example from my own homelab, and three self-check questions. I made it with my AI-assisted workflow, then went through every lesson myself.

## The whole path, in 14 steps

Here is the summary I wish I had on day one. Each line is one lesson.

1. **A network** is devices that agree on rules (protocols) to pass messages. Big messages get cut into small **packets** so everyone can share the wires.
2. **Bits on a wire.** Everything becomes 1s and 0s: voltage on copper, light in fiber, radio for Wi-Fi. One letter is 8 bits.
3. **MAC addresses and switches.** Every network card has a built-in MAC address. A switch learns which MAC sits behind which port and sends each message only there.
4. **IP addresses.** A MAC is a serial number; an IP is a postal address. Addresses like `192.168.x.x` are private and stay inside the house.
5. **Subnets.** `/24` means "the first three numbers are the street, the last one is the house". Same street = talk directly.
6. **Router and gateway.** Anything not on my street goes to the router, the "door for everything else".
7. **DHCP** hands each new device its address, the street size, the gateway and a DNS server.
8. **DNS** turns names into IP addresses. An ad blocker on the network works by answering "nothing here" for ad servers.
9. **Ports, TCP and UDP.** The IP finds the device; the port finds the program on it. TCP is a phone call (checked, resent if lost); UDP is a postcard (fast, no check).
10. **NAT.** My whole house shares one public address. The router keeps a table of who asked for what, and drops anything nobody asked for. That makes it a one-way door.
11. **The layers.** Each layer wraps the message in its own label (header). The receiver unwraps them in reverse.
12. **Virtual networks.** One server can hold a whole network in software: virtual switches, virtual cables, containers with their own private addresses.
13. **Getting in from outside.** Because of NAT, the safe ways in start from inside: a VPN for me, a tunnel for sharing a link with family. I never open ports on my router.
14. **Troubleshooting.** Start at the bottom layer and climb. The first layer that fails is where the problem is.

## The idea that made it click: wrapping

Lesson 11 tied everything together. When my phone asks the media server for its page, the message gets wrapped on the way down:

| Step | Layer adds | It says |
|---|---|---|
| 1 | App data | "Please send me the page /web" (the message itself) |
| 2 | TCP header | To port 8096, from a temporary port on my phone |
| 3 | IP header | To the server's address, from my phone's address |
| 4 | Ethernet / Wi-Fi header | To the next device's MAC, for this hop only |
| 5 | Bits | 1s and 0s on the radio or the cable |

The server reads it bottom up and peels each label off. The IP addresses stay the same for the whole trip; the MAC label is replaced at every router.

![The wrapping bench, fully wrapped: Ethernet, IP, TCP and app data labels around one request, with made-up addresses](images/networking-end-to-end/wrapping-bench.png)

## A real outage, seen through the layers

A few weeks ago my server's network card froze. The apps were still running inside the server, but every app looked dead from my laptop at the same moment: the media server, the DNS ad blocker, the tunnel.

The layers explain it. Every message has to go down through the layers and out through the card to leave the box. With the bottom layer stuck, nothing above it could get out. What I **saw** was at the top (apps not loading). The **cause** was at the bottom. I wrote up the whole fix in [A network card that froze my whole server](network-card-froze-server).

## The troubleshooting ladder

This is the part I use most now. Climb one rung at a time, and stop at the first one that fails:

| Rung | Question | Command (Linux) | If it fails |
|---|---|---|---|
| 1 | Is my link up? | `ip -br link` | Cable, Wi-Fi or the card |
| 2 | Do I have an IP? | `ip -br addr` | DHCP didn't give me one |
| 3 | Can I reach my router? | `ping -c 3 192.168.1.1` (your router's address) | Inside the home network is broken |
| 4 | Can I reach the internet by number? | `ping -c 3 1.1.1.1` | Past my router: modem or provider |
| 5 | Do names work? | `getent hosts github.com` | DNS |
| 6 | Is the service listening? | `curl -sI http://server:port` | "Connection refused" = the app is down |

- `ip -br link` lists network cards and whether each is up.
- `ip -br addr` shows the address each card has.
- `ping -c 3` sends three test messages and counts the replies.
- `getent hosts` asks the system's DNS for a name.
- `curl -sI` asks a web server for just the headers of a page.

When many things break at once, that's a hint the cause is low and shared, like that frozen card.

## What I'd tell someone starting

- Learn on your own network. "that address is my router" sticks better than any diagram in a book.
- One idea per lesson. Short lessons, played with, beat long chapters, read once.
- Spell out every acronym. Half my confusion was words like NAT or DHCP that nobody expanded.
- Learn the bottom-up order early. It turns "the internet is broken" into a six-step checklist.

Next I'm going one level deeper with the OSI model and TryHackMe's networking rooms.
