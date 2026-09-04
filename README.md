# Cayman Super Kings Cricket Club 🏏

Official content-led website for **Cayman Super Kings**, Grand Cayman's premier cricket franchise competing in the Cayman Islands Cricket Association (CICA) leagues.

---

## 🌟 Overview & Architecture

- **Zero-Build Static Architecture**: Native HTML5, modern modular CSS3, and ES Modules.
- **Centralized Content Layer**: Hand-maintained JSON files in `/content/` for easy seasonal updates without modifying code.
- **Hard Automated Safeguards**: Privacy and safeguarding Consent Guard on Squad and Youth pathways.
- **Design Tokens**:
  - **Navy (Primary)**: `#101C3F`
  - **Gold (Primary CTA / Captain Badge)**: `#F59E1B`
  - **Flame (Accents / Fills)**: `#F2600C` *(Text-safe `#B8430A` on light backgrounds)*
  - **Teal (Secondary / VC Badge / Focus Ring)**: `#38C6D9`
  - **Page Background**: `#F7F8FA`
  - **Typography**: Display in `Archivo` (tabular scorelines) & Body in `IBM Plex Sans`.

---

## 📂 Project Structure

```
.
├── index.html                   # 1. Home
├── matches.html                 # 2. Matches, Results & Standings
├── match-detail.html            # 3. Match Scorecard & CricClubs Portal
├── squad.html                   # 4. 2026 Squad Roster (5 Groups)
├── player-detail.html           # 5. Dynamic Player Profile
├── gallery.html                 # 6. Photos, Videos & Keyboard Lightbox
├── news.html                    # 7. Match Reports & News Grid
├── article.html                 # 8. Single Column Editorial Article
├── youth.html                   # 9. Youth Academy 3-Step Pathway
├── about.html                   # 10. History, Honours & 2023-2026 Timeline
├── partner.html                 # 11. Corporate Sponsorship Tiers & FAQs
├── contact.html                 # 12. Validated Contact Form & Ground Map
├── 404.html                     # 13. 404 Error & Reusable Empty States
├── css/
│   ├── tokens.css               # Color variables, typography & resets
│   ├── layout.css               # 12-column grid, header, nav & footer
│   ├── components.css           # Cards, scoreboards, buttons, lightbox, tables
│   └── pages.css                # Route-specific layouts & timeline
├── js/
│   ├── app.js                   # Header, mobile nav & announcement bar
│   ├── consent-guard.js         # Automated youth safeguarding guard
│   ├── content-store.js         # Centralized JSON store & fetch cache
│   ├── matches.js               # Match filters, tabs & countdown timer
│   ├── squad.js                 # Squad rendering & career stats calculator
│   ├── gallery.js               # Lightbox modal with Esc & Arrow key nav
│   ├── news.js                  # News filter & scoreline cards
│   └── contact.js               # Accessible client-side validation
├── content/
│   ├── fixtures.json            # Match dates, scores, and CricClubs URLs
│   ├── squad.json               # 22 player profiles with consent flags
│   ├── gallery.json             # Photo/video metadata and tags
│   ├── news.json                # Articles, match reports, and excerpts
│   └── about.json               # Timeline, honours, leadership, and ground
├── assets/
│   ├── icons/                   # Branded cricket SVG icons
│   └── placeholders/            # Drop-in SVG slots (portraits, hero, crest, logos)
├── sitemap.xml                  # Search engine sitemap
└── robots.txt                   # Web crawler configuration
```

---

## 🚀 Running Locally

Serve the static files with any local HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node / npx
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🌐 Deployment Targets

Deployable instantly with zero configuration on:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Cloudflare Pages**
