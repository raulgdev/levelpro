# Graph Report - .  (2026-06-23)

## Corpus Check
- Corpus is ~19,908 words - fits in a single context window. You may not need a graph.

## Summary
- 112 nodes · 133 edges · 12 communities (8 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 48,604 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Pages & Shared Components|Pages & Shared Components]]
- [[_COMMUNITY_Homepage Components|Homepage Components]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Package Manifest & Deps|Package Manifest & Deps]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Docs & Next.js Setup|Docs & Next.js Setup]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_UI Glyph Icons|UI Glyph Icons]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Brand Logos|Brand Logos]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `useLocale()` - 9 edges
3. `TRANSLATIONS` - 6 edges
4. `scripts` - 5 edges
5. `Next.js Project (create-next-app)` - 5 edges
6. `Preloader()` - 4 edges
7. `NavBar()` - 4 edges
8. `FooterCTA()` - 4 edges
9. `Locale` - 3 edges
10. `Next.js Agent Rules Directive` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Agent Rules Directive` --conceptually_related_to--> `Next.js Project (create-next-app)`  [INFERRED]
  AGENTS.md → README.md
- `CLAUDE.md Project Instructions` --references--> `Next.js Agent Rules Directive`  [EXTRACTED]
  CLAUDE.md → AGENTS.md
- `File/Document Glyph Icon` --semantically_similar_to--> `Browser Window Glyph Icon`  [INFERRED] [semantically similar]
  public/file.svg → public/window.svg
- `AboutPage()` --calls--> `useLocale()`  [EXTRACTED]
  app/about/page.tsx → app/components/shared.tsx
- `LevelProPage()` --calls--> `useLocale()`  [EXTRACTED]
  app/page.tsx → app/components/shared.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Default Next.js/Vercel Starter Assets** — public_file_icon, public_globe_icon, public_next_wordmark, public_vercel_logo, public_window_icon [INFERRED 0.85]

## Communities (12 total, 4 thin omitted)

### Community 0 - "Pages & Shared Components"
Cohesion: 0.18
Nodes (16): AboutPage(), STATS_DATA, LevelProPage(), Locale, Translation, TRANSLATIONS, FooterCTA(), NAV_ROUTES (+8 more)

### Community 1 - "Homepage Components"
Cohesion: 0.11
Nodes (9): LOCATIONS, MAT_ICONS, NAV_ROUTES, ProjectData, PROJECTS_STATIC, RevealText(), ServiceItem, SERVICES_ICONS (+1 more)

### Community 2 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 3 - "Package Manifest & Deps"
Cohesion: 0.13
Nodes (14): dependencies, leaflet, lenis, next, react, react-dom, name, private (+6 more)

### Community 4 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/leaflet, @types/node, @types/react (+2 more)

### Community 5 - "Docs & Next.js Setup"
Cohesion: 0.29
Nodes (8): Next.js Agent Rules Directive, Next.js Local Docs Guide (node_modules/next/dist/docs), CLAUDE.md Project Instructions, app/page.tsx Entry Page, Development Server (npm run dev), Geist Font via next/font, Next.js Project (create-next-app), Vercel Deployment Platform

### Community 6 - "Root Layout & Fonts"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 7 - "UI Glyph Icons"
Cohesion: 0.67
Nodes (3): File/Document Glyph Icon, Globe/World Icon, Browser Window Glyph Icon

## Knowledge Gaps
- **63 isolated node(s):** `STATS_DATA`, `NAV_ROUTES`, `geistSans`, `geistMono`, `metadata` (+58 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies` to `Package Manifest & Deps`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `useLocale()` connect `Pages & Shared Components` to `Homepage Components`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `STATS_DATA`, `NAV_ROUTES`, `geistSans` to the rest of the system?**
  _63 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Homepage Components` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Package Manifest & Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._