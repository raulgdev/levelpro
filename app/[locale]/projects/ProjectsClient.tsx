"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";
import { Locale, TRANSLATIONS, Translation } from "../../translations";
import { NAVY, useLocale, useLogoFloating, Preloader, NavBar, FooterCTA } from "../../components/shared";

type ProjectStatus = "finished" | "inProgress";
type ConstructionType = "hotel" | "residential" | "commercial" | "industrial";

interface ProjectSeed {
  id: number;
  contentIndex: number;
  name: string;
  location: string;
  year: string;
  status: ProjectStatus;
  constructionType: ConstructionType;
  budget?: string;
  images: string[];
  pin: { lat: number; lng: number };
  mapsUrl: string;
}

interface Project extends ProjectSeed {
  shortDesc: string;
  fullDesc: string;
  tags: string[];
}

const projectYearRank = (year: string) => {
  const matches = year.match(/\d{4}/g);
  return matches ? Math.max(...matches.map(Number)) : -1;
};

// Real project data shared with the homepage. Active projects stay first;
// completed projects are ordered from the newest completion year to the oldest.
const PROJECTS_SEED: ProjectSeed[] = [
  { id: 8, contentIndex: 0, name: "Seaway Tower", location: "Calpe", year: "2025", status: "finished", constructionType: "residential", images: ["/images/projects/seaway-tower-calpe.avif"], pin: { lat: 38.6415228, lng: 0.064426 }, mapsUrl: "https://www.google.com/maps/search/?api=1&query=38.6415228%2C0.0644260" },
  { id: 1, contentIndex: 1, name: "Nomad Hotel Cala Finestrat", location: "Finestrat", year: "2025", status: "finished", constructionType: "hotel", images: ["/images/projects/nomad-hotel-cala-finestrat.avif"], pin: { lat: 38.5261921, lng: -0.1635926 }, mapsUrl: "https://maps.app.goo.gl/J3FCKjeoeuHgYPeu7" },
  { id: 2, contentIndex: 2, name: "Alibuilding Benidorm", location: "Benidorm", year: "2025", status: "finished", constructionType: "residential", images: ["/images/projects/alibuilding-benidorm.avif"], pin: { lat: 38.5328296, lng: -0.16296 }, mapsUrl: "https://maps.app.goo.gl/7fbSfX37m8nmgbzx6" },
  { id: 3, contentIndex: 3, name: "Monver Tower Benidorm", location: "Benidorm", year: "2022", status: "finished", constructionType: "residential", images: ["/images/projects/monver-tower-benidorm.avif"], pin: { lat: 38.5358366, lng: -0.1124111 }, mapsUrl: "https://maps.app.goo.gl/hmaXBsbMdroebJg88" },
  { id: 4, contentIndex: 4, name: "Poseidon Playas de Benidorm", location: "Benidorm", year: "2026", status: "inProgress", constructionType: "hotel", images: ["/images/projects/poseidon-playas-benidorm.avif"], pin: { lat: 38.5378413, lng: -0.1469662 }, mapsUrl: "https://maps.app.goo.gl/6WD3wDruLYYnpzCdA" },
  { id: 5, contentIndex: 5, name: "Port Benidorm Hotel", location: "Benidorm", year: "2025", status: "finished", constructionType: "hotel", images: ["/images/projects/port-benidorm-hotel.avif"], pin: { lat: 38.5340091, lng: -0.1065199 }, mapsUrl: "https://maps.app.goo.gl/kXVd6tVsLRSq2wqd7" },
  { id: 6, contentIndex: 6, name: "Hotel Rosamar", location: "Benidorm", year: "2024", status: "finished", constructionType: "hotel", images: ["/images/projects/hotel-rosamar.avif"], pin: { lat: 38.5378884, lng: -0.1106753 }, mapsUrl: "https://maps.app.goo.gl/BAsG6ERmK29fqD7F9" },
  { id: 7, contentIndex: 7, name: "Novotel Valencia Lavant", location: "Valencia", year: "2024", status: "finished", constructionType: "hotel", images: ["/images/projects/novotel-valencia-lavant.avif"], pin: { lat: 39.4798142, lng: -0.3911179 }, mapsUrl: "https://maps.app.goo.gl/Tyyy1P9s6FV6ARsH8" },
  { id: 9, contentIndex: 8, name: "Villa España Hotel", location: "Benidorm", year: "2023", status: "finished", constructionType: "hotel", images: ["/images/projects/villa-espana-hotel.avif"], pin: { lat: 38.5387, lng: -0.1294 }, mapsUrl: "https://www.google.com/maps/search/?api=1&query=Villa%20Espa%C3%B1a%20Hotel%20Benidorm" },
  { id: 10, contentIndex: 9, name: "Edificio La Jirafa", location: "Benidorm", year: "2025", status: "finished", constructionType: "residential", images: ["/images/projects/edificio-la-jirafa.avif"], pin: { lat: 38.5381, lng: -0.1273 }, mapsUrl: "https://www.google.com/maps/search/?api=1&query=Edificio%20La%20Jirafa%20Benidorm" },
];

