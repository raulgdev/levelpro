"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { TRANSLATIONS } from "../translations";
import { NAVY, useLocale, Preloader, NavBar, FooterCTA, RevealText, StatNum } from "../components/shared";

const HERO_IMG = "https://levelpro.es/wp-content/uploads/2026/05/3.jpg";
const ALT_BG = "#faf9f7";

// Same clip used on the homepage's service cards — one illustrative asset
// reused everywhere, not a distinct video per service.
const VIDEO_SRC =
  "https://levelpro.venacydigital.com/wp-content/uploads/2026/04/333333benidorm-poniente-beach-aerial-flyover-mediterra-2026-02-24-23-51-33-utc.mp4";

// Real Level Pro figures, in the same order as sp.stats.items below:
// Projects completed / Service locations / Rapid site mobilization.
const STAT_VALUES = [1500, 3, 24] as const;
const STAT_SUFFIX = ["+", "", "h"] as const;

// ─── Eyebrow — small square dot + uppercase label, same pattern as About ────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

// ─── ServicesScroll — sticky media panel + scrolling detail list. The panel is
// a plain, static looping clip (same treatment as the equipment/mission photo
// blocks elsewhere on the site — no overlay chrome) ──────────────────────────
interface ServiceDetailItem { name: string; body: string; bullets: string[] }

