"use client";

import { useRef, useEffect, useState, useCallback, Fragment } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { Locale, TRANSLATIONS } from "./translations";

const NAV_ROUTES = ["/services", "/projects", "/equipment", "/about", "/contact"];

const NAVY = "#020A25";
const ACCENT = "#1847F2";
const SECTION_BG = "#f0eeea";
const VIDEO_SRC =
  "https://levelpro.venacydigital.com/wp-content/uploads/2026/04/333333benidorm-poniente-beach-aerial-flyover-mediterra-2026-02-24-23-51-33-utc.mp4";

const LOCATIONS = [
  { id: 0, name: "Benidorm",          video: VIDEO_SRC },
  { id: 1, name: "Ibiza",             video: VIDEO_SRC },
  { id: 2, name: "Palma de Mallorca", video: VIDEO_SRC },
];

const DEADZONE = 0.03;

const PROJ_IMG = "https://levelpro.es/wp-content/uploads/2026/05/1-copy.avif";
const PROJECTS_STATIC = [
  { id: 1, name: "Hotel Rosamar",            location: "Benidorm", year: "2020", budget: "€3M"   as string|undefined, img: PROJ_IMG, pin: { lat: 38.5411, lng: -0.1225 }, mapsUrl: "https://maps.google.com/?q=38.5411,-0.1225" },
  { id: 2, name: "Nomad Hotel Cala Finestrat 1", location: "Benidorm", year: "2020", budget: undefined as string|undefined, img: PROJ_IMG, pin: { lat: 38.5345, lng: -0.1305 }, mapsUrl: "https://maps.google.com/?q=38.5345,-0.1305" },
  { id: 3, name: "Residential Complex Altea", location: "Altea",    year: "2021", budget: "€1.8M" as string|undefined, img: PROJ_IMG, pin: { lat: 38.5980, lng: -0.0572 }, mapsUrl: "https://maps.google.com/?q=38.5980,-0.0572" },
];

const SERVICES_ICONS = [
  <svg key="pump" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="12" width="16" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 15h6l2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="6" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="14" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 12V8a2 2 0 012-2h4a2 2 0 012 2v4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>,
  <svg key="place" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M6 20L14 6l8 14H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M14 13v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="20" r="1.5" fill="currentColor"/>
  </svg>,
  <svg key="shot" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 14c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 14l4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
    <path d="M14 14l-3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 14l1.5 -3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  <svg key="found" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 22h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 22V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 22V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 10l3-4h6l3 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>,
];

const MAT_ICONS = [
  <svg key="m1" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="1" y="9" width="12" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M13 11.5h6l1.5-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="4.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="10.5" cy="17" r="2" stroke="currentColor" strokeWidth="1.4"/>
  </svg>,
  <svg key="m2" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 17l4-10h8l4 10" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M7 12h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="11" cy="17" r="1.5" fill="currentColor"/>
  </svg>,
];

// ─── Preloader ────────────────────────────────────────────────────────────────
function Preloader({ onComplete, fast = false }: { onComplete: () => void; fast?: boolean }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting"|"exiting">("counting");
  const duration = fast ? 550 : 1500;

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
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
    <div style={{ position:"fixed", inset:0, zIndex:9999, pointerEvents: exiting ? "none" : "all" }}>
      <div style={{ position:"absolute", left:0, right:0, top:0, height:"50%", backgroundColor:NAVY, transform: exiting ? "translateY(-100%)" : "translateY(0)", transition: exiting ? `transform ${exitDur}s cubic-bezier(0.76,0,0.24,1)` : "none", willChange:"transform" }} />
      <div style={{ position:"absolute", left:0, right:0, bottom:0, height:"50%", backgroundColor:NAVY, transform: exiting ? "translateY(100%)" : "translateY(0)", transition: exiting ? `transform ${exitDur}s cubic-bezier(0.76,0,0.24,1)` : "none", willChange:"transform" }} />
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"clamp(14px,2.2vh,24px)", opacity: exiting ? 0 : 1, transition: exiting ? "opacity 0.22s ease" : "none" }}>
        <div style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:600, fontSize:"clamp(0.88rem,1.15vw,1rem)", letterSpacing:"0.28em", textTransform:"uppercase", color:"#ffffff", animation:"preloaderFadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both" }}>Level Pro</div>
        <div style={{ width:"clamp(130px,18vw,200px)", height:"1px", background:"rgba(255,255,255,0.07)", position:"relative", overflow:"hidden", animation:"preloaderFadeUp 0.55s cubic-bezier(0.4,0,0.2,1) 0.08s both" }}>
          <div style={{ position:"absolute", inset:0, width:`${progress}%`, background:"rgba(255,255,255,0.75)", transition:"width 0.07s linear" }} />
        </div>
        <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:"clamp(0.56rem,0.7vw,0.63rem)", letterSpacing:"0.14em", color:"rgba(255,255,255,0.28)", fontVariantNumeric:"tabular-nums", animation:"preloaderFadeUp 0.55s cubic-bezier(0.4,0,0.2,1) 0.14s both" }}>
          {progress < 100 ? String(progress).padStart(2,"0") : "100"}
        </div>
      </div>
    </div>
  );
}

// ─── Word-reveal ──────────────────────────────────────────────────────────────
function useWordReveal() {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTriggered(true); obs.disconnect(); } }, { threshold:0 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, triggered] as const;
}

