"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Lenis from "lenis";
import { Locale, TRANSLATIONS } from "../../translations";
import { NAVY, useLocale, useLogoFloating, Preloader, NavBar, FooterCTA, StatNum } from "../../components/shared";

// Local 4:3 product photography, ordered to match equipmentPage.items.
const EQUIPMENT_IMAGES: Array<string | null> = [
  "/images/equipment/putzmeister-p-720.avif",
  "/images/equipment/putzmeister-bsa-1005-d5.avif",
  "/images/equipment/putzmeister-sp-25-dhf.avif",
  "/images/equipment/barikell-mk8-ride-on-power-trowel.avif",
  "/images/equipment/barikell-mk8-ride-on-power-trowel.avif",
];

// Real manufacturer figures (locale-invariant — only the labels are translated,
// same split as the homepage Stats section). Engine power is rounded to the
// nearest whole kW for the count-up display (P 720: 44.5 kW, BSA 1005 D5: 55.4
// kW) — StatNum always renders integers, same as every other stat on the site.
// Putzmeister P 720: CT datasheet (2-cylinder piston pump, shotcrete/screed).
// Putzmeister BSA 1005 D5 (F80): official CT 4957-1 EN datasheet.
// Putzmeister SP 25 DHF: official MT 4997-2 EN datasheet (worm pump).
// Barikell MK8-75: twin 750mm rotors, 18hp engine, 148rpm blade speed,
// 50-500m² recommended floor size.
const EQUIPMENT_SPECS: Array<Array<{ value: number; suffix?: string; unit: string }>> = [
  [
    { value: 21, unit: "m³/h" },
    { value: 80, unit: "bar" },
    { value: 16, unit: "mm" },
    { value: 45, unit: "kW" },
  ],
  [
    { value: 52, unit: "m³/h" },
    { value: 70, unit: "bar" },
    { value: 55, unit: "kW" },
    { value: 3100, unit: "kg" },
  ],
  [
    { value: 20, unit: "m³/h" },
    { value: 35, unit: "bar" },
    { value: 8, unit: "mm" },
    { value: 37, unit: "kW" },
  ],
  [
    { value: 2, suffix: "×750", unit: "mm" },
    { value: 18, unit: "hp" },
    { value: 148, unit: "rpm" },
    { value: 50, suffix: "–500", unit: "m²" },
  ],
  [
    { value: 2, unit: "" },
    { value: 35, unit: "CP" },
    { value: 8, unit: "" },
    { value: 1, unit: "" },
  ],
];

// ─── Eyebrow — small square dot + uppercase label, same pattern as every other page ──
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

interface EquipmentSpec { value: number; suffix?: string; unit: string; label: string }
interface EquipmentItem { category: string; name: string; desc: string; specs: EquipmentSpec[]; bullets: string[] }

