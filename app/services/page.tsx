"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { TRANSLATIONS } from "../translations";
import { useLocale, Preloader, NavBar, FooterCTA } from "../components/shared";

const HERO_IMG = "https://levelpro.es/wp-content/uploads/2026/05/3.jpg";
const TECH_IMG = "https://levelpro.es/wp-content/uploads/2026/05/1-copy.avif";

// ─── Light palette (T1-inspired) — page-scoped, mirrors the NAVY/ACCENT pattern ──
const BG_PRIMARY = "#FAFAF8";   // off-white, dominant background
const BG_SECONDARY = "#F4F2EE"; // warm grey, alternating sections
const BG_CARD = "#FFFFFF";      // solid cards
const BG_CONTRAST = "#0A0A0A";  // black impact section
const TEXT_PRIMARY = "#0A0A0A";
const TEXT_MUTED = "#6B6B6B";
const BORDER = "#E2E0DB";       // thin 1px borders
const ACCENT_WARM = "#8A8275";  // cement/concrete tone for discreet accents

// Real Level Pro figures — language-neutral, paired with translated labels below.
const STAT_VALUES = ["200+", "3", "9+", "24h"] as const;

// ─── SectionLabel — small square ▪ + uppercase tracked text ─────────────────────
function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "10px",
      fontFamily: "'Inter',sans-serif", fontWeight: 600,
      fontSize: "var(--lp-label-fs)", letterSpacing: "var(--lp-label-ls)",
      textTransform: "uppercase",
      color: dark ? "rgba(255,255,255,0.55)" : TEXT_MUTED,
    }}>
      <span style={{ width: "7px", height: "7px", background: dark ? "rgba(255,255,255,0.7)" : ACCENT_WARM, flexShrink: 0 }} />
      {children}
    </span>
  );
}

