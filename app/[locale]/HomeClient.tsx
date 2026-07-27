"use client";

import { useRef, useEffect, useState, useCallback, useSyncExternalStore, Fragment } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { Locale, TRANSLATIONS } from "../translations";
import { useLocale, NavBar, Preloader, StatNum, navHref, NAV_PATHS } from "../components/shared";

const NAVY = "#020A25";
// Dark-mode background for the homepage's desktop Projects/map section only —
// deliberately gray, not NAVY: kept strictly black/gray/white (no blue cast),
// dark gray as the dominant tone, per explicit request. Its mobile counterpart
// (no map there) keeps its own separate light literal, untouched.
const SECTION_BG = "#1a1a1a";
// One <video> per location, in the same order as t.hero.locations
// (Benidorm / Palma de Mallorca / Ibiza).
const LOCATION_VIDEOS = [
  "https://media.levelpro.es/Video%20uri%20hero/Export/benidorm.mp4",
  "https://media.levelpro.es/Video%20uri%20hero/Export/palma%20de%20mallorca.mp4",
  "https://media.levelpro.es/Video%20uri%20hero/Export/ibiza.mp4",
];

const DEADZONE = 0.03;
// Each location's hero video plays for this long (ms) before auto-advancing.
const LOC_DURATION = 10000;

const SERVICE_IMAGES_DESKTOP = [
  "/images/services/concrete-pumping-desktop.avif",
  "/images/services/self-levelling-mortars-desktop.avif",
  "/images/services/power-floated-concrete-desktop.avif",
  "/images/services/shotcrete-desktop.avif",
  "/images/services/slope-forming-desktop.avif",
] as const;

const SERVICE_IMAGES_MOBILE = [
  "/images/services/concrete-pumping-mobile.avif",
  "/images/services/self-levelling-mortars-mobile.avif",
  "/images/services/power-floated-concrete-mobile.avif",
  "/images/services/shotcrete-mobile.avif",
  "/images/services/slope-forming-mobile.avif",
] as const;

const SERVICE_ANCHORS = [
  "concrete-pumping",
  "self-levelling-mortars",
  "power-floated-concrete",
  "shotcrete",
  "slope-forming",
] as const;

const projectYearRank = (year: string) => {
  const matches = year.match(/\d{4}/g);
  return matches ? Math.max(...matches.map(Number)) : -1;
};

const PROJECTS_STATIC = [
  { id: 8, contentIndex: 0, status: "finished", name: "Seaway Tower", location: "Calpe", year: "2025", img: "/images/projects/seaway-tower-calpe.avif", pin: { lat: 38.6415228, lng: 0.064426 }, mapsUrl: "https://www.google.com/maps/search/?api=1&query=38.6415228%2C0.0644260" },
  { id: 1, contentIndex: 1, status: "finished", name: "Nomad Hotel Cala Finestrat", location: "Finestrat", year: "2025", img: "/images/projects/nomad-hotel-cala-finestrat.avif", pin: { lat: 38.5261921, lng: -0.1635926 }, mapsUrl: "https://maps.app.goo.gl/J3FCKjeoeuHgYPeu7" },
  { id: 2, contentIndex: 2, status: "finished", name: "Alibuilding Benidorm", location: "Benidorm", year: "2025", img: "/images/projects/alibuilding-benidorm.avif", pin: { lat: 38.5328296, lng: -0.16296 }, mapsUrl: "https://maps.app.goo.gl/7fbSfX37m8nmgbzx6" },
  { id: 3, contentIndex: 3, status: "finished", name: "Monver Tower Benidorm", location: "Benidorm", year: "2022", img: "/images/projects/monver-tower-benidorm.avif", pin: { lat: 38.5358366, lng: -0.1124111 }, mapsUrl: "https://maps.app.goo.gl/hmaXBsbMdroebJg88" },
  { id: 4, contentIndex: 4, status: "inProgress", name: "Poseidon Playas de Benidorm", location: "Benidorm", year: "2026", img: "/images/projects/poseidon-playas-benidorm.avif", pin: { lat: 38.5378413, lng: -0.1469662 }, mapsUrl: "https://maps.app.goo.gl/6WD3wDruLYYnpzCdA" },
  { id: 5, contentIndex: 5, status: "finished", name: "Port Benidorm Hotel", location: "Benidorm", year: "2025", img: "/images/projects/port-benidorm-hotel.avif", pin: { lat: 38.5340091, lng: -0.1065199 }, mapsUrl: "https://maps.app.goo.gl/kXVd6tVsLRSq2wqd7" },
  { id: 6, contentIndex: 6, status: "finished", name: "Hotel Rosamar", location: "Benidorm", year: "2024", img: "/images/projects/hotel-rosamar.avif", pin: { lat: 38.5378884, lng: -0.1106753 }, mapsUrl: "https://maps.app.goo.gl/BAsG6ERmK29fqD7F9" },
  { id: 7, contentIndex: 7, status: "finished", name: "Novotel Valencia Lavant", location: "Valencia", year: "2024", img: "/images/projects/novotel-valencia-lavant.avif", pin: { lat: 39.4798142, lng: -0.3911179 }, mapsUrl: "https://maps.app.goo.gl/Tyyy1P9s6FV6ARsH8" },
  { id: 9, contentIndex: 8, status: "finished", name: "Villa España Hotel", location: "Benidorm", year: "2023", img: "/images/projects/villa-espana-hotel.avif", pin: { lat: 38.5387, lng: -0.1294 }, mapsUrl: "https://www.google.com/maps/search/?api=1&query=Villa%20Espa%C3%B1a%20Hotel%20Benidorm" },
  { id: 10, contentIndex: 9, status: "finished", name: "Edificio La Jirafa", location: "Benidorm", year: "2025", img: "/images/projects/edificio-la-jirafa.avif", pin: { lat: 38.5381, lng: -0.1273 }, mapsUrl: "https://www.google.com/maps/search/?api=1&query=Edificio%20La%20Jirafa%20Benidorm" },
].sort((a, b) => {
  // Seaway Tower is intentionally featured first on the homepage.
  if (a.id === 8) return -1;
  if (b.id === 8) return 1;
  const statusOrder = Number(a.status === "finished") - Number(b.status === "finished");
  return statusOrder || projectYearRank(b.year) - projectYearRank(a.year);
});

const SERVICES_ICONS = [
  <svg key="pump" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="12" width="16" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 15h6l2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="14" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 12V8a2 2 0 012-2h4a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  <svg key="mortar" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M8 5l3 3.5L14 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 4v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 22h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="7" y="16.5" width="14" height="3.5" rx="1.2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="14" cy="18.25" r="1" fill="currentColor"/>
  </svg>,
  <svg key="trowel" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="15" width="15" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 15V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9.5 9.5h5a2 2 0 002-2v0a2 2 0 00-2-2h-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>,
  <svg key="shot" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 14c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 14l4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
    <path d="M14 14l-3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 14l1.5 -3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  <svg key="slope" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M3 22h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 22V12L21 22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 19.5l10-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="14" r="1.4" fill="currentColor"/>
  </svg>,
];

const TAILORED_SERVICE_ICON = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M3.5 10V5.5a2 2 0 0 1 2-2H10M18 3.5h4.5a2 2 0 0 1 2 2V10M24.5 18v4.5a2 2 0 0 1-2 2H18M10 24.5H5.5a2 2 0 0 1-2-2V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 8.5v11M8.5 14h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const MAT_ICONS = [
  <svg key="m1" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="1" y="9" width="12" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M13 11.5h6l1.5-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="4.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="10.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.4"/>
  </svg>,
  <svg key="m2" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 17l4-10h8l4 10" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M7 12h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="11" cy="17" r="1.5" fill="currentColor"/>
  </svg>,
];

// ─── Word-reveal ──────────────────────────────────────────────────────────────
function useWordReveal() {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold:0 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, triggered] as const;
}