// ─── EquipmentBlock — media card + copy, alternating side via source order
// (not CSS `order`, so mobile always stacks media first without extra rules) ──
function EquipmentBlock({ item, image, reverse, photoPendingLabel }: { item: EquipmentItem; image: string | null; reverse: boolean; photoPendingLabel: string }) {
  const media = (
    <div style={{ borderRadius: "var(--radius)", overflow: "hidden", width: "100%", height: "auto", aspectRatio: "4 / 3", background: "#ffffff", border: `1px ${image ? "solid" : "dashed"} rgba(2,10,37,0.1)`, padding: "clamp(10px,1vw,14px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {image ? (
        <img src={image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "calc(var(--radius) - 6px)", display: "block" }} />
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(1.3rem,2vw,1.8rem)", color: "rgba(2,10,37,0.28)", letterSpacing: "-0.02em", margin: "0 0 8px 0" }}>{item.name}</p>
          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: 0 }}>{photoPendingLabel}</p>
        </div>
      )}
    </div>
  );
  const content = (
    <div>
      <div style={{ marginBottom: "clamp(16px,2.2vh,22px)" }}>
        <Eyebrow>{item.category}</Eyebrow>
      </div>
      <h2 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(1.7rem,2.8vw,2.6rem)", color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.1, margin: "0 0 clamp(14px,2vh,18px) 0" }}>{item.name}</h2>
      <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: "0 0 clamp(24px,3.2vh,30px) 0" }}>{item.desc}</p>

      <div className="grid grid-cols-2 gap-3" style={{ marginBottom: "clamp(22px,3vh,28px)" }}>
        {item.specs.map((s, i) => (
          <div key={i} className="border border-[rgba(2,10,37,0.1)] rounded-[var(--radius)]" style={{ padding: "clamp(14px,1.8vw,18px)" }}>
            <div style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(1.4rem,2vw,1.9rem)", color: NAVY, letterSpacing: "-0.02em", lineHeight: 1 }}>
              <StatNum value={s.value} suffix={s.suffix ?? ""} delay={i * 80} />
              <span style={{ fontSize: "0.52em", fontWeight: 400, color: "rgba(2,10,37,0.35)", marginLeft: "3px" }}>{s.unit}</span>
            </div>
            <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.68vw,0.64rem)", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: "6px 0 0 0" }}>{s.label}</p>
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
export default function EquipmentClient({ locale: initialLocale }: { locale: Locale }) {
  const [locale, setLocale] = useLocale(initialLocale);
  const t = TRANSLATIONS[locale];
  const ep = t.equipmentPage;
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
        .eq-bullets li{display:flex;align-items:flex-start;gap:11px;font-family:var(--font-inter),sans-serif;font-weight:400;font-size:var(--lp-body-fs);color:var(--lp-text-body);line-height:1.6;}
        .eq-dot{width:5px;height:5px;background:rgba(2,10,37,0.35);flex-shrink:0;margin-top:9px;}
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} logoFloating={logoFloating} logoFloatingTone="light" logoFloatingDesktopOnly />

      {/* ─── HERO — compact, same pattern as Projects (no full-viewport height) ── */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#ffffff", padding: "clamp(120px,15vh,168px) clamp(24px,5vw,72px) clamp(56px,8vh,84px)" }}>
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: "46%", aspectRatio: "1", background: "radial-gradient(circle, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.03) 45%, transparent 72%)", filter: "blur(10px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "clamp(20px,2.8vh,28px)", animation: "fadeUp 0.7s ease 0.1s both" }}>
            <Eyebrow>{ep.hero.label}</Eyebrow>
          </div>
          <h1 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(2.4rem,5.4vw,5.4rem)", lineHeight: 1.02, color: NAVY, margin: "0 0 clamp(20px,2.8vh,28px) 0", letterSpacing: "-0.03em", maxWidth: "900px", animation: "fadeUp 0.8s ease 0.2s both" }}>
            {ep.hero.headingLine1}<br />
            <span style={{ color: "rgba(2,10,37,0.35)" }}>{ep.hero.headingLine2}</span><br />
            {ep.hero.headingLine3}
          </h1>
          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-subtitle-fs)", lineHeight: 1.5, color: "var(--lp-text-body)", maxWidth: "560px", margin: 0, animation: "fadeUp 0.8s ease 0.3s both" }}>
            {ep.hero.tagline}
          </p>
        </div>
      </section>

      {/* ─── Equipment blocks — alternating media/copy, real spec figures ──── */}
      {items.map((item, i) => (
        <section key={item.name} style={{ backgroundColor: "#ffffff", padding: "clamp(56px,8vh,88px) clamp(24px,5vw,72px)", borderTop: i > 0 ? "1px solid rgba(2,10,37,0.06)" : "none" }}>
          <EquipmentBlock item={item} image={EQUIPMENT_IMAGES[i]} reverse={i % 2 === 1} photoPendingLabel={ep.photoPending} />
        </section>
      ))}

      <FooterCTA locale={locale} />
    </>
  );
}
