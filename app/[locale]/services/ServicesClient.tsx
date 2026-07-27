"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { Locale, TRANSLATIONS } from "../../translations";
import { NAVY, useLocale, useLogoFloating, Preloader, NavBar, FooterCTA, RevealText, StatNum, navHref } from "../../components/shared";

const HERO_IMG = "/images/services/mission.avif";
const ALT_BG = "#faf9f7";

const SERVICE_IMAGES_DESKTOP = [
  "/images/services/concrete-pumping-desktop.avif",
  "/images/services/self-levelling-mortars-desktop.avif",
  "/images/services/power-floated-concrete-desktop.avif",
  "/images/services/shotcrete-desktop.avif",
  "/images/services/slope-forming-desktop.avif",
] as const;

const SERVICE_IMAGES_MOBILE = [
  "/images/services/concrete-pumping-mobile.avif",
  "/images/services/self-levelling-mortars-mobile.avif",
  "/images/services/power-floated-concrete-mobile.avif",
  "/images/services/shotcrete-mobile.avif",
  "/images/services/slope-forming-mobile.avif",
] as const;

const SERVICE_VIDEOS = [
  "https://media.levelpro.es/Videouri%20servicii/bombeos%20de%20hormigon.mp4",
  "https://media.levelpro.es/Videouri%20servicii/autonivelantes.mp4",
  "https://media.levelpro.es/Videouri%20servicii/Fratasado.mp4",
  "https://media.levelpro.es/Videouri%20servicii/gunitados.mp4",
  "https://media.levelpro.es/Videouri%20servicii/pendientes.mp4",
] as const;

const SERVICE_ANCHORS = [
  "concrete-pumping",
  "self-levelling-mortars",
  "power-floated-concrete",
  "shotcrete",
  "slope-forming",
] as const;

// Real Level Pro figures, in the same order as sp.stats.items below:
// Projects completed / Service locations / Rapid site mobilization.
const STAT_VALUES = [1500, 3, 24] as const;
const STAT_SUFFIX = ["+", "", "h"] as const;

// ─── Eyebrow — small square dot + uppercase label, same pattern as About ────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

// ─── ServicesScroll — sticky square image panel + scrolling detail list. ─────
interface ServiceDetailItem {
  name: string;
  body: string;
  funFact: string;
  bullets: string[];
  metrics: Array<{ value: string; label: string }>;
  equipment: string[];
  equipmentNote: string;
  planning: string;
  quality: string;
}

interface ServiceDetailLabels {
  performance: string;
  equipment: string;
  scope: string;
  planning: string;
  quality: string;
}

function splitServiceDescription(text: string) {
  const authoredParagraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  if (authoredParagraphs.length > 1) return authoredParagraphs;

  const firstSentenceEnd = text.indexOf(". ");
  if (firstSentenceEnd === -1) return [text];

  return [
    text.slice(0, firstSentenceEnd + 1),
    text.slice(firstSentenceEnd + 2),
  ];
}

