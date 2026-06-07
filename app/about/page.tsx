"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import { TRANSLATIONS } from "../translations";
import { NAVY, ACCENT, useLocale, Preloader, NavBar, FooterCTA } from "../components/shared";

const HERO_IMG = "https://levelpro.es/wp-content/uploads/2026/05/3.jpg";
const STORY_IMG = "https://levelpro.es/wp-content/uploads/2026/05/1-copy.avif";

// Maps to t.stats.items indices
const STATS_DATA = [
  { val: "200+", unit: "",      itemIdx: 1 },
  { val: "9+",   unit: "",      itemIdx: 3 },
  { val: "24",   unit: "h",     itemIdx: 2 },
  { val: "40–70",unit: "m³/h",  itemIdx: 0 },
];

export default function AboutPage() {
  const [locale, setLocale] = useLocale();
  const t = TRANSLATIONS[locale];
  const ap = t.aboutPage;

  const [scrollY, setScrollY] = useState(0);
  const [vh, setVh]           = useState(0);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey]         = useState(0);
  const [isFastLoader, setIsFastLoader]         = useState(false);
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
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let id: number;
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  useEffect(() => {
    const update = () => { setScrollY(window.scrollY); setVh(window.innerHeight); };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const pastHero = vh > 0 && scrollY > vh * 0.75;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:auto;}
        html.lenis,html.lenis body{height:auto;}
        .lenis.lenis-smooth{scroll-behavior:auto!important;}
        .lenis.lenis-stopped{overflow:hidden;}
        body{background-color:${NAVY};color:#fff;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${NAVY};}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px;}
        a{text-decoration:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        .shared-nav-active{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
        .shared-lang-active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        @media(max-width:900px){
          .hero-split{grid-template-columns:1fr!important;}
          .hero-photo-col{display:none!important;}
          .stats-grid{grid-template-columns:1fr 1fr!important;}
          .story-cols{grid-template-columns:1fr!important;}
          .values-row{grid-template-columns:clamp(22px,2.5vw,28px) 1fr!important;}
          .values-desc{display:none!important;}
          .milestone-row{grid-template-columns:1fr!important;}
          .nav-links-inner{display:none!important;}
        }
        @media(max-width:540px){
          .stats-grid{grid-template-columns:1fr 1fr!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} fast={isFastLoader} />}
      <NavBar pastHero={pastHero} locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ─── HERO: split navy / photo ─────────────────────────────────────── */}
      <section className="hero-split" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", height: "100vh", minHeight: "600px", overflow: "hidden" }}>

        {/* Left — navy panel */}
        <div style={{ backgroundColor: NAVY, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(24px,4.5vw,64px)", paddingTop: "clamp(80px,10vw,120px)" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", animation: "fadeUp 0.8s ease 0.4s both" }}>
              {ap.hero.label}
            </p>
            <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(3rem,5.5vw,5.5rem)", color: "rgba(255,255,255,0.05)", letterSpacing: "-0.04em", lineHeight: 1, userSelect: "none", animation: "fadeIn 1s ease 0.3s both" }}>04</span>
          </div>

          <div style={{ animation: "fadeUp 0.9s ease 0.2s both" }}>
            <h1 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(3.2rem,6.5vw,8rem)", lineHeight: 0.93, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
              {ap.hero.headingLine1}<br />
              <span style={{ color: ACCENT }}>{ap.hero.headingLine2}</span><br />
              {ap.hero.headingLine3}
            </h1>
          </div>

          <div style={{ animation: "fadeUp 0.8s ease 0.5s both" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.68rem,0.85vw,0.8rem)", lineHeight: 1.72, color: "rgba(255,255,255,0.4)", marginBottom: "clamp(20px,3vh,28px)", maxWidth: "400px" }}>
              {ap.hero.tagline}
            </p>

            {/* Three facts */}
            <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "clamp(14px,2vh,20px)" }}>
              <div style={{ paddingRight: "clamp(16px,2.5vw,32px)", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(1.1rem,1.8vw,1.7rem)", color: "#fff", letterSpacing: "-0.02em", display: "block", lineHeight: 1, marginBottom: "5px" }}>2016</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.28)" }}>{ap.hero.factLabels[1]}</span>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", alignSelf: "stretch", flexShrink: 0, marginRight: "clamp(16px,2.5vw,32px)" }} />
              <div style={{ paddingRight: "clamp(16px,2.5vw,32px)", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "clamp(0.75rem,1.1vw,1rem)", color: "#fff", display: "block", lineHeight: 1, marginBottom: "5px", letterSpacing: "0.01em" }}>Costa Blanca</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.28)" }}>{ap.hero.factLabels[0]}</span>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", alignSelf: "stretch", flexShrink: 0, marginRight: "clamp(16px,2.5vw,32px)" }} />
              <div style={{ flexShrink: 0 }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(1.1rem,1.8vw,1.7rem)", color: "#fff", letterSpacing: "-0.02em", display: "block", lineHeight: 1, marginBottom: "5px" }}>200+</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.28)" }}>{ap.hero.factLabels[2]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — photo */}
        <div className="hero-photo-col" style={{ position: "relative", overflow: "hidden" }}>
          <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(2,10,37,0.45) 0%, transparent 35%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "160px", background: "linear-gradient(to bottom, rgba(2,10,37,0.5) 0%, transparent 100%)" }} />
        </div>
      </section>

      {/* ─── STATS: editorial large numbers (inspired by Enter Engineering) ── */}
      <section style={{ backgroundColor: "#ffffff" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {STATS_DATA.map((s, i) => (
            <div key={i} style={{ padding: "clamp(28px,4.5vh,52px) clamp(20px,3.2vw,44px)", borderTop: `2px solid ${i === 0 ? ACCENT : "rgba(2,10,37,0.07)"}`, borderLeft: i > 0 ? "1px solid rgba(2,10,37,0.07)" : "none", background: i === 0 ? NAVY : "#ffffff" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "5px", marginBottom: "clamp(8px,1.2vh,12px)" }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(2.8rem,5.5vw,6rem)", color: i === 0 ? "#ffffff" : NAVY, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.val}</span>
                {s.unit && <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.65rem,0.9vw,0.82rem)", color: i === 0 ? "rgba(255,255,255,0.4)" : "rgba(2,10,37,0.3)", letterSpacing: "0.04em" }}>{s.unit}</span>}
              </div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.6rem,0.76vw,0.68rem)", fontWeight: 400, color: i === 0 ? "rgba(255,255,255,0.45)" : "rgba(2,10,37,0.42)", letterSpacing: "0.03em", margin: 0, lineHeight: 1.5 }}>
                {t.stats.items[s.itemIdx].label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STORY: full-bleed image + editorial 2-col text ─────────────── */}
      <section style={{ backgroundColor: NAVY }}>
        {/* Full-bleed image — no horizontal padding */}
        <div style={{ height: "clamp(260px,42vh,560px)", overflow: "hidden", position: "relative" }}>
          <img src={STORY_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.78) 100%)` }} />
          {/* Editorial stats overlay */}
          <div style={{ position: "absolute", bottom: "clamp(20px,3vh,32px)", left: "clamp(24px,5vw,72px)", right: "clamp(24px,5vw,72px)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(2.4rem,4.5vw,5rem)", color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1, display: "block" }}>2016</span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.62vw,0.58rem)", fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>{ap.hero.factLabels[1]}</span>
            </div>
            <div style={{ display: "flex", gap: "clamp(20px,3.5vw,44px)" }}>
              {STATS_DATA.slice(0, 2).map((s, idx) => (
                <div key={idx} style={{ textAlign: "right" as const }}>
                  <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(1.6rem,3vw,3.2rem)", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1, display: "block" }}>{s.val}{s.unit}</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.62vw,0.58rem)", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>{t.stats.items[s.itemIdx].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Text below the image */}
        <div className="story-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: "clamp(32px,5vw,80px)", padding: "clamp(48px,7vh,80px) clamp(24px,5vw,72px)" }}>
          <div>
            <div style={{ width: "2px", height: "clamp(18px,2.5vh,24px)", background: ACCENT, marginBottom: "clamp(14px,2vh,20px)" }} />
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", margin: "0 0 clamp(16px,2.2vh,22px) 0" }}>
              {ap.mission.label}
            </p>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(1.8rem,3.4vw,3.6rem)", lineHeight: 0.97, color: "#fff", letterSpacing: "-0.03em", margin: 0 }}>
              {ap.mission.heading}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2.2vh,22px)", justifyContent: "flex-end" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.76rem,0.96vw,0.88rem)", lineHeight: 1.82, color: "rgba(255,255,255,0.52)", margin: 0 }}>
              {ap.mission.body1}
            </p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.76rem,0.96vw,0.88rem)", lineHeight: 1.82, color: "rgba(255,255,255,0.36)", margin: 0 }}>
              {ap.mission.body2}
            </p>
          </div>
        </div>
      </section>

      {/* ─── VALUES: horizontal editorial list (not cards) ───────────────── */}
      <section style={{ backgroundColor: "#faf9f7", padding: "clamp(64px,10vh,112px) clamp(24px,5vw,72px)" }}>
        <div style={{ width: "2px", height: "clamp(20px,2.8vh,28px)", background: ACCENT, marginBottom: "clamp(16px,2.2vh,22px)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "clamp(28px,4.5vh,44px)", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(2,10,37,0.3)", margin: 0 }}>
            {ap.values.label}
          </p>
          <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.6rem,2.8vw,2.8rem)", lineHeight: 1.05, color: NAVY, letterSpacing: "-0.025em", margin: 0 }}>
            {ap.values.heading}
          </h2>
        </div>

        <div>
          {ap.values.items.map((item, i) => (
            <div key={i} className="values-row" style={{ display: "grid", gridTemplateColumns: "clamp(22px,2.5vw,28px) clamp(160px,28%,320px) 1fr", gap: "clamp(20px,3vw,48px)", alignItems: "baseline", borderTop: "1px solid rgba(2,10,37,0.08)", padding: "clamp(26px,4vh,42px) 0" }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.54rem,0.68vw,0.62rem)", fontWeight: 600, letterSpacing: "0.14em", color: "rgba(2,10,37,0.22)", fontVariantNumeric: "tabular-nums" }}>0{i + 1}</span>
              <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.4rem,2.6vw,2.6rem)", color: NAVY, margin: 0, letterSpacing: "-0.025em", lineHeight: 1 }}>{item.title}</h3>
              <p className="values-desc" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.72rem,0.88vw,0.82rem)", lineHeight: 1.78, color: "rgba(2,10,37,0.48)", margin: 0, maxWidth: "520px" }}>{item.desc}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(2,10,37,0.08)" }} />
        </div>
      </section>

      {/* ─── MILESTONES: editorial vertical rows ─────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px)" }}>
        <div style={{ marginBottom: "clamp(48px,7vh,80px)" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(2,10,37,0.3)", margin: "0 0 clamp(12px,1.8vh,18px) 0" }}>
            {ap.milestones.label}
          </p>
          <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(2rem,3.8vw,3.8rem)", lineHeight: 1.0, color: NAVY, letterSpacing: "-0.03em", margin: 0, maxWidth: "540px" }}>
            {ap.milestones.heading}
          </h2>
        </div>

        <div>
          {ap.milestones.items.map((item, i) => (
            <div key={i} className="milestone-row" style={{ display: "grid", gridTemplateColumns: "clamp(72px,10vw,120px) 1fr", gap: "clamp(24px,4vw,64px)", padding: "clamp(28px,4.5vh,52px) 0", borderTop: "1px solid rgba(2,10,37,0.08)", alignItems: "start" }}>
              <div style={{ paddingTop: "4px", position: "relative", borderLeft: `2px solid ${i === 0 ? ACCENT : "rgba(2,10,37,0.12)"}`, paddingLeft: "clamp(10px,1.4vw,16px)", transition: "border-color 0.4s ease" }}>
                <div style={{ position: "absolute", left: "-5px", top: "10px", width: "8px", height: "8px", borderRadius: "50%", background: i === 0 ? ACCENT : "#ffffff", border: `2px solid ${i === 0 ? ACCENT : "rgba(2,10,37,0.2)"}` }} />
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(1.8rem,3.2vw,3.4rem)", color: ACCENT, letterSpacing: "-0.04em", display: "block", lineHeight: 1 }}>{item.year}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.5rem,3vw,3rem)", color: NAVY, margin: "0 0 clamp(12px,1.8vh,18px) 0", letterSpacing: "-0.025em", lineHeight: 1.0 }}>{item.title}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.72rem,0.88vw,0.82rem)", lineHeight: 1.78, color: "rgba(2,10,37,0.5)", margin: 0, maxWidth: "520px" }}>{item.desc}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(2,10,37,0.08)" }} />
        </div>
      </section>

      <FooterCTA locale={locale} cta={ap.cta} />
    </>
  );
}