function RevealText({ text, delayOffset=0, style, as: Tag="p" }: { text:string; delayOffset?:number; style?:React.CSSProperties; as?:"p"|"span"|"h2"|"h1" }) {
  const [ref, triggered] = useWordReveal();
  const words = text.split(/\s+/);
  return (
    <Tag ref={ref as unknown as React.RefObject<HTMLParagraphElement>} style={style}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span style={{ display:"inline-block", opacity:0, animation: triggered ? `fadeBlurReveal 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${(delayOffset+i)*0.05}s both` : "none" }}>{word}</span>
          {i < words.length-1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}

// ─── Count-up ─────────────────────────────────────────────────────────────────
function runCountUp(target:number, duration:number, setter:(n:number)=>void, delay=0) {
  const go = () => { let t0:number|null=null; const step=(ts:number)=>{ if(t0===null)t0=ts; const p=Math.min((ts-t0)/duration,1); setter(Math.round((1-Math.pow(1-p,3))*target)); if(p<1)requestAnimationFrame(step); }; requestAnimationFrame(step); };
  delay>0 ? setTimeout(go,delay) : go();
}
function StatNum({ value, suffix="", delay=0 }:{ value:number; suffix?:string; delay?:number }) {
  const ref = useRef<HTMLDivElement>(null); const [count,setCount]=useState(0);
  useEffect(()=>{ const el=ref.current; if(!el)return; const obs=new IntersectionObserver(([e])=>{ if(!e.isIntersecting)return; obs.disconnect(); runCountUp(value,2000,setCount,delay); },{threshold:0.2}); obs.observe(el); return()=>obs.disconnect(); },[value,delay]);
  return <span ref={ref} style={{ fontVariantNumeric:"tabular-nums" }}>{count}{suffix}</span>;
}

// ─── Meta chip ────────────────────────────────────────────────────────────────
function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.42rem,0.5vw,0.46rem)", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(2,10,37,0.3)" }}>{label}</span>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.6rem,0.72vw,0.66rem)", fontWeight: 500, color: NAVY }}>{value}</span>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ proj, metaKeys, index }: { proj: ProjectData; metaKeys: { year: string; type: string; budget: string; location: string }; index: number }) {
  return (
    <div style={{ background: "#ffffff", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(2,10,37,0.06)", boxShadow: "0 2px 16px rgba(2,10,37,0.07)" }}>
      {/* Thumbnail — portrait / taller aspect ratio */}
      <div style={{ position: "relative", height: "clamp(280px,44vh,480px)", overflow: "hidden" }}>
        <img
          src={proj.img}
          alt={proj.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
        <div style={{ position: "absolute", top: "clamp(12px,1.6vw,16px)", left: "clamp(14px,1.8vw,18px)", background: "rgba(2,10,37,0.68)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", borderRadius: "3px", padding: "4px 10px" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.44rem,0.52vw,0.48rem)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.92)" }}>{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>
      {/* Title */}
      <div style={{ padding: "clamp(18px,2.4vw,26px) clamp(20px,2.6vw,28px) clamp(6px,0.9vw,8px)" }}>
        <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(1.35rem,2.3vw,2.1rem)", lineHeight: 1.05, color: NAVY, margin: 0, letterSpacing: "-0.02em" }}>{proj.name}</h3>
      </div>
      {/* Full description — 3-4 rows */}
      <div style={{ padding: "0 clamp(20px,2.6vw,28px) clamp(14px,1.8vw,18px)" }}>
        <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.65rem,0.8vw,0.72rem)", lineHeight: 1.74, color: "rgba(2,10,37,0.5)", margin: 0 }}>{proj.fullDesc}</p>
      </div>
      {/* Service tags — dedicated layout with divider */}
      <div style={{ padding: "0 clamp(20px,2.6vw,28px) clamp(16px,2.1vw,20px)" }}>
        <div style={{ height: "1px", background: "rgba(2,10,37,0.06)", marginBottom: "clamp(10px,1.4vw,14px)" }} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.42rem,0.5vw,0.46rem)", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(2,10,37,0.25)", margin: "0 0 clamp(7px,0.9vw,9px) 0" }}>Services</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(5px,0.6vw,7px)" }}>
          {proj.tags.map(tag => (
            <span key={tag} style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.55rem)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: ACCENT, background: "rgba(24,71,242,0.07)", border: "1px solid rgba(24,71,242,0.15)", borderRadius: "3px", padding: "4px 10px" }}>{tag}</span>
          ))}
        </div>
      </div>
      {/* Metadata footer */}
      <div style={{ borderTop: "1px solid rgba(2,10,37,0.07)", padding: "clamp(12px,1.6vw,16px) clamp(20px,2.6vw,28px)", display: "flex", gap: "clamp(18px,2.4vw,28px)", flexWrap: "wrap" }}>
        <MetaChip label={metaKeys.type} value={proj.type} />
        <MetaChip label={metaKeys.location} value={proj.location} />
        {proj.budget && <MetaChip label={metaKeys.budget} value={proj.budget} />}
        <MetaChip label={metaKeys.year} value={proj.year} />
      </div>
    </div>
  );
}

// ─── Language switcher ────────────────────────────────────────────────────────
function LangSwitcher({ locale, onLocaleChange, pastHero }: { locale:Locale; onLocaleChange:(l:Locale)=>void; pastHero:boolean }) {
  const langs:Locale[] = ["en","de","es"];
  return (
    <div style={{ display:"flex", alignItems:"center" }}>
      <div style={{ width:"1px", height:"13px", background: pastHero?"rgba(2,10,37,0.14)":"rgba(255,255,255,0.2)", marginRight:"14px", flexShrink:0 }} />
      {langs.map((l,i) => (
        <Fragment key={l}>
          {i>0 && <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.5rem,0.6vw,0.55rem)", color:pastHero?"rgba(2,10,37,0.18)":"rgba(255,255,255,0.2)", margin:"0 1px", userSelect:"none" }}>·</span>}
          <button onClick={()=>onLocaleChange(l)} className={l===locale?"lang-btn lang-btn--active":"lang-btn"} style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.56rem,0.68vw,0.62rem)", fontWeight:l===locale?600:400, letterSpacing:"0.1em", textTransform:"uppercase", color:l===locale?(pastHero?NAVY:"#ffffff"):(pastHero?"rgba(2,10,37,0.38)":"rgba(255,255,255,0.42)"), background:"transparent", border:"none", cursor:"pointer", padding:"5px 5px", transition:"color 0.3s ease" }}>
            {l.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function NavBar({ pastHero, locale, onLocaleChange }: { pastHero:boolean; locale:Locale; onLocaleChange:(l:Locale)=>void }) {
  const t = TRANSLATIONS[locale];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:"clamp(56px,5.5vw,68px)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 clamp(20px,5vw,72px)", background:pastHero?"rgba(255,255,255,0.97)":"transparent", backdropFilter:pastHero?"blur(16px)":"none", borderBottom:pastHero?"1px solid rgba(2,10,37,0.07)":"none", transition:"background 0.5s cubic-bezier(0.4,0,0.2,1), border-color 0.5s ease, backdrop-filter 0.5s ease" }}>
      <Link href="/" style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:600, fontSize:"clamp(0.9rem,1.2vw,1.05rem)", letterSpacing:"0.12em", textTransform:"uppercase", color:pastHero?NAVY:"#ffffff", transition:"color 0.5s ease", textDecoration:"none" }}>Level Pro</Link>
      <div className="nav-links" style={{ display:"flex", gap:"clamp(24px,3vw,44px)", alignItems:"center" }}>
        {t.nav.links.map((l,i)=><Link key={l} href={NAV_ROUTES[i]??"/"+l.toLowerCase().replace(/\s+/g,"-")} style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.68rem,0.82vw,0.75rem)", fontWeight:400, letterSpacing:"0.04em", color:pastHero?"rgba(2,10,37,0.65)":"rgba(255,255,255,0.75)", textDecoration:"none", transition:"color 0.3s ease" }}>{l}</Link>)}
      </div>
      <div style={{ display:"flex", alignItems:"center" }}>
        <Link href="/contact" className="btn-fill" style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.65rem,0.8vw,0.72rem)", fontWeight:500, letterSpacing:"0.06em", color:NAVY, background:pastHero?"transparent":"rgba(255,255,255,0.93)", border:pastHero?"1px solid rgba(2,10,37,0.32)":"1px solid transparent", borderRadius:"3px", padding:"9px 20px", cursor:"pointer", transition:"background 0.5s cubic-bezier(0.4,0,0.2,1), border-color 0.5s ease", whiteSpace:"nowrap", textDecoration:"none" }}>{t.nav.cta}</Link>
        <LangSwitcher locale={locale} onLocaleChange={onLocaleChange} pastHero={pastHero} />
      </div>
    </nav>
  );
}