function ServicesScroll({ items }: { items: ServiceDetailItem[] }) {
  return (
    <div className="svc-split">
      <div className="svc-split-visual">
        <div className="svc-visual-frame">
          <video className="svc-visual-video" autoPlay muted loop playsInline aria-hidden>
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="svc-list">
        {items.map((item, i) => (
          <div key={item.name} className="svc-block">
            {/* Mobile-only — .svc-split-visual isn't sticky once the layout
                stacks below 840px, so each block carries its own video instead
                of relying on that shared panel. */}
            <div className="svc-block-mvisual" aria-hidden>
              <video className="svc-block-mvisual-video" autoPlay muted loop playsInline preload="metadata">
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            </div>

            <div className="svc-block-head">
              <span className="svc-block-index">0{i + 1}</span>
              <h3 className="svc-block-name">{item.name}</h3>
            </div>

            <p className="svc-block-body">{item.body}</p>

            <div className="svc-specs">
              {item.bullets.map((b, bi) => (
                <div key={bi} className="svc-spec">
                  <span className="svc-spec-mark" aria-hidden />
                  <span className="svc-spec-text">{b}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [locale, setLocale] = useLocale();
  const t = TRANSLATIONS[locale];
  const sp = t.servicesPage;

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

  // Light-toned page from the very top (no dark hero) — nav stays "dark text" throughout.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    let id: number;
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:auto;touch-action:manipulation;}
        html.lenis,html.lenis body{height:auto;}
        .lenis.lenis-smooth{scroll-behavior:auto!important;}
        .lenis.lenis-stopped{overflow:hidden;}
        body{background-color:#ffffff;color:${NAVY};overflow-x:hidden;overscroll-behavior:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:#ffffff;}
        ::-webkit-scrollbar-thumb{background:rgba(2,10,37,0.15);border-radius:2px;}
        a{text-decoration:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes fadeBlurReveal{0%{opacity:0;filter:blur(10px);transform:translateY(12px);}100%{opacity:1;filter:blur(0);transform:translateY(0);}}

        /* ── Services split-scroll — sticky media panel + spec list. Deliberately
           built from the same pieces used elsewhere on the site rather than a
           one-off look: the equipment-page media card (rounded corners, no chrome),
           the homepage service-card tab switcher (plain text, bold+navy when
           active), the Locations-card index style, and the equipment page's
           bordered bullet grid. ── */
        .svc-split{display:grid;grid-template-columns:minmax(320px,2fr) minmax(0,3fr);gap:clamp(56px,7vw,120px);align-items:start;padding:0 clamp(24px,5vw,72px);}

        .svc-split-visual{position:sticky;top:clamp(96px,13vh,132px);height:max(420px,calc(100vh - clamp(96px,13vh,132px) * 2));}
        .svc-visual-frame{position:relative;height:100%;width:100%;border-radius:var(--radius);overflow:hidden;background:rgba(2,10,37,0.06);}
        .svc-visual-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}

        .svc-list{display:flex;flex-direction:column;border-top:1px solid rgba(2,10,37,0.08);}
        .svc-block{padding:clamp(56px,9vh,96px) 0;}
        .svc-block+.svc-block{border-top:1px solid rgba(2,10,37,0.08);}

        .svc-block-head{display:flex;align-items:flex-end;gap:clamp(14px,1.8vw,20px);margin-bottom:clamp(20px,2.8vh,26px);}
        .svc-block-index{font-family:'Inter',sans-serif;font-weight:500;font-size:clamp(0.62rem,0.76vw,0.7rem);letter-spacing:0.14em;color:var(--lp-text-meta);padding-bottom:clamp(8px,1.2vh,12px);}
        .svc-block-name{font-family:'Inter',sans-serif;font-weight:300;font-size:clamp(1.9rem,3.4vw,2.9rem);color:${NAVY};letter-spacing:-0.02em;line-height:1.08;margin:0;}

        .svc-block-body{font-family:'Inter',sans-serif;font-weight:400;font-size:var(--lp-subtitle-fs);line-height:1.6;color:var(--lp-text-body);max-width:58ch;margin:0 0 clamp(28px,3.6vh,36px) 0;}

        .svc-specs{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;max-width:680px;}
        .svc-spec{display:flex;align-items:flex-start;gap:11px;background:rgba(2,10,37,0.025);border:1px solid rgba(2,10,37,0.08);border-radius:var(--radius-sm);padding:clamp(14px,1.6vw,17px) clamp(16px,1.8vw,18px);transition:background 0.25s ease,border-color 0.25s ease;}
        .svc-spec:hover{background:rgba(2,10,37,0.05);border-color:rgba(2,10,37,0.14);}
        .svc-spec-mark{width:5px;height:5px;background:${NAVY};flex-shrink:0;margin-top:7px;}
        .svc-spec-text{font-family:'Inter',sans-serif;font-weight:500;font-size:clamp(0.82rem,0.88vw,0.89rem);line-height:1.4;color:${NAVY};}

        .svc-block-mvisual{display:none;}
        @media(max-width:840px){
          .svc-split{grid-template-columns:1fr;padding:0 clamp(20px,5vw,32px);}
          /* The sticky sidebar isn't sticky once the layout stacks, so it's
             dropped here in favour of the per-block video below instead of
             shipping a visual that would just sit there doing nothing. */
          .svc-split-visual{display:none;}
          .svc-block{padding:clamp(36px,7vh,48px) 0;}
          .svc-block-body,.svc-specs{max-width:none;}
          .svc-block-mvisual{display:block;position:relative;height:clamp(200px,58vw,260px);border-radius:var(--radius);overflow:hidden;background:rgba(2,10,37,0.06);margin-bottom:clamp(22px,4.5vh,30px);}
          .svc-block-mvisual-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
        }

        /* ── Stats row — same divided count-up row used on About/Home ── */
        .stats-row{display:flex;}
        .stat-block{flex:1;min-width:0;padding:clamp(32px,4.5vw,60px) clamp(20px,3vw,48px);border-left:1px solid rgba(2,10,37,0.08);position:relative;}
        .stat-block:first-child{border-left:none;padding-left:0;}
        .stat-val{font-family:'Inter',sans-serif;font-weight:200;font-size:clamp(3rem,6vw,5.5rem);color:${NAVY};letter-spacing:-0.03em;line-height:1;margin:0 0 clamp(8px,1.2vh,14px) 0;}
        .stat-label{font-family:'Inter',sans-serif;font-size:clamp(0.74rem,0.85vw,0.8rem);color:var(--lp-text-meta);letter-spacing:0.01em;line-height:1.5;}
        @media(max-width:640px){
          .stat-block{padding:clamp(20px,5vw,32px) 0!important;border-left:none!important;border-top:1px solid rgba(2,10,37,0.08)!important;}
          .stat-block:first-child{border-top:none!important;padding-top:0!important;}
          .stats-row{flex-direction:column!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ─── HERO: spacious white intro, same pattern as About ─────────────── */}
      <section style={{ position: "relative", minHeight: "clamp(620px,86vh,860px)", overflow: "hidden", backgroundColor: "#ffffff" }}>
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: "46%", aspectRatio: "1", background: `radial-gradient(circle, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.03) 45%, transparent 72%)`, filter: "blur(10px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "clamp(120px,15vh,168px) clamp(24px,5vw,72px) 0" }}>
          <div style={{ animation: "fadeUp 0.7s ease 0.1s both", marginBottom: "clamp(20px,2.8vh,28px)" }}>
            <Eyebrow>{sp.hero.label}</Eyebrow>
          </div>
          <h1 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 200, fontSize: "clamp(2.6rem,6.2vw,6.2rem)", lineHeight: 1.0, color: NAVY, margin: 0, letterSpacing: "-0.03em", maxWidth: "900px", animation: "fadeUp 0.8s ease 0.2s both" }}>
            {sp.hero.headingLine1}<br />
            <span style={{ color: "rgba(2,10,37,0.35)" }}>{sp.hero.headingLine2}</span><br />
            {sp.hero.headingLine3}
          </h1>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: "clamp(32px,5vh,56px)", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 clamp(24px,5vw,72px)", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", animation: "fadeIn 1s ease 0.6s both" }}>
            <span style={{ width: "1px", height: "22px", background: "rgba(2,10,37,0.22)" }} />
            <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(2,10,37,0.4)" }}>{sp.hero.scrollLabel}</span>
          </div>
          <p className="hidden lg:block" style={{ fontFamily: "'Inter',sans-serif", fontSize: "var(--lp-subtitle-fs)", lineHeight: 1.5, maxWidth: "460px", textAlign: "right", margin: 0, animation: "fadeUp 0.8s ease 0.5s both" }}>
            {(() => {
              const parts = sp.hero.tagline.split(" — ");
              const [lead, rest] = parts.length === 2 ? parts : [sp.hero.tagline, ""];
              return (
                <>
                  <span style={{ color: NAVY, fontWeight: 500 }}>{lead}</span>{" "}
                  {rest && <span style={{ color: "var(--lp-text-meta)" }}>— {rest}</span>}
                </>
              );
            })()}
          </p>
        </div>
      </section>

      {/* ─── SERVICES: intro statement + the sticky split-scroll list ──────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(72px,11vh,128px) 0 clamp(24px,4vh,40px)" }}>
        <div style={{ padding: "0 clamp(24px,5vw,72px)" }}>
          <div style={{ marginBottom: "clamp(20px,2.8vh,28px)" }}>
            <Eyebrow>{sp.tech.label}</Eyebrow>
          </div>
          <RevealText as="h2" text={sp.tech.heading} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.05, color: NAVY, letterSpacing: "var(--lp-title-ls)", maxWidth: "720px", margin: "0 0 clamp(20px,2.8vh,26px) 0" }} />
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", maxWidth: "620px", margin: 0 }}>
            {sp.tech.intro}
          </p>
        </div>

        <div style={{ marginTop: "clamp(40px,6vh,64px)" }}>
          <ServicesScroll items={sp.detail.items} />
        </div>
      </section>

      {/* ─── Mission — statement + photo, link to About ─────────────────────── */}
      <section style={{ backgroundColor: ALT_BG, padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div style={{ marginBottom: "clamp(20px,2.8vh,28px)" }}>
              <Eyebrow>{sp.mission.label}</Eyebrow>
            </div>
            <RevealText as="h2" text={sp.mission.heading} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.08, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: "0 0 clamp(24px,3.4vh,32px) 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2.2vh,22px)", marginBottom: "clamp(26px,3.5vh,34px)" }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                {sp.mission.body1}
              </p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                {sp.mission.body2}
              </p>
            </div>
            <Link href="/about" className="inline-flex items-center gap-[9px] hover:gap-[13px] border-b border-[rgba(2,10,37,0.3)] hover:border-[#020A25] pb-1 transition-all duration-300" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.72rem,0.86vw,0.8rem)", letterSpacing: "0.02em", color: NAVY }}>
              {sp.mission.btn} <span aria-hidden>→</span>
            </Link>
          </div>
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", height: "clamp(340px,46vh,500px)" }}>
            <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── Process — Our Approach, 4-step cards ── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px)" }}>
        <div style={{ marginBottom: "clamp(40px,6vh,64px)" }}>
          <div style={{ marginBottom: "clamp(16px,2.4vh,24px)" }}>
            <Eyebrow>{sp.process.label}</Eyebrow>
          </div>
          <RevealText as="h2" text={sp.process.heading} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.98, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: 0 }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {sp.process.steps.map((step, i) => (
            <div key={i} className="bg-white border border-[rgba(2,10,37,0.1)] rounded-[var(--radius)] flex flex-col" style={{ padding: "clamp(26px,3vw,38px)", minHeight: "clamp(200px,24vh,260px)" }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(2.2rem,3.6vw,3.4rem)", color: NAVY, opacity: 0.28, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "auto" }}>{step.num}</span>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-h3-fs)", color: NAVY, margin: "clamp(20px,3vh,30px) 0 clamp(10px,1.5vh,14px) 0", letterSpacing: "-0.01em" }}>{step.title}</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats — same divided count-up row as About/Home ── */}
      <section style={{ backgroundColor: ALT_BG, padding: "clamp(56px,8vh,90px) clamp(24px,5vw,72px)" }}>
        <div style={{ marginBottom: "clamp(32px,4.5vh,52px)" }}>
          <Eyebrow>{sp.stats.label}</Eyebrow>
        </div>
        <div className="stats-row" style={{ borderTop: "1px solid rgba(2,10,37,0.08)" }}>
          {STAT_VALUES.map((val, i) => (
            <div key={i} className="stat-block">
              <div className="stat-val">
                <StatNum value={val} suffix={STAT_SUFFIX[i]} delay={i * 100} />
              </div>
              <p className="stat-label">{sp.stats.items[i].label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Locations — light minimal cards ── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px)" }}>
        <div style={{ marginBottom: "clamp(40px,6vh,64px)" }}>
          <div style={{ marginBottom: "clamp(16px,2.4vh,24px)" }}>
            <Eyebrow>{sp.locations.label}</Eyebrow>
          </div>
          <RevealText as="h2" text={sp.locations.heading} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.98, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: 0 }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {sp.locations.items.map((loc, i) => (
            <div key={i} className="bg-white border border-[rgba(2,10,37,0.1)] rounded-[var(--radius)] flex flex-col" style={{ padding: "clamp(28px,3vw,42px)", minHeight: "clamp(220px,26vh,280px)" }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.6rem,0.74vw,0.68rem)", letterSpacing: "0.14em", color: "var(--lp-text-meta)" }}>0{i + 1}</span>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "clamp(1.5rem,2.4vw,2.1rem)", color: NAVY, margin: "clamp(20px,3vh,28px) 0 clamp(12px,1.8vh,16px) 0", letterSpacing: "-0.02em", marginTop: "auto" }}>{loc.name}</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>{loc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA + Footer — the only navy on the page ── */}
      <FooterCTA locale={locale} />
    </>
  );
}
