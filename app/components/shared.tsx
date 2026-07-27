"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore, Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Locale, TRANSLATIONS } from "../translations";

export const NAVY = "#020A25";

// Routes match the order of nav.links in translations
export const NAV_PATHS = ["services", "projects", "equipment", "about", "contact"];

// Builds a locale-prefixed path, e.g. navHref("en", "services") -> "/en/services",
// navHref("en", "") -> "/en".
export function navHref(locale: Locale, path: string) {
  return path ? `/${locale}/${path}` : `/${locale}`;
}

// ─── useLocale ────────────────────────────────────────────────────────────────
// Locale is now part of the URL (app/[locale]/...), so this no longer tracks
// its own state via localStorage — it just wraps the server-provided locale
// and turns "switch locale" into a client-side navigation to the equivalent
// path under the new locale prefix, persisting the choice in a cookie so the
// proxy (root proxy.ts) picks it up on the next unprefixed visit.
export function useLocale(initialLocale: Locale) {
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useCallback((l: Locale) => {
    if (l === initialLocale) return;
    try { document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`; } catch {}
    const segments = pathname.split("/");
    segments[1] = l;
    router.push(segments.join("/") || navHref(l, ""));
  }, [initialLocale, pathname, router]);
  return [initialLocale, setLocale] as const;
}

// ─── useLogoFloating ──────────────────────────────────────────────────────────
// Drives NavBar's logoFloating prop on every page except the homepage, which
// computes its own version tied to the hero + navy sub-hero band's own
// scroll position (see HomeClient's computeAnim). Those other pages have no
// equivalent band to measure against, so "floating" here just means
// "hasn't scrolled yet" — true until the first scroll past threshold, false
// from then on. A small threshold (rather than a bare > 0) absorbs stray
// 1-2px scroll events (e.g. mobile Safari's address-bar collapse) that
// aren't a real user scroll.
export function useLogoFloating(threshold = 4) {
  const [floating, setFloating] = useState(true);
  useEffect(() => {
    const onScroll = () => {
      const shouldFloat = window.scrollY <= threshold;
      setFloating((f) => (f === shouldFloat ? f : shouldFloat));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return floating;
}

// ─── Preloader ────────────────────────────────────────────────────────────────
export function Preloader({ onComplete, onCovered, fast = false }: { onComplete: () => void; onCovered?: () => void; fast?: boolean }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"filling" | "solid" | "exiting">("filling");
  const duration = fast ? 520 : 1750;

  useEffect(() => {
    const start = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveDuration = reducedMotion ? 240 : duration;
    let raf: number;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const tick = (now: number) => {
      const t = Math.min((now - start) / effectiveDuration, 1);
      const eased = t * t * (3 - 2 * t);
      setProgress(Math.round(eased * 100));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else {
        setPhase("solid");
        // The viewport is still completely covered here, so locale changes can
        // happen behind the finished white mark without producing a visible flash.
        onCovered?.();
        t1 = setTimeout(() => {
          setPhase("exiting");
          t2 = setTimeout(onComplete, fast ? 500 : 760);
        }, reducedMotion ? 40 : fast ? 90 : 280);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exiting = phase === "exiting";
  const solid = phase === "solid" || exiting;
  const exitDur = fast ? 0.5 : 0.76;
  const logoPath = "M0,1507.68l248.69-86.28,225.96-79.37L1070.36,0,428.64,591.24,39.65,1417.98,0,1507.68ZM678.48,1493.49l841.28-13.09,443.83-.13-33.35-59.68-562.46-930.88-160.85-261.1-249.33,562.82,408.41,479.42,61.05,69.71-401.46,81.22-347.12,71.71Z";
  // The white mass is pumped from top to bottom. Broad, asymmetric lobes at
  // the advancing edge keep it deliberately viscous and heavy rather than
  // looking like a fast, regular water wave.
  const fillY = -90 + (progress / 100) * 1690;
  const wobble = Math.sin(progress * 0.13) * 12;
  const concreteSurface = `M-180 -180 H2140 V${fillY - 4}
    C1900 ${fillY + 10}, 1720 ${fillY - 12 - wobble}, 1510 ${fillY + 16}
    C1410 ${fillY + 28}, 1380 ${fillY + 118 + wobble}, 1260 ${fillY + 104}
    C1140 ${fillY + 88}, 1090 ${fillY + 18}, 940 ${fillY + 24}
    C820 ${fillY + 34}, 780 ${fillY + 132 - wobble}, 650 ${fillY + 116}
    C520 ${fillY + 98}, 490 ${fillY + 18}, 380 ${fillY + 20}
    C190 ${fillY + 38 + wobble}, 10 ${fillY + 4}, -180 ${fillY + 26} Z`;

  return (
    <div role="status" aria-label="Loading" style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: exiting ? "none" : "all" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%", backgroundColor: NAVY, transform: exiting ? "translateY(-100%)" : "translateY(0)", transition: exiting ? `transform ${exitDur}s cubic-bezier(0.76,0,0.24,1)` : "none", willChange: "transform" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "50%", backgroundColor: NAVY, transform: exiting ? "translateY(100%)" : "translateY(0)", transition: exiting ? `transform ${exitDur}s cubic-bezier(0.76,0,0.24,1)` : "none", willChange: "transform" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: exiting ? 0 : 1, transform: exiting ? "scale(0.96)" : "scale(1)", transition: exiting ? "opacity 0.22s ease, transform 0.4s ease" : "none" }}>
        <svg aria-hidden="true" viewBox="0 0 1963.6 1507.68" style={{ width: "clamp(87px,11.25vw,138px)", height: "auto", display: "block", overflow: "visible", filter: "drop-shadow(0 14px 32px rgba(0,0,0,0.2))" }}>
          <defs>
            <clipPath id="lp-preloader-logo-clip">
              <path d={logoPath} />
            </clipPath>
          </defs>

          {/* Only a fine vessel outline remains before the white fill reaches it. */}
          <path d={logoPath} fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.16)" strokeWidth="12" />

          <g clipPath="url(#lp-preloader-logo-clip)" opacity={solid ? 0 : 1} style={{ transition: "opacity 0.28s ease" }}>
            <path d={concreteSurface} fill="#ffffff" />
          </g>

          {/* The moving fill locks into the exact clean brand mark before reveal. */}
          <path d={logoPath} fill="#ffffff" opacity={solid ? 1 : 0} style={{ transition: "opacity 0.3s cubic-bezier(0.22,1,0.36,1)" }} />
        </svg>
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
.lpnav{--lpnav-ctrl-h:clamp(42px,4vw,48px);background:transparent;}
.lpnav-links{display:flex;gap:clamp(22px,3vw,42px);align-items:center;}
.lpnav-link{position:relative;font-family:var(--font-inter),sans-serif;font-size:clamp(0.68rem,0.82vw,0.75rem);font-weight:400;letter-spacing:0.04em;text-decoration:none;padding:4px 0;color:rgba(255,255,255,0.91);transition:color 0.3s ease;}
.lpnav-link::after{content:'';position:absolute;left:0;bottom:2px;height:1px;width:100%;background:#ffffff;transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);}
.lpnav-link:hover,.lpnav-link[aria-current="page"]{color:#ffffff;}
.lpnav-link:hover::after,.lpnav-link[aria-current="page"]::after{transform:scaleX(1);}
.lpnav-right{display:flex;align-items:center;gap:clamp(10px,1.4vw,18px);margin-left:auto;}

/* Fixed appearance everywhere, on every page, at every scroll position —
   white text on a dark glass pill, always (no more light/dark tone
   switching based on scroll distance or what's behind the bar). Two things
   still react to what's on screen: the logo (below) — a fixed floating copy
   sits over the "before first scroll" band (the homepage's hero + navy
   sub-hero, or another page's own light top section) and cross-fades into
   the pill's own first slot once that band has scrolled past, see the
   .lpnav-logo-floating / .lpnav-pill-logo-slot rules for how — and the
   CONTACT button, which samples whatever's actually rendered behind it and
   flips fill/text color for contrast, see .lpnav-contact[data-ambient] below. */
.lpnav-logo-mark{display:block;height:clamp(20px,2.4vw,27px);aspect-ratio:2469/575;background-color:currentColor;-webkit-mask-image:url(/logo-official.png);mask-image:url(/logo-official.png);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:left center;mask-position:left center;}
/* z-index one step above .lpnav (200) — now that .lpnav paints its own mobile
   glass background (see the @media(max-width:768px) block below), this sits
   in front of that background instead of being painted over by it while
   cross-fading in over the hero. White by default (the homepage's hero is
   dark); data-tone="light" (set via logoFloatingTone, for pages whose "before
   first scroll" band is a plain light section instead) swaps it to navy,
   mirroring the .lpnav-mobile-logo/.lpnav-burger tone rules below. */
.lpnav-logo-floating{position:fixed;top:0;left:0;z-index:201;height:clamp(56px,5.5vw,72px);display:flex;align-items:center;padding-left:clamp(20px,5vw,72px);color:#ffffff;transition:opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94),transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94),filter 0.9s cubic-bezier(0.25,0.46,0.45,0.94),color 0.3s ease;}
.lpnav-logo-floating[data-hidden="true"]{opacity:0;transform:translateY(-12px);filter:blur(10px);pointer-events:none;}
.lpnav-logo-floating[data-tone="light"]{color:${NAVY};}

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
.lpnav-contact{display:inline-flex;align-items:center;font-family:var(--font-inter),sans-serif;font-size:clamp(0.62rem,0.76vw,0.7rem);font-weight:600;letter-spacing:0.12em;text-transform:uppercase;height:var(--lpnav-ctrl-h);border-radius:var(--radius);padding:0 clamp(22px,1.9vw,30px);text-decoration:none;white-space:nowrap;color:${NAVY};background:#ffffff;border:1px solid transparent;transition:background 0.3s ease,color 0.3s ease,border-color 0.3s ease;}
.lpnav-contact:hover{background:rgba(255,255,255,0.85);}
/* data-ambient (desktop pill CONTACT only, set from contactTone below) —
   navy/white-text fill once whatever's actually behind the button has
   scrolled to something light (i.e. outside the homepage's hero + navy
   sub-hero + dark Projects section, or anywhere at all on the other pages,
   which have no dark section for the sampler to find). The white/navy fill
   above stays the resting default for when a dark backdrop IS detected. */
.lpnav-contact[data-ambient="light"]{color:#ffffff;background:${NAVY};}
.lpnav-contact[data-ambient="light"]:hover{background:rgba(2,10,37,0.85);}
/* Mobile-overlay CTA (data-tone="light", set below) reuses this same solid
   white-fill/navy-text look as the desktop pill's CONTACT button's own
   base rule — not to be confused with data-ambient above, which is only
   ever set on the desktop pill's own CONTACT link. */

.lpnav-burger{display:none;width:auto;height:42px;margin-right:-6px;flex-direction:row;align-items:center;justify-content:center;gap:9px;background:rgba(44,44,46,0.58);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);border:none;border-radius:var(--radius);padding:0 14px;cursor:pointer;color:#ffffff;transition:background 0.3s ease;}
.lpnav-burger:hover{background:rgba(60,60,64,0.62);}
.lpnav-menu-grid{position:relative;width:15px;height:15px;display:grid;grid-template-columns:repeat(3,3px);grid-template-rows:repeat(3,3px);gap:3px;flex-shrink:0;}
.lpnav-menu-grid i{display:block;width:3px;height:3px;border-radius:0.75px;background:currentColor;transition:opacity 0.22s ease,transform 0.32s cubic-bezier(0.22,1,0.36,1);}
.lpnav-menu-grid::before,.lpnav-menu-grid::after{content:'';position:absolute;left:0;top:6.5px;width:15px;height:1.5px;border-radius:2px;background:currentColor;opacity:0;transform:rotate(0deg) scaleX(0.5);transition:opacity 0.22s ease,transform 0.38s cubic-bezier(0.22,1,0.36,1);}
.lpnav-burger[data-open="true"] .lpnav-menu-grid i{opacity:0;transform:scale(0.35);}
.lpnav-burger[data-open="true"] .lpnav-menu-grid::before{opacity:1;transform:rotate(45deg) scaleX(1);}
.lpnav-burger[data-open="true"] .lpnav-menu-grid::after{opacity:1;transform:rotate(-45deg) scaleX(1);}
.lpnav-menu-label{font-family:var(--font-inter),sans-serif;font-size:0.76rem;font-weight:400;letter-spacing:0.01em;line-height:1;color:currentColor;white-space:nowrap;}
.lpnav-mobile-controls{display:none;align-items:center;gap:4px;margin-left:auto;}

/* Desktop switcher: collapsed trigger (current locale only) + a dropdown
   that expands downward. The dropdown is position:absolute so opening it
   never changes the navbar's own height/layout — it overlays whatever's
   below instead of pushing it down. Glass treatment on the trigger matches
   .lpnav-pill; the dropdown itself stays a fixed light glass since it's a
   separate floating panel, not part of the bar's own fixed look. */
.lpnav-lang{position:relative;display:inline-flex;align-items:center;}
.lpnav-lang-trigger{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-inter),sans-serif;font-size:clamp(0.6rem,0.74vw,0.68rem);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;background:rgba(44,44,46,0.52);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);border:none;cursor:pointer;color:#ffffff;height:var(--lpnav-ctrl-h);border-radius:var(--radius);padding:0 clamp(16px,1.4vw,20px);transition:background 0.3s ease;}
.lpnav-lang-trigger:hover{background:rgba(60,60,64,0.5);}
.lpnav-lang-chevron{flex-shrink:0;transition:transform 0.35s cubic-bezier(0.22,1,0.36,1);}
.lpnav-lang-chevron[data-open="true"]{transform:rotate(180deg);}
.lpnav-lang-dropdown{position:absolute;top:calc(100% + 10px);left:50%;min-width:76px;display:flex;flex-direction:column;background:rgba(44,44,46,0.52);backdrop-filter:blur(18px) saturate(120%);-webkit-backdrop-filter:blur(18px) saturate(120%);border-radius:var(--radius);overflow:hidden;opacity:0;transform:translateX(-50%) translateY(-6px) scale(0.96);transform-origin:top center;pointer-events:none;transition:opacity 0.3s ease,transform 0.35s cubic-bezier(0.22,1,0.36,1);}
.lpnav-lang-dropdown[data-open="true"]{opacity:1;transform:translateX(-50%) translateY(0) scale(1);pointer-events:auto;}
.lpnav-lang-opt{font-family:var(--font-inter),sans-serif;font-size:clamp(0.62rem,0.76vw,0.7rem);font-weight:500;letter-spacing:0.06em;text-transform:uppercase;background:none;border:none;cursor:pointer;padding:11px 18px;color:rgba(255,255,255,0.7);text-align:center;transition:background 0.2s ease,color 0.2s ease;}
.lpnav-lang-opt:hover{background:rgba(255,255,255,0.08);color:#ffffff;}

/* Mobile-overlay (--lg) variant: unchanged always-expanded EN · DE · ES row —
   there's no space constraint inside the full-screen menu, so collapsing it
   would just add an extra tap for no benefit. Always rendered on the
   overlay's own dark-tone panel, so its colors are fixed rather than
   tone-conditional like the desktop trigger above. */
.lpnav-lang--lg{display:inline-flex;align-items:center;}
.lpnav-lang-sep{font-family:var(--font-inter),sans-serif;font-size:clamp(0.7rem,2.8vw,0.8rem);margin:0 4px;user-select:none;color:rgba(255,255,255,0.25);}
.lpnav-lang--lg .lpnav-lang-btn{font-family:var(--font-inter),sans-serif;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;background:none;border:none;cursor:pointer;font-size:clamp(0.82rem,3.6vw,0.95rem);padding:14px 9px;min-height:44px;display:inline-flex;align-items:center;color:rgba(255,255,255,0.45);transition:color 0.3s ease;}
.lpnav-lang--lg .lpnav-lang-btn:hover{color:#ffffff;}
.lpnav-lang--lg .lpnav-lang-btn.is-active{font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;color:#ffffff;}

/* Panel itself: a solid dark-gray sheet (no blur/translucency — flat color)
   that materializes in place — scale + opacity + blur-to-focus, no
   directional slide — and dissolves the same way to close, just faster.
   Content (below) reveals only once this motion is mostly resolved, via the
   separate data-revealed flag, so on close it just fades/scales away *with*
   the panel as one piece instead of doing its own separate reveal in
   reverse. Durations differ by direction: this relies on the browser
   resolving the transition property from the *target* state's own declared
   value, so open and close can each carry their own duration/easing — open
   is the slower, fuller motion; close is quicker and snappier. Both share
   the same expo-style bezier pair (mirrored for in/out) as the content
   reveal below, for one consistent "modern, fluid" motion language across
   the whole panel. */
.lpnav-overlay{position:fixed;inset:0;z-index:150;display:flex;flex-direction:column;gap:clamp(24px,4vh,36px);overflow-y:auto;padding:calc(clamp(56px,5.5vw,68px) + clamp(14px,2.5vh,22px)) clamp(24px,7vw,56px) clamp(28px,5vh,44px);background:#090909;opacity:0;transform:scale(0.94);filter:blur(14px);pointer-events:none;transition:opacity 0.26s cubic-bezier(0.7,0,0.84,0),transform 0.3s cubic-bezier(0.7,0,0.84,0),filter 0.22s cubic-bezier(0.7,0,0.84,0);}
.lpnav-overlay[data-open="true"]{opacity:1;transform:scale(1);filter:blur(0px);pointer-events:auto;transition:opacity 0.4s cubic-bezier(0.16,1,0.3,1),transform 0.44s cubic-bezier(0.16,1,0.3,1),filter 0.36s cubic-bezier(0.16,1,0.3,1);}
.lpnav-panel{display:flex;flex-direction:column;}
.lpnav-panel-link{display:flex;align-items:center;justify-content:space-between;gap:12px;text-decoration:none;padding:clamp(14px,2.6vh,20px) 0;border-bottom:1px solid rgba(255,255,255,0.12);opacity:0;transform:translateY(14px) scale(0.98);filter:blur(6px);}
/* data-revealed turns on with the open animation and (unlike data-open)
   stays on for the whole close — so on exit these rows just ride the
   panel's own scale/opacity/blur away as one unit instead of separately
   reversing their own reveal, matching the "single unitary movement, no
   stagger" close spec. */
.lpnav-overlay[data-revealed="true"] .lpnav-panel-link{opacity:1;transform:none;filter:none;transition:opacity 0.3s cubic-bezier(0.16,1,0.3,1),transform 0.34s cubic-bezier(0.16,1,0.3,1),filter 0.3s cubic-bezier(0.16,1,0.3,1);}
.lpnav-panel-label{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:clamp(1.15rem,4.8vw,1.4rem);letter-spacing:-0.01em;color:rgba(255,255,255,0.91);transition:color 0.3s ease;}
.lpnav-panel-link:hover .lpnav-panel-label,.lpnav-panel-link[aria-current="page"] .lpnav-panel-label{color:#ffffff;}
.lpnav-panel-arrow{flex-shrink:0;font-size:1rem;color:rgba(255,255,255,0.4);transition:color 0.3s ease;}
.lpnav-panel-link:hover .lpnav-panel-arrow,.lpnav-panel-link[aria-current="page"] .lpnav-panel-arrow{color:#ffffff;}
/* Reuses .lpnav-contact (the same button as the desktop pill's CONTACT link)
   so the two stay structurally identical — its white-fill look is just the
   base rule above (data-tone="light" here doesn't match any CSS rule; only
   the desktop button's own data-ambient does), and it gets its own entrance
   transition to match the rows above it. */
.lpnav-overlay .lpnav-contact{width:100%;justify-content:center;gap:8px;height:clamp(50px,7vh,58px);font-size:clamp(0.72rem,3.2vw,0.82rem);margin-top:clamp(14px,2.5vh,20px);opacity:0;transform:translateY(14px) scale(0.98);filter:blur(6px);}
.lpnav-overlay[data-revealed="true"] .lpnav-contact{opacity:1;transform:none;filter:none;transition:opacity 0.3s cubic-bezier(0.16,1,0.3,1),transform 0.34s cubic-bezier(0.16,1,0.3,1),filter 0.3s cubic-bezier(0.16,1,0.3,1),background 0.3s ease,border-color 0.3s ease;}
.lpnav-panel-foot{display:flex;flex-direction:column;gap:clamp(20px,3.2vh,28px);border-top:1px solid rgba(255,255,255,0.12);padding-top:clamp(24px,4vh,32px);opacity:0;transform:translateY(14px) scale(0.98);}
.lpnav-overlay[data-revealed="true"] .lpnav-panel-foot{opacity:1;transform:none;transition:opacity 0.3s cubic-bezier(0.16,1,0.3,1),transform 0.34s cubic-bezier(0.16,1,0.3,1);}
.lpnav-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2.5vh,18px) clamp(16px,3vw,24px);}
.lpnav-info-label{display:block;font-family:var(--font-inter),sans-serif;font-weight:500;font-size:0.6rem;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin:0 0 6px 0;}
.lpnav-info-value{display:inline-block;font-family:var(--font-inter),sans-serif;font-weight:500;font-size:0.82rem;line-height:1.4;color:#ffffff;}

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
  .lpnav-mobile-controls{display:flex!important;}
  .lpnav-burger{display:inline-flex!important;}
  .lpnav-mobile-logo{display:flex!important;}
  .lpnav-mobile-controls{gap:8px;}
  .lpnav-mobile-controls .lpnav-lang-trigger{height:42px;padding:0 13px;font-size:0.66rem;}
  .lpnav-mobile-controls .lpnav-lang-dropdown{top:calc(100% + 8px);}
  /* No pill on mobile — instead of an opaque glass rectangle, a blurred
     scrim that tapers away (opacity and, via the same mask, perceived blur
     both fade together) into the page below, so it reads as a soft gradient
     rather than a hard-edged bar. Lives on ::before rather than .lpnav's own
     background so it can extend past the bar's fixed height for the fade
     tail without pushing content down; sits behind the bar's real children
     (z-index:-1 inside the stacking context .lpnav's fixed position + its
     own z-index:200 already establish) so it never has to be masked around
     the logo/burger — they just get their own contrast below instead.
     Light/white and strong (heavier blur, higher peak opacity) is the
     default, covering the rest of the site; data-scrim="dark" (set by the
     caller via the mobileDarkZone prop — currently only the homepage, for
     its hero/sub-hero and Projects sections) swaps it to the dark charcoal
     variant instead of trying to keep it self-adapting to page content. */
  .lpnav::before{content:'';position:absolute;top:0;left:0;right:0;height:calc(100% + 64px);background:linear-gradient(to bottom,rgba(255,255,255,0.82) 0%,rgba(255,255,255,0.48) 45%,rgba(255,255,255,0) 100%);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 45%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0%,#000 45%,transparent 100%);pointer-events:none;z-index:-1;opacity:1;transition:opacity 0.25s ease;}
  .lpnav[data-scrim="dark"]::before{background:linear-gradient(to bottom,rgba(44,44,46,0.5) 0%,rgba(44,44,46,0.28) 45%,rgba(44,44,46,0) 100%);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
  /* Full-screen menu has its own solid panel — the scrim would otherwise
     float visibly over it (the bar sits above the overlay, z-index 200 vs
     150, so the burger/logo stay clickable/visible while open). Hidden for
     the whole time the menu is open; reappears once you exit. */
  .lpnav[data-open="true"]::before{opacity:0;}
  /* Logo/burger follow the same explicit mobileDarkZone signal (via
     data-tone, mirroring the desktop CONTACT button's own data-tone) rather
     than sampling — navy by default (data-tone="light", matching the scrim
     default above), white only where the caller marks the zone dark. */
  .lpnav-mobile-logo{transition:color 0.3s ease;}
  .lpnav-mobile-logo[data-tone="light"]{color:${NAVY};}
  .lpnav-burger[data-tone="light"]{color:#ffffff;}
}
@media (prefers-reduced-motion:reduce){
  .lpnav-link::after,.lpnav-burger span,.lpnav-overlay,.lpnav-panel-link,.lpnav-panel-foot,.lpnav-contact{transition-duration:0.01ms!important;}
}
`;

const MENU_LABELS: Record<Locale, { open: string; close: string; button: string }> = {
  en: { open: "Open menu", close: "Close menu", button: "Menu" },
  de: { open: "Menü öffnen", close: "Menü schließen", button: "Menü" },
  es: { open: "Abrir menú", close: "Cerrar menú", button: "Menú" },
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
// pill rules for why that was dropped). Two elements still react to what's
// on screen: the logo and the CONTACT button.
// logoFloating (default false — pages with no hero just show the pill-
// internal copy already expanded) is true while the page's own "before first
// scroll" band is still on screen, during which the wordmark lives in a
// separate fixed element outside the bar; it cross-fades into the pill's own
// first slot once that band has scrolled past. The homepage computes this
// against its hero + navy sub-hero band; other pages drive it with the
// simpler useLogoFloating (floats until any scroll at all). logoFloatingTone
// colors that floating copy for whatever's behind it (white over the
// homepage's dark hero, navy elsewhere). logoFloatingDesktopOnly keeps the
// whole dance desktop-only — the other pages' mobile bar should look exactly
// like it always has, so on mobile the floating logo/pill-slot state is
// forced to "already settled" regardless of scroll.
// CONTACT samples the real page content behind it on every scroll/resize and
// flips fill/text color for contrast — see contactTone above and the
// .lpnav-contact[data-ambient] CSS rules.
export function NavBar({ locale, onLocaleChange, logoFloating = false, logoFloatingTone = "dark", logoFloatingDesktopOnly = false, mobileDarkZone = false }: { locale: Locale; onLocaleChange: (l: Locale) => void; logoFloating?: boolean; logoFloatingTone?: "dark" | "light"; logoFloatingDesktopOnly?: boolean; mobileDarkZone?: boolean }) {
  const t = TRANSLATIONS[locale];
  const pathname = usePathname();
  const menuLabels = MENU_LABELS[locale];
  const homeHref = navHref(locale, "");
  const routeIndex = NAV_PATHS.findIndex((p) => pathname === navHref(locale, p));

  // Desktop check (SSR-safe: server/first-paint snapshot is false, matching
  // HomeClient's own isDesktop pattern) — only consulted when
  // logoFloatingDesktopOnly is set, to collapse effectiveLogoFloating to
  // "already settled" on mobile regardless of scroll.
  const isDesktop = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 769px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 769px)").matches,
    () => false,
  );
  const effectiveLogoFloating = logoFloatingDesktopOnly && !isDesktop ? false : logoFloating;

  // open = panel slide state; render = whether the overlay is mounted;
  // revealed = content visibility, which turns on with `open` but (unlike
  // `open`) stays on through the whole close so the links don't separately
  // fade/blur out — they just ride the panel off-screen as one unit. All
  // three unwind in sequence so the close transition (and its content) can
  // play before we unmount.
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [render, setRender] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CONTACT button tone — see the CSS comment on .lpnav-contact[data-ambient]
  // for why this is the one nav element that reacts continuously to what's
  // behind it (real-time luminance sampling, desktop-only in practice since
  // its rect is zero-width on mobile). The mobile logo/burger/scrim, by
  // contrast, use the explicit mobileDarkZone prop below instead of sampling
  // — the caller (currently only the homepage) decides when the bar should
  // read as dark. Seeded from mobileDarkZone (an accurate "is the very top of
  // this page dark" signal every caller already provides) rather than a
  // hardcoded default, so there's no single-frame flash to the wrong tone
  // before the first real sample runs.
  const navRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLAnchorElement>(null);
  const [contactTone, setContactTone] = useState<"dark" | "light">(mobileDarkZone ? "dark" : "light");
  const mobileTone = mobileDarkZone ? "dark" : "light";

  const openMenu = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setRender(true);
    // Two frames so the browser paints the hidden state before transitioning in.
    requestAnimationFrame(() => requestAnimationFrame(() => { setOpen(true); setRevealed(true); }));
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    // 320ms covers the panel's own 300ms close dissolve (its slowest
    // property); revealed only drops here (right as the overlay unmounts) so
    // content stays put for the ride.
    closeTimer.current = setTimeout(() => { setRender(false); setRevealed(false); }, 320);
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
        href={homeHref}
        aria-label="Level Pro"
        className="lpnav-logo-floating"
        data-hidden={!effectiveLogoFloating}
        data-tone={logoFloatingTone}
        tabIndex={effectiveLogoFloating ? 0 : -1}
        aria-hidden={!effectiveLogoFloating}
        onClick={open ? closeMenu : undefined}
      >
        <span className="lpnav-logo-mark" />
      </Link>
      <nav
        ref={navRef}
        className="lpnav"
        data-scrim={mobileTone}
        data-open={open}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          height: "clamp(56px,5.5vw,72px)",
          display: "flex", alignItems: "center",
          padding: "0 clamp(20px,5vw,72px)",
          borderBottom: "1px solid transparent",
        }}
      >
        <Link
          href={homeHref}
          aria-label="Level Pro"
          className="lpnav-mobile-logo"
          data-hidden={effectiveLogoFloating}
          data-tone={open ? "dark" : mobileTone}
          tabIndex={effectiveLogoFloating ? -1 : 0}
          aria-hidden={effectiveLogoFloating}
          onClick={open ? closeMenu : undefined}
        >
          <span className="lpnav-logo-mark" />
        </Link>

        <div className="lpnav-right lpnav-desktop">
          <div className="lpnav-pill">
            <Link
              href={homeHref}
              aria-label="Level Pro"
              className="lpnav-pill-logo-slot"
              data-expanded={!effectiveLogoFloating}
              tabIndex={effectiveLogoFloating ? -1 : 0}
              aria-hidden={effectiveLogoFloating}
            >
              <span className="lpnav-pill-logo-link">
                <span className="lpnav-logo-mark" />
              </span>
            </Link>
            <Link href={homeHref} className="lpnav-link" aria-current={pathname === homeHref ? "page" : undefined}>
              {t.nav.home}
            </Link>
            {pillLinks.map((label, i) => {
              const href = navHref(locale, NAV_PATHS[i] ?? "");
              return (
                <Link key={label} href={href} className="lpnav-link" aria-current={pathname === href ? "page" : undefined}>
                  {label}
                </Link>
              );
            })}
          </div>
          <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} />
          <Link ref={contactRef} href={navHref(locale, "contact")} className="lpnav-contact" data-ambient={contactTone} aria-current={pathname === navHref(locale, "contact") ? "page" : undefined}>{contactLabel}</Link>
        </div>

        <div className="lpnav-mobile-controls">
          <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} />
          <button
            type="button"
            className="lpnav-burger"
            aria-label={open ? menuLabels.close : menuLabels.open}
            aria-expanded={open}
            aria-controls="lpnav-overlay"
            data-open={open}
            data-tone={open ? "dark" : mobileTone}
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            <span className="lpnav-menu-grid" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => <i key={i} />)}
            </span>
            <span className="lpnav-menu-label">{menuLabels.button}</span>
          </button>
        </div>
      </nav>

      {render && (
        <div id="lpnav-overlay" className="lpnav-overlay" data-open={open} data-revealed={revealed} role="dialog" aria-modal="true" aria-label={t.nav.cta}>
          <nav className="lpnav-panel">
            <Link
              href={homeHref}
              className="lpnav-panel-link"
              aria-current={pathname === homeHref ? "page" : undefined}
              style={{ transitionDelay: "100ms" }}
              onClick={closeMenu}
            >
              <span className="lpnav-panel-label">{t.nav.home}</span>
              <span className="lpnav-panel-arrow" aria-hidden="true">→</span>
            </Link>
            {/* Links 0–3 render as plain rows here, same as the desktop pill;
                the last link ("Contact") becomes the CTA button below instead
                of a 6th row, mirroring the reference's row-list + CTA split. */}
            {t.nav.links.slice(0, 4).map((label, i) => {
              const href = navHref(locale, NAV_PATHS[i] ?? "");
              return (
                <Link
                  key={label}
                  href={href}
                  className="lpnav-panel-link"
                  aria-current={pathname === href ? "page" : undefined}
                  style={{ transitionDelay: `${100 + (i + 1) * 50}ms` }}
                  onClick={closeMenu}
                >
                  <span className="lpnav-panel-label">{label}</span>
                  <span className="lpnav-panel-arrow" aria-hidden="true">→</span>
                </Link>
              );
            })}
            <Link
              href={navHref(locale, "contact")}
              className="lpnav-contact"
              data-tone="light"
              aria-current={pathname === navHref(locale, "contact") ? "page" : undefined}
              style={{ transitionDelay: `${100 + t.nav.links.length * 50}ms` }}
              onClick={closeMenu}
            >
              {t.nav.cta} <span aria-hidden="true">→</span>
            </Link>
          </nav>
          <div className="lpnav-panel-foot" style={{ transitionDelay: `${100 + (t.nav.links.length + 1) * 50}ms` }}>
            <div className="lpnav-info-grid">
              <div>
                <span className="lpnav-info-label">{t.contactPage.info.phone.label}</span>
                <a href={`tel:${t.contactPage.info.phone.val.replace(/\s/g, "")}`} className="lpnav-info-value">{t.contactPage.info.phone.val}</a>
              </div>
              <div>
                <span className="lpnav-info-label">{t.contactPage.info.email.label}</span>
                <a href={`mailto:${t.contactPage.info.email.val}`} className="lpnav-info-value">{t.contactPage.info.email.val}</a>
              </div>
              {/* Same address as the /contact page's own info block — kept as one
                  locale-invariant literal there too, since a street address
                  doesn't get translated. */}
              <div style={{ gridColumn: "1 / -1" }}>
                <span className="lpnav-info-label">{t.contactPage.hero.factLabels[0]}</span>
                <span className="lpnav-info-value">Carrer Riu Montnegre, 7C, 03581 L&apos;Alfàs del Pi, Alicante, España</span>
              </div>
            </div>
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
          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "clamp(0.6rem,0.78vw,0.7rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 clamp(14px,2vh,22px) 0" }}>{cta.label}</p>
          <h2 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(2.2rem,5.5vw,5.5rem)", lineHeight: 0.95, color: "#ffffff", margin: 0, letterSpacing: "-0.03em", maxWidth: "clamp(280px,60vw,800px)" }}>{cta.heading}</h2>
        </div>
        <Link href={navHref(locale, "contact")} className="btn-fill btn-fill-light" style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.65rem,0.82vw,0.74rem)", fontWeight: 500, letterSpacing: "0.08em", color: NAVY, background: "#ffffff", border: "1px solid rgba(2,10,37,0.12)", borderRadius: "var(--radius)", padding: "12px 28px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          {cta.btn} <span className="btn-fill-icon">→</span>
        </Link>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "clamp(20px,2.5vh,28px)" }}>
        <Link href={navHref(locale, "")} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.85rem,1.1vw,1rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>Level Pro</Link>
        <div style={{ display: "flex", gap: "clamp(20px,3vw,36px)" }}>
          {t.footer.links.map((label, i) => (
            <Link key={label} href={navHref(locale, NAV_PATHS[i] ?? "")} style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.62rem,0.78vw,0.7rem)", fontWeight: 400, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>{label}</Link>
          ))}
        </div>
        <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.58rem,0.72vw,0.65rem)", color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>{t.footer.copyright}</span>
      </div>
    </footer>
  );
}