function ServiceVideo({
  src,
  poster,
  active,
  className,
  label,
}: {
  src: string;
  poster: string;
  active: boolean;
  className: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    if (active) {
      void video.play().catch(() => {
        // Muted inline playback is allowed by modern browsers; the poster
        // remains visible if a browser still chooses to defer playback.
      });
    } else {
      video.pause();
    }
  }, [active, src]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload={active ? "auto" : "metadata"}
      aria-label={label}
      aria-hidden={!active}
      tabIndex={-1}
      onCanPlay={(event) => {
        if (active) void event.currentTarget.play().catch(() => undefined);
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function ServicesScroll({ items, labels }: { items: ServiceDetailItem[]; labels: ServiceDetailLabels }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const blockRefs = useRef<Array<HTMLElement | null>>([]);
  const photoRefs = useRef<Array<HTMLImageElement | null>>([]);
  const railFillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const updateActiveService = () => {
      const viewportHeight = window.innerHeight;
      const readingLine = viewportHeight * 0.46;
      const readingPosition = window.scrollY + readingLine;
      let nextIndex = 0;
      blockRefs.current.forEach((block, index) => {
        if (block && block.getBoundingClientRect().top <= readingLine) nextIndex = index;
      });

      // Continuous per-block parallax for the mobile photo (a no-op on
      // desktop, where photoRefs stays empty) — each image drifts for the
      // whole time its own block is transiting the viewport, independent of
      // which block is "current". Direct style write, not a CSS transition:
      // it has to track scroll 1:1, same reasoning as railFillRef below.
      if (!reduceMotion) {
        blockRefs.current.forEach((block, index) => {
          const photo = photoRefs.current[index];
          if (!block || !photo) return;
          const rect = block.getBoundingClientRect();
          const span = rect.height + viewportHeight;
          const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / span));
          photo.style.transform = `translateY(${((progress - 0.5) * 44).toFixed(1)}px)`;
        });
      }

      const firstBlock = blockRefs.current[0];
      const lastBlock = blockRefs.current[items.length - 1];
      if (firstBlock && lastBlock && railFillRef.current) {
        const firstTop = firstBlock.getBoundingClientRect().top + window.scrollY;
        const lastTop = lastBlock.getBoundingClientRect().top + window.scrollY;
        const progress = Math.min(1, Math.max(0, (readingPosition - firstTop) / Math.max(1, lastTop - firstTop)));
        railFillRef.current.style.transform = `scaleY(${progress})`;
      }
      if (firstBlock && lastBlock) {
        setMobileNavVisible(
          firstBlock.getBoundingClientRect().top <= viewportHeight * 0.9 &&
          lastBlock.getBoundingClientRect().bottom >= viewportHeight * 0.1
        );
      }

      setActiveIndex((current) => current === nextIndex ? current : nextIndex);
    };

    updateActiveService();
    window.addEventListener("scroll", updateActiveService, { passive: true });
    window.addEventListener("resize", updateActiveService);
    return () => {
      window.removeEventListener("scroll", updateActiveService);
      window.removeEventListener("resize", updateActiveService);
    };
    // isMobile is a real dependency, not just items.length: on mount this
    // effect's first synchronous call can run before the isMobile-detecting
    // effect (declared earlier) has flipped state and re-rendered the mobile
    // <img> elements into existence, so photoRefs are still all null on that
    // first pass. Re-running once isMobile actually flips re-seeds every
    // geometry-dependent value (parallax transform, nav visibility, rail
    // fill) against the now-mounted images instead of silently leaving them
    // at their unset default until the next real scroll/resize.
  }, [items.length, isMobile]);

  const navigateToService = useCallback((index: number) => {
    const target = blockRefs.current[index];
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="svc-sticky-editorial">
      <aside className="svc-sticky-media" aria-label={items[activeIndex]?.name}>
        {!isMobile && items.map((item, i) => (
          <ServiceVideo
            key={SERVICE_VIDEOS[i]}
            src={SERVICE_VIDEOS[i]}
            poster={SERVICE_IMAGES_DESKTOP[i]}
            label={item.name}
            active={i === activeIndex}
            className={`svc-sticky-image${i === activeIndex ? " is-active" : ""}`}
          />
        ))}
        <div className="svc-sticky-facts" aria-live="polite">
          {items.map((item, i) => (
            <p
              key={item.name}
              className={`svc-sticky-fact${i === activeIndex ? " is-active" : ""}`}
              aria-hidden={i !== activeIndex}
            >
              <span aria-hidden>—</span>{item.funFact}
            </p>
          ))}
        </div>
      </aside>

      <nav className="svc-service-rail" aria-label={labels.performance}>
        <span className="svc-service-rail-track" aria-hidden>
          <span ref={railFillRef} className="svc-service-rail-fill" />
        </span>
        <div className="svc-service-rail-items">
          {items.map((item, index) => (
            <a
              key={item.name}
              href={`#${SERVICE_ANCHORS[index]}`}
              className={`svc-service-rail-button${index === activeIndex ? " is-active" : ""}`}
              aria-label={item.name}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigateToService(index);
                window.history.replaceState(null, "", `#${SERVICE_ANCHORS[index]}`);
              }}
            >
              <span className="svc-service-rail-number">0{index + 1}</span>
              <span className="svc-service-rail-name" aria-hidden>{item.name}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile-only bottom nav — same glass-pill language as the site's
          NavBar (.lpnav-pill: rgba(44,44,46,0.52) + blur(18px) saturate(120%)),
          with the active item's name dilating open via the same
          grid-template-columns "make room" trick as .lpnav-pill-logo-slot. */}
      <nav
        className={`svc-mobile-rail${mobileNavVisible ? " is-visible" : ""}`}
        aria-label={labels.performance}
        aria-hidden={!mobileNavVisible}
      >
        <div className="svc-mobile-rail-pill">
          {items.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={`svc-mobile-rail-btn${index === activeIndex ? " is-active" : ""}`}
              aria-label={item.name}
              aria-current={index === activeIndex ? "step" : undefined}
              onClick={() => {
                navigateToService(index);
                window.history.replaceState(null, "", `#${SERVICE_ANCHORS[index]}`);
              }}
            >
              <span className="svc-mobile-rail-num">0{index + 1}</span>
              <span className="svc-mobile-rail-name-slot">
                <span className="svc-mobile-rail-name">{item.name}</span>
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div className="svc-editorial-list">
        {items.map((item, i) => (
          <article
            key={item.name}
            id={SERVICE_ANCHORS[i]}
            ref={(element) => { blockRefs.current[i] = element; }}
            className={`svc-editorial-item${i === activeIndex ? " is-current" : ""}`}
          >
            <div className="svc-editorial-media">
              {isMobile && (
                <img
                  ref={(element) => { photoRefs.current[i] = element; }}
                  src={SERVICE_IMAGES_MOBILE[i]}
                  alt={item.name}
                  loading="lazy"
                  className="svc-editorial-photo"
                />
              )}
            </div>

            <div className="svc-editorial-content">
              <div className="svc-editorial-inner">
                <div className="svc-editorial-main">
                  <header className="svc-editorial-header">
                    <span className="svc-editorial-index">0{i + 1}</span>
                    <h3 className="svc-editorial-name">{item.name}</h3>
                  </header>
                  <div className="svc-editorial-paragraphs">
                    {splitServiceDescription(item.body).map((paragraph) => (
                      <p key={paragraph} className="svc-editorial-body">{paragraph}</p>
                    ))}
                  </div>
                </div>

                <section className="svc-editorial-metrics" aria-label={labels.performance}>
                  {item.metrics.map((metric) => (
                    <div key={`${metric.value}-${metric.label}`} className="svc-editorial-metric">
                      <span className="svc-editorial-metric-value">{metric.value}</span>
                      <span className="svc-editorial-metric-label">{metric.label}</span>
                    </div>
                  ))}
                </section>

                <p className="svc-editorial-note">{item.quality}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicesClient({ locale: initialLocale }: { locale: Locale }) {
  const [locale, setLocale] = useLocale(initialLocale);
  const t = TRANSLATIONS[locale];
  const sp = t.servicesPage;
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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

        /* Hero — full viewport height on mobile (desktop keeps its own
           clamp), description pinned closer to the bottom edge to match. */
        .svc-hero{min-height:clamp(620px,86vh,860px);}
        .svc-hero-footer{bottom:clamp(28px,5vh,56px);}
        @media(max-width:1023.98px){
          .svc-hero{min-height:100vh;min-height:100svh;}
          .svc-hero-footer{bottom:28px;}
        }

        /* Compact scroll-controlled slide: one white card is visible while short
           scroll segments keep the image, copy and progress navigation in sync. */
        .svc-slider{position:relative;min-width:0;background:${NAVY};}
        .svc-slider-stage{position:sticky;top:0;width:100%;height:100vh;height:100svh;overflow:hidden;background:${NAVY};}
        .svc-slider-media-stack,.svc-slider-media,.svc-slider-media img{position:absolute;inset:0;width:100%;height:100%;}
        .svc-slider-media{display:block;opacity:0;transform:scale(1.018);will-change:opacity,transform;transition:opacity 0.3s ease,transform 0.55s cubic-bezier(0.16,1,0.3,1);}
        .svc-slider-media.is-active{opacity:1;transform:scale(1);}
        .svc-slider-media img{display:block;object-fit:cover;object-position:center;}
        .svc-slider-shade{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(2,10,37,0.18),rgba(2,10,37,0.02) 42%,rgba(2,10,37,0.34));pointer-events:none;}
        .svc-slider-fade{position:absolute;z-index:2;top:0;right:0;width:min(66%,960px);height:100%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.28) 45%,rgba(255,255,255,0.88) 100%);-webkit-backdrop-filter:blur(13px);backdrop-filter:blur(13px);-webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,0.24) 28%,#000 68%);mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,0.24) 28%,#000 68%);pointer-events:none;}
        .svc-slider-counter{position:absolute;z-index:4;left:clamp(24px,5vw,72px);top:clamp(104px,14vh,142px);display:flex;align-items:center;gap:11px;font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.6rem;letter-spacing:0.13em;color:rgba(255,255,255,0.84);text-shadow:0 2px 14px rgba(2,10,37,0.42);}
        .svc-slider-counter-rule{width:clamp(38px,5vw,68px);height:1px;background:rgba(255,255,255,0.5);}

        .svc-slider-card-stack{position:absolute;z-index:5;right:clamp(24px,5vw,72px);top:46%;transform:translateY(-50%);width:min(580px,calc(100vw - 48px));height:min(66svh,600px);}
        .svc-slider-card{position:absolute;inset:0;overflow:auto;scrollbar-width:none;border:1px solid rgba(255,255,255,0.76);border-radius:var(--radius);background:rgba(255,255,255,0.9);-webkit-backdrop-filter:blur(25px) saturate(112%);backdrop-filter:blur(25px) saturate(112%);box-shadow:0 28px 86px rgba(2,10,37,0.16);padding:clamp(26px,2.8vw,38px);color:${NAVY};opacity:0;visibility:hidden;transform:translateY(18px) scale(0.994);will-change:opacity,transform;transition:opacity 0.2s ease,transform 0.34s cubic-bezier(0.16,1,0.3,1),visibility 0s linear 0.2s;}
        .svc-slider-card::-webkit-scrollbar{display:none;}
        .svc-slider-card.is-active{opacity:1;visibility:visible;transform:translateY(0) scale(1);transition-delay:0s;}
        .svc-slider-card-header{display:grid;grid-template-columns:30px minmax(0,1fr);gap:13px;align-items:start;margin-bottom:clamp(15px,2vh,20px);}
        .svc-slider-card-index{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.58rem;line-height:1.4;letter-spacing:0.12em;color:var(--lp-text-meta);padding-top:8px;}
        .svc-slider-card-name{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(2rem,3.15vw,3rem);line-height:1.02;letter-spacing:-0.025em;color:${NAVY};margin:0;}
        .svc-slider-card-body{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:clamp(0.84rem,0.98vw,0.98rem);line-height:1.55;color:var(--lp-text-body);margin:0 0 clamp(18px,2.3vh,24px);}
        .svc-slider-card-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid rgba(2,10,37,0.12);border-bottom:1px solid rgba(2,10,37,0.12);margin-bottom:clamp(19px,2.4vh,25px);}
        .svc-slider-card-metric{min-width:0;padding:14px 10px;display:flex;flex-direction:column;gap:6px;}
        .svc-slider-card-metric:first-child{padding-left:0;}
        .svc-slider-card-metric+.svc-slider-card-metric{border-left:1px solid rgba(2,10,37,0.12);}
        .svc-slider-card-metric-value{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(1.03rem,1.35vw,1.28rem);line-height:1.05;color:${NAVY};letter-spacing:-0.02em;white-space:nowrap;}
        .svc-slider-card-metric-label{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.5rem;line-height:1.35;color:var(--lp-text-meta);letter-spacing:0.075em;text-transform:uppercase;}
        .svc-slider-card-section{margin-bottom:clamp(18px,2.2vh,24px);}
        .svc-slider-card-kicker{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.52rem;line-height:1.3;color:var(--lp-text-meta);letter-spacing:0.12em;text-transform:uppercase;margin:0 0 9px;}
        .svc-slider-card-points{list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px;margin:0;padding:0;}
        .svc-slider-card-points li{min-width:0;display:grid;grid-template-columns:20px minmax(0,1fr);gap:6px;padding:8px 0;border-bottom:1px solid rgba(2,10,37,0.1);}
        .svc-slider-card-points li>span{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:0.48rem;line-height:1.65;letter-spacing:0.07em;color:rgba(2,10,37,0.38);}
        .svc-slider-card-points p{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:clamp(0.68rem,0.75vw,0.76rem);line-height:1.4;color:${NAVY};margin:0;}
        .svc-slider-card-operations{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
        .svc-slider-card-operations section+section{border-left:1px solid rgba(2,10,37,0.11);padding-left:22px;}
        .svc-slider-card-machines{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.69rem,0.77vw,0.76rem);line-height:1.42;color:${NAVY};margin:0 0 7px;}
        .svc-slider-card-copy{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:clamp(0.64rem,0.7vw,0.7rem);line-height:1.48;color:var(--lp-text-body);margin:0;}

        .svc-slider-nav{position:absolute;z-index:7;left:clamp(24px,5vw,72px);right:clamp(24px,5vw,72px);bottom:clamp(18px,2.8vh,28px);display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;border:1px solid rgba(255,255,255,0.18);border-radius:var(--radius);background:rgba(2,10,37,0.48);-webkit-backdrop-filter:blur(18px) saturate(120%);backdrop-filter:blur(18px) saturate(120%);overflow:hidden;}
        .svc-slider-nav-item{position:relative;min-width:0;height:64px;display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:6px;padding:9px 13px 13px;border:0;border-left:1px solid rgba(255,255,255,0.12);background:transparent;color:rgba(255,255,255,0.48);text-align:left;cursor:pointer;transition:color 0.25s ease,background 0.25s ease;}
        .svc-slider-nav-item:first-child{border-left:0;}
        .svc-slider-nav-item:hover,.svc-slider-nav-item.is-active{color:#fff;background:rgba(255,255,255,0.08);}
        .svc-slider-nav-num{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.5rem;letter-spacing:0.1em;}
        .svc-slider-nav-name{min-width:0;font-family:var(--font-inter),sans-serif;font-weight:500;font-size:clamp(0.58rem,0.72vw,0.69rem);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .svc-slider-nav-track{position:absolute;left:13px;right:13px;bottom:8px;height:1px;background:rgba(255,255,255,0.18);overflow:hidden;}
        .svc-slider-nav-track>span{display:block;width:100%;height:100%;background:#fff;transform:scaleX(0);transform-origin:left;transition:transform 0.12s linear;}
        .svc-slider-nav-item.is-active .svc-slider-nav-track>span{transform:scaleX(var(--svc-progress,0));}

        .svc-slider-triggers{position:absolute;inset:0;z-index:0;pointer-events:none;}
        .svc-slider-trigger{height:32vh;height:32svh;scroll-margin-top:0;}
        .svc-slider-trigger:last-child{height:100vh;height:100svh;}

        @media(max-width:840px){
          .svc-slider-media img{object-position:center;}
          .svc-slider-shade{background:linear-gradient(180deg,rgba(2,10,37,0.16),rgba(2,10,37,0.02) 30%,rgba(2,10,37,0.3) 62%,rgba(2,10,37,0.52));}
          .svc-slider-fade{top:auto;bottom:0;width:100%;height:72%;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.46) 32%,rgba(255,255,255,0.94) 72%);-webkit-mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.2) 24%,#000 68%);mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.2) 24%,#000 68%);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);}
          .svc-slider-counter{left:18px;top:82px;font-size:0.52rem;}
          .svc-slider-card-stack{left:13px;right:13px;top:auto;bottom:13px;transform:none;width:auto;height:min(63svh,570px);}
          .svc-slider-card{padding:20px 19px 76px;border-color:rgba(255,255,255,0.84);background:rgba(255,255,255,0.92);}
          .svc-slider-card-header{grid-template-columns:24px minmax(0,1fr);gap:8px;margin-bottom:11px;}
          .svc-slider-card-index{font-size:0.51rem;padding-top:6px;}
          .svc-slider-card-name{font-size:clamp(1.65rem,7.5vw,2rem);}
          .svc-slider-card-body{font-size:clamp(0.76rem,3.25vw,0.84rem);line-height:1.48;margin-bottom:14px;}
          .svc-slider-card-metrics{margin-bottom:14px;}
          .svc-slider-card-metric{padding:10px 7px;gap:4px;}
          .svc-slider-card-metric-value{font-size:clamp(0.82rem,3.6vw,0.98rem);white-space:normal;overflow-wrap:anywhere;}
          .svc-slider-card-metric-label{font-size:0.43rem;letter-spacing:0.055em;}
          .svc-slider-card-section{margin-bottom:14px;}
          .svc-slider-card-kicker{font-size:0.47rem;margin-bottom:6px;}
          .svc-slider-card-points{column-gap:12px;}
          .svc-slider-card-points li{grid-template-columns:16px minmax(0,1fr);gap:5px;padding:6px 0;}
          .svc-slider-card-points li>span{font-size:0.43rem;}
          .svc-slider-card-points p{font-size:clamp(0.59rem,2.6vw,0.67rem);line-height:1.34;}
          .svc-slider-card-operations{grid-template-columns:1fr;gap:12px;}
          .svc-slider-card-operations section+section{border-left:0;border-top:1px solid rgba(2,10,37,0.11);padding:12px 0 0;}
          .svc-slider-card-machines{font-size:clamp(0.62rem,2.7vw,0.7rem);margin-bottom:5px;}
          .svc-slider-card-copy{font-size:clamp(0.57rem,2.45vw,0.64rem);line-height:1.42;}
          .svc-slider-nav{left:13px;right:13px;bottom:25px;display:flex;gap:0;border-radius:10px;overflow-x:auto;scrollbar-width:none;}
          .svc-slider-nav::-webkit-scrollbar{display:none;}
          .svc-slider-nav-item{flex:0 0 112px;height:46px;grid-template-columns:19px minmax(0,1fr);padding:7px 9px 11px;}
          .svc-slider-nav-num{font-size:0.44rem;}
          .svc-slider-nav-name{font-size:0.54rem;}
          .svc-slider-nav-track{left:9px;right:9px;bottom:6px;}
        }

        /* Services retain the original split-scroll flow: one sticky image on
           desktop and naturally stacked, information-rich chapters beside it. */
        .svc-split{display:grid;grid-template-columns:minmax(300px,0.88fr) minmax(0,1.12fr);gap:clamp(54px,7vw,116px);align-items:start;padding:0 clamp(24px,5vw,72px);}
        .svc-split-visual{position:sticky;top:clamp(94px,12vh,126px);width:100%;}
        .svc-visual-frame{position:relative;width:100%;aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;background:rgba(2,10,37,0.055);}
        .svc-visual-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;opacity:0;transform:scale(1.018);transition:opacity 0.5s ease,transform 0.72s cubic-bezier(0.16,1,0.3,1);}
        .svc-visual-image.is-active{opacity:1;transform:scale(1);}
        .svc-visual-meta{display:flex;align-items:center;gap:11px;margin-top:15px;font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.54rem;letter-spacing:0.13em;color:var(--lp-text-meta);}
        .svc-visual-meta-line{width:clamp(36px,4vw,62px);height:1px;background:rgba(2,10,37,0.18);}

        .svc-list{min-width:0;display:flex;flex-direction:column;gap:clamp(22px,2.6vw,34px);}
        .svc-block{position:relative;min-width:0;padding:clamp(34px,3.6vw,50px);scroll-margin-top:clamp(82px,10vh,108px);border:1px solid rgba(2,10,37,0.1);border-radius:var(--radius);background:${ALT_BG};overflow:hidden;}
        .svc-block::before{content:"";position:absolute;top:0;left:clamp(34px,3.6vw,50px);width:clamp(52px,5vw,76px);height:3px;background:${NAVY};}
        .svc-block+.svc-block{border-top:1px solid rgba(2,10,37,0.1);}
        .svc-block-mvisual{display:none;}
        .svc-block-header{display:grid;grid-template-columns:30px minmax(0,1fr);gap:clamp(11px,1.2vw,17px);align-items:start;margin-bottom:clamp(18px,2.3vh,24px);}
        .svc-block-index{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.58rem;line-height:1.4;letter-spacing:0.13em;color:var(--lp-text-meta);padding-top:clamp(8px,1vh,11px);}
        .svc-block-name{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(2rem,3.2vw,3rem);line-height:1.02;letter-spacing:-0.027em;color:${NAVY};margin:0;}
        .svc-block-body{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:var(--lp-body-fs);line-height:var(--lp-body-lh);color:var(--lp-text-body);max-width:68ch;margin:0 0 clamp(24px,3.2vh,34px);}

        .svc-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:clamp(26px,3.4vh,36px);}
        .svc-metric{min-width:0;padding:clamp(15px,1.7vw,20px);display:flex;flex-direction:column;gap:7px;border:1px solid rgba(2,10,37,0.09);border-radius:var(--radius-sm);background:#fff;}
        .svc-metric:first-child{padding-left:clamp(15px,1.7vw,20px);}
        .svc-metric+.svc-metric{border-left:1px solid rgba(2,10,37,0.09);}
        .svc-metric-value{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(1.22rem,1.7vw,1.65rem);line-height:1.05;letter-spacing:-0.025em;color:${NAVY};}
        .svc-metric-label{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.5rem,0.58vw,0.57rem);line-height:1.35;letter-spacing:0.08em;text-transform:uppercase;color:var(--lp-text-meta);}

        .svc-detail-layout{display:grid;grid-template-columns:minmax(0,0.92fr) minmax(240px,1.08fr);gap:12px;align-items:stretch;}
        .svc-detail-kicker{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.53rem,0.62vw,0.6rem);line-height:1.3;letter-spacing:0.12em;text-transform:uppercase;color:var(--lp-text-meta);margin:0 0 14px;}
        .svc-applications,.svc-technical-column{min-width:0;border:1px solid rgba(2,10,37,0.09);border-radius:var(--radius-sm);background:#fff;padding:clamp(19px,2vw,25px);}
        .svc-application-list{list-style:none;margin:0;padding:0;border-top:1px solid rgba(2,10,37,0.1);}
        .svc-application-list li{display:grid;grid-template-columns:25px minmax(0,1fr);gap:8px;padding:13px 0;border-bottom:1px solid rgba(2,10,37,0.1);}
        .svc-application-list li>span{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:0.49rem;line-height:1.7;letter-spacing:0.08em;color:rgba(2,10,37,0.38);}
        .svc-application-list p{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:clamp(0.75rem,0.84vw,0.84rem);line-height:1.45;color:${NAVY};margin:0;}
        .svc-technical-column{display:flex;flex-direction:column;}
        .svc-technical-section{padding:clamp(16px,2vh,21px) 0;border-bottom:1px solid rgba(2,10,37,0.1);}
        .svc-technical-section:first-child{padding-top:0;}
        .svc-technical-section:last-child{border-bottom:0;padding-bottom:0;}
        .svc-equipment-tags{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 11px;}
        .svc-equipment-tags span{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:clamp(0.61rem,0.68vw,0.67rem);line-height:1.25;color:${NAVY};border:1px solid rgba(2,10,37,0.13);border-radius:999px;padding:6px 9px;background:#fff;}
        .svc-detail-copy{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:clamp(0.71rem,0.8vw,0.79rem);line-height:1.58;color:var(--lp-text-body);margin:0;}

        @media(max-width:980px){
          .svc-split{grid-template-columns:minmax(250px,0.78fr) minmax(0,1.22fr);gap:clamp(32px,5vw,54px);}
          .svc-detail-layout{grid-template-columns:1fr;gap:28px;}
          .svc-block{padding:clamp(30px,4vw,40px);}
        }
        @media(max-width:720px){
          .svc-split{display:block;padding:0 clamp(20px,5vw,32px);}
          .svc-split-visual{display:none;}
          .svc-block{padding:22px 20px 24px;scroll-margin-top:72px;}
          .svc-block::before{left:20px;width:52px;}
          .svc-block-mvisual{display:block;width:100%;aspect-ratio:4/3;border-radius:var(--radius);overflow:hidden;background:rgba(2,10,37,0.055);margin-bottom:26px;}
          .svc-block-mvisual img{width:100%;height:100%;object-fit:cover;display:block;}
          .svc-block-header{grid-template-columns:24px minmax(0,1fr);gap:8px;margin-bottom:16px;}
          .svc-block-index{font-size:0.51rem;padding-top:7px;}
          .svc-block-name{font-size:clamp(1.8rem,8vw,2.25rem);}
          .svc-block-body{font-size:var(--lp-body-fs);line-height:var(--lp-body-lh);margin-bottom:24px;}
          .svc-metrics{margin-bottom:29px;}
          .svc-metric{padding:15px 7px;gap:5px;}
          .svc-metric-value{font-size:clamp(0.96rem,4.3vw,1.18rem);overflow-wrap:anywhere;}
          .svc-metric-label{font-size:0.46rem;letter-spacing:0.055em;}
          .svc-detail-layout{gap:10px;}
          .svc-applications,.svc-technical-column{padding:18px;}
          .svc-application-list li{padding:12px 0;}
          .svc-application-list p{font-size:0.78rem;}
          .svc-detail-copy{font-size:0.76rem;}
        }

        /* Editorial service chapters: the media keeps an exact 3:4 portrait
           frame while the technical story is arranged on the remaining 60%. */
        .svc-sticky-editorial{display:grid;grid-template-columns:minmax(0,40%) minmax(0,60%);align-items:start;width:100%;border-top:1px solid rgba(2,10,37,0.11);}
        .svc-sticky-media{position:sticky;top:0;width:max(100%,75svh);max-width:none;aspect-ratio:3/4;height:100vh;height:100svh;justify-self:start;overflow:hidden;background:rgba(2,10,37,0.055);}
        .svc-sticky-media::after{content:"";position:absolute;z-index:1;inset:auto 0 0;height:30%;background:linear-gradient(180deg,transparent,rgba(2,10,37,0.42));pointer-events:none;}
        .svc-sticky-image{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;object-position:center;opacity:0;transform:scale(1.018);will-change:opacity,transform;transition:opacity 0.48s ease,transform 0.72s cubic-bezier(0.16,1,0.3,1);}
        .svc-sticky-image.is-active{opacity:1;transform:scale(1);}
        .svc-sticky-progress{position:absolute;z-index:2;left:clamp(22px,3vw,44px);right:clamp(22px,3vw,44px);bottom:clamp(24px,4vh,42px);display:grid;grid-template-columns:auto minmax(50px,1fr) auto;align-items:center;gap:12px;font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.56rem;letter-spacing:0.13em;color:rgba(255,255,255,0.88);}
        .svc-sticky-progress-line{height:1px;background:rgba(255,255,255,0.34);overflow:hidden;}
        .svc-sticky-progress-line i{display:block;width:100%;height:100%;background:#fff;transform-origin:left;transition:transform 0.5s cubic-bezier(0.16,1,0.3,1);}
        .svc-editorial-list{min-width:0;border-left:1px solid rgba(2,10,37,0.08);}
        .svc-editorial-item{display:block;min-height:clamp(720px,92vh,900px);min-height:clamp(720px,92svh,900px);background:#fff;border-bottom:1px solid rgba(2,10,37,0.11);scroll-margin-top:84px;}
        .svc-editorial-media{position:relative;display:none;min-width:0;overflow:hidden;background:rgba(2,10,37,0.055);}
        .svc-editorial-media::after{content:"";position:absolute;inset:0;box-shadow:inset -1px 0 rgba(2,10,37,0.08);pointer-events:none;}
        .svc-editorial-content{min-width:0;min-height:inherit;display:flex;flex-direction:column;padding:clamp(34px,4vw,64px) clamp(30px,4.7vw,76px) clamp(30px,3.8vw,56px);}
        .svc-editorial-main{border-top:1px solid rgba(2,10,37,0.12);padding-top:clamp(22px,2.5vh,30px);}
        .svc-editorial-header{display:grid;grid-template-columns:30px minmax(0,1fr);align-items:start;gap:clamp(10px,1vw,16px);margin-bottom:clamp(18px,2.3vh,24px);}
        .svc-editorial-index{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.56rem;line-height:1.4;letter-spacing:0.13em;color:var(--lp-text-meta);padding-top:clamp(7px,0.9vh,10px);}
        .svc-editorial-name{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(2.05rem,3.35vw,3.45rem);line-height:1.02;letter-spacing:-0.03em;color:${NAVY};margin:0;}
        .svc-editorial-paragraphs{display:flex;flex-direction:column;gap:clamp(14px,2vh,20px);max-width:68ch;}
        .svc-editorial-body{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:var(--lp-body-fs);line-height:var(--lp-body-lh);color:var(--lp-text-body);margin:0;}

        .svc-editorial-details{display:grid;grid-template-columns:minmax(190px,0.78fr) minmax(280px,1.22fr);gap:clamp(26px,3.5vw,54px);margin-top:clamp(28px,4vh,46px);padding-top:clamp(24px,3.2vh,36px);border-top:1px solid rgba(2,10,37,0.1);}
        .svc-editorial-kicker{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.52rem,0.6vw,0.58rem);line-height:1.3;letter-spacing:0.13em;text-transform:uppercase;color:var(--lp-text-meta);margin:0 0 14px;}
        .svc-editorial-points{list-style:none;margin:0;padding:0;border-top:1px solid rgba(2,10,37,0.1);}
        .svc-editorial-points li{display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;padding:11px 0;border-bottom:1px solid rgba(2,10,37,0.1);}
        .svc-editorial-points li>span{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:0.48rem;line-height:1.7;letter-spacing:0.08em;color:rgba(2,10,37,0.38);}
        .svc-editorial-points p{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:clamp(0.73rem,0.82vw,0.82rem);line-height:1.45;color:${NAVY};margin:0;}
        .svc-editorial-operations{min-width:0;}
        .svc-editorial-operation{padding:0 0 clamp(13px,1.8vh,18px);margin-bottom:clamp(13px,1.8vh,18px);border-bottom:1px solid rgba(2,10,37,0.1);}
        .svc-editorial-operation:last-child{margin-bottom:0;}
        .svc-editorial-tags{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 10px;}
        .svc-editorial-tags span{font-family:var(--font-inter),sans-serif;font-weight:500;font-size:clamp(0.61rem,0.68vw,0.67rem);line-height:1.25;color:${NAVY};border:1px solid rgba(2,10,37,0.13);border-radius:999px;padding:6px 9px;background:#fff;}
        .svc-editorial-copy{font-family:var(--font-inter),sans-serif;font-weight:400;font-size:clamp(0.7rem,0.78vw,0.78rem);line-height:1.57;color:var(--lp-text-body);margin:0;}

        .svc-editorial-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:auto;padding-top:clamp(26px,3.5vh,38px);border-top:1px solid rgba(2,10,37,0.12);}
        .svc-editorial-metric{min-width:0;padding:0 clamp(12px,1.6vw,24px);display:flex;flex-direction:column;gap:8px;}
        .svc-editorial-metric:first-child{padding-left:0;}
        .svc-editorial-metric+.svc-editorial-metric{border-left:1px solid rgba(2,10,37,0.12);}
        .svc-editorial-metric-value{font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(1.35rem,2.1vw,2.15rem);line-height:1.02;letter-spacing:-0.025em;color:${NAVY};white-space:nowrap;}
        .svc-editorial-metric-label{font-family:var(--font-inter),sans-serif;font-weight:600;font-size:clamp(0.49rem,0.56vw,0.55rem);line-height:1.35;letter-spacing:0.08em;text-transform:uppercase;color:var(--lp-text-meta);}

        @media(max-width:1080px){
          .svc-editorial-content{padding:34px clamp(26px,3.5vw,44px) 30px;}
          .svc-editorial-details{grid-template-columns:1fr;gap:24px;}
          .svc-editorial-item{min-height:max(760px,92svh);}
        }
        @media(max-width:720px){
          .svc-sticky-editorial{display:block;}
          .svc-sticky-media{display:none;}
          .svc-editorial-list{border-left:0;}
          .svc-editorial-item{display:block;min-height:0;scroll-margin-top:72px;}
          .svc-editorial-media{display:block;width:100%;min-height:0;aspect-ratio:4/3;}
          .svc-editorial-media::after{box-shadow:inset 0 -1px rgba(2,10,37,0.08);}
          .svc-editorial-content{padding:26px 20px 32px;}
          .svc-editorial-main{padding-top:20px;}
          .svc-editorial-header{grid-template-columns:24px minmax(0,1fr);gap:7px;margin-bottom:16px;}
          .svc-editorial-index{font-size:0.5rem;padding-top:7px;}
          .svc-editorial-name{font-size:clamp(1.8rem,8vw,2.25rem);}
          .svc-editorial-details{grid-template-columns:1fr;gap:24px;margin-top:28px;padding-top:24px;}
          .svc-editorial-points p{font-size:0.78rem;}
          .svc-editorial-copy{font-size:0.76rem;}
          .svc-editorial-metrics{margin-top:30px;padding-top:24px;}
          .svc-editorial-metric{padding:0 9px;gap:6px;}
          .svc-editorial-metric:first-child{padding-left:0;}
          .svc-editorial-metric-value{font-size:clamp(0.72rem,3.45vw,1.22rem);}
          .svc-editorial-metric-label{font-size:0.45rem;letter-spacing:0.055em;}
        }

        /* Refined service story: all information is held in one vertically
           centred composition, while the media column carries the changing fact. */
        .svc-sticky-editorial{position:relative;grid-template-columns:minmax(0,40%) minmax(0,60%);--svc-detail-gap:clamp(30px,3.2vw,52px);--svc-media-overhang:max(0px,calc(75svh - 40vw));--svc-rail-width:clamp(38px,3.2vw,48px);--svc-rail-offset:clamp(19px,1.6vw,24px);}
        .svc-sticky-media{grid-column:1;grid-row:1;}
        .svc-editorial-list{grid-column:2;grid-row:1;}
        .svc-sticky-media::before{content:"";position:absolute;z-index:1;left:0;right:0;bottom:0;height:43%;background:rgba(2,10,37,0.18);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);-webkit-mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.34) 34%,#000 82%);mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.34) 34%,#000 82%);pointer-events:none;}
        .svc-sticky-media::after{height:48%;background:linear-gradient(180deg,transparent 0%,rgba(2,10,37,0.16) 40%,rgba(2,10,37,0.76) 100%);}
        .svc-sticky-image{transform:scale(1.035);filter:saturate(0.94);transition:opacity 0.56s ease,transform 1.05s cubic-bezier(0.16,1,0.3,1),filter 0.75s ease;}
        .svc-sticky-image.is-active{transform:scale(1);filter:saturate(1);}
        .svc-sticky-facts{position:absolute;z-index:3;left:clamp(26px,3.5vw,54px);right:clamp(26px,3.5vw,54px);bottom:clamp(54px,7.5vh,76px);height:clamp(88px,15vh,138px);pointer-events:none;}
        .svc-sticky-fact{position:absolute;inset:auto 0 0;max-width:25ch;font-family:var(--font-inter),sans-serif;font-weight:300;font-size:clamp(1.18rem,2.15vw,2.15rem);line-height:1.14;letter-spacing:-0.025em;color:#fff;text-shadow:0 4px 30px rgba(2,10,37,0.35);opacity:0;filter:blur(8px);transform:translateY(22px);clip-path:inset(100% 0 0 0);transition:opacity 0.34s ease,filter 0.5s ease,transform 0.72s cubic-bezier(0.16,1,0.3,1),clip-path 0.72s cubic-bezier(0.16,1,0.3,1);}
        .svc-sticky-fact span{display:inline-block;margin-right:0.22em;}
        .svc-sticky-fact.is-active{opacity:1;filter:blur(0);transform:translateY(0);clip-path:inset(0 0 0 0);transition-delay:0.12s;}
        .svc-service-rail{position:sticky;top:0;z-index:6;grid-column:2;grid-row:1;align-self:start;justify-self:end;width:var(--svc-rail-width);height:100vh;height:100svh;display:flex;align-items:center;justify-content:center;pointer-events:none;isolation:isolate;}
        .svc-service-rail::before{display:none;}
        .svc-service-rail-track{position:absolute;z-index:1;top:calc(20% + 10px);bottom:calc(20% + 10px);left:50%;width:1px;overflow:hidden;background:rgba(2,10,37,0.1);transform:translateX(-50%);}
        .svc-service-rail-fill{display:block;width:100%;height:100%;background:${NAVY};transform:scaleY(0);transform-origin:top;will-change:transform;}
        .svc-service-rail-items{position:absolute;z-index:2;top:20%;bottom:20%;left:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;}
        .svc-service-rail-button{position:relative;width:28px;height:28px;border:0;border-radius:999px;background:transparent;color:rgba(2,10,37,0.38);display:grid;place-items:center;pointer-events:auto;cursor:pointer;outline:none;}
        .svc-service-rail-number{position:relative;z-index:2;width:20px;height:20px;border:1px solid rgba(2,10,37,0.08);border-radius:999px;background:#fff;display:grid;place-items:center;font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.42rem;line-height:1;letter-spacing:0.06em;transform:translateX(0.03em);transition:width 0.32s cubic-bezier(0.16,1,0.3,1),height 0.32s cubic-bezier(0.16,1,0.3,1),color 0.24s ease,background 0.28s ease,border-color 0.24s ease,transform 0.32s cubic-bezier(0.16,1,0.3,1);}
        .svc-service-rail-name{position:absolute;z-index:4;top:50%;right:calc(100% + 10px);max-width:240px;padding:9px 13px;border:1px solid rgba(255,255,255,0.16);border-radius:999px;background:rgba(2,10,37,0.88);-webkit-backdrop-filter:blur(14px) saturate(120%);backdrop-filter:blur(14px) saturate(120%);box-shadow:0 12px 34px rgba(2,10,37,0.16);font-family:var(--font-inter),sans-serif;font-weight:500;font-size:0.62rem;line-height:1.2;letter-spacing:0.01em;color:#fff;white-space:nowrap;opacity:0;visibility:hidden;transform:translate(7px,-50%);transition:opacity 0.22s ease,transform 0.36s cubic-bezier(0.16,1,0.3,1),visibility 0s linear 0.25s;pointer-events:none;}
        .svc-service-rail-button:hover .svc-service-rail-number,.svc-service-rail-button:focus-visible .svc-service-rail-number{color:${NAVY};border-color:rgba(2,10,37,0.2);transform:translateX(0.03em) scale(1.04);}
        .svc-service-rail-button:hover .svc-service-rail-name,.svc-service-rail-button:focus-visible .svc-service-rail-name{opacity:1;visibility:visible;transform:translate(0,-50%);transition-delay:0s;}
        .svc-service-rail-button:focus-visible{box-shadow:0 0 0 3px rgba(2,10,37,0.1);}
        .svc-service-rail-button.is-active .svc-service-rail-number{width:26px;height:26px;color:#fff;background:${NAVY};border-color:${NAVY};box-shadow:0 6px 16px rgba(2,10,37,0.14);}

        .svc-editorial-item{min-height:100vh;min-height:100svh;}
        .svc-editorial-content{justify-content:center;padding-top:clamp(48px,7vh,78px);padding-right:calc(var(--svc-detail-gap) + var(--svc-rail-offset));padding-bottom:clamp(48px,7vh,78px);padding-left:calc(var(--svc-detail-gap) + var(--svc-media-overhang));}
        .svc-editorial-inner{width:100%;max-width:760px;margin:auto;opacity:0.68;transform:translateY(16px);transition:opacity 0.52s ease,transform 0.78s cubic-bezier(0.16,1,0.3,1);}
        .svc-editorial-item.is-current .svc-editorial-inner{opacity:1;transform:translateY(0);}
        .svc-editorial-main{border-top:0;padding-top:0;}
        .svc-editorial-header{margin-bottom:clamp(20px,2.8vh,28px);}
        .svc-editorial-name{font-size:clamp(2.15rem,3.55vw,3.65rem);}
        .svc-editorial-body{max-width:68ch;}
        .svc-editorial-metrics{margin-top:clamp(30px,4.2vh,44px);padding:clamp(20px,2.8vh,28px) 0;border-bottom:1px solid rgba(2,10,37,0.12);}
        .svc-editorial-note{max-width:70ch;margin:clamp(24px,3.4vh,34px) 0 0;font-family:var(--font-inter),sans-serif;font-weight:400;font-size:clamp(0.69rem,0.82vw,0.8rem);line-height:1.66;color:rgba(2,10,37,0.48);}
        .svc-editorial-media-shade,.svc-editorial-media-fact{display:none;}

        @media(max-width:1080px){
          .svc-editorial-content{padding-top:44px;padding-bottom:44px;}
          .svc-editorial-item{min-height:92vh;min-height:92svh;}
          .svc-editorial-name{font-size:clamp(1.95rem,3.65vw,2.8rem);}
        }
        /* Mobile-only bottom nav — fixed glass pill, same recipe as the
           NavBar's .lpnav-pill (rgba(44,44,46,0.52) + blur(18px) saturate(120%)).
           Hidden by default/on desktop; shown only <=720px below. */
        .svc-mobile-rail{display:none;position:fixed;left:0;right:0;bottom:0;z-index:60;justify-content:center;padding:0 16px calc(16px + env(safe-area-inset-bottom,0px));opacity:0;transform:translateY(14px);pointer-events:none;transition:opacity 0.4s ease,transform 0.4s cubic-bezier(0.22,1,0.36,1);}
        .svc-mobile-rail.is-visible{opacity:1;transform:translateY(0);pointer-events:auto;}
        .svc-mobile-rail-pill{display:flex;align-items:center;gap:4px;max-width:100%;overflow-x:auto;scrollbar-width:none;padding:6px;border-radius:var(--radius);background:rgba(44,44,46,0.6);-webkit-backdrop-filter:blur(18px) saturate(120%);backdrop-filter:blur(18px) saturate(120%);box-shadow:0 18px 40px rgba(2,10,37,0.28);}
        .svc-mobile-rail-pill::-webkit-scrollbar{display:none;}
        .svc-mobile-rail-btn{flex-shrink:0;display:flex;align-items:center;height:38px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,0.55);cursor:pointer;padding:0;transition:background 0.3s ease,color 0.3s ease;}
        .svc-mobile-rail-btn.is-active{background:rgba(255,255,255,0.16);color:#ffffff;}
        .svc-mobile-rail-num{flex-shrink:0;width:38px;height:38px;display:grid;place-items:center;font-family:var(--font-inter),sans-serif;font-weight:600;font-size:0.62rem;letter-spacing:0.05em;}
        .svc-mobile-rail-name-slot{display:grid;grid-template-columns:0fr;overflow:hidden;transition:grid-template-columns 0.45s cubic-bezier(0.22,1,0.36,1);}
        .svc-mobile-rail-btn.is-active .svc-mobile-rail-name-slot{grid-template-columns:1fr;}
        .svc-mobile-rail-name{min-width:0;max-width:136px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;opacity:0;display:block;font-family:var(--font-inter),sans-serif;font-weight:500;font-size:0.68rem;letter-spacing:0.01em;padding-right:14px;transition:opacity 0.3s ease;}
        .svc-mobile-rail-btn.is-active .svc-mobile-rail-name{opacity:1;transition-delay:0.12s;}
        @media(max-width:720px){
          /* Full-screen "story" chapters: each service gets a full viewport
             height (mirrors the desktop pattern above, which mobile used to
             override back to min-height:0), instead of stacking as tall as
             its own content — the old approach read as one long continuous
             article rather than five distinct services. Scroll-snap was
             tried here and removed — mandatory snap fought real touch/
             momentum scrolling on mobile Safari (worked fine in mechanical
             testing but was reported as broken/janky on an actual device) —
             this is free-scroll, same as the rest of the site. */
          .svc-service-rail{display:none;}
          .svc-editorial-item{display:flex;flex-direction:column;min-height:100svh;}
          .svc-editorial-media{isolation:isolate;flex-shrink:0;}
          .svc-editorial-media::after{content:none;}
          /* Oversized (136% height, -18% top) so the continuous scroll-linked
             translateY written in the effect above (±22px) has travel room
             without ever showing an edge, even at narrow viewports where the
             4:3 frame itself is shortest — recomputed for 4:3 (shorter than
             the previous 3:4) so the overhang-to-shift margin doesn't shrink.
             No entrance reveal — the photo is visible immediately. */
          .svc-editorial-photo{position:absolute;left:0;right:0;top:-18%;width:100%;height:136%;object-fit:cover;object-position:center;display:block;}
          /* min-height:0 overrides the desktop rule's min-height:inherit —
             there .svc-editorial-content is the sole flex child so
             inheriting the item's 100vh is harmless, but here it shares the
             flex column with .svc-editorial-media, so an inherited 100svh
             on top of the image's own height was inflating each chapter
             to image-height + 100svh instead of just 100svh total. */
          .svc-editorial-content{flex:1;min-height:0;justify-content:center;padding:28px 20px 38px;}
          .svc-editorial-inner,.svc-editorial-item.is-current .svc-editorial-inner{opacity:1;transform:none;}
          .svc-editorial-main{border-top:0;padding-top:0;}
          .svc-editorial-name{font-size:clamp(1.8rem,8vw,2.25rem);}
          .svc-editorial-metrics{margin-top:28px;padding:20px 0;}
          .svc-editorial-note{margin-top:24px;font-size:0.73rem;line-height:1.6;}
          .svc-mobile-rail{display:flex;}
        }
        @media(prefers-reduced-motion:reduce){
          .svc-sticky-image,.svc-sticky-fact,.svc-editorial-inner,.svc-service-rail-button,.svc-service-rail-number,.svc-service-rail-name,.svc-editorial-photo,.svc-mobile-rail,.svc-mobile-rail-name-slot{transition:none!important;}
          .svc-editorial-photo{clip-path:none!important;transform:none!important;}
        }

        /* ── Stats row — same divided count-up row used on About/Home ── */
        .stats-row{display:flex;}
        .stat-block{flex:1;min-width:0;padding:clamp(32px,4.5vw,60px) clamp(20px,3vw,48px);border-left:1px solid rgba(2,10,37,0.08);position:relative;}
        .stat-block:first-child{border-left:none;padding-left:0;}
        .stat-val{font-family:var(--font-inter),sans-serif;font-weight:200;font-size:clamp(3rem,6vw,5.5rem);color:${NAVY};letter-spacing:-0.03em;line-height:1;margin:0 0 clamp(8px,1.2vh,14px) 0;}
        .stat-label{font-family:var(--font-inter),sans-serif;font-size:clamp(0.74rem,0.85vw,0.8rem);color:var(--lp-text-meta);letter-spacing:0.01em;line-height:1.5;}
        @media(max-width:640px){
          .stat-block{padding:clamp(20px,5vw,32px) 0!important;border-left:none!important;border-top:1px solid rgba(2,10,37,0.08)!important;}
          .stat-block:first-child{border-top:none!important;padding-top:clamp(20px,5vw,32px)!important;}
          .stats-row{flex-direction:column!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} logoFloating={logoFloating} logoFloatingTone="light" logoFloatingDesktopOnly />

      {/* ─── HERO: spacious white intro, same pattern as About ─────────────── */}
      <section className="svc-hero" style={{ position: "relative", overflow: "hidden", backgroundColor: "#ffffff" }}>
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: "46%", aspectRatio: "1", background: `radial-gradient(circle, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.03) 45%, transparent 72%)`, filter: "blur(10px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "clamp(120px,15vh,168px) clamp(24px,5vw,72px) 0" }}>
          <div style={{ animation: "fadeUp 0.7s ease 0.1s both", marginBottom: "clamp(20px,2.8vh,28px)" }}>
            <Eyebrow>{sp.hero.label}</Eyebrow>
          </div>
          <h1 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(2.6rem,6.2vw,6.2rem)", lineHeight: 1.0, color: NAVY, margin: 0, letterSpacing: "-0.03em", maxWidth: "900px", animation: "fadeUp 0.8s ease 0.2s both" }}>
            {sp.hero.headingLine1}<br />
            <span style={{ color: "rgba(2,10,37,0.35)" }}>{sp.hero.headingLine2}</span><br />
            {sp.hero.headingLine3}
          </h1>
        </div>

        <div className="svc-hero-footer flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 lg:gap-6" style={{ position: "absolute", left: 0, right: 0, zIndex: 1, padding: "0 clamp(24px,5vw,72px)" }}>
          <div className="order-2 lg:order-1 hidden lg:flex" style={{ flexDirection: "column", alignItems: "center", gap: "10px", animation: "fadeIn 1s ease 0.6s both" }}>
            <span style={{ width: "1px", height: "22px", background: "rgba(2,10,37,0.22)" }} />
            <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(2,10,37,0.4)" }}>{sp.hero.scrollLabel}</span>
          </div>
          <p className="order-1 lg:order-2 text-left lg:text-right" style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "var(--lp-subtitle-fs)", lineHeight: 1.5, maxWidth: "460px", margin: 0, animation: "fadeUp 0.8s ease 0.5s both" }}>
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

      {/* ─── SERVICES: sticky split-scroll list ───────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", paddingTop: "clamp(56px,8vh,88px)" }}>
        <ServicesScroll items={sp.detail.items} labels={sp.detail.labels} />
      </section>

      {/* ─── Mission — statement + photo, link to About ─────────────────────── */}
      <section style={{ backgroundColor: ALT_BG, padding: "clamp(84px,13vh,144px) clamp(24px,5vw,72px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div style={{ marginBottom: "clamp(20px,2.8vh,28px)" }}>
              <Eyebrow>{sp.mission.label}</Eyebrow>
            </div>
            <RevealText as="h2" text={sp.mission.heading} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 1.08, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: "0 0 clamp(24px,3.4vh,32px) 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2.2vh,22px)", marginBottom: "clamp(26px,3.5vh,34px)" }}>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                {sp.mission.body1}
              </p>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                {sp.mission.body2}
              </p>
            </div>
            <Link href={navHref(locale, "about")} className="inline-flex items-center gap-[9px] hover:gap-[13px] border-b border-[rgba(2,10,37,0.3)] hover:border-[#020A25] pb-1 transition-all duration-300" style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.72rem,0.86vw,0.8rem)", letterSpacing: "0.02em", color: NAVY }}>
              {sp.mission.btn} <span aria-hidden>→</span>
            </Link>
          </div>
          <div style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: "var(--radius)", overflow: "hidden" }}>
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
          <RevealText as="h2" text={sp.process.heading} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.98, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: 0 }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {sp.process.steps.map((step, i) => (
            <div key={i} className="bg-white border border-[rgba(2,10,37,0.1)] rounded-[var(--radius)] flex flex-col" style={{ padding: "clamp(26px,3vw,38px)", minHeight: "clamp(200px,24vh,260px)" }}>
              <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(2.2rem,3.6vw,3.4rem)", color: NAVY, opacity: 0.28, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "auto" }}>{step.num}</span>
              <h3 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-h3-fs)", color: NAVY, margin: "clamp(20px,3vh,30px) 0 clamp(10px,1.5vh,14px) 0", letterSpacing: "-0.01em" }}>{step.title}</h3>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>{step.desc}</p>
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
          <RevealText as="h2" text={sp.locations.heading} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.98, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: 0 }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {sp.locations.items.map((loc, i) => (
            <div key={i} className="bg-white border border-[rgba(2,10,37,0.1)] rounded-[var(--radius)] flex flex-col" style={{ padding: "clamp(28px,3vw,42px)", minHeight: "clamp(220px,26vh,280px)" }}>
              <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.6rem,0.74vw,0.68rem)", letterSpacing: "0.14em", color: "var(--lp-text-meta)" }}>0{i + 1}</span>
              <h3 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "clamp(1.5rem,2.4vw,2.1rem)", color: NAVY, margin: "clamp(20px,3vh,28px) 0 clamp(12px,1.8vh,16px) 0", letterSpacing: "-0.02em", marginTop: "auto" }}>{loc.name}</h3>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>{loc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA + Footer — the only navy on the page ── */}
      <FooterCTA locale={locale} />
    </>
  );
}
