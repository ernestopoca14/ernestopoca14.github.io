---
title: "Dual-booting CachyOS on a gaming laptop, layer by layer"
date: 2026-10-30
tags: [computing/linux]
description: How I put CachyOS next to Windows 11 on an MSI GF65 without breaking Windows, and what each step taught me about how a PC starts.
---

I've used Windows my whole life. I tried Linux once, but my NVIDIA card gave me trouble in games, so I went back. Now every server in my homelab runs Linux, and I'm interested in a  cybersecurity/software career, where Linux is the fundamental. Time to stop using it only over SSH and have it as a daily driver.

This is how I installed **CachyOS** next to Windows 11 on my gaming laptop without touching Windows, and what I learned along the way.

![The MSI laptop running CachyOS with KDE Plasma](images/dual-boot-cachyos/desktop.jpg)

## 💻 The laptop

| Part       | What                                  |
| ---------- | ------------------------------------- |
| Model      | MSI GF65 Thin (2020)                  |
| CPU        | Intel i7-10750H, 6 cores / 12 threads |
| GPU        | NVIDIA GTX 1660 Ti, 6 GB              |
| RAM / disk | 16 GB / 512 GB NVMe SSD               |

## 🤔 Why CachyOS

I compared Mint, Bazzite, Fedora, Debian, Lubuntu and plain Arch. CachyOS won because:

- It's **Arch underneath**, so I learn the real thing (pacman, the Arch Wiki).
- **NVIDIA and Steam work out of the box**, which is what sent me back to Windows last time.
- It takes a **btrfs snapshot before every update**, and I can boot into one if an update breaks something.

I tried KDE, Cinnamon, Xfce and COSMIC in a virtual machine first and picked **KDE Plasma**: familiar coming from Windows, with the best Wayland and gaming support.

## 🛠️ The install in 4 steps

**0. Back up.** I copied my Windows home folder to my home server and checked the copy before touching the disk.

**1. Prepare Windows.**

| What                                          | Why                                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| Turn off **Fast Startup** (`powercfg /h off`) | "Shut down" is really a half-hibernation that leaves the disk marked "in use"       |
| Turn off **BitLocker**                        | Resizing an encrypted drive is risky, and boot changes can trigger the recovery key |
| **Shrink C: by 200 GB** (Disk Management)     | That free space is where Linux goes                                                 |

**2. Make the USB stick.** I checked the ISO's **SHA256 checksum** (a fingerprint: if it matches, the download is complete and untouched) and wrote it with Rufus in **DD mode** (byte-for-byte copy). **F11** at the MSI logo boots the USB once. The live system runs from USB and RAM, so nothing changes until you click Install.

**3. Partition, by hand.** Never pick "Erase disk". Linux shows the SSD as `/dev/nvme0n1` and its partitions as `p1`, `p2`…

| Partition          | Size    | Filesystem | What                               |
| ------------------ | ------- | ---------- | ---------------------------------- |
| Windows EFI        | 200 MiB | FAT32      | Windows' boot files, **untouched** |
| Microsoft reserved | 16 MiB  | none       | Untouched                          |
| Windows C:         | 276 GiB | NTFS       | Shrunk by 200 GB                   |
| Windows Recovery   | 855 MiB | NTFS       | Untouched                          |
| **New: Linux EFI** | 1 GiB   | FAT32      | GRUB lives here (`/boot/efi`)      |
| **New: CachyOS**   | 199 GiB | btrfs      | System and files (`/`, `/home`…)   |

The surprise: the installer wants an EFI partition of at least 512 MiB, and Windows' is only 200 MiB. So CachyOS got **its own**. Two EFI partitions on one disk is fine: the firmware keeps a boot entry for each. I read the installer's summary twice before clicking Install.

![KDE Partition Manager showing the six partitions on the SSD](images/dual-boot-cachyos/partition-manager.png)
*Windows on p1–p4, CachyOS on p5 (its own EFI) and p6 (btrfs).*

