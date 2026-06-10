"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import { TRANSLATIONS } from "../translations";
import { NAVY, ACCENT, useLocale, Preloader, NavBar, FooterCTA } from "../components/shared";

const HERO_IMG = "https://levelpro.es/wp-content/uploads/2026/05/3.jpg";
const SVC_VIDEO = "https://levelpro.venacydigital.com/wp-content/uploads/2026/04/333333benidorm-poniente-beach-aerial-flyover-mediterra-2026-02-24-23-51-33-utc.mp4";

const SECTOR_ICONS = [
  <svg key="res" width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M3 11L13 3l10 8V23H3V11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M10 23v-8h6v8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>,
  <svg key="com" width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="3" y="7" width="20" height="16" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3 12h20M3 17h20" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 7V5M18 7V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8 12v5M13 12v5M18 12v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
  <svg key="ind" width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M3 23V11l5-4v3l5-4v3l5-4v14H3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <rect x="10" y="16" width="6" height="7" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3 16h6M18 16h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>,
  <svg key="hi" width="26" height="26" viewBox="0 0 26 26" fill="none">
    <rect x="6" y="3" width="14" height="20" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M10 3v20M16 3v20" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6 8h14M6 13h14M6 18h14" stroke="currentColor" strokeWidth="1.4"/>
  </svg>,
];