function RevealText({ text, delayOffset=0, style, as: Tag="p" }: { text:string; delayOffset?:number; style?:React.CSSProperties; as?:"p"|"span"|"h2"|"h1" }) {
  const [ref, triggered] = useWordReveal();
  const words = text.split(/\s+/);
  return (
    <Tag ref={ref as unknown as React.RefObject<HTMLParagraphElement>} style={style}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            style={{ display:"inline-block", opacity:0, animation: triggered ? `fadeBlurReveal 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${(delayOffset+i)*0.05}s both` : "none" }}
            onAnimationEnd={(e) => {
              const el = e.currentTarget;
              el.style.animation = "none";
              el.style.opacity = "1";
              el.style.filter = "none";
              el.style.transform = "none";
            }}
          >
            {word}
          </span>
          {i < words.length-1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

// ─── Meta chip ────────────────────────────────────────────────────────────────
// dark: used on the homepage's desktop Projects/map panel + cards (dark glass
// over the dark map); omitted everywhere else (light cards on a light section).
function MetaChip({ label, value, dark }: { label: string; value: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.6rem,0.72vw,0.66rem)", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.5)" : "var(--lp-text-meta)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.8rem,0.92vw,0.88rem)", fontWeight: 500, color: dark ? "#ffffff" : NAVY }}>{value}</span>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
// Frosted-glass treatment mirrors the map sidebar: translucent blurred fill,
// accent dot on the title, pill tags/badges, and the same "View on Maps"
// pill button used in the sidebar.
// dark: the homepage's desktop version (over the dark map) passes this; the
// mobile slider below (light section, no map) doesn't, and keeps the
// original light-glass look untouched.
function ProjectCard({ proj, metaKeys, index, viewOnMapsLabel, dark }: { proj: ProjectData; metaKeys: { year: string; type: string; budget: string; location: string }; index: number; viewOnMapsLabel: string; dark?: boolean }) {
  return (
    <div style={{
      background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.82)",
      backdropFilter: dark ? "blur(24px) saturate(160%)" : "blur(20px) saturate(140%)",
      WebkitBackdropFilter: dark ? "blur(24px) saturate(160%)" : "blur(20px) saturate(140%)",
      borderRadius: "var(--radius)", overflow: "hidden",
      border: dark ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.7)",
      boxShadow: "none",
    }}>
      {/* Thumbnail — wide / landscape aspect ratio */}
      <div style={{ position: "relative", aspectRatio: "3 / 2", overflow: "hidden" }}>
        <img
          src={proj.img}
          alt={proj.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
      </div>
      {/* Title — accent dot + heading, matching the Services card's Inter treatment */}
      <div style={{ padding: "clamp(14px,1.8vw,18px) clamp(18px,2.2vw,24px) clamp(4px,0.6vw,6px)", display: "flex", alignItems: "center", gap: "9px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: dark ? "#ffffff" : NAVY, flexShrink: 0 }} />
        <h3 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "var(--lp-h3-fs)", lineHeight: 1.3, color: dark ? "#ffffff" : NAVY, margin: 0 }}>{proj.name}</h3>
      </div>
      {/* Description — clamped to 2 lines for a condensed teaser */}
      <div style={{ padding: "0 clamp(18px,2.2vw,24px) clamp(10px,1.3vw,14px)" }}>
        <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-proj-desc-fs)", lineHeight: "var(--lp-card-body-lh)", color: dark ? "rgba(255,255,255,0.65)" : "var(--lp-text-body)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{proj.fullDesc}</p>
      </div>
      {/* Metadata + Maps CTA footer */}
      <div style={{ borderTop: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(2,10,37,0.08)", padding: "clamp(12px,1.5vw,15px) clamp(18px,2.2vw,24px)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "clamp(14px,1.8vw,20px)", flexWrap: "wrap" }}>
          <MetaChip label={metaKeys.type} value={proj.type} dark={dark} />
          <MetaChip label={metaKeys.location} value={proj.location} dark={dark} />
          <MetaChip label={metaKeys.year} value={proj.year} dark={dark} />
        </div>
        <a
          href={proj.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={dark ? "proj-maps-btn btn-fill btn-fill-light" : "proj-maps-btn btn-fill"}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.58rem,0.68vw,0.63rem)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: dark ? "#ffffff" : NAVY, border: dark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(2,10,37,0.25)", borderRadius: "var(--radius-sm)", padding: "8px 14px", textDecoration: "none", flexShrink: 0 }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.78 3.5 6.5 3.5 6.5s3.5-3.72 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor"/>
          </svg>
          {viewOnMapsLabel}
        </a>
      </div>
    </div>
  );
}


// NavBar + LangSwitcher now live in ./components/shared (single source of truth,
// with the responsive hamburger menu). Imported above.