**4. First boot.** GRUB found Windows by itself (`os-prober`). The menu shows CachyOS, Windows, and a **snapshots** entry (`grub-btrfs`).

![The GRUB menu with CachyOS, Windows and a snapshots entry](images/dual-boot-cachyos/grub-menu.jpg)
*CachyOS, Windows (found by `os-prober`) and the snapshots entry at the bottom.*

## 🧱 How it starts now

Each step loads the next program into RAM and jumps to it:

**Power → UEFI firmware → GRUB → kernel + initramfs → btrfs mounted as `/` → systemd → KDE Plasma → fish**

| Layer | One line |
|---|---|
| Firmware (UEFI) | Tests the hardware, picks a boot entry from its own list |
| GRUB | The menu. Loads the kernel and initramfs |
| Kernel | The only program allowed to touch the hardware |
| btrfs + snapper | Copy-on-write files, a snapshot before and after every update |
| systemd | Process 1. Starts and watches every service |
| fish | My shell |

My first boot sat **3 min 33 s in the firmware** (`systemd-analyze`). It was a one-off: every boot since spends 4–7 s there, about 16–24 s from power to desktop.

![fastfetch and systemd-analyze in the terminal](images/dual-boot-cachyos/systemd-analyze.png)
*A normal boot: 4.7 s in firmware, 21 s from power to desktop.*

## 🔧 Setting it up

- **Tailscale** to reach my homelab from anywhere.
- A **new SSH key** just for Linux. `ssh-copy-id` failed with `Permission denied (publickey)`: my server refuses passwords, so the tool couldn't log in to add the key. That's the security working. I added it through the server's web console.
- **gh** (GitHub CLI). Under Wayland it needed `wl-clipboard` to copy the login code.
- **Firefox** with a password manager, uBlock Origin, strict tracking protection and HTTPS-only.
- **Obsidian**: my notes are back, synced with git like on Windows.
- **My AI coding assistant** runs here now, same setup as on Windows (I'm still considering switching in the future to local models or another provider for frontier AI capabilities).

## 🎮 Gaming

**Fistful of Frags** and **Halo: The Master Chief Collection** both run fine through Steam and Proton, the NVIDIA problem from my last attempt is gone. The desktop runs on the Intel graphics, and games use the NVIDIA card through `prime-run`.

![Halo: The Master Chief Collection main menu](images/dual-boot-cachyos/halo-mcc.jpg)
*Halo MCC through Proton.*

![Fistful of Frags in game](images/dual-boot-cachyos/fistful-of-frags.jpg)
*Fistful of Frags.*

## 🩺 Health check after the first days

| Check | Result |
|---|---|
| Failed services | 0 |
| Firewall (ufw) | On, blocks everything coming in |
| NVIDIA driver | Open kernel module, built for the CachyOS kernel |
| Disk | 51 of 199 GB used (games included) |
| Snapshots | Before and after every update, max 50 |
| Leftovers | 6 `.pacnew` config files to merge with `pacdiff` |

> [!tip] Snapshots aren't backups
> They live on the same disk. A dead SSD takes them along. A real backup lives on another device.

## 🧠 What I learned

**Partitioning a disk.** A disk is a table of partitions, each with its own filesystem. You can shrink one to make room without losing data, but back up first, never let an installer "Erase disk", and read the summary: it's the last moment nothing has happened yet.

**Installing an OS from a USB.** The ISO is a whole bootable system. Check the checksum, write it byte for byte, boot it live, and try it before installing.

**How UEFI works.** The firmware keeps its own list of boot entries, each pointing to a `.efi` file on an EFI partition. That's why Windows and CachyOS can each have their own EFI partition and never touch each other's files.

**KDE, CachyOS and fish.** KDE felt like an improvement over Windows. On CachyOS, packages come from `pacman` (`sudo pacman -Syu`, never `-Sy` alone), and a snapshot sits behind every update. fish is friendly, but it isn't bash.
