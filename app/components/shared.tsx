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
export function Preloader({ onComplete, onCovered, fast = false }: { onComplete: () => void; onCovered?: () => void; fast?: boolean }) {
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
        // Fully covering the viewport here — swap underlying content (e.g. locale)
        // now, while it's hidden, so the reveal shows the final state with no flash.
        onCovered?.();
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

// ─── Nav styles ───────────────────────────────────────────────────────────────
// Self-contained: the NavBar injects this once, so it renders identically on every
// page without depending on per-page <style> blocks. Light/dark is driven by a
// [data-tone] attribute — "light" over the dark hero, "dark" over glass / overlay.
const NAV_CSS = `
.lpnav-logo{font-family:'General Sans','Inter',sans-serif;font-weight:600;font-size:clamp(0.9rem,1.2vw,1.05rem);letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;transition:color 0.45s ease;}
.lpnav-links{display:flex;gap:clamp(22px,3vw,42px);align-items:center;}
.lpnav-link{position:relative;font-family:'General Sans','Inter',sans-serif;font-size:clamp(0.7rem,0.84vw,0.78rem);font-weight:500;letter-spacing:0.01em;text-decoration:none;padding:4px 0;transition:color 0.3s ease;}
.lpnav-link::after{content:'';position:absolute;left:0;bottom:-2px;height:1px;width:100%;transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);}
.lpnav-link:hover::after,.lpnav-link[aria-current="page"]::after{transform:scaleX(1);}
.lpnav-right{display:flex;align-items:center;gap:clamp(10px,1.4vw,18px);}
.lpnav-cta{font-family:'General Sans','Inter',sans-serif;font-size:clamp(0.65rem,0.8vw,0.72rem);font-weight:500;letter-spacing:0.06em;border-radius:100px;padding:9px 22px;cursor:pointer;white-space:nowrap;text-decoration:none;border:1px solid transparent;transition:background 0.45s cubic-bezier(0.4,0,0.2,1),color 0.4s ease,border-color 0.45s ease;}

.lpnav[data-tone="light"] .lpnav-logo{color:#ffffff;}
.lpnav[data-tone="light"] .lpnav-link{color:rgba(255,255,255,0.7);}
.lpnav[data-tone="light"] .lpnav-link:hover,.lpnav[data-tone="light"] .lpnav-link[aria-current="page"]{color:#ffffff;}
.lpnav[data-tone="light"] .lpnav-link::after{background:#ffffff;}
.lpnav[data-tone="light"] .lpnav-cta{color:#ffffff;background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.38);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}
.lpnav[data-tone="light"] .lpnav-cta:hover{background:#ffffff;color:${NAVY};border-color:#ffffff;}
.lpnav[data-tone="light"] .lpnav-burger{color:#ffffff;}

.lpnav[data-tone="dark"] .lpnav-logo{color:${NAVY};}
.lpnav[data-tone="dark"] .lpnav-link{color:rgba(2,10,37,0.55);}
.lpnav[data-tone="dark"] .lpnav-link:hover,.lpnav[data-tone="dark"] .lpnav-link[aria-current="page"]{color:${NAVY};}
.lpnav[data-tone="dark"] .lpnav-link::after{background:${NAVY};}
.lpnav[data-tone="dark"] .lpnav-cta{color:${NAVY};background:rgba(2,10,37,0.05);border-color:rgba(2,10,37,0.2);}
.lpnav[data-tone="dark"] .lpnav-cta:hover{background:${NAVY};color:#ffffff;border-color:${NAVY};}
.lpnav[data-tone="dark"] .lpnav-burger{color:${NAVY};}

/* Glass pill holding the nav links + the solid CONTACT button (no shadows — fine
   border + backdrop-blur only). Both adapt to the light/dark tone. */
.lpnav-pill{display:flex;align-items:center;gap:clamp(18px,2.2vw,34px);border-radius:100px;padding:clamp(9px,0.85vw,12px) clamp(20px,1.8vw,28px);border:1px solid transparent;transition:background 0.5s cubic-bezier(0.4,0,0.2,1),border-color 0.5s ease;}
.lpnav[data-tone="light"] .lpnav-pill{background:rgba(44,44,46,0.4);border-color:rgba(255,255,255,0.16);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);}
.lpnav[data-tone="dark"] .lpnav-pill{background:rgba(255,255,255,0.66);border-color:rgba(2,10,37,0.08);backdrop-filter:blur(16px) saturate(150%);-webkit-backdrop-filter:blur(16px) saturate(150%);}
.lpnav-contact{font-family:'General Sans','Inter',sans-serif;font-size:clamp(0.62rem,0.76vw,0.7rem);font-weight:600;letter-spacing:0.12em;text-transform:uppercase;border-radius:100px;padding:clamp(11px,1vw,14px) clamp(22px,1.9vw,30px);text-decoration:none;border:1px solid transparent;white-space:nowrap;transition:background 0.45s ease,color 0.4s ease,border-color 0.45s ease;}
.lpnav[data-tone="light"] .lpnav-contact{background:#ffffff;color:${NAVY};border-color:#ffffff;}
.lpnav[data-tone="light"] .lpnav-contact:hover{background:rgba(255,255,255,0.85);}
.lpnav[data-tone="dark"] .lpnav-contact{background:#1e1e20;color:#ffffff;border-color:#1e1e20;}
.lpnav[data-tone="dark"] .lpnav-contact:hover{background:#2c2c2f;}

.lpnav-burger{display:none;width:42px;height:42px;margin-right:-9px;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:none;border:none;padding:0;cursor:pointer;transition:color 0.45s ease;}
.lpnav-burger span{display:block;width:22px;height:1.5px;background:currentColor;border-radius:2px;transition:transform 0.42s cubic-bezier(0.4,0,0.2,1),opacity 0.3s ease;}
.lpnav-burger[data-open="true"] span:first-child{transform:translateY(3.75px) rotate(45deg);}
.lpnav-burger[data-open="true"] span:last-child{transform:translateY(-3.75px) rotate(-45deg);}

.lpnav-lang{display:inline-flex;align-items:center;}
.lpnav-lang-rule{width:1px;height:13px;margin-right:14px;flex-shrink:0;}
.lpnav-lang-sep{font-family:'Inter',sans-serif;font-size:clamp(0.5rem,0.6vw,0.55rem);margin:0 1px;user-select:none;}
.lpnav-lang-btn{font-family:'Inter',sans-serif;font-size:clamp(0.56rem,0.68vw,0.62rem);font-weight:400;letter-spacing:0.1em;text-transform:uppercase;background:none;border:none;cursor:pointer;padding:5px 5px;transition:color 0.3s ease;}
.lpnav-lang-btn.is-active{font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
.lpnav-lang--lg .lpnav-lang-btn{font-size:clamp(0.82rem,3.6vw,0.95rem);padding:8px 9px;}
[data-tone="light"] .lpnav-lang-rule{background:rgba(255,255,255,0.22);}
[data-tone="light"] .lpnav-lang-sep{color:rgba(255,255,255,0.25);}
[data-tone="light"] .lpnav-lang-btn{color:rgba(255,255,255,0.5);}
[data-tone="light"] .lpnav-lang-btn:hover{color:#ffffff;}
[data-tone="light"] .lpnav-lang-btn.is-active{color:#ffffff;}
[data-tone="dark"] .lpnav-lang-rule{background:rgba(2,10,37,0.14);}
[data-tone="dark"] .lpnav-lang-sep{color:rgba(2,10,37,0.2);}
[data-tone="dark"] .lpnav-lang-btn{color:rgba(2,10,37,0.4);}
[data-tone="dark"] .lpnav-lang-btn:hover{color:${NAVY};}
[data-tone="dark"] .lpnav-lang-btn.is-active{color:${NAVY};}

.lpnav-overlay{position:fixed;inset:0;z-index:150;display:flex;flex-direction:column;padding:calc(clamp(56px,5.5vw,68px) + clamp(18px,3vh,30px)) clamp(24px,7vw,56px) clamp(34px,6vh,54px);background:rgba(244,244,246,0.72);backdrop-filter:blur(26px) saturate(160%);-webkit-backdrop-filter:blur(26px) saturate(160%);opacity:0;pointer-events:none;transition:opacity 0.42s ease;}
.lpnav-overlay[data-open="true"]{opacity:1;pointer-events:auto;}
.lpnav-panel{margin:auto 0;display:flex;flex-direction:column;gap:clamp(2px,1vh,8px);}
.lpnav-panel-link{display:flex;align-items:baseline;gap:clamp(12px,3vw,18px);text-decoration:none;padding:clamp(5px,1vh,9px) 0;opacity:0;transform:translateY(16px);filter:blur(5px);transition:opacity 0.5s ease,transform 0.6s cubic-bezier(0.22,1,0.36,1),filter 0.5s ease;}
.lpnav-overlay[data-open="true"] .lpnav-panel-link{opacity:1;transform:none;filter:none;}
.lpnav-panel-idx{font-family:'Inter',sans-serif;font-size:clamp(0.6rem,2.4vw,0.72rem);font-weight:500;letter-spacing:0.1em;color:rgba(2,10,37,0.32);min-width:1.4em;}
.lpnav-panel-label{font-family:'Titillium Web',sans-serif;font-weight:300;font-size:clamp(2rem,8.5vw,3.3rem);line-height:1.16;letter-spacing:-0.02em;color:rgba(2,10,37,0.82);transition:color 0.3s ease;}
.lpnav-panel-link:hover .lpnav-panel-label,.lpnav-panel-link[aria-current="page"] .lpnav-panel-label{color:${NAVY};}
.lpnav-panel-link[aria-current="page"] .lpnav-panel-idx{color:${ACCENT};}
.lpnav-panel-foot{display:flex;align-items:center;gap:18px;border-top:1px solid rgba(2,10,37,0.1);padding-top:clamp(20px,3vh,28px);opacity:0;transform:translateY(16px);transition:opacity 0.5s ease,transform 0.6s cubic-bezier(0.22,1,0.36,1);}
.lpnav-overlay[data-open="true"] .lpnav-panel-foot{opacity:1;transform:none;}

@media (max-width:768px){
  .lpnav-desktop{display:none!important;}
  .lpnav-burger{display:inline-flex!important;}
}
@media (prefers-reduced-motion:reduce){
  .lpnav-link::after,.lpnav-burger span,.lpnav-overlay,.lpnav-panel-link,.lpnav-panel-foot{transition-duration:0.01ms!important;}
}
`;

const MENU_LABELS: Record<Locale, { open: string; close: string }> = {
  en: { open: "Open menu", close: "Close menu" },
  de: { open: "Menü öffnen", close: "Menü schließen" },
  es: { open: "Abrir menú", close: "Cerrar menú" },
};

// ─── LangSwitcher ─────────────────────────────────────────────────────────────
export function LangSwitcher({ locale, onLocaleChange, size = "sm", showRule = true }: { locale: Locale; onLocaleChange: (l: Locale) => void; size?: "sm" | "lg"; showRule?: boolean }) {
  const langs: Locale[] = ["en", "de", "es"];
  return (
    <div className={size === "lg" ? "lpnav-lang lpnav-lang--lg" : "lpnav-lang"}>
      {showRule && <span className="lpnav-lang-rule" aria-hidden />}
      {langs.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span className="lpnav-lang-sep" aria-hidden>·</span>}
          <button type="button" onClick={() => onLocaleChange(l)} aria-pressed={l === locale} className={l === locale ? "lpnav-lang-btn is-active" : "lpnav-lang-btn"}>
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
  const menuLabels = MENU_LABELS[locale];

  // open = visual/animation state; render = whether the overlay is mounted.
  // Splitting them lets the close transition play before we unmount.
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setRender(true);
    // Two frames so the browser paints the hidden state before transitioning in.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setRender(false), 460);
  }, []);

  // Lock background scroll (clamps Lenis, which scrolls the window) + Escape to close.
  useEffect(() => {
    if (!render) return;
    const html = document.documentElement, body = document.body;
    const prevHtml = html.style.overflow, prevBody = body.style.overflow;
    html.style.overflow = "hidden"; body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMenu(); };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prevHtml; body.style.overflow = prevBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [render, closeMenu]);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  const tone = pastHero || open ? "dark" : "light";

  // Nav bar itself stays transparent — the glass pill is the visible container,
  // matching the reference. Links 0–3 live in the pill; the last link ("Contact")
  // becomes the solid CONTACT button.
  const pillLinks = t.nav.links.slice(0, 4);
  const contactLabel = t.nav.links[4] ?? t.nav.cta;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
      <nav
        className="lpnav"
        data-tone={tone}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          height: "clamp(56px,5.5vw,72px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(20px,5vw,72px)",
          background: "transparent",
          borderBottom: "1px solid transparent",
        }}
      >
        <Link href="/" className="lpnav-logo" onClick={open ? closeMenu : undefined}>Level Pro</Link>

        <div className="lpnav-right lpnav-desktop">
          <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} showRule={false} />
          <div className="lpnav-pill">
            {pillLinks.map((label, i) => {
              const href = NAV_ROUTES[i] ?? "#";
              return (
                <Link key={label} href={href} className="lpnav-link" aria-current={pathname === href ? "page" : undefined}>
                  {label}
                </Link>
              );
            })}
          </div>
          <Link href="/contact" className="lpnav-contact" aria-current={pathname === "/contact" ? "page" : undefined}>{contactLabel}</Link>
        </div>

        <button
          type="button"
          className="lpnav-burger"
          aria-label={open ? menuLabels.close : menuLabels.open}
          aria-expanded={open}
          aria-controls="lpnav-overlay"
          data-open={open}
          onClick={() => (open ? closeMenu() : openMenu())}
        >
          <span /><span />
        </button>
      </nav>

      {render && (
        <div id="lpnav-overlay" className="lpnav-overlay" data-open={open} role="dialog" aria-modal="true" aria-label={t.nav.cta}>
          <nav className="lpnav-panel">
            {t.nav.links.map((label, i) => {
              const href = NAV_ROUTES[i] ?? "#";
              return (
                <Link
                  key={label}
                  href={href}
                  className="lpnav-panel-link"
                  aria-current={pathname === href ? "page" : undefined}
                  style={{ transitionDelay: `${i * 55}ms` }}
                  onClick={closeMenu}
                >
                  <span className="lpnav-panel-idx">0{i + 1}</span>
                  <span className="lpnav-panel-label">{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="lpnav-panel-foot" data-tone="dark" style={{ transitionDelay: `${t.nav.links.length * 55}ms` }}>
            <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} size="lg" showRule={false} />
          </div>
        </div>
      )}
    </>
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