// ─── FadeIn — subtle one-shot fade/translate on scroll (only sanctioned motion) ──
function FadeIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? "none" : "translateY(18px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── TechAccordion — single-open expandable list on the black contrast section ───
function TechAccordion({ items }: {
  items: Array<{ name: string; shortDesc: string; body: string; tags: string[]; bullets: string[] }>;
}) {
  const [open, setOpen] = useState(0);

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "clamp(16px,2.5vw,28px)",
                background: "none", border: "none", cursor: "pointer", textAlign: "left",
                padding: "clamp(20px,2.8vh,30px) 0", color: "#fff",
              }}
            >
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.6rem,0.74vw,0.68rem)", letterSpacing: "0.14em", color: isOpen ? ACCENT_WARM : "rgba(255,255,255,0.3)", flexShrink: 0, transition: "color 0.3s ease", minWidth: "26px" }}>
                0{i + 1}
              </span>
              <span style={{ flex: 1, fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.4rem,2.8vw,2.4rem)", letterSpacing: "-0.02em", lineHeight: 1.1, color: isOpen ? "#fff" : "rgba(255,255,255,0.82)", transition: "color 0.3s ease" }}>
                {item.name}
              </span>
              {/* +/− toggle: vertical bar collapses to a minus when open */}
              <span style={{ position: "relative", width: "18px", height: "18px", flexShrink: 0, color: "rgba(255,255,255,0.85)" }} aria-hidden>
                <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1.5px", background: "currentColor", transform: "translateY(-50%)" }} />
                <span style={{ position: "absolute", left: "50%", top: 0, width: "1.5px", height: "100%", background: "currentColor", transform: `translateX(-50%) scaleY(${isOpen ? 0 : 1})`, transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
              </span>
            </button>

            <div style={{
              maxHeight: isOpen ? "640px" : "0",
              overflow: "hidden",
              opacity: isOpen ? 1 : 0,
              transition: `max-height ${isOpen ? "0.6s" : "0.4s"} cubic-bezier(0.4,0,0.2,1), opacity ${isOpen ? "0.45s ease 0.12s" : "0.2s ease"}`,
            }}>
              <div style={{ paddingBottom: "clamp(26px,3.6vh,38px)", paddingLeft: "clamp(42px,4.5vw,54px)", maxWidth: "640px" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.8rem,0.95vw,0.9rem)", lineHeight: 1.8, color: "rgba(255,255,255,0.6)", margin: "0 0 clamp(18px,2.6vh,24px) 0" }}>
                  {item.body}
                </p>
                <ul style={{ listStyle: "none", margin: "0 0 clamp(20px,2.8vh,26px) 0", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {item.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.72rem,0.88vw,0.82rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                      <span style={{ width: "5px", height: "5px", background: ACCENT_WARM, flexShrink: 0, marginTop: "7px" }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.58rem,0.72vw,0.65rem)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "40px", padding: "5px 14px", letterSpacing: "0.02em" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [locale, setLocale] = useLocale();
  const t = TRANSLATIONS[locale];
  const sp = t.servicesPage;

  const [pastHero, setPastHero] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const missionRef = useRef<HTMLElement>(null);

  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [isFastLoader, setIsFastLoader] = useState(false);
  const pendingLocaleRef = useRef<ReturnType<typeof useLocale>[0] | null>(null);

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
    lenisRef.current = lenis;
    let id: number;
    const check = () => {
      const nowPast = window.scrollY > window.innerHeight * 0.75;
      setPastHero(p => p === nowPast ? p : nowPast);
    };
    const raf = (time: number) => { lenis.raf(time); check(); id = requestAnimationFrame(raf); };
    check();
    id = requestAnimationFrame(raf);
    window.addEventListener("resize", check, { passive: true });
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenisRef.current = null; window.removeEventListener("resize", check); };
  }, []);

  const scrollToMission = useCallback(() => {
    if (missionRef.current) lenisRef.current?.scrollTo(missionRef.current);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:auto;touch-action:manipulation;}
        html.lenis,html.lenis body{height:auto;}
        .lenis.lenis-smooth{scroll-behavior:auto!important;}
        .lenis.lenis-stopped{overflow:hidden;}
        body{background-color:${BG_PRIMARY};color:${TEXT_PRIMARY};overflow-x:hidden;overscroll-behavior:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${BG_PRIMARY};}
        ::-webkit-scrollbar-thumb{background:rgba(10,10,10,0.18);border-radius:2px;}
        a{text-decoration:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @media(max-width:900px){
          .mission-grid{grid-template-columns:1fr!important;}
          .tech-grid{grid-template-columns:1fr!important;}
          .process-grid{grid-template-columns:1fr 1fr!important;}
          .locations-grid{grid-template-columns:1fr!important;}
          .tech-img{display:none!important;}
        }
        @media(max-width:560px){
          .process-grid{grid-template-columns:1fr!important;}
          .stats-grid{grid-template-columns:1fr 1fr!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar pastHero={pastHero} locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ── Hero — full-bleed concrete photo, subtle dark overlay ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "600px", display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: BG_CONTRAST }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 32%, transparent 52%, rgba(0,0,0,0.72) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(24px,5vw,72px)", paddingTop: "clamp(96px,11vw,140px)" }}>
          {/* Top label */}
          <div style={{ animation: "fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.4s both" }}>
            <SectionLabel dark>{sp.hero.label}</SectionLabel>
          </div>

          {/* Bottom — heading + tagline + Discover */}
          <div style={{ animation: "fadeUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.3s both" }}>
            <h1 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(2.8rem,7.2vw,7rem)", lineHeight: 1.0, color: "#ffffff", margin: 0, letterSpacing: "-0.03em" }}>
              {sp.hero.headingLine1}<br />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>{sp.hero.headingLine2}</span>
            </h1>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.78rem,0.95vw,0.9rem)", lineHeight: 1.65, color: "rgba(255,255,255,0.6)", margin: "clamp(22px,3vh,32px) 0 clamp(24px,3.2vh,34px) 0", maxWidth: "clamp(280px,42vw,500px)" }}>
              {sp.hero.tagline}
            </p>
            <button
              type="button"
              onClick={scrollToMission}
              style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.68rem,0.82vw,0.75rem)", letterSpacing: "0.06em", color: "#fff", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "100px", padding: "12px 26px", cursor: "pointer", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            >
              {sp.mission.btn}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v9M2 6.5l4.5 4.5L11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section ref={missionRef} style={{ backgroundColor: BG_PRIMARY, padding: "clamp(72px,11vh,140px) clamp(24px,5vw,72px)" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(36px,5.5vh,60px)" }}>
            <SectionLabel>{sp.mission.label}</SectionLabel>
          </div>
          <div className="mission-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: "clamp(32px,5vw,80px)", alignItems: "start" }}>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.05, color: TEXT_PRIMARY, letterSpacing: "var(--lp-title-ls)", margin: 0 }}>
              {sp.mission.heading}
            </h2>
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: TEXT_MUTED, margin: "0 0 clamp(16px,2.4vh,22px) 0" }}>
                {sp.mission.body1}
              </p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: TEXT_MUTED, margin: "0 0 clamp(26px,3.5vh,34px) 0" }}>
                {sp.mission.body2}
              </p>
              <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.68rem,0.82vw,0.75rem)", letterSpacing: "0.04em", color: TEXT_PRIMARY, borderBottom: `1px solid ${TEXT_PRIMARY}`, paddingBottom: "3px" }}>
                {sp.mission.btn} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Technology — black contrast section, image + expandable list ── */}
      <section style={{ backgroundColor: BG_CONTRAST, padding: "clamp(72px,11vh,140px) clamp(24px,5vw,72px)" }}>
        <div style={{ marginBottom: "clamp(40px,6vh,72px)" }}>
          <div style={{ marginBottom: "clamp(16px,2.4vh,24px)" }}>
            <SectionLabel dark>{sp.tech.label}</SectionLabel>
          </div>
          <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.98, color: "#ffffff", letterSpacing: "var(--lp-title-ls)", margin: 0 }}>
            {sp.tech.heading}
          </h2>
        </div>

        <div className="tech-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: "clamp(32px,4.5vw,72px)", alignItems: "start" }}>
          <div className="tech-img" style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: "clamp(80px,10vh,120px)", aspectRatio: "4 / 5" }}>
            <img src={TECH_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <TechAccordion items={sp.detail.items} />
        </div>
      </section>

      {/* ── Process — warm grey, solid cards ── */}
      <section style={{ backgroundColor: BG_SECONDARY, padding: "clamp(72px,11vh,140px) clamp(24px,5vw,72px)" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(40px,6vh,72px)" }}>
            <div style={{ marginBottom: "clamp(16px,2.4vh,24px)" }}>
              <SectionLabel>{sp.process.label}</SectionLabel>
            </div>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.98, color: TEXT_PRIMARY, letterSpacing: "var(--lp-title-ls)", margin: 0 }}>
              {sp.process.heading}
            </h2>
          </div>

          <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(12px,1.4vw,20px)" }}>
            {sp.process.steps.map((step, i) => (
              <div key={i} style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: "24px", padding: "clamp(26px,3vw,38px)", display: "flex", flexDirection: "column", minHeight: "clamp(200px,24vh,260px)" }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(2.2rem,3.6vw,3.4rem)", color: ACCENT_WARM, opacity: 0.45, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "auto" }}>{step.num}</span>
                <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 400, fontSize: "clamp(1.05rem,1.4vw,1.3rem)", color: TEXT_PRIMARY, margin: "clamp(20px,3vh,30px) 0 clamp(10px,1.5vh,14px) 0", letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.72rem,0.88vw,0.82rem)", lineHeight: 1.65, color: TEXT_MUTED, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Stats — huge focal numbers ── */}
      <section style={{ backgroundColor: BG_PRIMARY, padding: "clamp(64px,9vh,110px) clamp(24px,5vw,72px)" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(32px,4.5vh,52px)" }}>
            <SectionLabel>{sp.stats.label}</SectionLabel>
          </div>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: `1px solid ${BORDER}` }}>
            {STAT_VALUES.map((val, i) => (
              <div key={i} style={{ padding: "clamp(28px,4vh,48px) clamp(16px,2vw,32px) clamp(20px,3vh,32px) 0", borderRight: i < 3 ? `1px solid ${BORDER}` : "none", paddingLeft: i === 0 ? 0 : "clamp(16px,2vw,32px)" }}>
                <div style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(3rem,6.5vw,6rem)", color: TEXT_PRIMARY, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "clamp(12px,1.8vh,18px)", whiteSpace: "nowrap" }}>{val}</div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.66rem,0.82vw,0.74rem)", fontWeight: 400, color: TEXT_MUTED, letterSpacing: "0.02em", margin: 0, lineHeight: 1.4 }}>{sp.stats.items[i].label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Locations — light minimal cards ── */}
      <section style={{ backgroundColor: BG_SECONDARY, padding: "clamp(72px,11vh,140px) clamp(24px,5vw,72px)" }}>
        <FadeIn>
          <div style={{ marginBottom: "clamp(40px,6vh,72px)" }}>
            <div style={{ marginBottom: "clamp(16px,2.4vh,24px)" }}>
              <SectionLabel>{sp.locations.label}</SectionLabel>
            </div>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.98, color: TEXT_PRIMARY, letterSpacing: "var(--lp-title-ls)", margin: 0 }}>
              {sp.locations.heading}
            </h2>
          </div>

          <div className="locations-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(12px,1.4vw,20px)" }}>
            {sp.locations.items.map((loc, i) => (
              <div key={i} style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: "24px", padding: "clamp(28px,3vw,42px)", display: "flex", flexDirection: "column", minHeight: "clamp(220px,26vh,280px)" }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.6rem,0.74vw,0.68rem)", letterSpacing: "0.14em", color: ACCENT_WARM }}>0{i + 1}</span>
                <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 400, fontSize: "clamp(1.5rem,2.4vw,2.1rem)", color: TEXT_PRIMARY, margin: "clamp(20px,3vh,28px) 0 clamp(12px,1.8vh,16px) 0", letterSpacing: "-0.02em", marginTop: "auto" }}>{loc.name}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.74rem,0.9vw,0.84rem)", lineHeight: 1.65, color: TEXT_MUTED, margin: 0 }}>{loc.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── CTA + Footer — the only navy on the page ── */}
      <FooterCTA locale={locale} />
    </>
  );
}