PROJECTS_SEED.sort((a, b) => {
  const statusOrder = Number(a.status === "finished") - Number(b.status === "finished");
  return statusOrder || projectYearRank(b.year) - projectYearRank(a.year);
});

const CONSTRUCTION_TYPES: ConstructionType[] = ["hotel", "residential", "commercial", "industrial"];

// ─── Eyebrow — small square dot + uppercase label, same pattern as About/Services/Contact ────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.58rem,0.68vw,0.63rem)", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.78rem,0.9vw,0.86rem)", fontWeight: 500, color: NAVY }}>{value}</span>
    </div>
  );
}

// ─── useOverlay — two-phase render/open state (render mounts, open animates),
// with Escape-to-close + body scroll lock. Same technique NavBar's mobile menu
// already uses; shared here between the mobile filter drawer and the project
// modal so the exit transition always gets to play instead of an abrupt unmount ──
function useOverlay() {
  const [render, setRender] = useState(false);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setRender(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setRender(false), 500);
  }, []);

  useEffect(() => {
    if (!render) return;
    const html = document.documentElement, body = document.body;
    const prevHtml = html.style.overflow, prevBody = body.style.overflow;
    html.style.overflow = "hidden"; body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") hide(); };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevHtml; body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [render, hide]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return { render, open, show, hide } as const;
}

// ─── Filter controls ──────────────────────────────────────────────────────────
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="proj-filter-group">
      <p className="proj-filter-title">{title}</p>
      {children}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="proj-filter-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="proj-filter-box" aria-hidden>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span className="proj-filter-label">{label}</span>
    </label>
  );
}

function FilterChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} aria-pressed={checked} className="proj-chip" data-active={checked}>{label}</button>
  );
}

