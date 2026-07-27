"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { Locale, TRANSLATIONS } from "../../translations";
import { NAVY, useLocale, useLogoFloating, Preloader, NavBar, FooterCTA, RevealText, StatNum, navHref } from "../../components/shared";

const HERO_IMG = "/images/services/mission.avif";
const STORY_IMG = "https://levelpro.es/wp-content/uploads/2026/05/1-copy.avif";

// Real Level Pro figures, same values/order as the homepage Stats section —
// keeps the count-up numbers identical across pages.
const STATS_DATA = [
  { val: 40, suffix: "–70", unit: "m³/h", itemIdx: 0 },
  { val: 1500, suffix: "+", unit: "", itemIdx: 1 },
  { val: 24, suffix: "h", unit: "", itemIdx: 2 },
];

// ─── Eyebrow — small square dot + uppercase label, the same bullet+label
// pattern services/page.tsx uses site-wide ───────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

export default function AboutClient({ locale: initialLocale }: { locale: Locale }) {
  const [locale, setLocale] = useLocale(initialLocale);
  const t = TRANSLATIONS[locale];
  const ap = t.aboutPage;
  const logoFloating = useLogoFloating();

  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey]         = useState(0);
  const [isFastLoader, setIsFastLoader]         = useState(false);
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

  // Splits the tagline at the em-dash into a bold lead clause + a lighter
  // trailing clause, for the two-tone caption style.
  const [taglineLead, taglineRest] = (() => {
    const parts = ap.hero.tagline.split(" — ");
    return parts.length === 2 ? [parts[0], parts[1]] : [ap.hero.tagline, ""];
  })();

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
        .shared-nav-active{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
        .shared-lang-active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        /* ── Stats row — copied 1:1 from the homepage Stats section (breakpoint kept in sync with it) ── */
        .stats-row{display:flex;}
        .stat-block{flex:1;min-width:0;padding:clamp(32px,4.5vw,60px) clamp(20px,3vw,48px);border-left:1px solid rgba(2,10,37,0.08);position:relative;}
        .stat-block:first-child{border-left:none;padding-left:0;}
        .stat-val{font-family:var(--font-inter),sans-serif;font-weight:200;font-size:clamp(3rem,6vw,5.5rem);color:${NAVY};letter-spacing:-0.03em;line-height:1;margin:0 0 clamp(8px,1.2vh,14px) 0;}
        .stat-label{font-family:var(--font-inter),sans-serif;font-size:clamp(0.74rem,0.85vw,0.8rem);color:var(--lp-text-meta);letter-spacing:0.01em;line-height:1.5;}
        .stat-rule{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,${NAVY},transparent);opacity:0;transition:opacity 0.5s ease;}
        .stat-block:hover .stat-rule{opacity:1;}
        @media(max-width:640px){
          .stat-block{padding:clamp(20px,5vw,32px) 0!important;border-left:none!important;border-top:1px solid rgba(2,10,37,0.08)!important;}
          .stat-block:first-child{border-top:none!important;padding-top:clamp(20px,5vw,32px)!important;}
          .stats-row{flex-direction:column!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} logoFloating={logoFloating} logoFloatingTone="light" logoFloatingDesktopOnly />

      {/* ─── HERO: spacious white intro — heading top-left, soft accent glow,
          two-tone caption + scroll cue bottom, no CTA clutter ─────────────── */}
      <section style={{ position: "relative", minHeight: "clamp(620px,86vh,860px)", overflow: "hidden", backgroundColor: "#ffffff" }}>
        {/* Soft navy glow, top-right — the page's one decorative flourish */}
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: "46%", aspectRatio: "1", background: `radial-gradient(circle, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.03) 45%, transparent 72%)`, filter: "blur(10px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "clamp(120px,15vh,168px) clamp(24px,5vw,72px) 0" }}>
          <div style={{ animation: "fadeUp 0.7s ease 0.1s both", marginBottom: "clamp(20px,2.8vh,28px)" }}>
            <Eyebrow>{ap.hero.label}</Eyebrow>
          </div>
          <h1 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(2.6rem,6.2vw,6.2rem)", lineHeight: 1.0, color: NAVY, margin: 0, letterSpacing: "-0.03em", maxWidth: "900px", animation: "fadeUp 0.8s ease 0.2s both" }}>
            {ap.hero.headingLine1}<br />
            <span style={{ color: "rgba(2,10,37,0.35)" }}>{ap.hero.headingLine2}</span><br />
            {ap.hero.headingLine3}
          </h1>
        </div>

        {/* Bottom row: scroll cue (left) + two-tone caption (right) */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "clamp(32px,5vh,56px)", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 clamp(24px,5vw,72px)", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", animation: "fadeIn 1s ease 0.6s both" }}>
            <span style={{ width: "1px", height: "22px", background: "rgba(2,10,37,0.22)" }} />
            <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(2,10,37,0.4)" }}>{ap.hero.scrollLabel}</span>
          </div>
          <p className="hidden lg:block" style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "var(--lp-subtitle-fs)", lineHeight: 1.5, maxWidth: "440px", textAlign: "right", margin: 0, animation: "fadeUp 0.8s ease 0.5s both" }}>
            <span style={{ color: NAVY, fontWeight: 500 }}>{taglineLead}</span>{" "}
            {taglineRest && <span style={{ color: "var(--lp-text-meta)" }}>— {taglineRest}</span>}
          </p>
        </div>
      </section>

      {/* ─── Full-bleed photo — plain, no overlay/text ───────────────────── */}
      <div style={{ height: "clamp(280px,50vh,580px)", overflow: "hidden" }}>
        <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }} />
      </div>

      {/* ─── CAPABILITIES: positioning statement + proof numbers ─────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px) clamp(24px,3vh,32px)" }}>
        <div className="flex flex-col items-start gap-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3" style={{ marginBottom: "clamp(20px,2.8vh,28px)" }}>
          <Eyebrow>{t.stats.label}</Eyebrow>
          <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.68rem,0.8vw,0.76rem)", color: "var(--lp-text-meta)", letterSpacing: "0.02em" }}>
            {ap.hero.factLabels[0]}: <strong style={{ color: NAVY, fontWeight: 600 }}>Costa Blanca</strong>
          </span>
        </div>
        <RevealText as="h2" text={t.stats.heading} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.08, color: NAVY, letterSpacing: "var(--lp-title-ls)", maxWidth: "700px", margin: "0 0 clamp(22px,3vh,30px) 0" }} />
        <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", maxWidth: "620px", margin: "0 0 clamp(24px,3.2vh,32px) 0" }}>
          {t.about.body}
        </p>
        <Link href={navHref(locale, "projects")} className="inline-flex items-center gap-[9px] hover:gap-[13px] border-b border-[rgba(2,10,37,0.3)] hover:border-[#020A25] pb-1 transition-all duration-300" style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.72rem,0.86vw,0.8rem)", letterSpacing: "0.02em", color: NAVY }}>{t.hero.ctaSecondary} <span aria-hidden>→</span></Link>
      </section>

      {/* ─── STATS: same divided count-up row as the homepage Stats section ──── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(40px,6vh,64px) clamp(24px,5vw,72px) clamp(56px,7vh,80px)" }}>
        <div className="stats-row" style={{ borderTop: "1px solid rgba(2,10,37,0.08)" }}>
          {STATS_DATA.map((s, i) => (
            <div key={i} className="stat-block">
              <div className="stat-rule" />
              <div className="stat-val">
                <StatNum value={s.val} suffix={s.suffix} delay={i * 100} />
                {s.unit && <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(1.2rem,1.6vw,1.44rem)", fontWeight: 400, color: "rgba(2,10,37,0.48)", letterSpacing: "0.08em", marginLeft: "4px" }}>{s.unit}</span>}
              </div>
              <p className="stat-label">{t.stats.items[s.itemIdx].label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OUR STORY: text beside photo, side by side ──────────────────── */}
      <section style={{ backgroundColor: "#faf9f7", padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div style={{ marginBottom: "clamp(20px,2.8vh,28px)" }}>
              <Eyebrow>{ap.mission.label}</Eyebrow>
            </div>
            <RevealText as="h2" text={ap.mission.heading} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.08, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: "0 0 clamp(24px,3.4vh,32px) 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2.2vh,22px)" }}>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                {ap.mission.body1}
              </p>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                {ap.mission.body2}
              </p>
            </div>
          </div>
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", height: "clamp(340px,46vh,500px)" }}>
            <img src={STORY_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ─── JOURNEY: editorial vertical rows, numbered (no calendar dates) ──── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px)" }}>
        <div style={{ marginBottom: "clamp(48px,7vh,80px)" }}>
          <div style={{ marginBottom: "clamp(12px,1.8vh,18px)" }}>
            <Eyebrow>{ap.milestones.label}</Eyebrow>
          </div>
          <RevealText as="h2" text={ap.milestones.heading} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.0, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: 0, maxWidth: "540px" }} />
        </div>

        <div>
          {ap.milestones.items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-[clamp(72px,10vw,120px)_1fr] gap-3 lg:gap-14 border-t border-[rgba(2,10,37,0.08)] items-start" style={{ padding: "clamp(28px,4.5vh,52px) 0" }}>
              <div style={{ paddingTop: "6px" }}>
                <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(0.9rem,1.4vw,1.2rem)", color: NAVY, letterSpacing: "-0.01em", display: "block", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>0{i + 1}</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(1.5rem,3vw,3rem)", color: NAVY, margin: "0 0 clamp(12px,1.8vh,18px) 0", letterSpacing: "-0.025em", lineHeight: 1.0 }}>{item.title}</h3>
                <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0, maxWidth: "520px" }}>{item.desc}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-[rgba(2,10,37,0.08)]" />
        </div>
      </section>

      {/* ─── OUR WAY: sticky left label, stacked value rows on the right ──── */}
      <section style={{ backgroundColor: "#faf9f7", padding: "clamp(72px,11vh,128px) clamp(24px,5vw,72px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.5fr] gap-8 lg:gap-16 items-start">
          <div className="static lg:sticky" style={{ top: "clamp(88px,10vh,120px)" }}>
            <div style={{ marginBottom: "clamp(14px,2vh,20px)" }}>
              <Eyebrow>{ap.values.label}</Eyebrow>
            </div>
            <RevealText as="h2" text={ap.values.heading} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.08, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: 0, maxWidth: "360px" }} />
          </div>
          <div>
            {ap.values.items.map((item, i) => (
              <div key={i} className="border-t border-[rgba(2,10,37,0.1)]" style={{ padding: "clamp(26px,3.8vh,36px) 0" }}>
                <h3 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(1.25rem,2vw,1.7rem)", color: NAVY, margin: "0 0 clamp(8px,1.1vh,12px) 0", letterSpacing: "-0.02em" }}>{item.title}</h3>
                <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0, maxWidth: "560px" }}>{item.desc}</p>
              </div>
            ))}
            <div className="border-t border-[rgba(2,10,37,0.1)]" />
          </div>
        </div>
      </section>

      <FooterCTA locale={locale} cta={ap.cta} />
    </>
  );
}