// ─── Service slide card ───────────────────────────────────────────────────────
interface ServiceItem {
  name:string;
  detail:string;
  shortDesc:string;
  bullets:string[];
  icon:React.ReactNode;
  image?:string;
  mobileImage?:string;
  detailsHref?:string;
  moreLabel?:string;
}
function SvcSlideCard({ svc, isActive, onHover, onClick }: { svc:ServiceItem; isActive:boolean; onHover:()=>void; onClick:()=>void }) {
  return (
    <div
      onMouseEnter={onHover}
      onClick={onClick}
      style={{
        flex: isActive ? "2.5 1 0" : "1 1 0",
        minWidth: 0,
        borderRadius: "var(--radius)",
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "clamp(300px,37vh,340px)",
        background: isActive ? "#ffffff" : NAVY,
        border: isActive ? "1px solid rgba(2,10,37,0.12)" : "1px solid transparent",
        boxShadow: "none",
        transition: "flex 0.45s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, background 0.35s ease",
      }}
    >
      <div style={{ flex:1, minHeight:0, position:"relative", display:"flex", flexDirection:"column" }}>

        {/* Inactive layer */}
        <div style={{
          position: "absolute",
          inset: 0,
          padding: "clamp(22px,2.8vw,30px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: isActive ? 0 : 1,
          transition: "opacity 0.2s ease",
          pointerEvents: isActive ? "none" : "auto",
        }}>
          <div style={{ color:"rgba(255,255,255,0.38)" }}>{svc.icon}</div>
          {/* Fixed width, same "curtain" logic as the active layer above: this
              card's own outer width animates (flex 2.5<->1) whenever ANY card
              in the strip becomes active/inactive, so text sized at width:100%
              here would visibly reflow/rewrap in real time during that 0.45s
              transition. Sizing it to the resting (inactive-share) width
              instead means it never reflows. overflowWrap+hyphens guard
              against long unbroken words (e.g. "autonivelantes") clipping
              instead of wrapping. */}
          <div style={{ width:"clamp(64px,9vw,160px)", flexShrink:0, alignSelf:"flex-start" }}>
            <p style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:300, fontSize:"var(--lp-h3-fs)", color:"rgba(255,255,255,0.92)", margin:"0 0 6px 0", lineHeight:1.2, overflowWrap:"break-word", WebkitHyphens:"auto", hyphens:"auto" }}>{svc.name}</p>
            <p style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:400, fontSize:"clamp(0.75rem,0.86vw,0.82rem)", color:"rgba(255,255,255,0.58)", margin:0, lineHeight:1.55, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflowWrap:"break-word" }}>{svc.shortDesc}</p>
          </div>
        </div>

        {/* Active layer — original split layout: copy on the left and the
            portrait desktop image on the right. */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          padding: "clamp(10px,1vw,14px)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "clamp(10px,1vw,14px)",
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateX(0)" : "translateX(10px)",
          filter: isActive ? "blur(0px)" : "blur(8px)",
          transition: isActive
            ? "opacity 0.36s cubic-bezier(0.16,1,0.3,1) 0.04s, transform 0.42s cubic-bezier(0.16,1,0.3,1) 0.04s, filter 0.36s cubic-bezier(0.16,1,0.3,1) 0.04s"
            : "opacity 0.14s ease, transform 0.14s ease, filter 0.14s ease",
          pointerEvents: isActive ? "auto" : "none",
        }}>
          <div className="svc-active-copy" style={{ minWidth:0, padding:"clamp(10px,1.15vw,16px)", display:"flex", flexDirection:"column" }}>
            <div style={{ minWidth:0, marginTop:"auto", marginBottom:"auto", flexShrink:0 }}>
              <h3 style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:500, fontSize:"var(--lp-h3-fs)", color:NAVY, margin:"0 0 clamp(5px,0.7vh,7px) 0", lineHeight:1.3, overflowWrap:"break-word", WebkitHyphens:"auto", hyphens:"auto" }}>
                {svc.name}
              </h3>
              <p className="svc-active-desc">{svc.detail}</p>
            </div>
            {svc.detailsHref && svc.moreLabel && (
              <Link
                href={svc.detailsHref}
                className="svc-more-link"
                onClick={(event) => event.stopPropagation()}
              >
                {svc.moreLabel} <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>

          <div className="svc-active-media" style={{
            height: "100%",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            background: "rgba(2,10,37,0.06)",
          }}>
            <img
              src={svc.image ?? svc.mobileImage}
              alt={svc.name}
              loading="lazy"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Service card — mobile/tablet (mirrors the desktop expanded card; photo, no video) ──
// Cards have no hover state on touch, so the desktop strip's crossfade is
// replaced with a one-time reveal as each card scrolls into view.
function useRevealOnView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

function SvcMobileCard({ svc }: { svc:ServiceItem }) {
  const [ref, visible] = useRevealOnView<HTMLDivElement>();
  return (
    <div ref={ref} className={`svc-m-card${visible ? " is-visible" : ""}`}>
      <div className="svc-m-media">
        <img src={svc.mobileImage ?? svc.image} alt={svc.name} loading="lazy" />
      </div>
      <div className="svc-m-body">
        <h3 className="svc-m-name">{svc.name}</h3>
        <p className="svc-m-desc">{svc.detail}</p>
        {svc.detailsHref && svc.moreLabel && (
          <Link href={svc.detailsHref} className="svc-more-link">
            {svc.moreLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Leaflet map ──────────────────────────────────────────────────────────────
// Pin markup is created ONCE per marker and never swapped via setIcon() again —
// setIcon() replaces the whole DOM node, which is why the old version's
// "transition" on the icon HTML never actually animated (a freshly-mounted
// element has no previous state to transition from). Instead each active/
// inactive change toggles a class on the SAME persistent node via
// marker.getElement(), so the CSS transition genuinely runs. The dot sits
// centered inside a fixed 20x20 anchor box so it can grow/shrink without any
// of Leaflet's iconAnchor math changing mid-transition (which would otherwise
// make the pin visibly drift off its true coordinate while resizing).
const mapPinHtml = (active: boolean) => `<div class="lp-map-pin-wrap"><div class="lp-map-pin${active ? " is-active" : ""}"></div></div>`;

function LeafletMap({ activeIdx }: { activeIdx:number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentRegionRef = useRef<"costa-blanca"|"valencia">(
    PROJECTS_STATIC[activeIdx].location === "Valencia" ? "valencia" : "costa-blanca"
  );
  const latestActiveIdxRef = useRef(activeIdx);
  const initializedRef = useRef(false);
  latestActiveIdxRef.current = activeIdx;

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true; let alive=true;
    let removeResizeListener: (() => void) | undefined;
    let removeInitialTileListener: (() => void) | undefined;
    let initialRevealTimer: ReturnType<typeof setTimeout> | undefined;
    import("leaflet").then(L => {
      if (!alive || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl:false, dragging:false, doubleClickZoom:false,
        scrollWheelZoom:false, touchZoom:false, keyboard:false,
        attributionControl:true, zoomSnap:1, zoomDelta:1,
        fadeAnimation:true, zoomAnimation:false,
      });
      const tileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:"&copy; <a href='https://carto.com' target='_blank'>CARTO</a>",
        subdomains:"abcd", maxZoom:20, keepBuffer:6,
      }).addTo(map);
      const initialIdx = latestActiveIdxRef.current;
      markersRef.current = PROJECTS_STATIC.map((proj,i) => {
        const isActive = i===initialIdx;
        const icon = L.divIcon({ className:"", html:mapPinHtml(isActive), iconSize:[20,20], iconAnchor:[10,10] });
        return L.marker([proj.pin.lat,proj.pin.lng], {
          icon, interactive:false, zIndexOffset:isActive ? 1000 : 0,
        }).addTo(map);
      });
      mapRef.current = map;

      const costaBlancaBounds = L.latLngBounds(
        PROJECTS_STATIC.filter(p => p.location !== "Valencia").map(p => [p.pin.lat, p.pin.lng] as [number, number])
      );
      const valenciaProject = PROJECTS_STATIC.find(p => p.location === "Valencia")!;
      currentRegionRef.current = PROJECTS_STATIC[initialIdx].location === "Valencia" ? "valencia" : "costa-blanca";

      // Every regional switch remounts this component (see the key at the
      // render site below). Keep the fresh map covered until its own first
      // tile set has loaded, then reveal it smoothly.
      const revealInitialMap = () => {
        if (!alive) return;
        if (initialRevealTimer) clearTimeout(initialRevealTimer);
        veilRef.current?.classList.remove("is-covering");
      };
      tileLayer.once("load",revealInitialMap);
      removeInitialTileListener = () => tileLayer.off("load",revealInitialMap);
      initialRevealTimer = setTimeout(revealInitialMap,1600);

      const settle = () => {
        if (!alive || !containerRef.current) return;
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        if (width === 0 || height === 0) {
          requestAnimationFrame(settle);
          return;
        }

        map.invalidateSize({ animate:false });
        if (currentRegionRef.current === "valencia") {
          map.setView([valenciaProject.pin.lat, valenciaProject.pin.lng], 13, { animate:false });
        } else {
          const rightRail = Math.min(720, Math.max(360, width * 0.43));
          map.fitBounds(costaBlancaBounds, {
            paddingTopLeft:[Math.max(56, width * 0.04), Math.max(72, height * 0.08)],
            paddingBottomRight:[rightRail, Math.max(300, height * 0.4)],
            animate:false,
          });
          map.setZoom(Math.max(0, map.getZoom() - 1), { animate:false });
        }
      };
      settle();

      window.addEventListener("resize", settle);
      removeResizeListener = () => window.removeEventListener("resize", settle);
    });
    return ()=>{
      alive=false;
      removeResizeListener?.();
      removeInitialTileListener?.();
      if (initialRevealTimer) clearTimeout(initialRevealTimer);
      mapRef.current?.remove();
      mapRef.current=null;
      markersRef.current=[];
      initializedRef.current=false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    markersRef.current.forEach((marker,i) => {
      const isActive = i===activeIdx;
      marker.getElement()?.querySelector(".lp-map-pin")?.classList.toggle("is-active", isActive);
      marker.setZIndexOffset(isActive ? 1000 : 0);
    });
  },[activeIdx]);

  return (
    <div className="lp-map-stack">
      <div ref={containerRef} className="lp-map-dark lp-map-region" aria-hidden="true" />
      <div ref={veilRef} className="lp-map-transition-veil is-covering" aria-hidden="true" />
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectData { id:number; name:string; type:string; location:string; year:string; budget?:string; shortDesc:string; fullDesc:string; tags:string[]; img:string; pin:{lat:number;lng:number}; mapsUrl:string; }

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomeClient({ locale: initialLocale }: { locale: Locale }) {
  const aboutRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis|null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroLocTabsRef = useRef<HTMLDivElement>(null);
  const heroVideoWrapRef = useRef<HTMLDivElement>(null);
  const heroVideoScrimRef = useRef<HTMLDivElement>(null);
  const heroLeftRef = useRef<HTMLDivElement>(null);
  // Location rotation — refs drive per-frame progress writes without React re-renders
  const activeLocationRef = useRef(0);
  const locVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const locTrackRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const locFillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const locAccRef = useRef(0);
  const locLastTsRef = useRef<number | null>(null);
  const locHoverRef = useRef(false);
  const locErrorAttemptsRef = useRef<Record<number, number>>({});

  const [locale, setLocale] = useLocale(initialLocale);
  const t = TRANSLATIONS[locale];
  const locationNames = t.hero.locations;
  const locationCount = locationNames.length;

  // Preloader state — supports retrigger on locale change
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [isFastLoader, setIsFastLoader] = useState(false);
  const pendingLocaleRef = useRef<Locale|null>(null);

  const handlePreloaderCovered = useCallback(() => {
    if (pendingLocaleRef.current) {
      setLocale(pendingLocaleRef.current);
      pendingLocaleRef.current = null;
    }
  }, [setLocale]);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderVisible(false);
  }, []);

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    pendingLocaleRef.current = newLocale;
    setIsFastLoader(true);
    setPreloaderVisible(true);
    setPreloaderKey(k => k + 1);
  }, [locale]);

  const projects: ProjectData[] = PROJECTS_STATIC.map((p) => ({
    ...p,
    type: t.projects.items[p.contentIndex].type,
    shortDesc: t.projects.items[p.contentIndex].shortDesc,
    fullDesc: t.projects.items[p.contentIndex].fullDesc,
    tags: t.projects.items[p.contentIndex].tags,
  }));

  const services: ServiceItem[] = SERVICES_ICONS.map((icon,i) => ({
    icon,
    name: t.services.items[i].name,
    // Homepage cards use the concise, self-contained summary. The complete
    // technical copy remains available after following the service link.
    detail: t.services.items[i].detail,
    shortDesc: t.services.items[i].shortDesc,
    bullets: t.services.items[i].bullets,
    image: SERVICE_IMAGES_DESKTOP[i],
    mobileImage: SERVICE_IMAGES_MOBILE[i],
    detailsHref: `${navHref(locale, "services")}#${SERVICE_ANCHORS[i]}`,
    moreLabel: t.services.learnMore,
  }));

  const [logoFloating, setLogoFloating] = useState(true);
  const [activeProject, setActiveProject] = useState(0);
  const [displayProject, setDisplayProject] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeSvc, setActiveSvc] = useState(0);
  const [activeLocation, setActiveLocation] = useState(0);
  const [videoPlaybackBlocked, setVideoPlaybackBlocked] = useState(false);

  // Only mount the Leaflet map on desktop — the mobile Projects section has no map,
  // and keeping it off mobile avoids loading Leaflet there and prevents flyTo() from
  // throwing on the hidden (0×0) container. useSyncExternalStore keeps it SSR-safe
  // (server snapshot = false) without a cascading setState-in-effect.
  const isDesktop = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 769px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 769px)").matches,
    () => false,
  );

  // Reduced-motion preference — gates the heavy rAF progress animation. SSR-safe
  // (server snapshot = false) like isDesktop above.
  const prefersReducedMotion = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // Switch the active location and reset its progress. Playback starts in the
  // effect below, after React has made that video visible; Safari can reject a
  // play() call made while the element is still opacity:0.
  const goToLocation = useCallback((i: number) => {
    activeLocationRef.current = i;
    locAccRef.current = 0;
    locLastTsRef.current = null;
    setActiveLocation(i);
  }, []);

  const playActiveLocationVideo = useCallback(async () => {
    const video = locVideoRefs.current[activeLocationRef.current];
    if (!video) return;

    // Set both DOM properties and attributes before play(). This is deliberate:
    // older WebKit versions inspect the initial muted/inline state very early.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    try {
      await video.play();
      setVideoPlaybackBlocked(false);
      locErrorAttemptsRef.current[activeLocationRef.current] = 0;
    } catch {
      // Safari allows users to block even muted autoplay. In that case the
      // visible fallback control below provides the required user gesture.
      setVideoPlaybackBlocked(true);
    }
  }, []);

  // The CDN transcodes each clip on the fly on a cache miss (observed: this can
  // occasionally 504 under cold-cache conditions), which fires a load error
  // instead of `canplay`. Without handling it, the affected video never starts
  // playing — and since the rotation timer below only accrues while a video is
  // actually confirmed playing, that permanently freezes the hero on a blank
  // frame instead of advancing to a location whose clip does load. Retry a
  // couple of times first (the failure is usually transient), then give up on
  // this clip for now and move on rather than stall forever.
  const handleVideoError = useCallback((index: number) => {
    if (index !== activeLocationRef.current) return;
    const video = locVideoRefs.current[index];
    if (!video) return;
    const attempts = (locErrorAttemptsRef.current[index] ?? 0) + 1;
    locErrorAttemptsRef.current[index] = attempts;

    if (attempts <= 2) {
      setTimeout(() => {
        if (activeLocationRef.current !== index) return;
        video.addEventListener("canplay", () => { void playActiveLocationVideo(); }, { once: true });
        video.load();
      }, 1500);
    } else {
      locErrorAttemptsRef.current[index] = 0;
      goToLocation((index + 1) % locationCount);
    }
  }, [goToLocation, locationCount, playActiveLocationVideo]);

  // Only the visible location video is allowed to play. Running all three
  // autoplay elements at once works in Chromium but is unreliable in Safari,
  // whose media policy is applied per element and pauses hidden video.
  useEffect(() => {
    const activeVideo = locVideoRefs.current[activeLocation];
    if (!activeVideo) return;

    let cancelled = false;
    setVideoPlaybackBlocked(false);
    locVideoRefs.current.forEach((video, index) => {
      if (video && index !== activeLocation) video.pause();
    });

    const startWhenVisible = () => {
      if (!cancelled) void playActiveLocationVideo();
    };

    if (activeVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startWhenVisible();
    } else {
      activeVideo.addEventListener("canplay", startWhenVisible, { once: true });
      activeVideo.load();
    }

    return () => {
      cancelled = true;
      activeVideo.removeEventListener("canplay", startWhenVisible);
    };
  }, [activeLocation, playActiveLocationVideo]);

  // Safari pauses background media for power saving. Resume the active video
  // when the tab becomes visible again instead of leaving a frozen hero.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void playActiveLocationVideo();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [playActiveLocationVideo]);

  // Full-motion: rAF loop ties the bar fill + track-opacity ramp to *real* video
  // playback — time only accrues while the active video is actually playing (not
  // paused, ended, buffering, or hover-paused), so the bar matches what's on screen.
  useEffect(() => {
    if (prefersReducedMotion) return;
    let raf = 0;
    const frame = (ts: number) => {
      if (locLastTsRef.current === null) locLastTsRef.current = ts;
      const dt = ts - locLastTsRef.current;
      locLastTsRef.current = ts;
      const active = activeLocationRef.current;
      const v = locVideoRefs.current[active];
      const playing = !!v && !v.paused && !v.ended && v.readyState >= 3 && !locHoverRef.current;
      if (playing) locAccRef.current += dt;
      const p = Math.min(locAccRef.current / LOC_DURATION, 1);
      for (let i = 0; i < locationCount; i++) {
        const fill = locFillRefs.current[i];
        const track = locTrackRefs.current[i];
        if (i === active) {
          if (fill) fill.style.width = (p * 100).toFixed(2) + "%";
          if (track) track.style.opacity = (0.16 + p * 0.54).toFixed(3);
        } else {
          if (fill) fill.style.width = "0%";
          if (track) track.style.opacity = "0.16";
        }
      }
      if (p >= 1) goToLocation((active + 1) % locationCount);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion, goToLocation, locationCount]);

  // Reduced-motion: no progressive animation — just advance on a plain timer.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    const id = setInterval(() => goToLocation((activeLocationRef.current + 1) % locationCount), LOC_DURATION);
    return () => clearInterval(id);
  }, [prefersReducedMotion, goToLocation, locationCount]);

  const computeAnim = useCallback(() => {
    const about = aboutRef.current;
    if (!about) return;
    const rect = about.getBoundingClientRect();
    const vhNow = window.innerHeight;
    const rawProgress = Math.max(0, Math.min(1, (vhNow - rect.top) / vhNow));

    // Logo re-enters the navbar only once the navy sub-hero band (this same
    // `about` element) has fully scrolled past — reusing this rect avoids a
    // second layout read on top of the exit-parallax math below.
    const logoShouldFloat = rect.bottom > 0;
    setLogoFloating(f => (f === logoShouldFloat ? f : logoShouldFloat));

    let overlayOpacity = 0, videoBrightness = 1, exitOpacity = 1, contentTranslate = 0;
    if (window.scrollY > 0) {
      const ap = rawProgress <= DEADZONE ? 0 : (rawProgress - DEADZONE) / (1 - DEADZONE);
      overlayOpacity = Math.min(1, ap * 2.2);
      videoBrightness = Math.max(0.1, 1 - ap * 1.8);
      exitOpacity = Math.max(0, 1 - ap * 2.8);
      contentTranslate = ap * -420;
    }

    if (heroOverlayRef.current) heroOverlayRef.current.style.opacity = String(overlayOpacity);
    // Dimming is a plain opacity scrim over the video, not a `filter` on its
    // ancestor — see the scrim div's own comment for why.
    if (heroVideoScrimRef.current) heroVideoScrimRef.current.style.opacity = videoBrightness < 1 ? (1 - videoBrightness).toFixed(3) : "0";
    if (heroLocTabsRef.current) {
      heroLocTabsRef.current.style.opacity = String(exitOpacity);
      heroLocTabsRef.current.style.transform = contentTranslate ? `translateY(${(contentTranslate * 0.4).toFixed(1)}px)` : "";
    }
    const cardTranslate = contentTranslate ? `translateY(${contentTranslate.toFixed(1)}px)` : "";
    if (heroLeftRef.current) heroLeftRef.current.style.transform = cardTranslate;
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    lenisRef.current = lenis;
    let id: number;
    const raf = (time: number) => {
      lenis.raf(time);
      computeAnim();
      id = requestAnimationFrame(raf);
    };
    computeAnim();
    id = requestAnimationFrame(raf);
    const onResize = () => {
      computeAnim();
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("resize", onResize);
    };
  }, [computeAnim]);

  // Scroll-based active card: whichever card's center is closest to 40% down the viewport
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.40;
      let best = 0, bestDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const { top, height } = el.getBoundingClientRect();
        const dist = Math.abs(top + height / 2 - line);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActiveProject(best);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const onScroll = () => {
      const cardWidth = slider.scrollWidth / PROJECTS_STATIC.length;
      if (!cardWidth) return; // slider is display:none (desktop) — nothing to compute yet
      setActiveProject(Math.min(PROJECTS_STATIC.length - 1, Math.max(0, Math.round(slider.scrollLeft / cardWidth))));
    };
    slider.addEventListener("scroll", onScroll, { passive: true });
    return () => slider.removeEventListener("scroll", onScroll);
  }, []);

  // Fade sidebar content on project change
  useEffect(() => {
    if (activeProject === displayProject) return;
    setSidebarVisible(false);
    const timer = setTimeout(() => {
      setDisplayProject(activeProject);
      setSidebarVisible(true);
    }, 160);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html:`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:auto;touch-action:manipulation;}
        html.lenis,html.lenis body{height:auto;}
        .lenis.lenis-smooth{scroll-behavior:auto!important;}
        .lenis.lenis-stopped{overflow:hidden;}
        body{background-color:${NAVY};color:#ffffff;overflow-x:hidden;overscroll-behavior:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${NAVY};}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px;}
        a{text-decoration:none;}
        @keyframes fadeBlurReveal{0%{opacity:0;filter:blur(10px);transform:translateY(12px);}100%{opacity:1;filter:blur(0);transform:translateY(0);}}
        @keyframes kenBurns{0%{transform:scale(1);}100%{transform:scale(1.07);}}
        @keyframes preloaderFadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes svcFadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        /* ── Hero content ── */
        .hero-content{padding:clamp(94px,14vh,150px) clamp(24px,5vw,72px) clamp(104px,16vh,166px);}
        .hero-title{font-family:var(--font-inter),sans-serif;font-weight:200;font-size:clamp(3rem,7.4vw,7rem);line-height:0.96;color:#ffffff;margin:0;letter-spacing:-0.03em;}
        .hero-main-row{display:flex;align-items:flex-end;justify-content:space-between;gap:clamp(28px,4.5vw,64px);}
        .hero-left{flex:1 1 auto;min-width:0;}
        /* ── Hero CTAs — static grey-glass buttons (no animation, no shadow) ── */
        .hero-cta-row{display:flex;flex-wrap:wrap;gap:clamp(10px,1.1vw,14px);margin-top:clamp(24px,3.4vh,40px);}
        .hero-btn{font-family:var(--font-inter),sans-serif;font-size:clamp(0.82rem,0.98vw,0.94rem);font-weight:500;letter-spacing:0.01em;border-radius:var(--radius);padding:clamp(14px,1.2vw,18px) clamp(26px,2.3vw,38px);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;white-space:nowrap;color:#ffffff;background:rgba(44,44,46,0.42);backdrop-filter:blur(16px) saturate(118%);-webkit-backdrop-filter:blur(16px) saturate(118%);}
        .hero-btn:hover{background:rgba(62,62,66,0.5);}
        /* ── Location switcher ── */
        .hero-loc{display:flex;gap:clamp(18px,3vw,48px);padding:0 clamp(24px,5vw,72px) clamp(22px,3.2vh,34px);}
        .hero-loc-item{flex:1 1 0;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:clamp(9px,1.1vh,13px);background:none;border:none;padding:6px 0;cursor:pointer;text-align:left;min-height:44px;}
        .hero-loc-trackwrap{position:relative;width:100%;height:2px;border-radius:2px;}
        .hero-loc-track{position:absolute;inset:0;background:#ffffff;opacity:0.16;border-radius:2px;}
        .hero-loc-fill{position:absolute;left:0;top:0;bottom:0;width:0;background:#ffffff;opacity:0.95;border-radius:2px;}
        .hero-loc-name{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(0.9rem,1.25vw,1.15rem);letter-spacing:0.01em;color:#ffffff;}
        @media(max-width:900px){
          .hero-content{padding:clamp(82px,12vh,110px) clamp(24px,5vw,72px) clamp(96px,13vh,120px);justify-content:center!important;}
          .hero-main-row{flex-direction:column;align-items:stretch;gap:clamp(18px,3.5vw,26px);}
          .hero-title{font-size:clamp(2.5rem,9vw,3.4rem);}
        }
        @media(max-width:600px){
          .hero-loc{gap:clamp(10px,3vw,18px);bottom:15px!important;}
          .hero-loc-item:first-child{flex-grow:0.95;}
          .hero-loc-item:nth-child(2){flex-grow:1.35;}
          .hero-loc-item:nth-child(3){flex-grow:0.82;}
          .hero-loc-name{font-size:clamp(0.68rem,3vw,0.84rem);white-space:nowrap;}
          .hero-scroll-shell{height:auto!important;}
          .hero-about-band{position:relative!important;top:auto!important;height:auto!important;}
          .hero-about-content{height:auto!important;padding-bottom:clamp(56px,7vh,80px)!important;}
        }
        /* Laptop band (1024-1600px) for the "who we are" teaser line under the hero:
           its max-width is normally clamp(320px,72vw,900px), which sits near its
           900px ceiling through this whole range — at laptop widths that's a long
           enough line, at 1.12 leading, to read as both too-wide and cramped.
           Narrower cap + looser leading here keep the measure readable. Font-size is
           also capped lower than its native 3rem ceiling: the fixed-height (31vh)
           container above has no slack for both a taller line-height AND the full
           3rem size at once without the text pushing into the Services section below
           (verified empirically — 1.2 leading at the native size overlaps the next
           section by up to ~80px near 1600px). All three values were tuned together
           so the block clears the next section at every width in this band. Mobile/
           tablet (still on the vw-scaled clamp + original 1.12/3rem) and real
           desktops (back to the 900px/3rem ceiling above 1600px) are unaffected. */
        @media(min-width:1024px) and (max-width:1600px){
          .hero-about-content p:last-child{max-width:720px!important;line-height:1.2!important;font-size:clamp(1.5rem,2.4vw,2.4rem)!important;}
        }
        .stat-block{flex:1;min-width:0;padding:clamp(32px,4.5vw,60px) clamp(20px,3vw,48px);border-left:1px solid rgba(2,10,37,0.08);position:relative;}
        .stat-block:first-child{border-left:none;padding-left:0;}
        .stat-val{font-family:var(--font-inter),sans-serif;font-weight:200;font-size:clamp(3rem,6vw,5.5rem);color:${NAVY};letter-spacing:-0.03em;line-height:1;margin:0 0 clamp(8px,1.2vh,14px) 0;}
        .stat-label{font-family:var(--font-inter),sans-serif;font-size:clamp(0.96rem,1.1vw,1.04rem);color:var(--lp-text-meta);letter-spacing:0.01em;line-height:1.5;}
        .stat-rule{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,${NAVY},transparent);opacity:0;transition:opacity 0.5s ease;}
        .stat-block:hover .stat-rule{opacity:1;}
        .mat-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,1.8vw,24px);margin-top:clamp(40px,5.5vh,64px);}
        .mat-card{position:relative;overflow:hidden;background:#f3f2ef;border:1px solid rgba(2,10,37,0.09);border-radius:var(--radius);padding:clamp(24px,3vw,40px);min-height:clamp(280px,32vh,340px);display:flex;flex-direction:column;gap:clamp(34px,5vh,56px);}
        .mat-card:nth-child(2){background:#f8f7f5;}
        .mat-card-top{display:flex;align-items:center;gap:16px;}
        .mat-icon-wrap{width:46px;height:46px;border-radius:50%;background:${NAVY};display:flex;align-items:center;justify-content:center;color:#ffffff;flex-shrink:0;}
        .mat-card-copy{margin-top:auto;}
        .mat-card-title{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:var(--lp-h3-fs);color:${NAVY};margin:0 0 clamp(10px,1.4vh,14px) 0;line-height:1.25;letter-spacing:-0.012em;}
        .mat-card-desc{font-family:var(--font-inter),sans-serif;font-size:var(--lp-card-body-fs);line-height:1.6;color:var(--lp-text-body);margin:0;max-width:62ch;}
        /* Projects */
        .footer-cta-btn{font-family:var(--font-inter),sans-serif;font-size:clamp(0.65rem,0.82vw,0.74rem);font-weight:500;letter-spacing:0.08em;color:${NAVY};background:#ffffff;border:1px solid rgba(2,10,37,0.12);border-radius:var(--radius);padding:12px 28px;cursor:pointer;}
        .home-footer{background-color:${SECTION_BG};}
        @media(max-width:767px){.home-footer{background-color:${NAVY};}}
        @media(max-width:640px){
          .stat-block{padding:clamp(20px,5vw,32px) 0!important;border-left:none!important;border-top:1px solid rgba(2,10,37,0.08)!important;}
          .stat-block:first-child{border-top:none!important;padding-top:clamp(20px,5vw,32px)!important;}
          .stats-row{flex-direction:column!important;}
          .mat-grid{grid-template-columns:1fr!important;}
          .mat-card{min-height:0;gap:28px;padding:24px;}
          .mat-icon-wrap{width:44px;height:44px;}
        }
        /* Services — desktop strip vs mobile/tablet stack of desktop-style cards */
        .svc-strip{display:flex;}
        .svc-stack{display:none;}
        .svc-controls{display:flex;}
        .svc-m-card{background:#ffffff;border:1px solid rgba(2,10,37,0.12);border-radius:var(--radius);overflow:hidden;box-shadow:none;display:flex;flex-direction:column;opacity:0;transform:translateY(30px);transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1),transform 0.7s cubic-bezier(0.16,1,0.3,1);}
        .svc-m-card.is-visible{opacity:1;transform:translateY(0);}
        .svc-m-media{width:100%;height:auto;aspect-ratio:4/3;background:rgba(2,10,37,0.06);overflow:hidden;flex-shrink:0;}
        .svc-m-media img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.12);filter:blur(6px);transition:transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.08s,filter 0.9s ease 0.08s;}
        .svc-m-card.is-visible .svc-m-media img{transform:scale(1);filter:blur(0);}
        .svc-m-body{padding:clamp(22px,5.5vw,30px);display:flex;flex-direction:column;}
        .svc-m-name{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:var(--lp-h3-fs);color:${NAVY};margin:0 0 clamp(8px,2vw,11px) 0;line-height:1.3;}
        .svc-m-desc{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:var(--lp-card-body-fs);line-height:var(--lp-card-body-lh);color:var(--lp-text-body);margin:0;}
        /* The card width animates on hover, but its copy keeps a stable fluid
           width. This prevents the paragraph from re-wrapping on every frame
           of the flex transition while the media can still slide smoothly. */
        .svc-active-copy{width:clamp(150px,17vw,280px);flex:0 0 clamp(150px,17vw,280px);}
        .svc-active-media{width:clamp(125px,14vw,240px);flex:0 0 clamp(125px,14vw,240px);}
        @media(min-width:901px) and (max-width:1050px){
          .svc-active-copy{width:145px;flex-basis:145px;}
          .svc-active-media{width:120px;flex-basis:120px;}
        }
        .svc-active-desc{font-family:var(--font-inter),sans-serif;font-size:var(--lp-card-body-fs);line-height:var(--lp-card-body-lh);color:var(--lp-text-body);margin:0 0 clamp(14px,2vh,20px) 0;min-height:0;flex-shrink:0;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5;overflow-wrap:break-word;-webkit-hyphens:auto;hyphens:auto;}
        .svc-more-link{width:max-content;margin-top:auto;padding-bottom:4px;display:inline-flex;align-items:center;gap:18px;border-bottom:1px solid rgba(2,10,37,0.3);font-family:var(--font-inter),sans-serif;font-size:clamp(0.7rem,0.8vw,0.78rem);font-weight:500;letter-spacing:0.01em;color:${NAVY};text-decoration:none;transition:gap 0.3s ease,border-color 0.3s ease;flex-shrink:0;}
        .svc-more-link:hover{gap:24px;border-color:${NAVY};}
        .svc-m-body .svc-more-link{margin-top:clamp(16px,3.5vw,22px);align-self:flex-start;}
        .svc-tailored-cta{width:max-content;margin-top:clamp(12px,1.7vh,16px);display:inline-flex;align-items:center;justify-content:space-between;gap:18px;padding:10px 16px;border:1px solid ${NAVY};border-radius:var(--radius-sm);background:${NAVY};font-family:var(--font-inter),sans-serif;font-size:clamp(0.62rem,0.72vw,0.7rem);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;}
        /* Tailored-services CTA lives in two places depending on how much
           room the strip actually has: on laptop-width screens (the strip's
           whole 901-1600px range) it's a banner below the row, since a 6th
           card there is what caused the crowding fixed earlier; on wide
           dedicated monitors (>1600px) there's enough room to put it back
           in row with the real services, as it always was before that fix. */
        .svc-tailored-row{display:none;}
        .svc-tailored-banner{display:flex;}
        @media(min-width:1601px){
          .svc-tailored-row{display:flex;}
          .svc-tailored-banner{display:none;}
        }
        @media(max-width:900px){
          .svc-strip{display:none!important;}
          .svc-controls{display:none!important;}
          .svc-stack{display:flex!important;flex-direction:column;gap:clamp(16px,3vw,22px);margin-bottom:clamp(22px,5vw,32px);}
          /* Tailored-services banner goes dark on mobile only — the same
             banner also renders at laptop widths (901-1600px, see the
             breakpoint comment above), which stays untouched. */
          .svc-tailored-banner{background:${NAVY}!important;border-color:rgba(255,255,255,0.14)!important;}
          .svc-tailored-icon{color:rgba(255,255,255,0.55)!important;}
          .svc-tailored-heading{color:#ffffff!important;}
          .svc-tailored-body{color:rgba(255,255,255,0.62)!important;}
          .svc-tailored-cta-banner{background:#ffffff!important;border-color:#ffffff!important;color:${NAVY}!important;}
        }
        /* Wider tablets: media beside the text, like the desktop card */
        @media(min-width:620px) and (max-width:900px){
          .svc-m-card{flex-direction:row-reverse;}
          .svc-m-media{width:42%;height:auto;aspect-ratio:4/3;align-self:center;}
          .svc-m-body{width:58%;justify-content:center;}
        }
        /* Map pin — a fixed 20x20 anchor box keeps Leaflet's iconAnchor math
           stable while the inner dot grows/shrinks on activation, so the
           transition never drifts off its true coordinate mid-animation. */
        .lp-map-pin-wrap{width:20px;height:20px;display:flex;align-items:center;justify-content:center;}
        .lp-map-pin{width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,0.2);border:1.5px solid rgba(255,255,255,0.5);transition:width 0.4s cubic-bezier(0.4,0,0.2,1),height 0.4s cubic-bezier(0.4,0,0.2,1),background 0.4s cubic-bezier(0.4,0,0.2,1),border-width 0.4s cubic-bezier(0.4,0,0.2,1),border-color 0.4s cubic-bezier(0.4,0,0.2,1),box-shadow 0.4s cubic-bezier(0.4,0,0.2,1);}
        .lp-map-pin.is-active{width:20px;height:20px;background:#ffffff;border-width:3px;border-color:#ffffff;box-shadow:0 0 0 5px rgba(255,255,255,0.25),0 2px 10px rgba(0,0,0,0.5);}
        /* Each region gets a fresh map instance behind a short dark veil.
           The veil lifts only after that instance's first tiles load, avoiding
           both the staggered long flight and Chromium's stale-raster bug. */
        .lp-map-stack{position:relative;width:100%;height:100%;background:${SECTION_BG};overflow:hidden;}
        .lp-map-region{position:absolute!important;inset:0;width:100%;height:100%;pointer-events:none;}
        .lp-map-transition-veil{position:absolute;inset:0;z-index:1000;background:${SECTION_BG};opacity:0;pointer-events:none;will-change:opacity;transition:opacity 0.65s cubic-bezier(0.22,1,0.36,1);}
        .lp-map-transition-veil.is-covering{opacity:1;transition-duration:0.32s;}
        .lp-map-dark.leaflet-container{background:${SECTION_BG};}
        @media(prefers-reduced-motion:reduce){.lp-map-transition-veil,.lp-map-transition-veil.is-covering{transition-duration:0.12s;}.svc-m-card,.svc-m-media img{transition:none!important;opacity:1!important;transform:none!important;filter:none!important;}}
        .projects-desktop{display:block;}
        .projects-mobile{display:none;}
        .proj-mobile-slider{-webkit-overflow-scrolling:touch;overscroll-behavior:none;}
        .proj-mobile-slider::-webkit-scrollbar{display:none;}
        @media(max-width:768px){
          .projects-desktop{display:none!important;}
          .projects-mobile{display:block!important;}
        }
      `}} />

      {preloaderVisible && (
        <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />
      )}

      {/* mobileDarkZone reuses logoFloating's own signal (rect.bottom > 0 for
          the navy hero/sub-hero band in computeAnim above) — the mobile
          Projects section is a light cream background, not dark, so it's
          deliberately excluded from the dark-scrim zone. */}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} logoFloating={logoFloating} mobileDarkZone={logoFloating} />

      {/* ── Hero ── */}
      <div className="hero-scroll-shell" style={{ position:"relative", height:"145vh", backgroundColor:NAVY }}>
        <section style={{ position:"sticky", top:0, height:"100vh", zIndex:1, overflow:"hidden", backgroundColor:NAVY }}>
          <div ref={heroVideoWrapRef} style={{ position:"absolute", inset:0 }}>
            {LOCATION_VIDEOS.map((src, i) => (
              <video
                key={i}
                ref={(el) => {
                  locVideoRefs.current[i] = el;
                  if (el) {
                    // Set these properties as soon as React attaches the node.
                    // WebKit evaluates autoplay eligibility earlier than Chromium.
                    el.muted = true;
                    el.defaultMuted = true;
                    el.playsInline = true;
                  }
                }}
                src={src}
                loop muted playsInline
                autoPlay={i === activeLocation}
                preload={i === activeLocation ? "auto" : "metadata"}
                aria-hidden={i !== activeLocation}
                onError={() => handleVideoError(i)}
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity: i === activeLocation ? 1 : 0, transition:"opacity 0.8s cubic-bezier(0.4,0,0.2,1)" }}
              />
            ))}
          </div>
          {/* Scroll-driven dimming as a plain opacity scrim, not a `filter` on the
              video's ancestor: CSS `filter`/`will-change` on an element that
              contains a <video> is a known WebKit compositing bug that can break
              video rendering in Safari specifically — the same bug family as the
              `::-webkit-media-controls` landmine already fixed in this hero. */}
          <div ref={heroVideoScrimRef} style={{ position:"absolute", inset:0, backgroundColor:NAVY, opacity:0, pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:0, backgroundColor:"rgba(0,0,0,0.28)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"linear-gradient(to bottom,rgba(0,0,0,0.32) 0%,transparent 30%,rgba(0,0,0,0.1) 70%,rgba(0,0,0,0.5) 100%)" }} />
          {videoPlaybackBlocked && (
            <button
              type="button"
              onClick={() => { void playActiveLocationVideo(); }}
              aria-label={t.hero.playVideo}
              style={{
                position:"absolute", left:"50%", top:"50%", zIndex:20,
                transform:"translate(-50%,-50%)", display:"inline-flex",
                alignItems:"center", gap:"10px", padding:"12px 18px",
                border:"1px solid rgba(255,255,255,0.45)", borderRadius:"999px",
                background:"rgba(2,10,37,0.52)", backdropFilter:"blur(12px)",
                WebkitBackdropFilter:"blur(12px)", color:"#ffffff", cursor:"pointer",
                fontFamily:"var(--font-inter),sans-serif", fontSize:"clamp(0.68rem,0.82vw,0.76rem)",
                fontWeight:500, letterSpacing:"0.05em",
              }}
            >
              <span aria-hidden="true" style={{ fontSize:"0.85em" }}>▶</span>
              {t.hero.playVideo}
            </button>
          )}
          {/* Navy scroll-out wash — sits ABOVE the hero content (z:30) so it fades the
              whole hero (video + title + cards + location bar) to navy uniformly. At
              rest it's opacity:0, so it never affects the cards' backdrop-filter. */}
          <div ref={heroOverlayRef} style={{ position:"absolute", inset:0, zIndex:30, backgroundColor:NAVY, opacity:0, willChange:"opacity", pointerEvents:"none" }} />
          {/* ── Hero content — title + CTAs (left), glass mini-cards (right) ── */}
          <div className="hero-content" style={{ position:"relative", zIndex:10, height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
            <div className="hero-main-row">
              {/* Left */}
              <div ref={heroLeftRef} className="hero-left" style={{ willChange: "transform" }}>
                <div>
                  <h1 className="hero-title">
                    {t.hero.titleLine1}<br />
                    {t.hero.titleLine2}
                    {t.hero.titleLine3 && <><br />{t.hero.titleLine3}</>}
                  </h1>
                </div>
                <div className="hero-cta-row">
                  <Link href={navHref(locale, "services")} className="hero-btn">{t.hero.ctaSecondary}</Link>
                  <Link href={navHref(locale, "contact")} className="hero-btn">{t.hero.ctaPrimary}</Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Location switcher — synced progress bars over the full hero width ── */}
          <div
            ref={heroLocTabsRef}
            className="hero-loc"
            style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:20, willChange:"opacity, transform" }}
            onMouseEnter={() => { locHoverRef.current = true; }}
            onMouseLeave={() => { locHoverRef.current = false; }}
          >
            {locationNames.map((name, i) => {
              const active = i === activeLocation;
              return (
                <button key={i} type="button" className="hero-loc-item" onClick={() => goToLocation(i)} aria-pressed={active}>
                  <span className="hero-loc-trackwrap">
                    <span className="hero-loc-track" ref={(el) => { locTrackRefs.current[i] = el; }} style={prefersReducedMotion ? { opacity: active ? 0.7 : 0.16, transition:"opacity 0.6s ease" } : undefined} />
                    <span className="hero-loc-fill" ref={(el) => { locFillRefs.current[i] = el; }} style={prefersReducedMotion ? { width: active ? "100%" : "0%", transition:"width 0.6s cubic-bezier(0.4,0,0.2,1)" } : undefined} />
                  </span>
                  <span className="hero-loc-name" style={{ opacity: active ? 1 : 0.42, transition:"opacity 0.55s ease" }}>{name}</span>
                </button>
              );
            })}
          </div>
        </section>
        <div ref={aboutRef} className="hero-about-band" style={{ position:"absolute", top:"100vh", left:0, right:0, height:"45vh", zIndex:2 }}>
          <div style={{ height:"14vh", background:`linear-gradient(to bottom,transparent,${NAVY})`, pointerEvents:"none" }} />
          <div className="hero-about-content" style={{ height:"31vh", backgroundColor:NAVY, display:"flex", flexDirection:"column", justifyContent:"flex-start", padding:"clamp(24px,3.5vh,40px) clamp(24px,5vw,72px) clamp(20px,3vh,36px)" }}>
            <RevealText text={t.about.label} style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:400, fontSize:"clamp(0.6rem,0.8vw,0.7rem)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", margin:"0 0 clamp(16px,2.5vh,28px) 0" }} />
            <RevealText text={t.about.body} delayOffset={3} style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:200, fontSize:"clamp(1.5rem,3.2vw,3rem)", lineHeight:1.12, color:"rgba(255,255,255,0.9)", margin:0, maxWidth:"clamp(320px,72vw,900px)", letterSpacing:"-0.02em" }} />
          </div>
        </div>
      </div>

      {/* ── Services — slider ── */}
      <section className="home-services-section" style={{ background:"#ffffff", padding:"clamp(56px,7vh,80px) clamp(24px,5vw,72px)", borderTop:"1px solid rgba(2,10,37,0.05)" }}>
        {/* Heading */}
        <div style={{ marginBottom:"clamp(24px,3.2vh,38px)" }}>
          <p className="home-services-label" style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:600, fontSize:"var(--lp-label-fs)", letterSpacing:"var(--lp-label-ls)", textTransform:"uppercase", color:"var(--lp-text-meta)", margin:"0 0 clamp(12px,1.8vh,18px) 0" }}>{t.services.label}</p>
          <h2 style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:300, fontSize:"var(--lp-title-fs)", lineHeight:0.95, color:NAVY, margin:0, letterSpacing:"var(--lp-title-ls)" }}>
            {t.services.headingLine1}<br />{t.services.headingLine2}
          </h2>
        </div>

        {/* Card strip — desktop expand-on-hover. The tailored-CTA card only
            shows here on wide dedicated monitors (>1600px, see
            .svc-tailored-row) — on laptop widths it's the banner below
            instead, since a 6th card there is what caused the crowding. */}
        <div className="svc-strip" style={{ gap:"clamp(8px,1vw,12px)", alignItems:"stretch", marginBottom:"clamp(14px,2vh,22px)" }}>
          {services.map((svc, i) => (
            <SvcSlideCard
              key={svc.name}
              svc={svc}
              isActive={i===activeSvc}
              onHover={() => setActiveSvc(i)}
              onClick={() => setActiveSvc(i)}
            />
          ))}
          <div
            className="svc-tailored-row"
            style={{
              flex: "1 1 0",
              width: 0,
              minWidth: 0,
              height: "clamp(300px,37vh,340px)",
              borderRadius: "var(--radius)",
              border: "1px solid rgba(2,10,37,0.12)",
              background: "#ffffff",
              boxShadow: "none",
              overflow: "hidden",
              flexDirection: "column",
            }}
          >
            <div style={{ flex:1, minWidth:0, minHeight:0, padding:"clamp(14px,1.5vw,22px)", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
              <div style={{ color:"rgba(2,10,37,0.42)", flexShrink:0 }}>{TAILORED_SERVICE_ICON}</div>
              <div style={{ minWidth:0 }}>
                <p style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:300, fontSize:"var(--lp-h3-fs)", color:NAVY, margin:"0 0 6px 0", lineHeight:1.2, overflowWrap:"break-word", WebkitHyphens:"auto", hyphens:"auto" }}>{t.servicesCta.label}</p>
                <p style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:400, fontSize:"clamp(0.72rem,0.82vw,0.8rem)", color:"var(--lp-text-body)", margin:0, lineHeight:1.45 }}>{t.servicesCta.body}</p>
                <Link href={navHref(locale, "contact")} className="svc-tailored-cta">
                  {t.servicesCta.btn}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card stack — mobile / tablet: desktop-style cards, one below another, photo not video */}
        <div className="svc-stack">
          {services.map((svc) => (
            <SvcMobileCard key={svc.name} svc={svc} />
          ))}
        </div>

        {/* Tailored-solutions CTA — banner form, above the dots/arrows. On
            laptop widths this is the only place it appears (see
            .svc-tailored-banner); on wide dedicated monitors it's hidden in
            favour of the in-row card above, so the CTA never shows twice. */}
        <div className="svc-tailored-banner" style={{
          marginBottom: "clamp(20px,3vh,32px)",
          borderRadius: "var(--radius)",
          border: "1px solid rgba(2,10,37,0.12)",
          background: "linear-gradient(120deg,rgba(2,10,37,0.025),#ffffff 60%)",
          padding: "clamp(24px,3.2vw,36px)",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "clamp(20px,3vw,32px)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"clamp(16px,2.2vw,24px)", minWidth:0 }}>
            <div className="svc-tailored-icon" style={{ color:"rgba(2,10,37,0.42)", flexShrink:0 }}>{TAILORED_SERVICE_ICON}</div>
            <div style={{ minWidth:0 }}>
              <h3 className="svc-tailored-heading" style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:500, fontSize:"var(--lp-h3-fs)", color:NAVY, margin:"0 0 4px 0", lineHeight:1.3 }}>{t.servicesCta.label}</h3>
              <p className="svc-tailored-body" style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:400, fontSize:"var(--lp-card-body-fs)", lineHeight:"var(--lp-card-body-lh)", color:"var(--lp-text-body)", margin:0, maxWidth:"58ch" }}>{t.servicesCta.body}</p>
            </div>
          </div>
          <Link href={navHref(locale, "contact")} className="svc-tailored-cta svc-tailored-cta-banner" style={{ flexShrink:0, margin:0 }}>
            {t.servicesCta.btn}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Dots + Arrows — desktop only */}
        <div className="svc-controls" style={{ justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            {services.map((_, i) => (
              <button key={i} onClick={() => setActiveSvc(i)} style={{ width:i===activeSvc?"28px":"6px", height:"3px", background:i===activeSvc?"rgba(2,10,37,0.7)":"rgba(2,10,37,0.15)", border:"none", borderRadius:"2px", cursor:"pointer", padding:0, transition:"all 0.5s cubic-bezier(0.37,0,0.63,1)" }} />
            ))}
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            {(["prev","next"] as const).map(dir => {
              const disabled = dir==="prev" ? activeSvc===0 : activeSvc===services.length-1;
              return (
                <button key={dir} onClick={() => setActiveSvc(dir==="prev" ? Math.max(0,activeSvc-1) : Math.min(services.length-1,activeSvc+1))} disabled={disabled}
                  style={{ width:"46px", height:"46px", display:"flex", alignItems:"center", justifyContent:"center", background:disabled?"transparent":"rgba(2,10,37,0.06)", border:`1.5px solid ${disabled?"rgba(2,10,37,0.1)":"rgba(2,10,37,0.22)"}`, borderRadius:"var(--radius)", cursor:disabled?"default":"pointer", color:disabled?"rgba(2,10,37,0.2)":NAVY, flexShrink:0, opacity:disabled?0.35:1 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    {dir==="prev"
                      ? <path d="M8.5 2L4 6.5l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      : <path d="M4.5 2l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>}
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {/* ── Stats ── */}
      <section style={{ backgroundColor:"#ffffff", padding:"clamp(56px,7vh,80px) clamp(24px,5vw,72px)", borderTop:"1px solid rgba(2,10,37,0.05)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"clamp(24px,4vw,48px)", flexWrap:"wrap", marginBottom:"clamp(40px,6vh,72px)" }}>
          <div style={{ flex:"0 0 auto" }}>
            <p style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:600, fontSize:"var(--lp-label-fs)", letterSpacing:"var(--lp-label-ls)", textTransform:"uppercase", color:"var(--lp-text-meta)", margin:"0 0 clamp(12px,1.8vh,18px) 0" }}>{t.stats.label}</p>
            <RevealText as="h2" text={t.stats.heading} style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:300, fontSize:"var(--lp-title-fs)", lineHeight:1.08, color:NAVY, letterSpacing:"var(--lp-title-ls)", maxWidth:"clamp(300px,48vw,600px)", margin:0 }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:"clamp(10px,1.5vh,16px)", alignSelf:"flex-end" }}>
            <Link href={navHref(locale, "projects")} className="btn-fill" style={{ fontFamily:"var(--font-inter),sans-serif", fontSize:"clamp(0.62rem,0.78vw,0.7rem)", fontWeight:500, letterSpacing:"0.06em", color:NAVY, background:"transparent", border:`1px solid ${NAVY}`, borderRadius:"var(--radius)", padding:"11px 24px", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", width:"fit-content" }}>
              {t.stats.equipmentBtn} <span className="btn-fill-icon">→</span>
            </Link>
          </div>
        </div>
        <div className="stats-row" style={{ display:"flex", borderTop:"1px solid rgba(2,10,37,0.08)" }}>
          {[{val:40,suffix:"–70",unit:"m³/h"},{val:1500,suffix:"+",unit:""},{val:24,suffix:"h",unit:""}].map((s,i)=>(
            <div key={i} className="stat-block">
              <div className="stat-rule" />
              <div className="stat-val"><StatNum value={s.val} suffix={s.suffix} delay={i*100} />{s.unit&&<span style={{ fontFamily:"var(--font-inter),sans-serif", fontSize:"clamp(1.2rem,1.6vw,1.44rem)", fontWeight:400, color:"rgba(2,10,37,0.48)", letterSpacing:"0.08em", marginLeft:"4px" }}>{s.unit}</span>}</div>
              <p className="stat-label">{t.stats.items[i].label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Materials ── */}
      <section style={{ backgroundColor:"#ffffff", padding:"clamp(56px,7vh,80px) clamp(24px,5vw,72px)", borderTop:"1px solid rgba(2,10,37,0.05)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"clamp(16px,2.5vw,28px)" }}>
          <RevealText as="h2" text={t.materials.heading} style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:300, fontSize:"var(--lp-title-fs)", lineHeight:1.1, color:NAVY, letterSpacing:"var(--lp-title-ls)", maxWidth:"clamp(300px,52vw,620px)", margin:0 }} />
          <p style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:400, fontSize:"var(--lp-body-fs)", lineHeight:"var(--lp-body-lh)", color:"var(--lp-text-body)", maxWidth:"340px", alignSelf:"flex-end", margin:0 }}>{t.materials.tagline}</p>
        </div>
        <div className="mat-grid">
          {t.materials.cards.map(({title,desc},i)=>(
            <div key={i} className="mat-card">
              <div className="mat-card-top">
                <div className="mat-icon-wrap">{MAT_ICONS[i]}</div>
              </div>
              <div className="mat-card-copy"><h3 className="mat-card-title">{title}</h3><p className="mat-card-desc">{desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Projects — desktop: full-bleed map, cards floating on the right ══ */}
      <section className="projects-desktop" style={{ background: SECTION_BG, position: "relative" }}>
        {/* Grid stack: sticky full-width map and the scrolling card column share one cell */}
        <div style={{ display: "grid" }}>

          {/* ── Full-width sticky map layer ── */}
          <div style={{ gridColumn: 1, gridRow: 1, position: "sticky", top: 0, height: "100vh", overflow: "hidden", zIndex: 1 }}>

            {/* Map — isolated stacking context so Leaflet's internal z-indexes
                (200/400/600) stay below the overlays. CARTO's dark tiles are
                already monochrome, so no compositor filter is needed here. */}
            <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
              {isDesktop && (
                <LeafletMap
                  key={PROJECTS_STATIC[activeProject].location === "Valencia" ? "valencia" : "costa-blanca"}
                  activeIdx={activeProject}
                />
              )}
            </div>

            {/* Left + bottom scrims — keep the floating overlays legible over the dark map */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(105deg, ${SECTION_BG} 0%, rgba(26,26,26,0.75) 18%, rgba(26,26,26,0) 46%)` }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "42%", pointerEvents: "none", background: `linear-gradient(to top, ${SECTION_BG} 4%, rgba(26,26,26,0) 100%)` }} />

            {/* Section heading — pinned top-left */}
            <div style={{ position: "absolute", top: "clamp(98px,13vh,150px)", left: "clamp(24px,4vw,64px)", maxWidth: "min(42%,460px)", zIndex: 4 }}>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.66rem,0.82vw,0.74rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", margin: "0 0 clamp(12px,1.6vh,18px) 0" }}>{t.projects.label}</p>
              <h2 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(1.9rem,3vw,3rem)", lineHeight: 1.04, color: "#ffffff", letterSpacing: "-0.025em", margin: 0 }}>{t.projects.heading}</h2>
            </div>

            {/* Floating glass info panel — pinned bottom-left, syncs with the active card.
                Dark frosted glass (light tint on transparent + blur, not a solid fill) so
                the dark map still reads through it softly, matching the map's own theme. */}
            <div style={{
              position: "absolute", left: "clamp(24px,4vw,64px)", bottom: "clamp(28px,5vh,56px)",
              width: "min(40%,420px)", zIndex: 4,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.14)", borderRadius: "var(--radius)",
              padding: "clamp(20px,1.9vw,26px) clamp(22px,2.1vw,28px)", overflow: "hidden",
            }}>
              {/* Label + progress row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(12px,1.5vh,16px)" }}>
                <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: 0 }}>{String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
                <div style={{ display: "flex", gap: "5px" }}>
                  {projects.map((_, i) => (
                    <div key={i} style={{ height: "3px", width: i === activeProject ? "22px" : "6px", background: i === activeProject ? "#ffffff" : "rgba(255,255,255,0.22)", borderRadius: "2px", transition: "all 0.5s cubic-bezier(0.37,0,0.63,1)" }} />
                  ))}
                </div>
              </div>

              {/* Fading dynamic content */}
              <div style={{ opacity: sidebarVisible ? 1 : 0, transform: sidebarVisible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.28s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(8px,1.1vh,11px)" }}>
                  <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#ffffff", flexShrink: 0 }} />
                  <h3 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(1.45rem,2vw,2rem)", lineHeight: 1.05, color: "#ffffff", letterSpacing: "-0.025em", margin: 0 }}>
                    {projects[displayProject].name}
                  </h3>
                </div>

                <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "rgba(255,255,255,0.65)", margin: "0 0 clamp(16px,2vh,20px) 0" }}>
                  {projects[displayProject].shortDesc}
                </p>

                <div style={{ height: "1px", background: "rgba(255,255,255,0.14)", margin: "0 0 clamp(14px,1.8vh,18px) 0" }} />

                {/* Meta + Maps button */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                  <div style={{ display: "flex", gap: "clamp(18px,2vw,26px)", flexWrap: "wrap" }}>
                    <MetaChip label={t.projects.metaKeys.location} value={projects[displayProject].location} dark />
                    <MetaChip label={t.projects.metaKeys.year} value={projects[displayProject].year} dark />
                  </div>
                  <a
                    href={projects[displayProject].mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-maps-btn btn-fill btn-fill-light"
                    style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.6rem,0.72vw,0.66rem)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "var(--radius-sm)", padding: "9px 16px", textDecoration: "none", flexShrink: 0 }}
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.78 3.5 6.5 3.5 6.5s3.5-3.72 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor"/>
                    </svg>
                    {t.projects.viewOnMaps}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Scrolling portrait cards — right side, drives the scroll height ── */}
          <div style={{ gridColumn: 1, gridRow: 1, position: "relative", zIndex: 2, justifySelf: "end", width: "min(46%,620px)", padding: "clamp(100px,14vh,160px) clamp(24px,4vw,64px) 42vh 0", pointerEvents: "none" }}>
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                ref={(el: HTMLDivElement | null) => { cardRefs.current[i] = el; }}
                style={{ marginBottom: i < projects.length - 1 ? "clamp(20px,3vh,28px)" : 0, pointerEvents: "auto" }}
              >
                <ProjectCard proj={proj} metaKeys={t.projects.metaKeys} index={i} viewOnMapsLabel={t.projects.viewOnMaps} dark />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Projects mobile ── */}
      <section className="projects-mobile" style={{ background: "#f0eeea", paddingTop: "clamp(48px,7vh,72px)", paddingBottom: "clamp(48px,7vh,72px)" }}>
        <div style={{ paddingLeft: "clamp(24px,5vw,48px)", paddingRight: "clamp(24px,5vw,48px)", marginBottom: "clamp(22px,3.5vh,32px)" }}>
          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.62rem,2.6vw,0.7rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: "0 0 clamp(8px,1.2vh,12px) 0" }}>{t.projects.label}</p>
          <h2 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(1.9rem,6.5vw,3rem)", lineHeight: 1.05, color: NAVY, letterSpacing: "-0.025em", margin: 0 }}>{t.projects.heading}</h2>
        </div>
        <div
          ref={mobileSliderRef}
          className="proj-mobile-slider"
          style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollPaddingLeft: "clamp(24px,5vw,48px)", scrollPaddingRight: "clamp(24px,5vw,48px)", gap: "clamp(12px,3vw,16px)", paddingLeft: "clamp(24px,5vw,48px)", paddingRight: "clamp(24px,5vw,48px)", paddingBottom: "4px", scrollbarWidth: "none" }}
        >
          {projects.map((proj, i) => (
            <div key={proj.id} style={{ flex: "0 0 86vw", maxWidth: "420px", scrollSnapAlign: "start" }}>
              <ProjectCard proj={proj} metaKeys={t.projects.metaKeys} index={i} viewOnMapsLabel={t.projects.viewOnMaps} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer" style={{ padding:"clamp(64px,10vh,120px) clamp(24px,5vw,72px) clamp(32px,4vh,56px)" }}>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"clamp(48px,7vh,88px)", display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"clamp(24px,4vw,48px)", marginBottom:"clamp(56px,8vh,100px)" }}>
          <div>
            <p style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:400, fontSize:"clamp(0.6rem,0.78vw,0.7rem)", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", margin:"0 0 clamp(14px,2vh,22px) 0" }}>{t.footer.ctaLabel}</p>
            <h2 style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:200, fontSize:"clamp(2.2rem,5.5vw,5.5rem)", lineHeight:0.95, color:"#ffffff", margin:0, letterSpacing:"-0.03em", maxWidth:"clamp(280px,60vw,800px)" }}>{t.footer.ctaHeading}</h2>
          </div>
          <Link href={navHref(locale, "contact")} className="footer-cta-btn btn-fill btn-fill-light" style={{ textDecoration:"none" }}>{t.footer.ctaBtn} <span className="btn-fill-icon">→</span></Link>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px", borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"clamp(20px,2.5vh,28px)" }}>
          <Link href={navHref(locale, "")} style={{ fontFamily:"var(--font-inter),sans-serif", fontWeight:600, fontSize:"clamp(0.85rem,1.1vw,1rem)", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.9)", textDecoration:"none" }}>Level Pro</Link>
          <div style={{ display:"flex", gap:"clamp(20px,3vw,36px)" }}>
            {t.footer.links.map((l,i)=><Link key={l} href={navHref(locale, NAV_PATHS[i] ?? l.toLowerCase().replace(/\s+/g,"-"))} style={{ fontFamily:"var(--font-inter),sans-serif", fontSize:"clamp(0.62rem,0.78vw,0.7rem)", fontWeight:400, color:"rgba(255,255,255,0.35)", letterSpacing:"0.04em", textDecoration:"none", transition:"color 0.2s ease" }}>{l}</Link>)}
          </div>
          <span style={{ fontFamily:"var(--font-inter),sans-serif", fontSize:"clamp(0.58rem,0.72vw,0.65rem)", color:"rgba(255,255,255,0.2)", letterSpacing:"0.04em" }}>{t.footer.copyright}</span>
        </div>
      </footer>
    </>
  );
}
