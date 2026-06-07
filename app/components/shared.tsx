"use client";

import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, TRANSLATIONS } from "../translations";

export const NAVY = "#020A25";
export const ACCENT = "#1847F2";

// Routes match the order of nav.links in translations
const NAV_ROUTES = ["/services", "/projects", "/equipment", "/about", "/contact"];

// ─── useLocale ────────────────────────────────────────────────────────────────
export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");
  useEffect(() => {
    try {
      const s = localStorage.getItem("lp_locale") as Locale | null;
      if (s && ["en", "de", "es"].includes(s)) setLocaleState(s);
    } catch {}
  }, []);
  const setLocale = useCallback((l: Locale) => {
    try { localStorage.setItem("lp_locale", l); } catch {}
    setLocaleState(l);
  }, []);
  return [locale, setLocale] as const;
}

// ─── Preloader ────────────────────────────────────────────────────────────────
export function Preloader({ onComplete, fast = false }: { onComplete: () => void; fast?: boolean }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "exiting">("counting");
  const duration = fast ? 550 : 1500;

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else {
        t1 = setTimeout(() => {
          setPhase("exiting");
          t2 = setTimeout(onComplete, fast ? 550 : 850);
        }, fast ? 80 : 220);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exiting = phase === "exiting";
  const exitDur = fast ? 0.55 : 0.85;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: exiting ? "none" : "all" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%", backgroundColor: NAVY, transform: exiting ? "translateY(-100%)" : "translateY(0)", transition: exiting ? `transform ${exitDur}s cubic-bezier(0.76,0,0.24,1)` : "none", willChange: "transform" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "50%", backgroundColor: NAVY, transform: exiting ? "translateY(100%)" : "translateY(0)", transition: exiting ? `transform ${exitDur}s cubic-bezier(0.76,0,0.24,1)` : "none", willChange: "transform" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "clamp(14px,2.2vh,24px)", opacity: exiting ? 0 : 1, transition: exiting ? "opacity 0.22s ease" : "none" }}>
        <div style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 600, fontSize: "clamp(0.88rem,1.15vw,1rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: "#ffffff" }}>Level Pro</div>
        <div style={{ width: "clamp(130px,18vw,200px)", height: "1px", background: "rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, width: `${progress}%`, background: "rgba(255,255,255,0.75)", transition: "width 0.07s linear" }} />
        </div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.56rem,0.7vw,0.63rem)", letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", fontVariantNumeric: "tabular-nums" }}>
          {progress < 100 ? String(progress).padStart(2, "0") : "100"}
        </div>
      </div>
    </div>
  );
}

// ─── useWordReveal ────────────────────────────────────────────────────────────
export function useWordReveal() {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold: 0 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, triggered] as const;
}

