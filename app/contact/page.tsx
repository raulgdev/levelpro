"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import { TRANSLATIONS } from "../translations";
import { NAVY, ACCENT, useLocale, Preloader, NavBar, FooterCTA } from "../components/shared";

const HERO_IMG = "https://levelpro.es/wp-content/uploads/2026/05/1-copy.avif";

export default function ContactPage() {
  const [locale, setLocale] = useLocale();
  const t = TRANSLATIONS[locale];
  const cp = t.contactPage;

  const [pastHero, setPastHero] = useState(false);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [isFastLoader, setIsFastLoader] = useState(false);
  const pendingLocaleRef = useRef<ReturnType<typeof useLocale>[0] | null>(null);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

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

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    let id: number;
    const check = () => {
      const nowPast = window.scrollY > window.innerHeight * 0.75;
      setPastHero(p => p === nowPast ? p : nowPast);
    };
    const raf = (time: number) => { lenis.raf(time); check(); id = requestAnimationFrame(raf); };
    check();
    id = requestAnimationFrame(raf);
    window.addEventListener("resize", check, { passive: true });
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.removeEventListener("resize", check); };
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = cp.form.errors.required;
    if (!form.email.trim()) errs.email = cp.form.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = cp.form.errors.emailInvalid;
    if (!form.message.trim()) errs.message = cp.form.errors.required;
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  const fieldBase: React.CSSProperties = {
    width: "100%",
    fontFamily: "'Inter',sans-serif",
    fontSize: "clamp(0.76rem,0.92vw,0.84rem)",
    fontWeight: 300,
    color: NAVY,
    background: "#ffffff",
    borderRadius: "3px",
    padding: "clamp(12px,1.8vh,16px) 14px",
    lineHeight: 1.4,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:auto;touch-action:manipulation;}
        html.lenis,html.lenis body{height:auto;}
        .lenis.lenis-smooth{scroll-behavior:auto!important;}
        .lenis.lenis-stopped{overflow:hidden;}
        body{background-color:${NAVY};color:#fff;overflow-x:hidden;overscroll-behavior:none;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:${NAVY};}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px;}
        a{text-decoration:none;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        .shared-nav-active{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
        .shared-lang-active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        .contact-field{outline:none;transition:border-color 0.2s ease,box-shadow 0.2s ease;appearance:none;-webkit-appearance:none;}
        .contact-field:focus{border-color:${ACCENT}!important;box-shadow:0 0 0 3px rgba(24,71,242,0.08);}
        .contact-field.field-error{border-color:rgba(200,40,40,0.55)!important;}
        .contact-submit{cursor:pointer;transition:opacity 0.2s ease;}
        .contact-submit:hover{opacity:0.82;}
        @media(max-width:900px){
          .hero-split{grid-template-columns:1fr!important;}
          .hero-photo-col{display:none!important;}
          .contact-grid{grid-template-columns:1fr!important;}
          .nav-links-inner{display:none!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar pastHero={pastHero} locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero-split" style={{ display: "grid", gridTemplateColumns: "55fr 45fr", height: "100vh", minHeight: "600px", overflow: "hidden" }}>

        {/* Left — navy panel */}
        <div style={{ backgroundColor: NAVY, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(24px,4.5vw,64px)", paddingTop: "clamp(80px,10vw,120px)" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", animation: "fadeUp 0.8s ease 0.4s both" }}>
              {cp.hero.label}
            </p>
            <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(3rem,5.5vw,5.5rem)", color: "rgba(255,255,255,0.05)", letterSpacing: "-0.04em", lineHeight: 1, userSelect: "none", animation: "fadeIn 1s ease 0.3s both" }}>05</span>
          </div>

          <div style={{ animation: "fadeUp 0.9s ease 0.2s both" }}>
            <h1 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(3.2rem,6.5vw,8rem)", lineHeight: 0.93, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
              {cp.hero.headingLine1}<br />
              <span style={{ color: ACCENT }}>{cp.hero.headingLine2}</span><br />
              {cp.hero.headingLine3}
            </h1>
          </div>

          <div style={{ animation: "fadeUp 0.8s ease 0.5s both" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.68rem,0.85vw,0.8rem)", lineHeight: 1.72, color: "rgba(255,255,255,0.4)", marginBottom: "clamp(20px,3vh,28px)", maxWidth: "400px" }}>
              {cp.hero.tagline}
            </p>

            {/* Facts row */}
            <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "clamp(14px,2vh,20px)" }}>
              <div style={{ paddingRight: "clamp(16px,2.5vw,32px)", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "clamp(0.75rem,1.1vw,1rem)", color: "#fff", display: "block", lineHeight: 1, marginBottom: "5px", letterSpacing: "0.01em" }}>Costa Blanca</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.28)" }}>{cp.hero.factLabels[0]}</span>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", alignSelf: "stretch", flexShrink: 0, marginRight: "clamp(16px,2.5vw,32px)" }} />
              <div style={{ paddingRight: "clamp(16px,2.5vw,32px)", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 200, fontSize: "clamp(1.1rem,1.8vw,1.7rem)", color: "#fff", letterSpacing: "-0.02em", display: "block", lineHeight: 1, marginBottom: "5px" }}>{"< 24h"}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.28)" }}>{cp.hero.factLabels[1]}</span>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", alignSelf: "stretch", flexShrink: 0, marginRight: "clamp(16px,2.5vw,32px)" }} />
              <div style={{ flexShrink: 0 }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "clamp(0.75rem,1.1vw,1rem)", color: "#fff", display: "block", lineHeight: 1, marginBottom: "5px", letterSpacing: "0.01em" }}>Mon–Sat</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.28)" }}>{cp.hero.factLabels[2]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — photo */}
        <div className="hero-photo-col" style={{ position: "relative", overflow: "hidden" }}>
          <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(2,10,37,0.5) 0%, transparent 40%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "160px", background: "linear-gradient(to bottom, rgba(2,10,37,0.5) 0%, transparent 100%)" }} />
        </div>
      </section>

      {/* ─── CONTACT BODY ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#ffffff", padding: "clamp(64px,10vh,112px) clamp(24px,5vw,72px)" }}>

        {/* Section eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px,1.4vw,16px)", marginBottom: "clamp(48px,7vh,80px)" }}>
          <div style={{ width: "2px", height: "clamp(18px,2.5vh,24px)", background: ACCENT, flexShrink: 0 }} />
          <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.55rem,0.7vw,0.63rem)", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "rgba(2,10,37,0.3)", margin: 0 }}>
            {cp.info.label}
          </p>
        </div>

        {/* Two-column grid */}
        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "clamp(48px,8vw,120px)", alignItems: "start" }}>

          {/* ── Info column ── */}
          <div>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "var(--lp-title-fs)", lineHeight: 0.97, color: NAVY, letterSpacing: "var(--lp-title-ls)", margin: "0 0 clamp(36px,5.5vh,56px) 0" }}>
              {cp.info.heading}
            </h2>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Phone */}
              <div style={{ paddingBottom: "clamp(24px,3.5vh,36px)", borderBottom: "1px solid rgba(2,10,37,0.08)", marginBottom: "clamp(24px,3.5vh,36px)" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(2,10,37,0.32)", margin: "0 0 8px 0" }}>
                  {cp.info.phone.label}
                </p>
                <a href={`tel:${cp.info.phone.val.replace(/\s/g, "")}`} style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.3rem,2.4vw,2.4rem)", color: NAVY, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {cp.info.phone.val}
                </a>
              </div>

              {/* Email */}
              <div style={{ paddingBottom: "clamp(24px,3.5vh,36px)", borderBottom: "1px solid rgba(2,10,37,0.08)" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(2,10,37,0.32)", margin: "0 0 8px 0" }}>
                  {cp.info.email.label}
                </p>
                <a href={`mailto:${cp.info.email.val}`} style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1rem,1.8vw,1.8rem)", color: NAVY, letterSpacing: "-0.01em", lineHeight: 1 }}>
                  {cp.info.email.val}
                </a>
              </div>
            </div>

            <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.68rem,0.82vw,0.76rem)", lineHeight: 1.82, color: "rgba(2,10,37,0.42)", marginTop: "clamp(28px,4vh,40px)", maxWidth: "340px" }}>
              {cp.info.note}
            </p>
          </div>

          {/* ── Form column ── */}
          <div>
            {submitted ? (
              /* Success state */
              <div style={{ padding: "clamp(36px,5.5vh,56px) clamp(28px,4vw,44px)", border: `1px solid rgba(24,71,242,0.18)`, borderRadius: "3px", borderTop: `3px solid ${ACCENT}` }}>
                <div style={{ width: "2px", height: "clamp(18px,2.5vh,24px)", background: ACCENT, marginBottom: "clamp(16px,2.2vh,22px)" }} />
                <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontWeight: 300, fontSize: "clamp(1.6rem,2.8vw,2.8rem)", color: NAVY, letterSpacing: "-0.025em", margin: "0 0 clamp(12px,1.8vh,18px) 0", lineHeight: 1 }}>
                  {cp.form.success.heading}
                </h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(0.72rem,0.88vw,0.82rem)", lineHeight: 1.78, color: "rgba(2,10,37,0.5)", margin: 0 }}>
                  {cp.form.success.body}
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(22px,3.2vh,32px)" }}>

                  {/* Full Name */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(2,10,37,0.4)", marginBottom: "8px" }}>
                      {cp.form.name.label}
                    </label>
                    <input
                      type="text"
                      className={`contact-field${errors.name ? " field-error" : ""}`}
                      value={form.name}
                      onChange={e => handleChange("name", e.target.value)}
                      placeholder={cp.form.name.placeholder}
                      style={{ ...fieldBase, border: `1px solid ${errors.name ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.15)"}` }}
                    />
                    {errors.name && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(2,10,37,0.4)", marginBottom: "8px" }}>
                      {cp.form.email.label}
                    </label>
                    <input
                      type="email"
                      className={`contact-field${errors.email ? " field-error" : ""}`}
                      value={form.email}
                      onChange={e => handleChange("email", e.target.value)}
                      placeholder={cp.form.email.placeholder}
                      style={{ ...fieldBase, border: `1px solid ${errors.email ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.15)"}` }}
                    />
                    {errors.email && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(2,10,37,0.4)", marginBottom: "8px" }}>
                      {cp.form.message.label}
                    </label>
                    <textarea
                      className={`contact-field${errors.message ? " field-error" : ""}`}
                      value={form.message}
                      onChange={e => handleChange("message", e.target.value)}
                      placeholder={cp.form.message.placeholder}
                      rows={6}
                      style={{ ...fieldBase, border: `1px solid ${errors.message ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.15)"}`, lineHeight: 1.72, resize: "vertical" as const }}
                    />
                    {errors.message && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <div>
                    <button
                      type="submit"
                      className="contact-submit"
                      style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.65rem,0.8vw,0.72rem)", fontWeight: 500, letterSpacing: "0.08em", color: "#ffffff", background: NAVY, border: "none", borderRadius: "3px", padding: "clamp(12px,1.8vh,16px) clamp(24px,3vw,36px)", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      {cp.form.submit} <span>→</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <FooterCTA locale={locale} />
    </>
  );
}
