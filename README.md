# JontroHaat (যন্ত্রহাট)

> **যন্ত্র ভাড়া নিন, কাজ এগিয়ে নিন।**  
> Bangladesh-focused Agricultural Equipment Rental Marketplace.

---

## 🌾 Project Overview

**JontroHaat (যন্ত্রহাট)** is a dedicated agritech rental marketplace designed specifically for Bangladeshi farmers, agricultural contractors, and equipment owners. The platform bridges the gap between agricultural machinery owners (power tillers, combine harvesters, irrigation pumps, seeders, threshers) and farmers seeking cost-effective, timely access to vital tools for crop cycles.

---

## 🎨 Brand Identity & Design System

- **Forest Green** (`#174C32`): Primary brand color representing lush fields and agricultural stability.
- **Leaf Green** (`#39834F`): Secondary accent representing growth, vitality, and active states.
- **Fresh Green** (`#B4D68A`): Soft highlight for tags, badges, and dark-mode contrast.
- **Harvest Yellow** (`#E7B54A`): Accent for calls-to-action, ratings, and seasonal highlights.
- **Warm Cream** (`#F4F5E9`): Background surfaces, cards, and warm daylight balance.

### Typography
- **English**: [Manrope](https://fonts.google.com/specimen/Manrope) — clean, modern, legible UI sans-serif.
- **Bengali**: [Hind Siliguri](https://fonts.google.com/specimen/Hind+Siliguri) — elegant, native Bengali script legibility.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) with React 19 & TypeScript
- **Styling**: Tailwind CSS v4 & custom CSS variable tokens
- **UI Components**: shadcn/ui architectural design & Lucide React icons
- **Animations**: Framer Motion
- **Form Management**: React Hook Form with Zod validation
- **Authentication**: Better Auth with MongoDB Adapter and JWT plugin
- **Theme**: Light & Dark mode support via `next-themes`
- **Charts**: Recharts
- **Notifications**: Sonner

---

## 📁 Project Architecture

```
src/
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── favicon.ico
│   ├── globals.css       # Tailwind v4 theme, brand CSS variables & utilities
│   ├── layout.tsx        # Root layout with fonts, theme provider, and toaster
│   └── page.tsx          # Main entry view
├── components/
│   ├── layout/           # Shared layout components (Navbar, Footer, Sidebar)
│   ├── shared/           # Reusable functional widgets (ThemeToggle, Providers)
│   └── ui/               # Primitive UI design elements (Button, Card, Input)
├── features/             # Feature-oriented domain modules (equipment, bookings)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, fonts, auth client, api helpers
│   ├── fonts.ts          # Manrope and Hind Siliguri font configurations
│   └── utils.ts          # Class merging, BDT currency, and date formatters
└── types/                # Domain TypeScript models and interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm
- MongoDB Atlas cluster

### 1. Installation
```bash
git clone <repository-url>
cd jontrohaat
npm install
```

### 2. Environment Setup
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📜 License
This project is developed for academic and educational evaluation.
