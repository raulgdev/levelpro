"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Lenis from "lenis";
import { TRANSLATIONS } from "../translations";
import { NAVY, useLocale, Preloader, NavBar, FooterCTA, RevealText, StatNum } from "../components/shared";

const EQUIPMENT_IMAGES = [
  "https://levelpro.es/wp-content/uploads/2026/07/putzmeister-p720-scaled.avif",
  "https://levelpro.es/wp-content/uploads/2026/07/Barikell-scaled.avif",
];

// Real manufacturer figures (locale-invariant — only the labels are translated,
// same split as the homepage Stats section). Putzmeister P 730: piston pump
// datasheet (output/pressure/aggregate/power). Barikell MK8-75: twin 750mm
// rotors, 18hp engine, 148rpm blade speed, 50-500m² recommended floor size.
const EQUIPMENT_SPECS: Array<Array<{ value: number; suffix?: string; unit: string }>> = [
  [
    { value: 3, suffix: "–30", unit: "m³/h" },
    { value: 55, unit: "bar" },
    { value: 32, unit: "mm" },
    { value: 55, unit: "kW" },
  ],
  [
    { value: 2, suffix: "×750", unit: "mm" },
    { value: 18, unit: "hp" },
    { value: 148, unit: "rpm" },
    { value: 50, suffix: "–500", unit: "m²" },
  ],
];

// ─── Eyebrow — small square dot + uppercase label, same pattern as every other page ──
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

interface EquipmentSpec { value: number; suffix?: string; unit: string; label: string }
interface EquipmentItem { category: string; name: string; desc: string; specs: EquipmentSpec[]; bullets: string[] }

// ─── EquipmentBlock — media card + copy, alternating side via source order
// (not CSS `order`, so mobile always stacks media first without extra rules) ──
function EquipmentBlock({ item, image, reverse }: { item: EquipmentItem; image: string; reverse: boolean }) {
  const media = (
    <div style={{ borderRadius: "var(--radius)", overflow: "hidden", height: "clamp(300px,40vh,440px)", background: "#f6f6f4", border: "1px solid rgba(2,10,37,0.1)", padding: "clamp(24px,3.5vw,44px)" }}>
      <img src={image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
    </div>
  );
  const content = (
    <div>
      <div style={{ marginBottom: "clamp(16px,2.2vh,22px)" }}>
        <Eyebrow>{item.category}</Eyebrow>
      </div>
      <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(1.7rem,2.8vw,2.6rem)", color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.1, margin: "0 0 clamp(14px,2vh,18px) 0" }}>{item.name}</h2>
      <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: "0 0 clamp(24px,3.2vh,30px) 0" }}>{item.desc}</p>

      <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "clamp(22px,3vh,28px)" }}>
        {item.specs.map((s, i) => (
          <div key={i} className="border border-[rgba(2,10,37,0.1)] rounded-[var(--radius)]" style={{ padding: "clamp(14px,1.8vw,18px)" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 200, fontSize: "clamp(1.4rem,2vw,1.9rem)", color: NAVY, letterSpacing: "-0.02em", lineHeight: 1 }}>
              <StatNum value={s.value} suffix={s.suffix ?? ""} delay={i * 80} />
              <span style={{ fontSize: "0.52em", fontWeight: 400, color: "rgba(2,10,37,0.35)", marginLeft: "3px" }}>{s.unit}</span>
            </div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.68vw,0.64rem)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: "6px 0 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <ul className="eq-bullets">
        {item.bullets.map((b, i) => (
          <li key={i}><span className="eq-dot" />{b}</li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {reverse ? <>{content}{media}</> : <>{media}{content}</>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EquipmentPage() {
  const [locale, setLocale] = useLocale();
  const t = TRANSLATIONS[locale];
  const ep = t.equipmentPage;

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

  const items: EquipmentItem[] = useMemo(() => ep.items.map((item, i) => ({
    ...item,
    specs: item.specs.map((s, si) => ({ ...EQUIPMENT_SPECS[i][si], label: s.label })),
  })), [ep.items]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap');
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
        @keyframes fadeBlurReveal{0%{opacity:0;filter:blur(10px);transform:translateY(12px);}100%{opacity:1;filter:blur(0);transform:translateY(0);}}

        .eq-bullets{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;}
        .eq-bullets li{display:flex;align-items:flex-start;gap:11px;font-family:'Inter',sans-serif;font-weight:400;font-size:var(--lp-body-fs);color:var(--lp-text-body);line-height:1.6;}
        .eq-dot{width:5px;height:5px;background:rgba(2,10,37,0.35);flex-shrink:0;margin-top:9px;}
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ─── HERO — compact, same pattern as Projects (no full-viewport height) ── */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#ffffff", padding: "clamp(120px,15vh,168px) clamp(24px,5vw,72px) clamp(56px,8vh,84px)" }}>
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: "46%", aspectRatio: "1", background: "radial-gradient(circle, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.03) 45%, transparent 72%)", filter: "blur(10px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "clamp(20px,2.8vh,28px)", animation: "fadeUp 0.7s ease 0.1s both" }}>
            <Eyebrow>{ep.hero.label}</Eyebrow>
          </div>
          <h1 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 200, fontSize: "clamp(2.4rem,5.4vw,5.4rem)", lineHeight: 1.02, color: NAVY, margin: "0 0 clamp(20px,2.8vh,28px) 0", letterSpacing: "-0.03em", maxWidth: "900px", animation: "fadeUp 0.8s ease 0.2s both" }}>
            {ep.hero.headingLine1}<br />
            <span style={{ color: "rgba(2,10,37,0.35)" }}>{ep.hero.headingLine2}</span><br />
            {ep.hero.headingLine3}
          </h1>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-subtitle-fs)", lineHeight: 1.5, color: "var(--lp-text-body)", maxWidth: "560px", margin: 0, animation: "fadeUp 0.8s ease 0.3s both" }}>
            {ep.hero.tagline}
          </p>
        </div>
      </section>

      {/* ─── INTRO — short framing line before the two feature blocks ─────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "0 clamp(24px,5vw,72px) clamp(48px,7vh,72px)" }}>
        <div style={{ marginBottom: "clamp(14px,2vh,18px)" }}>
          <Eyebrow>{ep.intro.label}</Eyebrow>
        </div>
        <RevealText as="h2" text={ep.intro.heading} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.08, color: NAVY, letterSpacing: "var(--lp-title-ls)", maxWidth: "680px", margin: "0 0 clamp(16px,2.2vh,20px) 0" }} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", maxWidth: "560px", margin: 0 }}>
          {ep.intro.tagline}
        </p>
      </section>

      {/* ─── Equipment blocks — alternating media/copy, real spec figures ──── */}
      {items.map((item, i) => (
        <section key={item.name} style={{ backgroundColor: "#ffffff", padding: "clamp(56px,8vh,88px) clamp(24px,5vw,72px)", borderTop: i > 0 ? "1px solid rgba(2,10,37,0.06)" : "none" }}>
          <EquipmentBlock item={item} image={EQUIPMENT_IMAGES[i]} reverse={i % 2 === 1} />
        </section>
      ))}

      <FooterCTA locale={locale} />
    </>
  );
}
