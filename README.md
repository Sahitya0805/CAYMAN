# 🦁 Cayman Super Kings — Official Digital Platform & CMS

> **One Team. One Dream. The Lion Roars Again.**  
> The official website, live match centre, and administrative CMS for the **Cayman Super Kings (CSK)** cricket club in the Daniel Morris Super League T20.

---

## 🌟 Overview & Features

### 🏏 Fan Experience & Public Platform
- **3-Window Sliding Video Hero**: Cinematic ambient video background with 3-window sliding video selector (62-run victory reel, upcoming fixture, VIP hospitality).
- **Live Match Centre**: Real-time ball-by-ball scoreboard, run-rate gauge, win probability meter (82%), and active striker/non-striker/bowler tracker.
- **Matchday Ticketing & Dynamic QR Gate Passes**: Interactive seat selection, ticket categories (General, Grandstand, VIP Lounge, Corporate), instant dynamic QR gate pass generation, and digital wallet downloads.
- **Gate Pass QR Verifier (`/tickets/verify`)**: Real-time scanner tool for gate marshals to validate and check-in attendees.
- **Squad & Player Profiles**: Comprehensive stats, bowling & batting styles, career records, match logs, and medal accolades (*Rahul Garg 53 off 42, Ravneet 3/16, Rajasekhara 3/6, Parthipan 43\**).
- **Match Highlights & Media Theatre**: Playable video reels, photo galleries, and match replays.
- **Official Merchandise Store**: 2026 match jerseys, snapbacks, and supporter apparel with size selectors, slide-out Cart Drawer, and checkout flow.
- **VIP Hospitality**: Corporate suite packages and interactive booking request modal.
- **Fan Zone & Polls**: Real-time interactive matchday voting polls and digital fan membership pass creator.

### ⚙️ Administrative CMS & Live Scoring (`/admin`)
- **Command Dashboard**: Real-time KPI widgets for matches, squad players, news reports, issued ticket passes, store orders, and revenue metrics.
- **Dedicated Scorer Keypad (`/admin/live-scoring`)**: 1-click ball recording (`0`, `1`, `2`, `3`, `4`, `6`, `W`, `WD`, `NB`, `Bye / Leg Bye`, `Undo`) that synchronizes live scoreboards instantly across browser sessions without page refreshes.
- **Player Squad CRUD**: Add, edit, and update player bios, photos, and career statistics.
- **Match & Fixtures Manager**: Schedule upcoming games, toggle match statuses (`UPCOMING`, `LIVE`, `COMPLETED`), and publish scorecards.
- **News & Articles CMS**: Rich markdown match report creator and draft/published controls.
- **Media Library**: Upload and categorize photo and video assets.
- **Store Inventory & Orders**: Product catalog controls and customer order fulfillment updates (`PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`).
- **Homepage Builder**: Show, hide, and reorder all 15 modular homepage sections dynamically.
- **Site Settings & Audit Trail**: Top announcement bar editor, club contact info, and SOC2 audit trail.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS, CSS Custom Properties, Custom Glassmorphism & Gold Gradients
- **Typography**: Montserrat (Display & Numbers), Oswald (Scoreboards & Badges), Plus Jakarta Sans (Body), Cinzel (Luxury Accents)
- **Motion & Physics**: Framer Motion (Hardware-accelerated 60fps spring parallax and ambient floating cricket elements)
- **State Management**: Reactive Context API with multi-tab storage synchronization and live scorer engine
- **QR Engine**: `qrcode` (dynamic cryptographic verification hashes)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev -- -p 3004
```
Open [http://localhost:3004](http://localhost:3004) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start -- -p 3004
```

---

## 🏛️ Project Directory Structure

```
├── src/
│   ├── app/                    # Next.js App Router (Public & Admin routes)
│   │   ├── admin/              # Complete CMS & Scorer Console suite
│   │   ├── club/               # Club history & mission
│   │   ├── contact/            # Contact & enquiries form
│   │   ├── fan-zone/           # Fan polls & digital pass generator
│   │   ├── hospitality/        # VIP suites & corporate packages
│   │   ├── matches/            # Fixtures & Live Match Centre
│   │   ├── media/              # Video vault & photo galleries
│   │   ├── news/               # Match reports & editorial reader
│   │   ├── players/[slug]/     # Individual player profiles & career stats
│   │   ├── shop/               # E-commerce store & checkout
│   │   ├── team/               # Squad roster
│   │   ├── tickets/            # Ticketing flow & gate validator
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Modular dynamic homepage
│   ├── components/             # Reusable UI & section components
│   ├── context/                # StoreContext & CartContext
│   ├── data/                   # Initial authentic seed datasets
│   └── types/                  # TypeScript interface definitions
└── tailwind.config.ts          # Brand palette & typography configuration
```

---

*Cayman Super Kings © 2026. All rights reserved.*
