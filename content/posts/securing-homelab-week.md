---
title: "Securing my homelab in a week"
date: 2026-11-17
tags: [type/learning, security/hardening, homelab/networking]
description: "Six days of closing doors on my home server: SSH keys only, a host firewall, a locked-down password manager, rotated secrets, and a leak scan on every pull request."
---

## 🤔 Why

After [my hard drive died](my-hard-drive-died), I started looking at the whole server with fresh eyes. I'm also working toward a cybersecurity career, so my own homelab is the best place to practice. If I want to defend other people's systems one day, I should start by attacking and fixing my own.

The plan: look at the server the way an attacker would, write down every weak spot, and fix them one at a time, **testing each fix**. This is what one week (2026-10-17 → 10-22) looked like.

## 🗺️ The checklist

| Layer | Weak spot I found | Fix |
|---|---|---|
| Logins | SSH accepted passwords | Keys only, everywhere |
| Updates | Security updates were manual | Automatic security updates |
| Host | Admin services listened to anyone who could reach them | Host firewall: home network only |
| Password manager | Public sign-ups were **on** | Off, plus an unused account deleted |
| Password manager | Admin token stored in plain text | Stored as an Argon2id hash |
| Secrets | An old password was in git history; another showed up in a chat log | Rotated, old database retired |
| Code | Nothing stopped me from committing a secret | gitleaks scan on every PR |
| Smart home | No 2FA; device keys in a text file | 2FA on; keys moved into the password manager |

## 🔑 1. SSH: keys only

Password logins over SSH are what bots try all day. I turned them off on the host and every container, so only my SSH keys work.

The test that matters is the negative one: I tried a password login and checked that the host **refused** it.

## 🧱 2. A firewall on the host, with a dead-man switch

Proxmox has a built-in firewall. I set it to **drop everything**, then allowed only what I need, and only from my home network: SSH, the web UI, the console and ping. I also turned off a service I don't use (`rpcbind`, only needed for NFS shares).

The scary part of a firewall is locking yourself out. So before turning it on, I started a **dead-man switch**: a background timer that turns the firewall back off after 5 minutes, unless a *new* SSH login proves it still works.

```bash
setsid nohup sh -c 'sleep 300; [ -f /root/fw-keep ] || { …turn the firewall off…; }' &
pve-firewall restart
# from a NEW terminal, within 5 minutes:
ssh … touch /root/fw-keep
```

- `setsid nohup … &` keeps the timer running even if my SSH session dies.
- If `/root/fw-keep` doesn't exist after 300 seconds, the firewall turns itself off.

It earned its keep right away: on the **first try the timer switched the firewall back off**. On the second try, it confirmed and stayed on.

From outside, ShieldsUP showed all common ports as *Stealth*, and Shodan had no record of my IP.

## 🔐 3. The password manager

I run Vaultwarden (a self-hosted Bitwarden server). Two surprises:

- **Public sign-ups were on.** Anyone who found the page could make an account. I turned sign-ups and invitations off and deleted an old, empty account of mine.
- **The admin token was stored in plain text** in its config file. I replaced it with a new one stored as an **Argon2id hash**, so the file alone isn't enough to get in. I tested it: the new token works, a wrong one gets rejected. Then I shredded the old file and its backup.

## 🔄 4. Rotating secrets

A scan of my repo's **whole git history** found one old commit with passwords in a config file, and a VPN key.

- The leaked database password still opened an **old, unused database**. I dumped it to a file, stopped it, and stopped it from restarting. A database that nothing uses is pure risk.
- Another database password had shown up in a chat log while I was debugging. I rotated it and checked the app still worked.
- I changed my VPN account password and its service credentials.

I didn't rewrite the git history. The secrets in it are all rotated now, so the old values are useless.

## 🕵️ 5. A leak scan on every PR

The best fix is to stop the next leak. Every pull request in my homelab repo now runs **gitleaks**, a tool that scans changes for passwords, keys and tokens. I added one custom rule for plain passwords in config files.

GitHub's own push protection needs a paid plan for private repos, so gitleaks in CI does the job for free.

## 🏠 6. Smart home

- 2FA on Home Assistant, verified.
- My smart-light device keys were in a `.txt` file and in screenshots. They moved into the password manager, and the screenshots were deleted.

## 🧠 What I learned

- **Test the negative.** "Login works" isn't the test. "A password login gets refused" is.
- **Plan your way back before you lock a door.** The dead-man switch saved me on the first try.
- **Unused things are risk.** An old database and an old account were the weakest spots.
- **Rotating beats deleting.** Once a secret is changed, a leaked copy doesn't matter.
- **Automate the guard.** A scan on every PR is better than remembering to check.

## ⏭️ Next

Still open: rotate the last few app passwords (the ad blocker and the download apps), a non-root Proxmox admin with 2FA, smart-home devices on their own network, and deleting one unused public hostname.