// ─── ServiceCard ──────────────────────────────────────────────────────────────
function ServiceCard({ item, index, isActive, onActivate, videoSrc }: {
  item: { name: string; shortDesc: string; body: string; tags: string[]; bullets: string[] };
  index: number; isActive: boolean; onActivate: (i: number | null) => void; videoSrc: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) { v.play().catch(() => {}); } else { v.pause(); }
  }, [isActive]);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: isActive ? "clamp(420px,56vh,560px)" : "clamp(110px,15vh,160px)",
        transition: "min-height 0.65s cubic-bezier(0.4,0,0.2,1)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        cursor: "pointer",
      }}
      onMouseEnter={() => onActivate(index)}
      onMouseLeave={() => onActivate(null)}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        loop muted playsInline preload="metadata"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          opacity: isActive ? 0.55 : 0.2,
          transition: "opacity 0.65s ease",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: isActive
          ? "linear-gradient(110deg, rgba(2,10,37,0.82) 0%, rgba(2,10,37,0.58) 65%, rgba(2,10,37,0.32) 100%)"
          : "rgba(2,10,37,0.87)",
        transition: "background 0.65s ease",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "clamp(28px,4vw,56px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        {/* Header row — always visible */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px,3vw,44px)" }}>
          <span style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: "clamp(0.6rem,0.76vw,0.68rem)",
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: isActive ? ACCENT : "rgba(255,255,255,0.3)",
            transition: "color 0.3s ease",
            flexShrink: 0,
            minWidth: "28px",
          }}>
            0{index + 1}
          </span>
          <span style={{
            fontFamily: "'Titillium Web',sans-serif",
            fontWeight: 300,
            fontSize: "clamp(2.2rem,4.8vw,5.2rem)",
            color: "#ffffff",
            letterSpacing: "-0.028em",
            lineHeight: 1,
            flex: 1,
          }}>
            {item.name}
          </span>
          <span className="svc-short-desc" style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: "clamp(0.65rem,0.82vw,0.74rem)",
            color: "rgba(255,255,255,0.38)",
            maxWidth: "300px",
            textAlign: "right" as const,
            lineHeight: 1.5,
            flexShrink: 0,
          }}>
            {item.shortDesc}
          </span>
        </div>

        {/* Expanded content */}
        <div style={{
          maxHeight: isActive ? "700px" : "0",
          overflow: "hidden",
          opacity: isActive ? 1 : 0,
          transition: `max-height ${isActive ? "0.65s" : "0.35s"} cubic-bezier(0.4,0,0.2,1), opacity ${isActive ? "0.45s ease 0.18s" : "0.2s ease"}`,
        }}>
          <div style={{ paddingTop: "clamp(24px,3.8vh,40px)", display: "grid", gridTemplateColumns: "1fr clamp(200px,38%,420px)", gap: "clamp(28px,4vw,64px)", alignItems: "start" }} className="svc-expand-grid">
            <div>
              <p style={{
                fontFamily: "'Inter',sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.78rem,0.95vw,0.9rem)",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.62)",
                margin: "0 0 clamp(18px,2.8vh,26px) 0",
                maxWidth: "560px",
              }}>
                {item.body}
              </p>
              <ul style={{ listStyle: "none", margin: "0 0 clamp(20px,3vh,28px) 0", padding: 0, display: "flex", flexDirection: "column", gap: "clamp(8px,1.2vh,11px)" }}>
                {item.bullets.map((b, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "11px", fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.7rem,0.88vw,0.82rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: "6px" }} />
                    {b}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.58rem,0.72vw,0.65rem)", color: "rgba(255,255,255,0.72)", background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "40px", padding: "4px 13px", letterSpacing: "0.02em" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Accent line / stat block */}
            <div style={{ borderLeft: `2px solid ${ACCENT}`, paddingLeft: "clamp(20px,2.8vw,36px)", opacity: 0.9 }}>
              <p style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(0.72rem,0.9vw,0.82rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: ACCENT, margin: "0 0 10px 0" }}>Key benefits</p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.68rem,0.85vw,0.78rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {item.shortDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [locale, setLocale] = useLocale();
  const t = TRANSLATIONS[locale];
  const sp = t.servicesPage;

  const [pastHero, setPastHero] = useState(false);
  const [activeSvc, setActiveSvc] = useState<number | null>(null);

  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [isFastLoader, setIsFastLoader] = useState(false);
  const pendingLocaleRef = useRef<ReturnType<typeof useLocale>[0] | null>(null);

  const handlePreloaderComplete = useCallback(() => {
    if (pendingLocaleRef.current) { setLocale(pendingLocaleRef.current); pendingLocaleRef.current = null; }
    setPreloaderVisible(false);
  }, [setLocale]);

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
    const check = () => {
      const nowPast = window.scrollY > window.innerHeight * 0.75;
      setPastHero(p => p === nowPast ? p : nowPast);
    };
    const raf = (time: number) => { lenis.raf(time); check(); id = requestAnimationFrame(raf); };
    check();
    id = requestAnimationFrame(raf);
    window.addEventListener("resize", check, { passive: true });
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.removeEventListener("resize", check); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        .shared-nav-active{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
        .shared-lang-active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        @media(max-width:768px){
          .svc-short-desc{display:none!important;}
          .svc-expand-grid{grid-template-columns:1fr!important;}
          .sectors-grid{grid-template-columns:1fr 1fr!important;}
          .process-grid{grid-template-columns:1fr 1fr!important;}
          .hero-strip{flex-direction:column!important;align-items:flex-start!important;gap:12px!important;}
          .nav-links-inner{display:none!important;}
        }
        @media(max-width:480px){
          .sectors-grid{grid-template-columns:1fr!important;}
          .process-grid{grid-template-columns:1fr!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} fast={isFastLoader} />}
      <NavBar pastHero={pastHero} locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ── Hero ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "600px", backgroundColor: NAVY, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Background image */}
        <div style={{ position: "absolute", inset: 0 }}>
          <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", opacity: 0.18 }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${NAVY} 0%, rgba(2,10,37,0.6) 50%, rgba(2,10,37,0.85) 100%)` }} />
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(24px,5vw,72px)", paddingTop: "clamp(80px,10vw,120px)" }}>

          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", animation: "fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.4s both" }}>
              {sp.hero.label}
            </p>
            <p style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(3.5rem,8vw,8rem)", lineHeight: 1, color: "rgba(255,255,255,0.06)", letterSpacing: "-0.04em", userSelect: "none", animation: "fadeIn 1s ease 0.3s both" }}>
              04
            </p>
          </div>

          {/* Main heading */}
          <div style={{ animation: "fadeUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.25s both" }}>
            <h1 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(3.8rem,9.5vw,10rem)", lineHeight: 0.93, color: "#ffffff", margin: 0, letterSpacing: "-0.03em" }}>
              {sp.hero.headingLine1}<br />
              <span style={{ color: ACCENT }}>{sp.hero.headingLine2}</span><br />
              {sp.hero.headingLine3}
            </h1>
          </div>

          {/* Bottom strip */}
          <div style={{ animation: "fadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.5s both" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.7rem,0.9vw,0.82rem)", lineHeight: 1.65, color: "rgba(255,255,255,0.45)", margin: "0 0 clamp(20px,3vh,32px) 0", maxWidth: "clamp(260px,40vw,440px)" }}>
              {sp.hero.tagline}
            </p>
            <div className="hero-strip" style={{ display: "flex", alignItems: "center", gap: "0", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "clamp(16px,2.5vh,24px)" }}>
              {sp.detail.items.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ flex: 1, paddingRight: "clamp(12px,1.8vw,24px)" }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.62vw,0.58rem)", fontWeight: 500, letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)", display: "block", marginBottom: "3px" }}>0{i + 1}</span>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.62rem,0.8vw,0.72rem)", color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>{item.name}</span>
                  </div>
                  {i < sp.detail.items.length - 1 && <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.1)", flexShrink: 0, marginRight: "clamp(12px,1.8vw,24px)" }} />}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, paddingLeft: "clamp(16px,2.5vw,32px)", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.25)" }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.65vw,0.6rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{sp.hero.scrollLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services cards ── */}
      <section style={{ backgroundColor: NAVY, padding: "clamp(56px,9vh,104px) clamp(24px,5vw,72px)" }}>
        <div style={{ marginBottom: "clamp(40px,6.5vh,72px)" }}>
          {/* Thin header bar: label | tagline */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "clamp(14px,2vh,20px)", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "clamp(20px,3vh,32px)", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: 0 }}>
              {t.services.label}
            </p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.68rem,0.85vw,0.78rem)", lineHeight: 1.6, color: "rgba(255,255,255,0.38)", maxWidth: "380px", margin: 0, textAlign: "right" as const }}>
              {t.services.tagline}
            </p>
          </div>
          {/* Bold headline statement */}
          <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.95, color: "#ffffff", letterSpacing: "var(--lp-title-ls)", margin: 0 }}>
            {t.services.headingLine1}<br />
            <span style={{ color: ACCENT }}>{t.services.headingLine2}</span> {t.services.headingLine3}
          </h2>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {sp.detail.items.map((item, i) => (
            <ServiceCard
              key={i}
              item={item}
              index={i}
              isActive={activeSvc === i}
              onActivate={setActiveSvc}
              videoSrc={SVC_VIDEO}
            />
          ))}
        </div>
      </section>

      {/* ── Sectors ── */}
      <section style={{ backgroundColor: NAVY, padding: "clamp(64px,10vh,120px) clamp(24px,5vw,72px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "clamp(16px,2.5vw,28px)", marginBottom: "clamp(40px,6.5vh,72px)" }}>
          <div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", margin: "0 0 clamp(10px,1.6vh,16px) 0" }}>
              {sp.sectors.label}
            </p>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.95, color: "#ffffff", letterSpacing: "var(--lp-title-ls)", margin: 0 }}>
              {sp.sectors.heading}
            </h2>
          </div>
          <div style={{ width: "1px", height: "clamp(40px,6vh,64px)", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
        </div>

        <div className="sectors-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(8px,1.2vw,16px)" }}>
          {sp.sectors.items.map((sector, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "clamp(24px,3.2vw,40px) clamp(20px,2.5vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(16px,2.5vh,24px)", transition: "background 0.3s ease, border-color 0.3s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <div style={{ color: ACCENT, opacity: 0.85 }}>{SECTOR_ICONS[i]}</div>
              <div>
                <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 400, fontSize: "clamp(1rem,1.4vw,1.3rem)", color: "#ffffff", margin: "0 0 clamp(8px,1.2vh,12px) 0", letterSpacing: "-0.01em" }}>{sector.title}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.68rem,0.85vw,0.78rem)", lineHeight: 1.65, color: "rgba(255,255,255,0.42)", margin: 0 }}>{sector.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process ── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(64px,10vh,120px) clamp(24px,5vw,72px)", borderTop: "1px solid rgba(2,10,37,0.05)" }}>
        <div style={{ borderTop: `3px solid ${NAVY}`, paddingTop: "clamp(28px,4.5vh,48px)", marginBottom: "clamp(48px,7.5vh,80px)" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(2,10,37,0.3)", margin: "0 0 clamp(12px,1.8vh,20px) 0" }}>
            {sp.process.label}
          </p>
          <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.95, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: 0 }}>
            {sp.process.heading}
          </h2>
        </div>

        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "clamp(1px,0.15vw,2px)" }}>
          {sp.process.steps.map((step, i) => (
            <div key={i} style={{ borderLeft: i === 0 ? "none" : "1px solid rgba(2,10,37,0.08)", padding: `0 clamp(24px,3vw,44px) clamp(24px,3.5vh,36px) ${i === 0 ? "0" : "clamp(24px,3vw,44px)"}`, position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: i === 0 ? 0 : "clamp(24px,3vw,44px)", right: 0, height: "2px", background: `linear-gradient(to right,${ACCENT},transparent)`, opacity: 0, transition: "opacity 0.4s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}
              />
              <div style={{ paddingTop: "clamp(24px,3.5vh,36px)" }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(2.5rem,4.5vw,4.5rem)", color: "rgba(2,10,37,0.07)", letterSpacing: "-0.04em", display: "block", lineHeight: 1, marginBottom: "clamp(12px,2vh,20px)" }}>{step.num}</span>
                <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 400, fontSize: "clamp(1rem,1.3vw,1.2rem)", color: NAVY, margin: "0 0 clamp(10px,1.5vh,14px) 0", letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.68rem,0.85vw,0.78rem)", lineHeight: 1.7, color: "rgba(2,10,37,0.48)", margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ backgroundColor: NAVY, padding: "clamp(48px,7.5vh,88px) clamp(24px,5vw,72px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
          {[
            { val: "40–70", unit: "m³/h", label: t.stats.items[0].label },
            { val: "200+", unit: "", label: t.stats.items[1].label },
            { val: "24h", unit: "", label: t.stats.items[2].label },
            { val: "9+", unit: "", label: t.stats.items[3].label },
          ].map((s, i) => (
            <div key={i} style={{ flex: "1 1 0", minWidth: "120px", padding: "clamp(28px,4vh,48px) clamp(20px,3vw,44px)", borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(2.2rem,4.5vw,4rem)", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "clamp(8px,1.2vh,12px)", whiteSpace: "nowrap" }}>
                {s.val}{s.unit && <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.6rem,0.8vw,0.72rem)", color: "rgba(255,255,255,0.3)", marginLeft: "5px" }}>{s.unit}</span>}
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.62rem,0.78vw,0.7rem)", color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <FooterCTA locale={locale} />
    </>
  );
}
