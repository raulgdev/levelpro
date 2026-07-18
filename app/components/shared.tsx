"use client";

import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, TRANSLATIONS } from "../translations";

export const NAVY = "#020A25";

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
        <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "clamp(0.88rem,1.15vw,1rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: "#ffffff" }}>Level Pro</div>
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

// ─── Count-up stat number ──────────────────────────────────────────────────────
function runCountUp(target: number, duration: number, setter: (n: number) => void, delay = 0) {
  const go = () => { let t0: number | null = null; const step = (ts: number) => { if (t0 === null) t0 = ts; const p = Math.min((ts - t0) / duration, 1); setter(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); };
  delay > 0 ? setTimeout(go, delay) : go();
}
export function StatNum({ value, suffix = "", delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; obs.disconnect(); runCountUp(value, 2000, setCount, delay); }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, [value, delay]);
  return <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>{count}{suffix}</span>;
}

// ─── RevealText ───────────────────────────────────────────────────────────────
export function RevealText({ text, delayOffset = 0, style, as: Tag = "p" }: { text: string; delayOffset?: number; style?: React.CSSProperties; as?: "p" | "span" | "h2" | "h1" }) {
  const [ref, triggered] = useWordReveal();
  const words = text.split(/\s+/);
  return (
    <Tag ref={ref as unknown as React.RefObject<HTMLParagraphElement>} style={style}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            style={{ display: "inline-block", opacity: 0, animation: triggered ? `fadeBlurReveal 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${(delayOffset + i) * 0.05}s both` : "none" }}
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
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

// ─── Nav styles ───────────────────────────────────────────────────────────────
// Self-contained: the NavBar injects this once, so it renders identically on every
// page without depending on per-page <style> blocks. One fixed appearance
// everywhere — no scroll- or background-driven color/tone switching.
const NAV_CSS = `
.lpnav{--lpnav-ctrl-h:clamp(42px,4vw,48px);}
.lpnav-links{display:flex;gap:clamp(22px,3vw,42px);align-items:center;}
.lpnav-link{position:relative;font-family:'Inter',sans-serif;font-size:clamp(0.68rem,0.82vw,0.75rem);font-weight:400;letter-spacing:0.04em;text-decoration:none;padding:4px 0;color:rgba(255,255,255,0.91);transition:color 0.3s ease;}
.lpnav-link::after{content:'';position:absolute;left:0;bottom:2px;height:1px;width:100%;background:#ffffff;transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);}
.lpnav-link:hover,.lpnav-link[aria-current="page"]{color:#ffffff;}
.lpnav-link:hover::after,.lpnav-link[aria-current="page"]::after{transform:scaleX(1);}
.lpnav-right{display:flex;align-items:center;gap:clamp(10px,1.4vw,18px);margin-left:auto;}

/* Fixed appearance everywhere, on every page, at every scroll position —
   white text on a dark glass pill, always (no more light/dark tone
   switching based on scroll distance or what's behind the bar). The ONE
   thing that still reacts to scroll is the logo itself (below): a fixed
   floating copy sits over the hero + navy sub-hero band, and cross-fades
   into the pill's own first slot once that band has fully scrolled past —
   see the .lpnav-logo-floating / .lpnav-pill-logo-slot rules for how. */
.lpnav-logo-mark{display:block;height:clamp(20px,2.4vw,27px);aspect-ratio:2469/575;background-color:currentColor;-webkit-mask-image:url(/logo-official.png);mask-image:url(/logo-official.png);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:left center;mask-position:left center;}
.lpnav-logo-floating{position:fixed;top:0;left:0;z-index:200;height:clamp(56px,5.5vw,72px);display:flex;align-items:center;padding-left:clamp(20px,5vw,72px);color:#ffffff;transition:opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94),transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94),filter 0.9s cubic-bezier(0.25,0.46,0.45,0.94);}
.lpnav-logo-floating[data-hidden="true"]{opacity:0;transform:translateY(-12px);filter:blur(10px);pointer-events:none;}

/* Glass pill holding the logo + nav links + the solid CONTACT button (no
   shadows, no border — backdrop-blur only, always on, regardless of the
   logo's own state below). Pill, CONTACT, and the lang trigger all share
   the same explicit --lpnav-ctrl-h height (vertical padding dropped in
   favor of align-items:center) so the three sit flush instead of each
   emerging a slightly different height from its own font-size/padding
   math. */
.lpnav-pill{display:flex;align-items:center;gap:clamp(18px,2.2vw,34px);height:var(--lpnav-ctrl-h);border-radius:var(--radius);padding:0 clamp(20px,1.8vw,28px);background:rgba(44,44,46,0.52);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);}

/* Pill-internal logo slot — the "dilate to make room" effect. A CSS-grid
   0fr->1fr track (not width, which can't transition to/from "auto") lets the
   slot animate to its content's natural size without hardcoding a pixel
   width; overflow:hidden + min-width:0 on the inner link let the column
   actually clip to zero instead of being floored by the logo's intrinsic
   width. Only this slot's width/opacity move — the pill's own background
   above is already there from first paint, so nothing else about the
   capsule changes shape at the same time.
   margin-right cancels out the pill's own flex gap while collapsed — a
   zero-width flex item still consumes one full gap before the next item, so
   without this "Home" sat visibly further from the pill's left edge than
   "About Us" sits from the right edge. Resets to 0 once expanded, restoring
   the normal gap between the now-visible logo and "Home". */
.lpnav-pill-logo-slot{display:grid;grid-template-columns:0fr;opacity:0;overflow:hidden;margin-right:calc(-1 * clamp(18px,2.2vw,34px));transition:grid-template-columns 0.6s cubic-bezier(0.22,1,0.36,1),opacity 0.45s ease,margin-right 0.6s cubic-bezier(0.22,1,0.36,1);}
.lpnav-pill-logo-slot[data-expanded="true"]{grid-template-columns:1fr;opacity:1;margin-right:0;}
.lpnav-pill-logo-link{display:flex;align-items:center;min-width:0;overflow:hidden;color:#ffffff;}
.lpnav-contact{display:inline-flex;align-items:center;font-family:'Inter',sans-serif;font-size:clamp(0.62rem,0.76vw,0.7rem);font-weight:600;letter-spacing:0.12em;text-transform:uppercase;height:var(--lpnav-ctrl-h);border-radius:var(--radius);padding:0 clamp(22px,1.9vw,30px);text-decoration:none;white-space:nowrap;color:${NAVY};background:#ffffff;transition:background 0.3s ease,color 0.3s ease;}
.lpnav-contact:hover{background:rgba(255,255,255,0.85);}
.lpnav-contact[data-tone="light"]{color:#ffffff;background:${NAVY};}
.lpnav-contact[data-tone="light"]:hover{background:rgba(2,10,37,0.85);}

.lpnav-burger{display:none;width:44px;height:44px;margin-right:-10px;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:none;border:none;padding:0;cursor:pointer;color:#ffffff;}
.lpnav-burger span{display:block;width:22px;height:1.5px;background:currentColor;border-radius:2px;box-shadow:0 0 3px rgba(2,10,37,0.55);transition:transform 0.42s cubic-bezier(0.4,0,0.2,1),opacity 0.3s ease;}
.lpnav-burger[data-open="true"] span:first-child{transform:translateY(3.75px) rotate(45deg);}
.lpnav-burger[data-open="true"] span:last-child{transform:translateY(-3.75px) rotate(-45deg);}

/* Desktop switcher: collapsed trigger (current locale only) + a dropdown
   that expands downward. The dropdown is position:absolute so opening it
   never changes the navbar's own height/layout — it overlays whatever's
   below instead of pushing it down. Glass treatment on the trigger matches
   .lpnav-pill; the dropdown itself stays a fixed light glass since it's a
   separate floating panel, not part of the bar's own fixed look. */
.lpnav-lang{position:relative;display:inline-flex;align-items:center;}
.lpnav-lang-trigger{display:inline-flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;font-size:clamp(0.6rem,0.74vw,0.68rem);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;background:rgba(44,44,46,0.52);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);border:none;cursor:pointer;color:#ffffff;height:var(--lpnav-ctrl-h);border-radius:var(--radius);padding:0 clamp(16px,1.4vw,20px);transition:background 0.3s ease;}
.lpnav-lang-trigger:hover{background:rgba(60,60,64,0.5);}
.lpnav-lang-chevron{flex-shrink:0;transition:transform 0.35s cubic-bezier(0.22,1,0.36,1);}
.lpnav-lang-chevron[data-open="true"]{transform:rotate(180deg);}
.lpnav-lang-dropdown{position:absolute;top:calc(100% + 10px);left:50%;min-width:76px;display:flex;flex-direction:column;background:rgba(44,44,46,0.52);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);border-radius:var(--radius);overflow:hidden;opacity:0;transform:translateX(-50%) translateY(-6px) scale(0.96);transform-origin:top center;pointer-events:none;transition:opacity 0.3s ease,transform 0.35s cubic-bezier(0.22,1,0.36,1);}
.lpnav-lang-dropdown[data-open="true"]{opacity:1;transform:translateX(-50%) translateY(0) scale(1);pointer-events:auto;}
.lpnav-lang-opt{font-family:'Inter',sans-serif;font-size:clamp(0.62rem,0.76vw,0.7rem);font-weight:500;letter-spacing:0.06em;text-transform:uppercase;background:none;border:none;cursor:pointer;padding:11px 18px;color:rgba(255,255,255,0.7);text-align:center;transition:background 0.2s ease,color 0.2s ease;}
.lpnav-lang-opt:hover{background:rgba(255,255,255,0.08);color:#ffffff;}

/* Mobile-overlay (--lg) variant: unchanged always-expanded EN · DE · ES row —
   there's no space constraint inside the full-screen menu, so collapsing it
   would just add an extra tap for no benefit. Always rendered on the
   overlay's own dark-tone panel, so its colors are fixed rather than
   tone-conditional like the desktop trigger above. */
.lpnav-lang--lg{display:inline-flex;align-items:center;}
.lpnav-lang-sep{font-family:'Inter',sans-serif;font-size:clamp(0.7rem,2.8vw,0.8rem);margin:0 4px;user-select:none;color:rgba(2,10,37,0.2);}
.lpnav-lang--lg .lpnav-lang-btn{font-family:'Inter',sans-serif;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;background:none;border:none;cursor:pointer;font-size:clamp(0.82rem,3.6vw,0.95rem);padding:14px 9px;min-height:44px;display:inline-flex;align-items:center;color:rgba(2,10,37,0.4);transition:color 0.3s ease;}
.lpnav-lang--lg .lpnav-lang-btn:hover{color:${NAVY};}
.lpnav-lang--lg .lpnav-lang-btn.is-active{font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;color:${NAVY};}

.lpnav-overlay{position:fixed;inset:0;z-index:150;display:flex;flex-direction:column;padding:calc(clamp(56px,5.5vw,68px) + clamp(18px,3vh,30px)) clamp(24px,7vw,56px) clamp(34px,6vh,54px);background:rgba(244,244,246,0.72);backdrop-filter:blur(26px) saturate(160%);-webkit-backdrop-filter:blur(26px) saturate(160%);opacity:0;pointer-events:none;transition:opacity 0.42s ease;}
.lpnav-overlay[data-open="true"]{opacity:1;pointer-events:auto;}
.lpnav-panel{margin:auto 0;display:flex;flex-direction:column;gap:clamp(2px,1vh,8px);}
.lpnav-panel-link{display:flex;align-items:baseline;gap:clamp(12px,3vw,18px);text-decoration:none;padding:clamp(5px,1vh,9px) 0;opacity:0;transform:translateY(16px);filter:blur(5px);transition:opacity 0.5s ease,transform 0.6s cubic-bezier(0.22,1,0.36,1),filter 0.5s ease;}
.lpnav-overlay[data-open="true"] .lpnav-panel-link{opacity:1;transform:none;filter:none;}
.lpnav-panel-idx{font-family:'Inter',sans-serif;font-size:clamp(0.6rem,2.4vw,0.72rem);font-weight:500;letter-spacing:0.1em;color:rgba(2,10,37,0.32);min-width:1.4em;}
.lpnav-panel-label{font-family:'Inter',sans-serif;font-weight:300;font-size:clamp(2rem,8.5vw,3.3rem);line-height:1.16;letter-spacing:-0.02em;color:rgba(2,10,37,0.82);transition:color 0.3s ease;}
.lpnav-panel-link:hover .lpnav-panel-label,.lpnav-panel-link[aria-current="page"] .lpnav-panel-label{color:${NAVY};}
.lpnav-panel-link[aria-current="page"] .lpnav-panel-idx{color:${NAVY};}
.lpnav-panel-foot{display:flex;align-items:center;gap:18px;border-top:1px solid rgba(2,10,37,0.1);padding-top:clamp(20px,3vh,28px);opacity:0;transform:translateY(16px);transition:opacity 0.5s ease,transform 0.6s cubic-bezier(0.22,1,0.36,1);}
.lpnav-overlay[data-open="true"] .lpnav-panel-foot{opacity:1;transform:none;}

/* Mobile-only wordmark: below 768px the pill (and the logo living inside it)
   is hidden along with the rest of .lpnav-desktop, which would otherwise
   leave the bar with no way back to "/" at all once the floating logo has
   cross-faded out — this is the one thing that takes its place, plain (no
   glass pill of its own). Hidden while the floating logo is still showing
   (data-hidden="true") so the two don't ever appear stacked on top of each
   other during the hero/sub-hero band. */
.lpnav-mobile-logo{display:none;align-items:center;color:#ffffff;margin-right:auto;opacity:0;pointer-events:none;transition:opacity 0.6s ease;}
.lpnav-mobile-logo[data-hidden="false"]{opacity:1;pointer-events:auto;}
@media (max-width:768px){
  .lpnav-desktop{display:none!important;}
  .lpnav-burger{display:inline-flex!important;}
  .lpnav-mobile-logo{display:flex!important;}
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
// "lg" (mobile overlay) stays an always-expanded EN · DE · ES row. "sm" (desktop
// nav) is a collapsed trigger showing only the active locale, expanding into an
// absolutely-positioned dropdown on click so it never reflows the navbar.
export function LangSwitcher({ locale, onLocaleChange, size = "sm" }: { locale: Locale; onLocaleChange: (l: Locale) => void; size?: "sm" | "lg" }) {
  const langs: Locale[] = ["en", "de", "es"];
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (size !== "sm" || !open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [size, open]);

  if (size === "lg") {
    return (
      <div className="lpnav-lang lpnav-lang--lg">
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

  // Dropdown only ever offers the OTHER locales, not the one already active —
  // there's nothing useful to do by picking the value you're already on, and
  // with 3 total locales this also keeps the panel a fixed, predictable size.
  const otherLangs = langs.filter((l) => l !== locale);

  return (
    <div className="lpnav-lang" ref={wrapRef}>
      <button type="button" className="lpnav-lang-trigger" onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>
        {locale.toUpperCase()}
        <svg className="lpnav-lang-chevron" data-open={open} width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden>
          <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="lpnav-lang-dropdown" data-open={open} role="menu">
        {otherLangs.map((l) => (
          <button
            key={l}
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={() => { onLocaleChange(l); setOpen(false); }}
            className="lpnav-lang-opt"
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
// Fixed appearance on every page, at every scroll position — no more
// scroll-driven tone switching on colors (see the NAV_CSS comment above the
// pill rules for why that was dropped). The logo is the one exception:
// logoFloating (default false — pages with no hero just show the pill-
// internal copy already expanded) is true while a hero + navy sub-hero band
// is still on screen, during which the wordmark lives in a separate fixed
// element outside the bar; it cross-fades into the pill's own first slot
// once that band has fully scrolled past. See the homepage for the one page
// that passes this dynamically.
export function NavBar({ locale, onLocaleChange, logoFloating = false }: { locale: Locale; onLocaleChange: (l: Locale) => void; logoFloating?: boolean }) {
  const t = TRANSLATIONS[locale];
  const pathname = usePathname();
  const menuLabels = MENU_LABELS[locale];

  // open = visual/animation state; render = whether the overlay is mounted.
  // Splitting them lets the close transition play before we unmount.
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CONTACT button tone — see the CSS comment on .lpnav-contact for why this
  // is the one nav element allowed to react to what's behind it.
  const navRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLAnchorElement>(null);
  const [contactTone, setContactTone] = useState<"dark" | "light">("dark");

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

  // Samples whatever's actually rendered behind the CONTACT button (real page
  // content, not the pill) and classifies it light/dark by luminance, purely
  // via solid background-colors — deliberately NOT the mix-blend-mode trick
  // tried earlier, which forced the browser into a compositing mode that
  // broke backdrop-filter on the neighboring glass pill. Hiding the whole nav
  // from hit-testing for the instant of the sample is what lets
  // elementFromPoint see the real page underneath a fixed, full-width bar
  // instead of just hitting the bar itself.
  useEffect(() => {
    let raf = 0, pending = false;
    const sample = () => {
      pending = false;
      const nav = navRef.current, btn = contactRef.current;
      if (!nav || !btn) return;
      const r = btn.getBoundingClientRect();
      if (r.width === 0) return; // hidden on mobile (.lpnav-desktop)
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const prevPE = nav.style.pointerEvents;
      nav.style.pointerEvents = "none";
      let node: Element | null = document.elementFromPoint(x, y);
      nav.style.pointerEvents = prevPE;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        const m = bg.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
        if (m) {
          const a = m[4] === undefined ? 1 : parseFloat(m[4]);
          if (a > 0.5) {
            const lum = 0.299 * Number(m[1]) + 0.587 * Number(m[2]) + 0.114 * Number(m[3]);
            setContactTone(lum > 150 ? "light" : "dark");
            return;
          }
        }
        node = node.parentElement;
      }
      // No solid color found anywhere up the chain (e.g. over a bare video/
      // image with no color layer) — leave the last known tone as-is rather
      // than guess.
    };
    const onScroll = () => { if (!pending) { pending = true; raf = requestAnimationFrame(sample); } };
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Nav bar itself stays transparent — the glass pill is the visible container,
  // matching the reference. Links 0–3 live in the pill; the last link ("Contact")
  // becomes the solid CONTACT button.
  const pillLinks = t.nav.links.slice(0, 4);
  const contactLabel = t.nav.links[4] ?? t.nav.cta;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />
      <Link
        href="/"
        aria-label="Level Pro"
        className="lpnav-logo-floating"
        data-hidden={!logoFloating}
        tabIndex={logoFloating ? 0 : -1}
        aria-hidden={!logoFloating}
        onClick={open ? closeMenu : undefined}
      >
        <span className="lpnav-logo-mark" />
      </Link>
      <nav
        ref={navRef}
        className="lpnav"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          height: "clamp(56px,5.5vw,72px)",
          display: "flex", alignItems: "center",
          padding: "0 clamp(20px,5vw,72px)",
          background: "transparent",
          borderBottom: "1px solid transparent",
        }}
      >
        <Link
          href="/"
          aria-label="Level Pro"
          className="lpnav-mobile-logo"
          data-hidden={logoFloating}
          tabIndex={logoFloating ? -1 : 0}
          aria-hidden={logoFloating}
          onClick={open ? closeMenu : undefined}
        >
          <span className="lpnav-logo-mark" />
        </Link>

        <div className="lpnav-right lpnav-desktop">
          <div className="lpnav-pill">
            <Link
              href="/"
              aria-label="Level Pro"
              className="lpnav-pill-logo-slot"
              data-expanded={!logoFloating}
              tabIndex={logoFloating ? -1 : 0}
              aria-hidden={logoFloating}
            >
              <span className="lpnav-pill-logo-link">
                <span className="lpnav-logo-mark" />
              </span>
            </Link>
            <Link href="/" className="lpnav-link" aria-current={pathname === "/" ? "page" : undefined}>
              {t.nav.home}
            </Link>
            {pillLinks.map((label, i) => {
              const href = NAV_ROUTES[i] ?? "#";
              return (
                <Link key={label} href={href} className="lpnav-link" aria-current={pathname === href ? "page" : undefined}>
                  {label}
                </Link>
              );
            })}
          </div>
          <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} />
          <Link ref={contactRef} href="/contact" className="lpnav-contact" data-tone={contactTone} aria-current={pathname === "/contact" ? "page" : undefined}>{contactLabel}</Link>
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
            <Link
              href="/"
              className="lpnav-panel-link"
              aria-current={pathname === "/" ? "page" : undefined}
              style={{ transitionDelay: "0ms" }}
              onClick={closeMenu}
            >
              <span className="lpnav-panel-idx">01</span>
              <span className="lpnav-panel-label">{t.nav.home}</span>
            </Link>
            {t.nav.links.map((label, i) => {
              const href = NAV_ROUTES[i] ?? "#";
              return (
                <Link
                  key={label}
                  href={href}
                  className="lpnav-panel-link"
                  aria-current={pathname === href ? "page" : undefined}
                  style={{ transitionDelay: `${(i + 1) * 55}ms` }}
                  onClick={closeMenu}
                >
                  <span className="lpnav-panel-idx">0{i + 2}</span>
                  <span className="lpnav-panel-label">{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="lpnav-panel-foot" data-tone="dark" style={{ transitionDelay: `${(t.nav.links.length + 1) * 55}ms` }}>
            <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} size="lg" />
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
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 200, fontSize: "clamp(2.2rem,5.5vw,5.5rem)", lineHeight: 0.95, color: "#ffffff", margin: 0, letterSpacing: "-0.03em", maxWidth: "clamp(280px,60vw,800px)" }}>{cta.heading}</h2>
        </div>
        <Link href="/contact" className="btn-fill btn-fill-light" style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.65rem,0.82vw,0.74rem)", fontWeight: 500, letterSpacing: "0.08em", color: NAVY, background: "#ffffff", border: "1px solid rgba(2,10,37,0.12)", borderRadius: "var(--radius)", padding: "12px 28px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          {cta.btn} <span className="btn-fill-icon">→</span>
        </Link>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "clamp(20px,2.5vh,28px)" }}>
        <Link href="/" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "clamp(0.85rem,1.1vw,1rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>Level Pro</Link>
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