// ─── RevealText ───────────────────────────────────────────────────────────────
export function RevealText({ text, delayOffset = 0, style, as: Tag = "p" }: { text: string; delayOffset?: number; style?: React.CSSProperties; as?: "p" | "span" | "h2" | "h1" }) {
  const [ref, triggered] = useWordReveal();
  const words = text.split(/\s+/);
  return (
    <Tag ref={ref as unknown as React.RefObject<HTMLParagraphElement>} style={style}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span style={{ display: "inline-block", opacity: 0, animation: triggered ? `fadeBlurReveal 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${(delayOffset + i) * 0.05}s both` : "none" }}>{word}</span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

// ─── LangSwitcher ─────────────────────────────────────────────────────────────
export function LangSwitcher({ locale, onLocaleChange, pastHero }: { locale: Locale; onLocaleChange: (l: Locale) => void; pastHero: boolean }) {
  const langs: Locale[] = ["en", "de", "es"];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: "1px", height: "13px", background: pastHero ? "rgba(2,10,37,0.14)" : "rgba(255,255,255,0.2)", marginRight: "14px", flexShrink: 0 }} />
      {langs.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.55rem)", color: pastHero ? "rgba(2,10,37,0.18)" : "rgba(255,255,255,0.2)", margin: "0 1px", userSelect: "none" }}>·</span>}
          <button onClick={() => onLocaleChange(l)} className={l === locale ? "shared-lang-active" : ""} style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.56rem,0.68vw,0.62rem)", fontWeight: l === locale ? 600 : 400, letterSpacing: "0.1em", textTransform: "uppercase", color: l === locale ? (pastHero ? NAVY : "#ffffff") : (pastHero ? "rgba(2,10,37,0.38)" : "rgba(255,255,255,0.42)"), background: "transparent", border: "none", cursor: "pointer", padding: "5px 5px", transition: "color 0.3s ease" }}>
            {l.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
export function NavBar({ pastHero, locale, onLocaleChange }: { pastHero: boolean; locale: Locale; onLocaleChange: (l: Locale) => void }) {
  const t = TRANSLATIONS[locale];
  const pathname = usePathname();
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: "clamp(56px,5.5vw,68px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px,5vw,72px)", background: pastHero ? "rgba(255,255,255,0.97)" : "transparent", backdropFilter: pastHero ? "blur(16px)" : "none", borderBottom: pastHero ? "1px solid rgba(2,10,37,0.07)" : "none", transition: "background 0.5s cubic-bezier(0.4,0,0.2,1), border-color 0.5s ease, backdrop-filter 0.5s ease" }}>
      <Link href="/" style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 600, fontSize: "clamp(0.9rem,1.2vw,1.05rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: pastHero ? NAVY : "#ffffff", transition: "color 0.5s ease" }}>Level Pro</Link>
      <div style={{ display: "flex", gap: "clamp(24px,3vw,44px)", alignItems: "center" }}>
        {t.nav.links.map((label, i) => {
          const href = NAV_ROUTES[i] ?? "#";
          const isActive = pathname === href;
          return (
            <Link key={label} href={href} className={isActive ? "shared-nav-active" : ""} style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.68rem,0.82vw,0.75rem)", fontWeight: isActive ? 500 : 400, letterSpacing: "0.04em", color: isActive ? (pastHero ? NAVY : "#ffffff") : (pastHero ? "rgba(2,10,37,0.55)" : "rgba(255,255,255,0.65)"), transition: "color 0.3s ease" }}>
              {label}
            </Link>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link href="/contact" className="btn-fill" style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.65rem,0.8vw,0.72rem)", fontWeight: 500, letterSpacing: "0.06em", color: NAVY, background: pastHero ? "transparent" : "rgba(255,255,255,0.93)", border: pastHero ? "1px solid rgba(2,10,37,0.32)" : "1px solid transparent", borderRadius: "3px", padding: "9px 20px", cursor: "pointer", transition: "background 0.5s cubic-bezier(0.4,0,0.2,1), border-color 0.5s ease", whiteSpace: "nowrap" }}>{t.nav.cta}</Link>
        <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} pastHero={pastHero} />
      </div>
    </nav>
  );
}

// ─── FooterCTA ────────────────────────────────────────────────────────────────
export function FooterCTA({ locale, cta: ctaOverride }: { locale: Locale; cta?: { label: string; heading: string; btn: string } }) {
  const t = TRANSLATIONS[locale];
  const cta = ctaOverride ?? (t as { servicesPage?: { cta: { label: string; heading: string; btn: string } } }).servicesPage?.cta ?? { label: t.footer.ctaLabel, heading: t.footer.ctaHeading, btn: t.footer.ctaBtn };
  return (
    <footer style={{ backgroundColor: NAVY, padding: "clamp(64px,10vh,120px) clamp(24px,5vw,72px) clamp(32px,4vh,56px)" }}>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "clamp(48px,7vh,88px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "clamp(24px,4vw,48px)", marginBottom: "clamp(56px,8vh,100px)" }}>
        <div>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "clamp(0.6rem,0.78vw,0.7rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 clamp(14px,2vh,22px) 0" }}>{cta.label}</p>
          <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(2.2rem,5.5vw,5.5rem)", lineHeight: 0.95, color: "#ffffff", margin: 0, letterSpacing: "-0.03em", maxWidth: "clamp(280px,60vw,800px)" }}>{cta.heading}</h2>
        </div>
        <Link href="/contact" style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.65rem,0.82vw,0.74rem)", fontWeight: 500, letterSpacing: "0.08em", color: NAVY, background: "#ffffff", border: "1px solid rgba(2,10,37,0.12)", borderRadius: "3px", padding: "12px 28px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          {cta.btn} <span>→</span>
        </Link>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "clamp(20px,2.5vh,28px)" }}>
        <Link href="/" style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 600, fontSize: "clamp(0.85rem,1.1vw,1rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>Level Pro</Link>
        <div style={{ display: "flex", gap: "clamp(20px,3vw,36px)" }}>
          {t.footer.links.map((label, i) => (
            <Link key={label} href={NAV_ROUTES[i] ?? "#"} style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.62rem,0.78vw,0.7rem)", fontWeight: 400, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{label}</Link>
          ))}
        </div>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.58rem,0.72vw,0.65rem)", color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>{t.footer.copyright}</span>
      </div>
    </footer>
  );
}