function StatusTabs({ value, onChange, labels }: { value: "all" | ProjectStatus; onChange: (v: "all" | ProjectStatus) => void; labels: { all: string; finished: string; inProgress: string } }) {
  const opts: Array<{ key: "all" | ProjectStatus; label: string }> = [
    { key: "all", label: labels.all },
    { key: "finished", label: labels.finished },
    { key: "inProgress", label: labels.inProgress },
  ];
  return (
    <div className="proj-status-tabs" role="tablist">
      {opts.map(o => (
        <button key={o.key} type="button" role="tab" aria-selected={value === o.key} className="proj-status-tab" data-active={value === o.key} onClick={() => onChange(o.key)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface FilterState {
  locations: string[];
  status: "all" | ProjectStatus;
  types: ConstructionType[];
  years: string[];
}

function FilterPanel({ t, locationOptions, yearOptions, state, onToggleLocation, onStatusChange, onToggleType, onToggleYear, onClearAll, activeCount }: {
  t: Translation;
  locationOptions: string[];
  yearOptions: string[];
  state: FilterState;
  onToggleLocation: (v: string) => void;
  onStatusChange: (v: "all" | ProjectStatus) => void;
  onToggleType: (v: ConstructionType) => void;
  onToggleYear: (v: string) => void;
  onClearAll: () => void;
  activeCount: number;
}) {
  const f = t.projectsPage.filters;
  return (
    <div>
      <FilterGroup title={f.location.label}>
        {locationOptions.map(loc => (
          <FilterCheckbox key={loc} label={loc} checked={state.locations.includes(loc)} onChange={() => onToggleLocation(loc)} />
        ))}
      </FilterGroup>
      <FilterGroup title={f.status.label}>
        <StatusTabs value={state.status} onChange={onStatusChange} labels={{ all: f.status.all, finished: t.projectsPage.statusLabels.finished, inProgress: t.projectsPage.statusLabels.inProgress }} />
      </FilterGroup>
      <FilterGroup title={f.type.label}>
        {CONSTRUCTION_TYPES.map(ty => (
          <FilterCheckbox key={ty} label={t.projectsPage.types[ty]} checked={state.types.includes(ty)} onChange={() => onToggleType(ty)} />
        ))}
      </FilterGroup>
      <FilterGroup title={f.year.label}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {yearOptions.map(y => (
            <FilterChip key={y} label={y} checked={state.years.includes(y)} onChange={() => onToggleYear(y)} />
          ))}
        </div>
      </FilterGroup>
      {activeCount > 0 && (
        <div style={{ paddingTop: "clamp(16px,2.2vh,22px)" }}>
          <button type="button" onClick={onClearAll} className="proj-clearall">{f.clearAll} ({activeCount})</button>
        </div>
      )}
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, t, onSeeMore }: { project: Project; t: Translation; onSeeMore: () => void }) {
  const pp = t.projectsPage;
  return (
    <div className="proj-card">
      <div className="proj-card-media">
        <img src={project.images[0]} alt={project.name} />
        <span className="proj-card-status" data-status={project.status}>{pp.statusLabels[project.status]}</span>
      </div>
      <div className="proj-card-body">
        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: NAVY, flexShrink: 0 }} />
          <h3 className="proj-card-title">{project.name}</h3>
        </div>
        <p className="proj-card-desc">{project.shortDesc}</p>
      </div>
      <div className="proj-card-footer">
        <div className="proj-card-meta">
          <MetaChip label={t.projects.metaKeys.location} value={project.location} />
          <MetaChip label={t.projects.metaKeys.year} value={project.year} />
        </div>
        <button type="button" onClick={onSeeMore} className="proj-card-cta btn-fill">{pp.card.seeMore} <span aria-hidden className="btn-fill-icon">→</span></button>
      </div>
    </div>
  );
}

// ─── Modal map — single static non-interactive pin, same dynamic-import Leaflet
// technique as the homepage's LeafletMap, simplified (no activeIdx sync needed) ──
function ModalMap({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any = null;
    import("leaflet").then(L => {
      if (!alive || !containerRef.current) return;
      map = L.map(containerRef.current, { zoomControl: false, dragging: false, doubleClickZoom: false, scrollWheelZoom: false, touchZoom: false, keyboard: false, attributionControl: true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { attribution: "&copy; <a href='https://carto.com' target='_blank'>CARTO</a>", subdomains: "abcd", maxZoom: 20 }).addTo(map);
      const icon = L.divIcon({ className: "", html: `<div style="width:20px;height:20px;background:${NAVY};border:3px solid #fff;border-radius:50%;box-shadow:0 5px 16px rgba(0,0,0,0.38);"></div>`, iconSize: [20, 20], iconAnchor: [10, 10] });
      L.marker([lat, lng], { icon, interactive: false }).addTo(map);
      map.setView([lat, lng], 14);
    });
    return () => { alive = false; if (map) map.remove(); };
  }, [lat, lng]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── Project detail modal ─────────────────────────────────────────────────────
function ProjectModal({ project, t, open, onClose }: { project: Project; t: Translation; open: boolean; onClose: () => void }) {
  const pp = t.projectsPage;
  return (
    <div role="dialog" aria-modal="true" aria-label={project.name} className="proj-modal-backdrop" data-open={open} onClick={onClose}>
      <div className="proj-modal-panel" data-open={open} onClick={e => e.stopPropagation()}>
        <button type="button" className="proj-modal-close" onClick={onClose} aria-label={pp.modal.close}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <div className="proj-modal-scroll">
          <div className="proj-modal-layout">
            <div className="proj-modal-main">
              <div className="proj-modal-hero">
                <img src={project.images[0]} alt={project.name} />
              </div>
              <div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "clamp(14px,2vh,18px)" }}>
                  <span className="proj-modal-pill" data-status={project.status}>{pp.statusLabels[project.status]}</span>
                  <span className="proj-modal-pill">{pp.types[project.constructionType]}</span>
                </div>
                <h2 className="proj-modal-title">{project.name}</h2>
                <p className="proj-modal-desc">{project.fullDesc}</p>
              </div>
            </div>

            <aside className="proj-modal-sidebar">
              <div>
                <p className="proj-modal-section-label">{pp.modal.scope}</p>
                <ul className="proj-modal-bullets">
                  {project.tags.map(tag => <li key={tag}><span className="proj-modal-dot" />{tag}</li>)}
                </ul>
              </div>
              <div className="proj-modal-meta">
                <MetaChip label={t.projects.metaKeys.location} value={project.location} />
                <MetaChip label={t.projects.metaKeys.year} value={project.year} />
              </div>
              <div className="proj-modal-map-wrap">
                <ModalMap lat={project.pin.lat} lng={project.pin.lng} />
              </div>
              <a href={project.mapsUrl} target="_blank" rel="noopener noreferrer" className="proj-maps-btn-modal btn-fill">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.78 3.5 6.5 3.5 6.5s3.5-3.72 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor" />
                </svg>
                {t.projects.viewOnMaps}
              </a>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsClient({ locale: initialLocale }: { locale: Locale }) {
  const [locale, setLocale] = useLocale(initialLocale);
  const t = TRANSLATIONS[locale];
  const pp = t.projectsPage;
  const logoFloating = useLogoFloating();

  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [isFastLoader, setIsFastLoader] = useState(false);
  const pendingLocaleRef = useRef<Locale | null>(null);

  const handlePreloaderCovered = useCallback(() => {
    if (pendingLocaleRef.current) { setLocale(pendingLocaleRef.current); pendingLocaleRef.current = null; }
  }, [setLocale]);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderVisible(false);
  }, []);

  const handleLocaleChange = useCallback((newLocale: typeof locale) => {
    if (newLocale === locale) return;
    pendingLocaleRef.current = newLocale;
    setIsFastLoader(true);
    setPreloaderVisible(true);
    setPreloaderKey(k => k + 1);
  }, [locale]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    let id: number;
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  const projects: Project[] = useMemo(() => PROJECTS_SEED.map((p) => ({
    ...p,
    shortDesc: t.projects.items[p.contentIndex].shortDesc,
    fullDesc: t.projects.items[p.contentIndex].fullDesc,
    tags: t.projects.items[p.contentIndex].tags,
  })), [t]);

  // Filter state — canonical, locale-invariant values (place names, "hotel"/
  // "residential"/etc., "finished"/"inProgress", raw year strings) so switching
  // EN/DE/ES never silently invalidates an active filter selection.
  const [search, setSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [selectedTypes, setSelectedTypes] = useState<ConstructionType[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const locationOptions = useMemo(() => {
    const fromData = projects.map(p => p.location);
    return Array.from(new Set([...t.hero.locations, ...fromData]));
  }, [projects, t.hero.locations]);

  const yearOptions = useMemo(() => (
    Array.from(new Set(projects.map(p => p.year)))
      .filter(year => projectYearRank(year) > 0)
      .sort((a, b) => projectYearRank(b) - projectYearRank(a))
  ), [projects]);

  const toggleLocation = useCallback((v: string) => {
    setSelectedLocations(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }, []);
  const toggleType = useCallback((v: ConstructionType) => {
    setSelectedTypes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }, []);
  const toggleYear = useCallback((v: string) => {
    setSelectedYears(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  }, []);
  const clearAll = useCallback(() => {
    setSelectedLocations([]); setStatusFilter("all"); setSelectedTypes([]); setSelectedYears([]);
  }, []);

  const activeFilterCount = selectedLocations.length + (statusFilter !== "all" ? 1 : 0) + selectedTypes.length + selectedYears.length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter(p => {
      if (q) {
        const haystack = [p.name, p.location, pp.types[p.constructionType], ...p.tags].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (selectedLocations.length && !selectedLocations.includes(p.location)) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (selectedTypes.length && !selectedTypes.includes(p.constructionType)) return false;
      if (selectedYears.length && !selectedYears.includes(p.year)) return false;
      return true;
    });
  }, [projects, search, selectedLocations, statusFilter, selectedTypes, selectedYears, pp.types]);

  const resultsText = pp.results.template.replace("{n}", String(filtered.length)).replace("{total}", String(projects.length));

  const drawerOverlay = useOverlay();
  const modalOverlay = useOverlay();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const openProject = useCallback((p: Project) => { setSelectedProject(p); modalOverlay.show(); }, [modalOverlay]);

  const filterPanelProps = {
    t,
    locationOptions,
    yearOptions,
    state: { locations: selectedLocations, status: statusFilter, types: selectedTypes, years: selectedYears },
    onToggleLocation: toggleLocation,
    onStatusChange: setStatusFilter,
    onToggleType: toggleType,
    onToggleYear: toggleYear,
    onClearAll: clearAll,
    activeCount: activeFilterCount,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:auto;touch-action:manipulation;}
        html.lenis,html.lenis body{height:auto;}
        .lenis.lenis-smooth{scroll-behavior:auto!important;}
        .lenis.lenis-stopped{overflow:hidden;}
        body{background-color:#ffffff;color:${NAVY};overflow-x:hidden;overscroll-behavior:none;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#ffffff;}
        ::-webkit-scrollbar-thumb{background:rgba(2,10,37,0.15);border-radius:2px;}
        a{text-decoration:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        .shared-nav-active{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
        .shared-lang-active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}

        /* ── Search ── */
        .proj-search{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(2,10,37,0.15);border-radius:var(--radius);padding:clamp(14px,1.6vw,18px) clamp(18px,2vw,22px);transition:border-color 0.2s ease,box-shadow 0.2s ease;}
        .proj-search:focus-within{border-color:${NAVY};box-shadow:0 0 0 3px rgba(2,10,37,0.08);}
        .proj-search-input{flex:1;min-width:0;border:none;outline:none;background:none;font-family:var(--font-inter),sans-serif;font-size:var(--lp-body-fs);font-weight:300;color:${NAVY};}
        .proj-search-input::placeholder{color:rgba(2,10,37,0.35);}
        .proj-search-clear{width:22px;height:22px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:none;background:rgba(2,10,37,0.08);border-radius:50%;color:rgba(2,10,37,0.5);font-size:16px;line-height:1;cursor:pointer;}

        /* ── Layout: sidebar + grid ── */
        .proj-layout{display:grid;grid-template-columns:264px 1fr;gap:clamp(40px,4vw,56px);align-items:start;}
        .proj-sidebar-desktop{display:block;position:sticky;top:clamp(88px,10vh,120px);}
        .proj-mobile-trigger{display:none;align-items:center;gap:8px;font-family:var(--font-inter),sans-serif;font-size:clamp(0.72rem,0.85vw,0.8rem);font-weight:500;color:${NAVY};background:#fff;border:1px solid rgba(2,10,37,0.18);border-radius:var(--radius);padding:11px 18px;cursor:pointer;white-space:nowrap;}
        @media(max-width:1023px){
          .proj-layout{grid-template-columns:1fr!important;}
          .proj-sidebar-desktop{display:none!important;}
          .proj-mobile-trigger{display:inline-flex!important;}
        }

        /* ── Filter groups ── */
        .proj-filter-heading{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.66rem,0.78vw,0.72rem);letter-spacing:0.14em;text-transform:uppercase;color:${NAVY};margin:0 0 clamp(16px,2.2vh,20px) 0;}
        .proj-filter-group{padding:clamp(16px,2.2vh,22px) 0;border-top:1px solid rgba(2,10,37,0.1);}
        .proj-filter-group:first-child{border-top:none;padding-top:0;}
        .proj-filter-title{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.6rem,0.72vw,0.66rem);letter-spacing:0.14em;text-transform:uppercase;color:var(--lp-text-meta);margin:0 0 clamp(12px,1.6vh,16px) 0;}
        .proj-filter-check{position:relative;display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 0;min-height:34px;}
        .proj-filter-check input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer;}
        .proj-filter-box{width:16px;height:16px;border:1.5px solid rgba(2,10,37,0.25);border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background 0.2s ease,border-color 0.2s ease;}
        .proj-filter-box svg{opacity:0;transform:scale(0.6);transition:opacity 0.15s ease,transform 0.15s ease;}
        .proj-filter-check input:checked ~ .proj-filter-box{background:${NAVY};border-color:${NAVY};}
        .proj-filter-check input:checked ~ .proj-filter-box svg{opacity:1;transform:scale(1);}
        .proj-filter-check input:focus-visible ~ .proj-filter-box{outline:2px solid rgba(2,10,37,0.35);outline-offset:2px;}
        .proj-filter-label{font-family:var(--font-inter),sans-serif;font-size:clamp(0.76rem,0.88vw,0.84rem);color:rgba(2,10,37,0.65);}
        .proj-chip{font-family:var(--font-inter),sans-serif;font-size:clamp(0.7rem,0.8vw,0.76rem);font-weight:500;color:rgba(2,10,37,0.6);background:transparent;border:1px solid rgba(2,10,37,0.18);border-radius:var(--radius);padding:7px 14px;min-height:34px;cursor:pointer;transition:background 0.2s ease,color 0.2s ease,border-color 0.2s ease;}
        .proj-chip[data-active="true"]{background:${NAVY};border-color:${NAVY};color:#fff;}
        .proj-status-tabs{display:flex;flex-direction:column;gap:2px;}
        .proj-status-tab{text-align:left;font-family:var(--font-inter),sans-serif;font-size:clamp(0.76rem,0.88vw,0.84rem);font-weight:400;color:rgba(2,10,37,0.55);background:none;border:none;padding:7px 0;min-height:32px;cursor:pointer;transition:color 0.2s ease,font-weight 0.2s ease;}
        .proj-status-tab[data-active="true"]{font-weight:700;color:${NAVY};}
        .proj-clearall{font-family:var(--font-inter),sans-serif;font-size:clamp(0.68rem,0.8vw,0.74rem);font-weight:500;color:rgba(2,10,37,0.5);background:none;border:none;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:3px;}
        .proj-clearall:hover{color:${NAVY};}

        /* ── Grid + card ── */
        .proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:clamp(16px,2vw,22px);}
        .proj-card{background:#fff;border:1px solid rgba(2,10,37,0.1);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:border-color 0.25s ease;}
        .proj-card:hover{border-color:rgba(2,10,37,0.2);}
        .proj-card-media{position:relative;aspect-ratio:3/2;overflow:hidden;background:rgba(2,10,37,0.05);}
        .proj-card-media img{width:100%;height:100%;object-fit:cover;object-position:center 30%;display:block;}
        .proj-card-status{position:absolute;top:14px;left:14px;font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;color:#fff;background:rgba(2,10,37,0.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-radius:var(--radius);padding:5px 11px;}
        .proj-card-status[data-status="inProgress"]{background:rgba(163,100,10,0.8);}
        .proj-card-body{padding:clamp(16px,2vw,20px) clamp(18px,2.2vw,22px) 0;flex:1;}
        .proj-card-title{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:var(--lp-h3-fs);color:${NAVY};margin:0;line-height:1.3;}
        .proj-card-desc{font-family:var(--font-inter),sans-serif;font-size:var(--lp-proj-desc-fs);line-height:var(--lp-card-body-lh);color:var(--lp-text-body);margin:0 0 12px 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
        .proj-card-footer{border-top:1px solid rgba(2,10,37,0.08);padding:clamp(12px,1.5vw,15px) clamp(18px,2.2vw,22px);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
        .proj-card-meta{display:flex;gap:16px;flex-wrap:wrap;}
        .proj-card-cta{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-inter),sans-serif;font-size:clamp(0.66rem,0.76vw,0.72rem);font-weight:600;letter-spacing:0.04em;color:${NAVY};background:none;border:1px solid rgba(2,10,37,0.25);border-radius:var(--radius);padding:8px 14px;cursor:pointer;white-space:nowrap;}

        /* ── Empty state ── */
        .proj-empty{text-align:center;padding:clamp(56px,9vh,96px) 24px;border:1px dashed rgba(2,10,37,0.15);border-radius:var(--radius);}
        .proj-empty-heading{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(1.2rem,2vw,1.6rem);color:${NAVY};margin:0 0 8px 0;}
        .proj-empty-body{font-family:var(--font-inter),sans-serif;font-size:var(--lp-body-fs);line-height:var(--lp-body-lh);color:var(--lp-text-body);margin:0;}

        /* ── Mobile filter drawer — bottom sheet, same two-phase open/close + easing
           the rest of the site uses for overlays (NavBar mobile menu) ── */
        .proj-drawer{position:fixed;inset:0;z-index:500;display:flex;background:rgba(2,10,37,0.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity 0.4s ease;}
        .proj-drawer[data-open="true"]{opacity:1;pointer-events:auto;}
        .proj-drawer-inner{margin-top:auto;width:100%;background:#fff;border-radius:var(--radius) var(--radius) 0 0;padding:clamp(22px,5vw,30px) clamp(22px,5vw,30px) clamp(30px,6vh,42px);max-height:82vh;overflow-y:auto;overscroll-behavior:contain;transform:translateY(100%);transition:transform 0.5s cubic-bezier(0.22,1,0.36,1);box-shadow:0 -20px 60px rgba(2,10,37,0.18);}
        .proj-drawer[data-open="true"] .proj-drawer-inner{transform:translateY(0);}
        .proj-drawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:clamp(14px,2.2vh,20px);}
        .proj-drawer-close{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(2,10,37,0.06);border:none;border-radius:var(--radius);cursor:pointer;color:${NAVY};}

        /* ── Project detail modal — combined opacity+scale+translate+blur using the
           same cubic-bezier(0.22,1,0.36,1) easing as the nav overlay reveal, not a
           plain fade ── */
        .proj-modal-backdrop{position:fixed;inset:0;z-index:9000;background:rgba(2,10,37,0.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:clamp(16px,4vw,48px);opacity:0;transition:opacity 0.4s ease;}
        .proj-modal-backdrop[data-open="true"]{opacity:1;}
        .proj-modal-panel{position:relative;width:min(100%,1000px);background:#fff;border-radius:var(--radius);overflow:hidden;opacity:0;transform:scale(0.94) translateY(28px);filter:blur(8px);transition:opacity 0.45s ease,transform 0.55s cubic-bezier(0.22,1,0.36,1),filter 0.45s ease;}
        .proj-modal-panel[data-open="true"]{opacity:1;transform:scale(1) translateY(0);filter:blur(0);}
        .proj-modal-scroll{max-height:88vh;overflow-y:auto;overscroll-behavior:contain;}
        .proj-modal-close{position:absolute;top:18px;right:18px;z-index:2;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(2,10,37,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;color:${NAVY};transition:background 0.2s ease;}
        .proj-modal-close:hover{background:#fff;}
        .proj-modal-layout{display:grid;grid-template-columns:1fr 300px;gap:clamp(28px,3.5vh,40px) clamp(28px,3vw,40px);padding:clamp(24px,3.2vw,36px);}
        .proj-modal-main{display:flex;flex-direction:column;gap:clamp(20px,2.5vh,26px);min-width:0;}
        .proj-modal-hero{position:relative;width:100%;aspect-ratio:16/9;border-radius:var(--radius);overflow:hidden;background:rgba(2,10,37,0.06);}
        .proj-modal-hero img{width:100%;height:100%;object-fit:cover;display:block;}
        .proj-modal-sidebar{display:flex;flex-direction:column;gap:clamp(20px,2.5vh,26px);border-left:1px solid rgba(2,10,37,0.1);padding-left:clamp(24px,2.5vw,32px);min-width:0;}
        .proj-modal-pill{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.66rem;letter-spacing:0.08em;text-transform:uppercase;color:${NAVY};background:rgba(2,10,37,0.06);border-radius:var(--radius);padding:6px 12px;}
        .proj-modal-pill[data-status="finished"]{background:rgba(30,140,80,0.12);color:rgb(20,110,64);}
        .proj-modal-pill[data-status="inProgress"]{background:rgba(163,100,10,0.14);color:rgb(150,92,8);}
        .proj-modal-title{font-family:var(--font-inter),sans-serif;font-weight:200;font-size:clamp(1.6rem,3vw,2.4rem);color:${NAVY};letter-spacing:-0.025em;margin:0 0 clamp(12px,1.8vh,16px) 0;line-height:1.05;}
        .proj-modal-desc{font-family:var(--font-inter),sans-serif;font-size:var(--lp-body-fs);line-height:var(--lp-body-lh);color:var(--lp-text-body);margin:0;}
        .proj-modal-section-label{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.6rem,0.72vw,0.66rem);letter-spacing:0.14em;text-transform:uppercase;color:var(--lp-text-meta);margin:0 0 clamp(12px,1.6vh,16px) 0;}
        .proj-modal-bullets{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;}
        .proj-modal-bullets li{display:flex;align-items:flex-start;gap:11px;font-family:var(--font-inter),sans-serif;font-size:var(--lp-body-fs);color:var(--lp-text-body);line-height:1.6;}
        .proj-modal-dot{width:5px;height:5px;background:rgba(2,10,37,0.35);flex-shrink:0;margin-top:7px;}
        .proj-modal-meta{display:flex;flex-wrap:wrap;gap:clamp(16px,2vw,24px);}
        .proj-modal-map-wrap{height:240px;border-radius:var(--radius);overflow:hidden;border:1px solid rgba(2,10,37,0.1);isolation:isolate;}
        @media(max-width:760px){
          .proj-modal-layout{grid-template-columns:1fr;}
          .proj-modal-sidebar{border-left:none;padding-left:0;border-top:1px solid rgba(2,10,37,0.1);padding-top:clamp(20px,2.5vh,26px);}
        }
        .proj-maps-btn-modal{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:var(--font-inter),sans-serif;font-size:clamp(0.66rem,0.76vw,0.72rem);font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${NAVY};border:1px solid rgba(2,10,37,0.25);border-radius:var(--radius-sm);padding:11px 16px;text-decoration:none;width:100%;}

        @media(max-width:640px){
          .proj-modal-scroll{max-height:92vh;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} logoFloating={logoFloating} logoFloatingTone="light" logoFloatingDesktopOnly />

      {/* ─── HERO — heading + tagline + the search bar as the functional centerpiece ── */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#ffffff", padding: "clamp(120px,15vh,168px) clamp(24px,5vw,72px) clamp(56px,8vh,84px)" }}>
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: "46%", aspectRatio: "1", background: "radial-gradient(circle, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.03) 45%, transparent 72%)", filter: "blur(10px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "clamp(20px,2.8vh,28px)", animation: "fadeUp 0.7s ease 0.1s both" }}>
            <Eyebrow>{pp.hero.label}</Eyebrow>
          </div>
          <h1 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(2.4rem,5.4vw,5.4rem)", lineHeight: 1.02, color: NAVY, margin: "0 0 clamp(20px,2.8vh,28px) 0", letterSpacing: "-0.03em", maxWidth: "900px", animation: "fadeUp 0.8s ease 0.2s both" }}>
            {pp.hero.headingLine1}<br />
            <span style={{ color: "rgba(2,10,37,0.35)" }}>{pp.hero.headingLine2}</span><br />
            {pp.hero.headingLine3}
          </h1>
          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-subtitle-fs)", lineHeight: 1.5, color: "var(--lp-text-body)", maxWidth: "560px", margin: "0 0 clamp(32px,4.5vh,44px) 0", animation: "fadeUp 0.8s ease 0.3s both" }}>
            {pp.hero.tagline}
          </p>

          <form onSubmit={e => e.preventDefault()} role="search" style={{ maxWidth: "620px", animation: "fadeUp 0.8s ease 0.4s both" }}>
            <div className="proj-search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: "rgba(2,10,37,0.35)" }}>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={pp.search.placeholder} className="proj-search-input" />
              {search && <button type="button" onClick={() => setSearch("")} aria-label={pp.search.clear} className="proj-search-clear">×</button>}
            </div>
          </form>
        </div>
      </section>

      {/* ─── FILTERS + GRID ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(24px,4vh,40px) clamp(24px,5vw,72px) clamp(72px,11vh,128px)", borderTop: "1px solid rgba(2,10,37,0.05)" }}>
        <div className="proj-layout">
          <aside className="proj-sidebar-desktop">
            <p className="proj-filter-heading">{pp.filters.title}</p>
            <FilterPanel {...filterPanelProps} />
          </aside>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "clamp(20px,2.8vh,28px)" }}>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.76rem,0.88vw,0.84rem)", color: "var(--lp-text-meta)", margin: 0 }}>{resultsText}</p>
              <button type="button" className="proj-mobile-trigger" onClick={drawerOverlay.show}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 2h12M3.5 7h7M6 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                {pp.filters.mobileOpen}{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="proj-empty">
                <p className="proj-empty-heading">{pp.results.empty.heading}</p>
                <p className="proj-empty-body">{pp.results.empty.body}</p>
              </div>
            ) : (
              <div className="proj-grid">
                {filtered.map(project => (
                  <ProjectCard key={project.id} project={project} t={t} onSeeMore={() => openProject(project)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <FooterCTA locale={locale} />

      {/* ─── Mobile filter drawer ─────────────────────────────────────────── */}
      {drawerOverlay.render && (
        <div className="proj-drawer" data-open={drawerOverlay.open} role="dialog" aria-modal="true" aria-label={pp.filters.title} onClick={drawerOverlay.hide}>
          <div className="proj-drawer-inner" onClick={e => e.stopPropagation()}>
            <div className="proj-drawer-head">
              <p className="proj-filter-heading" style={{ margin: 0 }}>{pp.filters.title}</p>
              <button type="button" className="proj-drawer-close" onClick={drawerOverlay.hide} aria-label={pp.modal.close}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            </div>
            <FilterPanel {...filterPanelProps} />
          </div>
        </div>
      )}

      {/* ─── Project detail modal ─────────────────────────────────────────── */}
      {modalOverlay.render && selectedProject && createPortal(
        <ProjectModal project={selectedProject} t={t} open={modalOverlay.open} onClose={modalOverlay.hide} />,
        document.body
      )}
    </>
  );
}