// ─── Service slide card ───────────────────────────────────────────────────────
interface ServiceItem { name:string; detail:string; shortDesc:string; tagDescs:string[]; bullets:string[]; icon:React.ReactNode }
function SvcSlideCard({ svc, isActive, tags, onHover, onClick }: { svc:ServiceItem; isActive:boolean; tags:string[]; onHover:()=>void; onClick:()=>void }) {
  const [activeTag, setActiveTag] = useState(0);
  return (
    <div
      onMouseEnter={onHover}
      onClick={onClick}
      style={{
        flex: isActive ? "2.5 1 0" : "1 1 0",
        minWidth: 0,
        borderRadius: "18px",
        cursor: "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "clamp(220px,28vh,300px)",
        background: isActive ? "#ffffff" : NAVY,
        boxShadow: isActive ? "0 8px 40px rgba(2,10,37,0.16)" : "none",
        transition: "flex 0.55s cubic-bezier(0.4,0,0.2,1), box-shadow 0.45s ease, background 0.4s ease",
      }}
    >
      <div style={{ flex:1, minHeight:0, position:"relative", display:"flex", flexDirection:"column" }}>

        {/* Inactive layer */}
        <div style={{
          position: "absolute",
          inset: 0,
          padding: "clamp(22px,2.8vw,30px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          opacity: isActive ? 0 : 1,
          transition: "opacity 0.2s ease",
          pointerEvents: isActive ? "none" : "auto",
        }}>
          <div style={{ color:"rgba(255,255,255,0.38)" }}>{svc.icon}</div>
          <div>
            <p style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:300, fontSize:"clamp(1.05rem,1.35vw,1.22rem)", color:"rgba(255,255,255,0.92)", margin:"0 0 6px 0", lineHeight:1.2 }}>{svc.name}</p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:400, fontSize:"clamp(0.65rem,0.78vw,0.72rem)", color:"rgba(255,255,255,0.45)", margin:0, lineHeight:1.5 }}>{svc.shortDesc}</p>
          </div>
        </div>

        {/* Active layer */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          paddingTop: "12px",
          paddingRight: "12px",
          paddingBottom: "12px",
          paddingLeft: "clamp(22px,2.8vw,30px)",
          display: "flex",
          flexDirection: "row",
          gap: "clamp(16px,2vw,24px)",
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0)" : "translateY(8px)",
          transition: isActive
            ? "opacity 0.28s ease 0.1s, transform 0.38s cubic-bezier(0.22,1,0.36,1) 0.1s"
            : "opacity 0.12s ease, transform 0.12s ease",
          pointerEvents: isActive ? "auto" : "none",
        }}>
          {/* Left: text content — extra top/bottom padding to reach full card inset */}
          <div style={{ flex:1, minWidth:0, minHeight:0, display:"flex", flexDirection:"column", paddingTop:"calc(clamp(22px,2.8vw,30px) - 12px)", paddingBottom:"calc(clamp(22px,2.8vw,30px) - 12px)" }}>
            <div style={{ color:"rgba(2,10,37,0.45)", marginBottom:"clamp(10px,1.4vh,14px)", flexShrink:0 }}>{svc.icon}</div>
            <h3 style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:"clamp(0.88rem,1.08vw,0.98rem)", color:NAVY, margin:"0 0 clamp(5px,0.7vh,7px) 0", lineHeight:1.3, flexShrink:0 }}>
              {svc.name}
            </h3>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.7rem,0.86vw,0.78rem)", lineHeight:1.65, color:"rgba(2,10,37,0.52)", margin:0, flex:1, minHeight:0, overflow:"hidden" }}>
              {svc.tagDescs[activeTag]}
            </p>
            {/* Divider + tag toggles */}
            <div style={{ flexShrink:0 }}>
              <div style={{ height:"1px", background:"rgba(2,10,37,0.08)", margin:"clamp(10px,1.4vh,16px) 0 clamp(8px,1.1vh,12px)" }} />
              <div style={{ display:"flex", gap:"clamp(10px,1.4vw,18px)", flexWrap:"wrap", alignItems:"center" }}>
                {tags.map((tag, i) => (
                  <button
                    key={tag}
                    onClick={e => { e.stopPropagation(); setActiveTag(i); }}
                    style={{
                      fontFamily:"'Inter',sans-serif",
                      fontSize:"clamp(0.72rem,0.88vw,0.8rem)",
                      fontWeight: i===activeTag ? 700 : 400,
                      color: i===activeTag ? NAVY : "rgba(2,10,37,0.45)",
                      background:"none", border:"none", padding:0, cursor:"pointer",
                      transition:"color 0.2s ease, font-weight 0.2s ease",
                    }}
                  >
                    {i===activeTag ? `›${tag}` : tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: video */}
          <div style={{
            flexShrink: 0,
            alignSelf: "stretch",
            aspectRatio: "1/1",
            borderRadius: "14px",
            overflow: "hidden",
            background: "rgba(2,10,37,0.06)",
          }}>
            <video
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
              autoPlay muted loop playsInline
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Leaflet map ──────────────────────────────────────────────────────────────
function LeafletMap({ activeIdx }: { activeIdx:number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const initializedRef = useRef(false);

  const makePin = (active:boolean) => `<div style="width:${active?20:12}px;height:${active?20:12}px;background:${active?NAVY:"rgba(2,10,37,0.3)"};border:${active?"3px":"2px"} solid #fff;border-radius:50%;box-shadow:0 ${active?"5px 16px rgba(0,0,0,0.38)":"2px 8px rgba(0,0,0,0.18)"};transition:all 0.4s cubic-bezier(0.4,0,0.2,1);"></div>`;

  useEffect(() => {
    if (initializedRef.current || !containerRef.current) return;
    initializedRef.current = true; let alive=true;
    import("leaflet").then(L => {
      if (!alive||!containerRef.current) return;
      const map = L.map(containerRef.current,{ zoomControl:false,dragging:false,doubleClickZoom:false,scrollWheelZoom:false,touchZoom:false,keyboard:false,attributionControl:true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{ attribution:"&copy; <a href='https://carto.com' target='_blank'>CARTO</a>",subdomains:"abcd",maxZoom:20 }).addTo(map);
      PROJECTS_STATIC.forEach((proj,i) => {
        const icon=L.divIcon({ className:"", html:makePin(i===0), iconSize:[i===0?20:12,i===0?20:12], iconAnchor:[i===0?10:6,i===0?10:6] });
        markersRef.current.push(L.marker([proj.pin.lat,proj.pin.lng],{ icon,interactive:false }).addTo(map));
      });
      map.setView([PROJECTS_STATIC[0].pin.lat,PROJECTS_STATIC[0].pin.lng],13);
      mapRef.current=map;
    });
    return ()=>{ alive=false; if(mapRef.current){mapRef.current.remove();mapRef.current=null;} markersRef.current=[]; initializedRef.current=false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then(L => {
      markersRef.current.forEach((m,i)=>{ const active=i===activeIdx; m.setIcon(L.divIcon({ className:"",html:makePin(active),iconSize:[active?20:12,active?20:12],iconAnchor:[active?10:6,active?10:6] })); });
      const {lat,lng}=PROJECTS_STATIC[activeIdx].pin;
      mapRef.current.flyTo([lat,lng],13,{ animate:true,duration:0.9 });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeIdx]);

  return <div ref={containerRef} style={{ width:"100%", height:"100%" }} />;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProjectData { id:number; name:string; type:string; location:string; year:string; budget?:string; shortDesc:string; fullDesc:string; tags:string[]; img:string; pin:{lat:number;lng:number}; mapsUrl:string; }
interface AnimState { overlayOpacity:number; videoBlur:number; videoBrightness:number; titleOpacity:number; titleY:number; descOpacity:number; descY:number; }

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LevelProPage() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number|null>(null);
  const lenisRef = useRef<Lenis|null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileSliderRef = useRef<HTMLDivElement>(null);

  const [locale, setLocale] = useState<Locale>("en");
  const t = TRANSLATIONS[locale];

  // Preloader state — supports retrigger on locale change
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [isFastLoader, setIsFastLoader] = useState(false);
  const pendingLocaleRef = useRef<Locale|null>(null);

  const handlePreloaderComplete = useCallback(() => {
    if (pendingLocaleRef.current) {
      setLocale(pendingLocaleRef.current);
      pendingLocaleRef.current = null;
    }
    setPreloaderVisible(false);
  }, []);

  const handleLocaleChange = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return;
    pendingLocaleRef.current = newLocale;
    setIsFastLoader(true);
    setPreloaderVisible(true);
    setPreloaderKey(k => k + 1);
  }, [locale]);

  const projects: ProjectData[] = PROJECTS_STATIC.map((p,i) => ({
    ...p,
    type: t.projects.items[i].type,
    shortDesc: t.projects.items[i].shortDesc,
    fullDesc: t.projects.items[i].fullDesc,
    tags: t.projects.items[i].tags,
  }));

  const services: ServiceItem[] = SERVICES_ICONS.map((icon,i) => ({
    icon,
    name: t.services.items[i].name,
    detail: t.services.items[i].detail,
    shortDesc: t.services.items[i].shortDesc,
    tagDescs: t.services.items[i].tagDescs,
    bullets: t.services.items[i].bullets,
  }));

  const [anim, setAnim] = useState<AnimState>({ overlayOpacity:0, videoBlur:0, videoBrightness:1, titleOpacity:1, titleY:0, descOpacity:1, descY:0 });
  const [pastHero, setPastHero] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [displayProject, setDisplayProject] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeSvc, setActiveSvc] = useState(0);
  const [activeLocation, setActiveLocation] = useState(0);
  const [hoveredLocation, setHoveredLocation] = useState<number|null>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration:1.0, easing:(t:number)=>1-Math.pow(1-t,4) });
    lenisRef.current = lenis;
    let id:number;
    const raf=(time:number)=>{ lenis.raf(time); id=requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return ()=>{ cancelAnimationFrame(id); lenis.destroy(); lenisRef.current=null; };
  },[]);

  const computeAnim = useCallback(() => {
    const about=aboutRef.current; if(!about)return;
    const rect=about.getBoundingClientRect(); const vhNow=window.innerHeight;
    const rawProgress=Math.max(0,Math.min(1,(vhNow-rect.top)/vhNow));
    if(window.scrollY===0){ setAnim({overlayOpacity:0,videoBlur:0,videoBrightness:1,titleOpacity:1,titleY:0,descOpacity:1,descY:0}); return; }
    const scrolledPx=rawProgress*vhNow;
    const ap=rawProgress<=DEADZONE?0:(rawProgress-DEADZONE)/(1-DEADZONE);
    setAnim({ overlayOpacity:Math.min(1,ap*2.2), videoBlur:Math.min(12,ap*12), videoBrightness:Math.max(0.1,1-ap*1.8), titleOpacity:Math.max(0,1-ap*3.5), titleY:-(scrolledPx*0.3), descOpacity:Math.max(0,1-ap*2.8), descY:-(scrolledPx*0.2) });
  },[]);

  // Single scroll listener — pastHero only re-renders when crossing the threshold
  useEffect(() => {
    const onScroll = () => {
      const nowPast = window.scrollY > window.innerHeight * 0.75;
      setPastHero(p => p === nowPast ? p : nowPast);
      if(rafRef.current!==null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(computeAnim);
    };
    const onResize = () => {
      const nowPast = window.scrollY > window.innerHeight * 0.75;
      setPastHero(p => p === nowPast ? p : nowPast);
      computeAnim();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", onResize, {passive:true});
    return ()=>{
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if(rafRef.current!==null) cancelAnimationFrame(rafRef.current);
    };
  },[computeAnim]);

  // Scroll-based active card: whichever card's center is closest to 40% down the viewport
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.40;
      let best = 0, bestDist = Infinity;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const { top, height } = el.getBoundingClientRect();
        const dist = Math.abs(top + height / 2 - line);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActiveProject(best);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const onScroll = () => {
      const cardWidth = slider.scrollWidth / PROJECTS_STATIC.length;
      setActiveProject(Math.min(PROJECTS_STATIC.length - 1, Math.max(0, Math.round(slider.scrollLeft / cardWidth))));
    };
    slider.addEventListener("scroll", onScroll, { passive: true });
    return () => slider.removeEventListener("scroll", onScroll);
  }, []);

  // Fade sidebar content on project change
  useEffect(() => {
    if (activeProject === displayProject) return;
    setSidebarVisible(false);
    const timer = setTimeout(() => {
      setDisplayProject(activeProject);
      setSidebarVisible(true);
    }, 160);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject]);

  const displayLocation = hoveredLocation ?? activeLocation;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html:`
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:auto;}
        html.lenis,html.lenis body{height:auto;}
        .lenis.lenis-smooth{scroll-behavior:auto!important;}
        .lenis.lenis-stopped{overflow:hidden;}
        body{background-color:${NAVY};color:#ffffff;overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
        video::-webkit-media-controls{display:none!important;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${NAVY};}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px;}
        a{text-decoration:none;}
        @keyframes fadeBlurReveal{0%{opacity:0;filter:blur(10px);transform:translateY(12px);}100%{opacity:1;filter:blur(0);transform:translateY(0);}}
        @keyframes kenBurns{0%{transform:scale(1);}100%{transform:scale(1.07);}}
        @keyframes preloaderFadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes svcFadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .lang-btn{text-decoration:none;}
        .lang-btn--active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        @media(max-width:640px){.nav-links{display:none!important;}}
        .stat-block{flex:1;min-width:0;padding:clamp(32px,4.5vw,60px) clamp(20px,3vw,48px);border-left:1px solid rgba(2,10,37,0.08);position:relative;}
        .stat-block:first-child{border-left:none;padding-left:0;}
        .stat-val{font-family:'Titillium Web',sans-serif;font-weight:200;font-size:clamp(3rem,6vw,5.5rem);color:${NAVY};letter-spacing:-0.03em;line-height:1;margin:0 0 clamp(8px,1.2vh,14px) 0;}
        .stat-label{font-family:'Inter',sans-serif;font-size:clamp(0.62rem,0.78vw,0.7rem);color:rgba(2,10,37,0.42);letter-spacing:0.02em;line-height:1.5;}
        .stat-rule{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,${ACCENT},transparent);opacity:0;transition:opacity 0.5s ease;}
        .stat-block:hover .stat-rule{opacity:1;}
        .mat-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(12px,1.5vw,20px);margin-top:clamp(40px,5.5vh,64px);}
        .mat-card{background:#f0eeeb;border-radius:12px;padding:clamp(24px,3vw,40px);min-height:clamp(220px,28vh,300px);display:flex;flex-direction:column;justify-content:space-between;transition:background 0.35s ease;}
        .mat-card:hover{background:#e8e6e2;}
        .mat-icon-wrap{width:40px;height:40px;border-radius:8px;background:rgba(2,10,37,0.07);display:flex;align-items:center;justify-content:center;color:rgba(2,10,37,0.5);}
        .mat-card-title{font-family:'Titillium Web',sans-serif;font-weight:400;font-size:clamp(1rem,1.3vw,1.2rem);color:${NAVY};margin:0 0 clamp(8px,1.2vh,12px) 0;line-height:1.3;}
        .mat-card-desc{font-family:'Inter',sans-serif;font-size:clamp(0.68rem,0.82vw,0.75rem);line-height:1.65;color:rgba(2,10,37,0.5);margin:0;}
        /* Projects */
        .proj-maps-btn:hover{background:${NAVY}!important;border-color:${NAVY}!important;color:#ffffff!important;}
        .btn-fill{position:relative!important;overflow:hidden!important;z-index:1;transition:color 0.4s ease!important;}
        .btn-fill::before{content:''!important;position:absolute!important;bottom:0!important;left:0!important;width:100%!important;height:0!important;background-color:${NAVY}!important;z-index:-1!important;clip-path:polygon(0 45%,100% 0,100% 100%,0 100%);transition:height 0.4s cubic-bezier(0.65,0.05,0.36,1) 0.1s,clip-path 0.3s ease!important;}
        .btn-fill:hover{color:#ffffff!important;}
        .btn-fill:hover::before{height:100%!important;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transition:height 0.45s cubic-bezier(0.65,0.05,0.36,1),clip-path 0.25s ease-out 0.2s!important;}
        .btn-fill-icon{display:inline-flex!important;align-items:center!important;margin-left:8px!important;transition:transform 0.3s ease!important;}
        .btn-fill:hover .btn-fill-icon{transform:translate(3px,-3px)!important;}
        .footer-cta-btn{font-family:'Inter',sans-serif;font-size:clamp(0.65rem,0.82vw,0.74rem);font-weight:500;letter-spacing:0.08em;color:${NAVY};background:#ffffff;border:1px solid rgba(2,10,37,0.12);border-radius:3px;padding:12px 28px;cursor:pointer;}
        @media(max-width:640px){
          .stat-block{padding:clamp(20px,5vw,32px) 0!important;border-left:none!important;border-top:1px solid rgba(2,10,37,0.08)!important;}
          .stat-block:first-child{border-top:none!important;padding-top:0!important;}
          .stats-row{flex-direction:column!important;}
          .mat-grid{grid-template-columns:1fr!important;}
          .hero-bottom-strip{flex-direction:column!important;gap:16px!important;}
        }
        .projects-desktop{display:block;}
        .projects-mobile{display:none;}
        .proj-mobile-slider::-webkit-scrollbar{display:none;}
        @media(max-width:768px){
          .projects-desktop{display:none!important;}
          .projects-mobile{display:block!important;}
        }
      `}} />

      {preloaderVisible && (
        <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} fast={isFastLoader} />
      )}

      <NavBar pastHero={pastHero} locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ── Hero ── */}
      <div style={{ position:"relative", height:"165vh", backgroundColor:NAVY }}>
        <section style={{ position:"sticky", top:0, height:"100vh", zIndex:1, overflow:"hidden", backgroundColor:NAVY }}>
          {LOCATIONS.map((loc, i) => (
            <video key={loc.id} autoPlay loop muted playsInline style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", filter:`brightness(${anim.videoBrightness}) blur(${anim.videoBlur}px)`, willChange:"filter, opacity", opacity: i === displayLocation ? 1 : 0, transition:"opacity 0.7s cubic-bezier(0.4,0,0.2,1)" }}>
              <source src={loc.video} type="video/mp4" />
            </video>
          ))}
          <div style={{ position:"absolute", inset:0, backgroundColor:"rgba(2,10,37,0.38)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"linear-gradient(to bottom,rgba(2,10,37,0.3) 0%,transparent 30%,rgba(2,10,37,0.15) 70%,rgba(2,10,37,0.55) 100%)" }} />
          <div style={{ position:"absolute", inset:0, backgroundColor:NAVY, opacity:anim.overlayOpacity, willChange:"opacity", pointerEvents:"none", transition:"none" }} />
          <div style={{ position:"relative", zIndex:10, height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-between", paddingTop:"clamp(24px,5vw,72px)", paddingLeft:"clamp(24px,5vw,72px)", paddingRight:"clamp(24px,5vw,72px)", paddingBottom:"calc(clamp(58px,7.5vh,78px) + clamp(24px,3vh,36px))" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginTop:"clamp(48px,8vh,88px)", opacity:anim.titleOpacity, transform:`translateY(${anim.titleY*0.4}px)`, willChange:"opacity,transform", transition:"none" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:400, fontSize:"clamp(0.6rem,0.78vw,0.7rem)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", margin:0 }}>{t.hero.eyebrow}</p>
              <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:400, fontSize:"clamp(0.6rem,0.78vw,0.7rem)", letterSpacing:"0.1em", color:"rgba(255,255,255,0.35)", margin:0 }}>{t.hero.est}</p>
            </div>
            <div style={{ opacity:anim.titleOpacity, transform:`translateY(${anim.titleY}px)`, willChange:"transform,opacity", transition:"none" }}>
              <h1 style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:200, fontSize:"clamp(3.5rem,9vw,9rem)", lineHeight:0.95, color:"#ffffff", margin:0, letterSpacing:"-0.03em" }}>
                {t.hero.titleLine1}<br />
                {t.hero.titleLine2}<br />
                {t.hero.titleLine3}
              </h1>
            </div>
            <div className="hero-bottom-strip" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", opacity:anim.descOpacity, transform:`translateY(${anim.descY}px)`, willChange:"transform,opacity", transition:"none", gap:"clamp(16px,3vw,32px)" }}>
              <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:"clamp(0.7rem,0.92vw,0.82rem)", lineHeight:1.65, color:"rgba(255,255,255,0.6)", margin:0, maxWidth:"clamp(260px,34vw,380px)" }}>{t.hero.tagline}</p>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"18px", flexShrink:0 }}>
                <div style={{ display:"flex", gap:"clamp(20px,3vw,36px)" }}>
                  {[{n:"200+",l:t.hero.statsLabels.projects},{n:"9+",l:t.hero.statsLabels.years},{n:"24h",l:t.hero.statsLabels.mobilization}].map(({n,l})=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:300, fontSize:"clamp(1.4rem,2.2vw,2rem)", color:"#ffffff", letterSpacing:"-0.02em" }}>{n}</div>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.55rem,0.68vw,0.62rem)", color:"rgba(255,255,255,0.38)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:"3px" }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"32px", height:"1px", background:"rgba(255,255,255,0.3)" }} />
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.55rem,0.68vw,0.62rem)", color:"rgba(255,255,255,0.35)", letterSpacing:"0.15em", textTransform:"uppercase" }}>{t.hero.scroll}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Location tabs ── */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:20, display:"flex", opacity:anim.descOpacity, willChange:"opacity", transition:"none" }}>
            {LOCATIONS.map((loc, i) => {
              const isActive = i === activeLocation;
              const isHovered = i === hoveredLocation;
              const highlighted = isActive || isHovered;
              return (
                <button
                  key={loc.id}
                  onMouseEnter={() => setHoveredLocation(i)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  onClick={() => setActiveLocation(i)}
                  style={{
                    flex: 1,
                    height: "clamp(58px,7.5vh,78px)",
                    background: isHovered ? "rgba(255,255,255,0.07)" : isActive ? "rgba(255,255,255,0.04)" : "rgba(2,10,37,0.52)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "none",
                    borderRight: i < LOCATIONS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    boxShadow: highlighted ? "inset 0 2px 0 rgba(255,255,255,0.82)" : "inset 0 1px 0 rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    padding: 0,
                    transition: "background 0.35s ease, box-shadow 0.35s ease",
                  }}
                >
                  <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.47rem,0.56vw,0.52rem)", fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color: highlighted ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.3)", transition:"color 0.35s ease" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight: highlighted ? 400 : 300, fontSize:"clamp(0.78rem,1vw,0.9rem)", letterSpacing:"0.05em", color: highlighted ? "#ffffff" : "rgba(255,255,255,0.48)", transition:"color 0.35s ease" }}>
                    {loc.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <div ref={aboutRef} style={{ position:"absolute", top:"100vh", left:0, right:0, height:"65vh", zIndex:2 }}>
          <div style={{ height:"22vh", background:`linear-gradient(to bottom,transparent,${NAVY})`, pointerEvents:"none" }} />
          <div style={{ height:"43vh", backgroundColor:NAVY, display:"flex", flexDirection:"column", justifyContent:"center", padding:"clamp(30px,5vh,60px) clamp(24px,5vw,72px)" }}>
            <RevealText text={t.about.label} style={{ fontFamily:"'Inter',sans-serif", fontWeight:400, fontSize:"clamp(0.6rem,0.8vw,0.7rem)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", margin:"0 0 clamp(16px,2.5vh,28px) 0" }} />
            <RevealText text={t.about.body} delayOffset={3} style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:200, fontSize:"clamp(1.5rem,3.2vw,3rem)", lineHeight:1.12, color:"rgba(255,255,255,0.9)", margin:0, maxWidth:"clamp(320px,72vw,900px)", letterSpacing:"-0.02em" }} />
          </div>
        </div>
      </div>

      {/* ── Services — slider ── */}
      <section style={{ background:"#ffffff", padding:"clamp(56px,7vh,80px) clamp(24px,5vw,72px)", borderTop:"1px solid rgba(2,10,37,0.05)" }}>
        {/* Heading */}
        <div style={{ marginBottom:"clamp(24px,3.2vh,38px)" }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:500, fontSize:"var(--lp-label-fs)", letterSpacing:"var(--lp-label-ls)", textTransform:"uppercase", color:"rgba(2,10,37,0.35)", margin:"0 0 clamp(12px,1.8vh,18px) 0" }}>{t.services.label}</p>
          <h2 style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:300, fontSize:"var(--lp-title-fs)", lineHeight:0.95, color:NAVY, margin:0, letterSpacing:"var(--lp-title-ls)" }}>
            {t.services.headingLine1}<br />{t.services.headingLine2}
          </h2>
        </div>

        {/* Card strip */}
        <div style={{ display:"flex", gap:"clamp(8px,1vw,12px)", alignItems:"stretch", marginBottom:"clamp(14px,2vh,22px)" }}>
          {services.map((svc, i) => (
            <SvcSlideCard
              key={svc.name}
              svc={svc}
              isActive={i===activeSvc}
              tags={t.services.tags}
              onHover={() => setActiveSvc(i)}
              onClick={() => setActiveSvc(i)}
            />
          ))}
        </div>

        {/* Dots + Arrows */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            {services.map((_, i) => (
              <button key={i} onClick={() => setActiveSvc(i)} style={{ width:i===activeSvc?"28px":"6px", height:"3px", background:i===activeSvc?"rgba(2,10,37,0.7)":"rgba(2,10,37,0.15)", border:"none", borderRadius:"2px", cursor:"pointer", padding:0, transition:"all 0.5s cubic-bezier(0.37,0,0.63,1)" }} />
            ))}
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            {(["prev","next"] as const).map(dir => {
              const disabled = dir==="prev" ? activeSvc===0 : activeSvc===services.length-1;
              return (
                <button key={dir} onClick={() => setActiveSvc(p => dir==="prev" ? Math.max(0,p-1) : Math.min(services.length-1,p+1))} disabled={disabled}
                  style={{ width:"46px", height:"46px", display:"flex", alignItems:"center", justifyContent:"center", background:disabled?"transparent":"rgba(2,10,37,0.06)", border:`1.5px solid ${disabled?"rgba(2,10,37,0.1)":"rgba(2,10,37,0.22)"}`, borderRadius:"50%", cursor:disabled?"default":"pointer", color:disabled?"rgba(2,10,37,0.2)":NAVY, flexShrink:0, opacity:disabled?0.35:1 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    {dir==="prev"
                      ? <path d="M8.5 2L4 6.5l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      : <path d="M4.5 2l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>}
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ backgroundColor:"#ffffff", padding:"clamp(56px,7vh,80px) clamp(24px,5vw,72px)", borderTop:"1px solid rgba(2,10,37,0.05)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"clamp(24px,4vw,48px)", flexWrap:"wrap", marginBottom:"clamp(40px,6vh,72px)" }}>
          <div style={{ flex:"0 0 auto" }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:500, fontSize:"var(--lp-label-fs)", letterSpacing:"var(--lp-label-ls)", textTransform:"uppercase", color:"rgba(2,10,37,0.35)", margin:"0 0 clamp(12px,1.8vh,18px) 0" }}>{t.stats.label}</p>
            <RevealText as="h2" text={t.stats.heading} style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:300, fontSize:"var(--lp-title-fs)", lineHeight:1.08, color:NAVY, letterSpacing:"var(--lp-title-ls)", maxWidth:"clamp(300px,48vw,600px)", margin:0 }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:"clamp(10px,1.5vh,16px)", alignSelf:"flex-end" }}>
            <button className="btn-fill" style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.62rem,0.78vw,0.7rem)", fontWeight:500, letterSpacing:"0.06em", color:NAVY, background:"transparent", border:`1px solid ${NAVY}`, borderRadius:"3px", padding:"11px 24px", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" }}>
              {t.stats.equipmentBtn} <span className="btn-fill-icon">→</span>
            </button>
          </div>
        </div>
        <div className="stats-row" style={{ display:"flex", borderTop:"1px solid rgba(2,10,37,0.08)" }}>
          {[{val:40,suffix:"–70",unit:"m³/h"},{val:200,suffix:"+",unit:""},{val:24,suffix:"h",unit:""},{val:9,suffix:"+",unit:""}].map((s,i)=>(
            <div key={i} className="stat-block">
              <div className="stat-rule" />
              <div className="stat-val"><StatNum value={s.val} suffix={s.suffix} delay={i*100} />{s.unit&&<span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.6rem,0.8vw,0.72rem)", fontWeight:400, color:"rgba(2,10,37,0.3)", letterSpacing:"0.08em", marginLeft:"4px" }}>{s.unit}</span>}</div>
              <p className="stat-label">{t.stats.items[i].label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Materials ── */}
      <section style={{ backgroundColor:"#ffffff", padding:"clamp(56px,7vh,80px) clamp(24px,5vw,72px)", borderTop:"1px solid rgba(2,10,37,0.05)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"clamp(16px,2.5vw,28px)" }}>
          <RevealText as="h2" text={t.materials.heading} style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:300, fontSize:"var(--lp-title-fs)", lineHeight:1.1, color:NAVY, letterSpacing:"var(--lp-title-ls)", maxWidth:"clamp(300px,52vw,620px)", margin:0 }} />
          <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:"clamp(0.72rem,0.9vw,0.82rem)", lineHeight:1.7, color:"rgba(2,10,37,0.5)", maxWidth:"320px", alignSelf:"flex-end", margin:0 }}>{t.materials.tagline}</p>
        </div>
        <div className="mat-grid">
          {t.materials.cards.map(({title,desc},i)=>(
            <div key={i} className="mat-card">
              <div className="mat-icon-wrap">{MAT_ICONS[i]}</div>
              <div><h3 className="mat-card-title">{title}</h3><p className="mat-card-desc">{desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Projects ══ */}
      <section className="projects-desktop" style={{ background: SECTION_BG }}>
        <div style={{ display: "flex" }}>

          {/* Left: sticky — full-height map + overlay details panel — 60% */}
          <div style={{ position: "sticky", top: 0, width: "60%", height: "100vh", flexShrink: 0, overflow: "hidden" }}>

            {/* Map fills the full 100vh — extends to absolute bottom, no gaps */}
            {/* isolation:isolate contains Leaflet's internal z-indexes (200/400/600) so they don't bleed above the details overlay */}
            <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
              <LeafletMap activeIdx={activeProject} />
            </div>

            {/* Details overlay — anchored to bottom, sits atop the map */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 11 }}>

              {/* Gradient bridge: map dissolves into the details panel */}
              <div style={{ height: "clamp(72px,11vh,100px)", background: `linear-gradient(to bottom, transparent, ${SECTION_BG})`, position: "relative" }}>
                {/* Floating location pill — centered in the gradient transition zone */}
                <div style={{
                  position: "absolute", bottom: "clamp(10px,1.5vh,14px)", left: "50%",
                  transform: "translateX(-50%)",
                  background: "#ffffff", borderRadius: "100px", padding: "9px 20px",
                  display: "flex", alignItems: "center", gap: "10px",
                  boxShadow: "0 4px 24px rgba(2,10,37,0.16)", whiteSpace: "nowrap",
                  opacity: sidebarVisible ? 1 : 0,
                  transition: "opacity 0.25s ease",
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.6rem,0.78vw,0.7rem)", fontWeight: 500, color: NAVY, letterSpacing: "0.03em" }}>{projects[displayProject].name}</span>
                  <span style={{ width: "1px", height: "12px", background: "rgba(2,10,37,0.15)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.58rem,0.7vw,0.65rem)", color: "rgba(2,10,37,0.45)" }}>{projects[displayProject].location}</span>
                </div>
              </div>

              {/* Solid details panel */}
              <div style={{ background: SECTION_BG, padding: "clamp(16px,2.2vh,22px) clamp(28px,4vw,52px) clamp(28px,4.5vh,48px)", position: "relative", overflow: "hidden" }}>

                {/* Label + progress row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(10px,1.4vh,14px)" }}>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "var(--lp-label-fs)", letterSpacing: "var(--lp-label-ls)", textTransform: "uppercase", color: "rgba(2,10,37,0.35)", margin: 0 }}>{t.projects.label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {projects.map((_, i) => (
                        <div key={i} style={{ height: "2px", width: i === activeProject ? "22px" : "5px", background: i === activeProject ? NAVY : "rgba(2,10,37,0.15)", borderRadius: "2px", transition: "all 0.5s cubic-bezier(0.37,0,0.63,1)" }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.65vw,0.6rem)", fontWeight: 500, letterSpacing: "0.12em", color: "rgba(2,10,37,0.28)", fontVariantNumeric: "tabular-nums" }}>
                      {String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Fading dynamic content — smooth opacity + lift transition on project change */}
                <div style={{ opacity: sidebarVisible ? 1 : 0, transform: sidebarVisible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.28s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)" }}>

                  {/* Project name */}
                  <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.4rem,2.4vw,2.6rem)", lineHeight: 1.04, color: NAVY, letterSpacing: "-0.025em", margin: "0 0 clamp(8px,1.2vh,12px) 0" }}>
                    {projects[displayProject].name}
                  </h2>

                  {/* Full rich description */}
                  <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.64rem,0.79vw,0.72rem)", lineHeight: 1.72, color: "rgba(2,10,37,0.52)", margin: "0 0 clamp(12px,1.7vh,16px) 0", maxWidth: "clamp(280px,36vw,480px)" }}>
                    {projects[displayProject].fullDesc}
                  </p>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "rgba(2,10,37,0.08)", margin: "0 0 clamp(10px,1.4vh,13px) 0" }} />

                  {/* Service tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "clamp(10px,1.4vh,14px)" }}>
                    {projects[displayProject].tags.map(tag => (
                      <span key={tag} style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.48rem,0.57vw,0.52rem)", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: ACCENT, background: "rgba(24,71,242,0.07)", border: "1px solid rgba(24,71,242,0.14)", borderRadius: "3px", padding: "3px 9px" }}>{tag}</span>
                    ))}
                  </div>

                  {/* Meta chips + Maps button */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "clamp(8px,1.2vh,12px)" }}>
                    <div style={{ display: "flex", gap: "clamp(14px,2vw,22px)", flexWrap: "wrap" }}>
                      <MetaChip label={t.projects.metaKeys.type} value={projects[displayProject].type} />
                      <MetaChip label={t.projects.metaKeys.location} value={projects[displayProject].location} />
                      {projects[displayProject].budget && <MetaChip label={t.projects.metaKeys.budget} value={projects[displayProject].budget!} />}
                      <MetaChip label={t.projects.metaKeys.year} value={projects[displayProject].year} />
                    </div>
                    <a
                      href={projects[displayProject].mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-maps-btn"
                      style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.65vw,0.59rem)", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: NAVY, border: "1px solid rgba(2,10,37,0.22)", borderRadius: "3px", padding: "8px 14px", textDecoration: "none", transition: "background 0.22s ease, border-color 0.22s ease, color 0.22s ease", flexShrink: 0 }}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.78 3.5 6.5 3.5 6.5s3.5-3.72 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" fill="currentColor"/>
                      </svg>
                      {t.projects.viewOnMaps}
                    </a>
                  </div>

                </div>

                {/* Bottom fade — premium bleed effect, text dissolves into section bg */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "clamp(36px,5.5vh,52px)", background: `linear-gradient(to bottom, transparent, ${SECTION_BG})`, pointerEvents: "none" }} />
              </div>
            </div>
          </div>

          {/* Right: scrollable portrait card list — 40% */}
          <div style={{ flex: 1, minWidth: 0, padding: "clamp(40px,6vh,64px) clamp(24px,3.5vw,44px) 40vh" }}>
            {projects.map((proj, i) => (
              <div
                key={proj.id}
                ref={(el: HTMLDivElement | null) => { cardRefs.current[i] = el; }}
                style={{ marginBottom: i < projects.length - 1 ? "clamp(20px,3vh,28px)" : 0 }}
              >
                <ProjectCard proj={proj} metaKeys={t.projects.metaKeys} index={i} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Projects mobile ── */}
      <section className="projects-mobile" style={{ background: "#f0eeea", paddingTop: "clamp(48px,7vh,72px)", paddingBottom: "clamp(48px,7vh,72px)" }}>
        <div style={{ paddingLeft: "clamp(24px,5vw,48px)", paddingRight: "clamp(24px,5vw,48px)", marginBottom: "clamp(16px,2.5vh,24px)" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(2,10,37,0.35)", margin: "0 0 clamp(8px,1.2vh,12px) 0" }}>{t.projects.label}</p>
          <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.8rem,5vw,3rem)", lineHeight: 1.05, color: NAVY, letterSpacing: "-0.025em", margin: 0 }}>{t.projects.heading}</h2>
        </div>
        <div style={{ height: "clamp(200px,45vw,300px)", marginBottom: "clamp(24px,3.5vh,32px)", position: "relative" }}>
          <LeafletMap activeIdx={activeProject} />
        </div>
        <div
          ref={mobileSliderRef}
          className="proj-mobile-slider"
          style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", gap: "clamp(12px,3vw,16px)", paddingLeft: "clamp(24px,5vw,48px)", paddingRight: "clamp(24px,5vw,48px)", paddingBottom: "4px", scrollbarWidth: "none" }}
        >
          {projects.map((proj, i) => (
            <div key={proj.id} style={{ flex: "0 0 82vw", maxWidth: "360px", scrollSnapAlign: "start" }}>
              <ProjectCard proj={proj} metaKeys={t.projects.metaKeys} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor:NAVY, padding:"clamp(64px,10vh,120px) clamp(24px,5vw,72px) clamp(32px,4vh,56px)" }}>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"clamp(48px,7vh,88px)", display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"clamp(24px,4vw,48px)", marginBottom:"clamp(56px,8vh,100px)" }}>
          <div>
            <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:400, fontSize:"clamp(0.6rem,0.78vw,0.7rem)", letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", margin:"0 0 clamp(14px,2vh,22px) 0" }}>{t.footer.ctaLabel}</p>
            <h2 style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:200, fontSize:"clamp(2.2rem,5.5vw,5.5rem)", lineHeight:0.95, color:"#ffffff", margin:0, letterSpacing:"-0.03em", maxWidth:"clamp(280px,60vw,800px)" }}>{t.footer.ctaHeading}</h2>
          </div>
          <Link href="/contact" className="footer-cta-btn btn-fill" style={{ textDecoration:"none" }}>{t.footer.ctaBtn} <span className="btn-fill-icon">→</span></Link>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px", borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"clamp(20px,2.5vh,28px)" }}>
          <Link href="/" style={{ fontFamily:"'Titillium Web',sans-serif", fontWeight:600, fontSize:"clamp(0.85rem,1.1vw,1rem)", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.9)", textDecoration:"none" }}>Level Pro</Link>
          <div style={{ display:"flex", gap:"clamp(20px,3vw,36px)" }}>
            {t.footer.links.map((l,i)=><Link key={l} href={NAV_ROUTES[i]??"/"+l.toLowerCase().replace(/\s+/g,"-")} style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.62rem,0.78vw,0.7rem)", fontWeight:400, color:"rgba(255,255,255,0.35)", letterSpacing:"0.04em", textDecoration:"none", transition:"color 0.2s ease" }}>{l}</Link>)}
          </div>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(0.58rem,0.72vw,0.65rem)", color:"rgba(255,255,255,0.2)", letterSpacing:"0.04em" }}>{t.footer.copyright}</span>
        </div>
      </footer>
    </>
  );
}
