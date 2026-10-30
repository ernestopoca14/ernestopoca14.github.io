# ernestopoca14.github.io

My notes on Linux, my homelab and security, published at <https://ernestopoca14.github.io>.

Built with [Quartz](https://quartz.jzhao.xyz) v5 (MIT). Posts live in `content/`. Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).

## ✍️ Writing a post

Posts are drafted in my private Obsidian vault. A post only comes here after it passed the privacy check: no IPs, hostnames, domains of my homelab, fingerprints, tokens, private repo names or family details.

## 🖥️ Preview locally

```
npm ci
npx quartz plugin restore
npx quartz build --serve
```

Then open <http://localhost:8080>.

## ⬆️ Updating Quartz

`upstream` points to `jackyzha0/quartz`. Update on a branch, build, then open a PR.
