"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import { TRANSLATIONS } from "../translations";
import { NAVY, useLocale, Preloader, NavBar, FooterCTA } from "../components/shared";

// ─── Eyebrow — small square dot + uppercase label, same pattern as About/Services ────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

export default function ContactPage() {
  const [locale, setLocale] = useLocale();
  const t = TRANSLATIONS[locale];
  const cp = t.contactPage;

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

  // Light-toned page from the very top (no dark hero) — nav stays "dark text"
  // throughout, same convention as About/Services. Only the footer is navy.
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    let id: number;
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
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

  // Touch target: 14px vertical floor (was 12px) clears 44px tap height on mobile
  // once combined with the 1.4 line-height, instead of landing just under it.
  const fieldBase: React.CSSProperties = {
    width: "100%",
    fontFamily: "'Inter',sans-serif",
    fontSize: "var(--lp-body-fs)",
    fontWeight: 300,
    color: NAVY,
    padding: "clamp(14px,1.8vh,16px) 14px",
    lineHeight: 1.4,
  };
  const fieldClass = "bg-white rounded-[var(--radius)]";

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
        .shared-nav-active{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
        .shared-lang-active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        .contact-field{outline:none;transition:border-color 0.2s ease,box-shadow 0.2s ease;appearance:none;-webkit-appearance:none;}
        .contact-field:focus{border-color:${NAVY}!important;box-shadow:0 0 0 3px rgba(2,10,37,0.08);}
        .contact-field.field-error{border-color:rgba(200,40,40,0.55)!important;}
        /* Small-laptop band (1024-1366px): the two-column split gives the text
           column only ~55% of the viewport, but its heading scales off the full
           viewport width (vw unit) — without this it overshoots the column in
           exactly the 13-14in laptop range. Pulls the vw coefficient back. */
        @media(min-width:1024px) and (max-width:1366px){
          .contact-hero-title{font-size:clamp(2.4rem,4.6vw,4.6rem)!important;}
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} />

      {/* ─── HERO — title, description and the contact form all live in this
          one white section; nothing repeats below it except the navy footer ── */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#ffffff", minHeight: "clamp(640px,90vh,900px)", padding: "clamp(120px,15vh,168px) clamp(24px,5vw,72px) clamp(64px,9vh,96px)" }}>
        {/* Soft navy glow, top-right — same decorative touch as About/Services */}
        <div style={{ position: "absolute", top: "-12%", right: "-8%", width: "46%", aspectRatio: "1", background: "radial-gradient(circle, rgba(2,10,37,0.08) 0%, rgba(2,10,37,0.03) 45%, transparent 72%)", filter: "blur(10px)", pointerEvents: "none" }} />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-start" style={{ position: "relative", zIndex: 1 }}>

          {/* ── Left: heading, tagline, contact details, quick facts ── */}
          <div>
            <div style={{ marginBottom: "clamp(20px,2.8vh,28px)", animation: "fadeUp 0.7s ease 0.1s both" }}>
              <Eyebrow>{cp.hero.label}</Eyebrow>
            </div>

            <h1 className="contact-hero-title" style={{ fontFamily: "'Inter',sans-serif", fontWeight: 200, fontSize: "clamp(2.6rem,5.2vw,5.6rem)", lineHeight: 1.0, color: NAVY, margin: "0 0 clamp(20px,2.8vh,28px) 0", letterSpacing: "-0.03em", animation: "fadeUp 0.9s ease 0.2s both" }}>
              {cp.hero.headingLine1}<br />
              <span style={{ color: "rgba(2,10,37,0.35)" }}>{cp.hero.headingLine2}</span><br />
              {cp.hero.headingLine3}
            </h1>

            <div style={{ animation: "fadeUp 0.8s ease 0.4s both" }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: "0 0 clamp(36px,5vh,48px) 0", maxWidth: "400px" }}>
                {cp.hero.tagline}
              </p>

              {/* Contact details */}
              <div style={{ borderTop: "1px solid rgba(2,10,37,0.1)", paddingTop: "clamp(28px,4vh,40px)", marginBottom: "clamp(28px,4vh,36px)" }}>
                <div style={{ marginBottom: "clamp(14px,2vh,18px)" }}>
                  <Eyebrow>{cp.info.label}</Eyebrow>
                </div>

                <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-h3-fs)", color: NAVY, letterSpacing: "-0.01em", margin: "0 0 clamp(20px,2.8vh,26px) 0", lineHeight: 1.2 }}>
                  {cp.info.heading}
                </h2>

                <div className="flex flex-wrap" style={{ columnGap: "clamp(32px,4.5vw,56px)", rowGap: "clamp(18px,2.5vh,24px)", marginBottom: "clamp(18px,2.5vh,24px)" }}>
                  <div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: "0 0 8px 0" }}>
                      {cp.info.phone.label}
                    </p>
                    <a href={`tel:${cp.info.phone.val.replace(/\s/g, "")}`} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem,2.6vw,2.4rem)", color: NAVY, letterSpacing: "-0.02em", lineHeight: 1 }}>
                      {cp.info.phone.val}
                    </a>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: "0 0 8px 0" }}>
                      {cp.info.email.label}
                    </p>
                    <a href={`mailto:${cp.info.email.val}`} style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "clamp(1.3rem,2vw,1.8rem)", color: NAVY, letterSpacing: "-0.01em", lineHeight: 1 }}>
                      {cp.info.email.val}
                    </a>
                  </div>
                </div>

                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0, maxWidth: "440px" }}>
                  {cp.info.note}
                </p>
              </div>

              {/* Quick facts — no rule; whitespace alone separates it from the block above */}
              <div className="flex flex-wrap" style={{ rowGap: "12px" }}>
                <div style={{ paddingRight: "clamp(16px,2.5vw,32px)", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "clamp(0.75rem,1.1vw,1rem)", color: NAVY, display: "block", lineHeight: 1, marginBottom: "5px", letterSpacing: "0.01em" }}>Costa Blanca</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)" }}>{cp.hero.factLabels[0]}</span>
                </div>
                <div style={{ width: "1px", background: "rgba(2,10,37,0.1)", alignSelf: "stretch", flexShrink: 0, marginRight: "clamp(16px,2.5vw,32px)" }} />
                <div style={{ paddingRight: "clamp(16px,2.5vw,32px)", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 200, fontSize: "clamp(1.1rem,1.8vw,1.7rem)", color: NAVY, letterSpacing: "-0.02em", display: "block", lineHeight: 1, marginBottom: "5px" }}>{"< 24h"}</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)" }}>{cp.hero.factLabels[1]}</span>
                </div>
                <div style={{ width: "1px", background: "rgba(2,10,37,0.1)", alignSelf: "stretch", flexShrink: 0, marginRight: "clamp(16px,2.5vw,32px)" }} />
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 400, fontSize: "clamp(0.75rem,1.1vw,1rem)", color: NAVY, display: "block", lineHeight: 1, marginBottom: "5px", letterSpacing: "0.01em" }}>Mon–Sat</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.5rem,0.6vw,0.56rem)", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)" }}>{cp.hero.factLabels[2]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: the form, unchanged — housed in a bordered white card so it
              reads as a distinct panel against the white page ── */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(2,10,37,0.07)", borderRadius: "var(--radius)", padding: "clamp(32px,4.5vw,52px)", animation: "fadeUp 0.9s ease 0.3s both" }}>
            {submitted ? (
              /* Success state */
              <div>
                <div style={{ width: "2px", height: "clamp(18px,2.5vh,24px)", background: NAVY, marginBottom: "clamp(16px,2.2vh,22px)" }} />
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "clamp(1.6rem,2.8vw,2.8rem)", color: NAVY, letterSpacing: "-0.025em", margin: "0 0 clamp(12px,1.8vh,18px) 0", lineHeight: 1 }}>
                  {cp.form.success.heading}
                </h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                  {cp.form.success.body}
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(22px,3.2vh,32px)" }}>

                  {/* Full Name */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>
                      {cp.form.name.label}
                    </label>
                    <input
                      type="text"
                      className={`contact-field ${fieldClass}${errors.name ? " field-error" : ""}`}
                      value={form.name}
                      onChange={e => handleChange("name", e.target.value)}
                      placeholder={cp.form.name.placeholder}
                      style={{ ...fieldBase, border: `1px solid ${errors.name ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.15)"}` }}
                    />
                    {errors.name && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>
                      {cp.form.email.label}
                    </label>
                    <input
                      type="email"
                      className={`contact-field ${fieldClass}${errors.email ? " field-error" : ""}`}
                      value={form.email}
                      onChange={e => handleChange("email", e.target.value)}
                      placeholder={cp.form.email.placeholder}
                      style={{ ...fieldBase, border: `1px solid ${errors.email ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.15)"}` }}
                    />
                    {errors.email && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>
                      {cp.form.message.label}
                    </label>
                    <textarea
                      className={`contact-field ${fieldClass}${errors.message ? " field-error" : ""}`}
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
                      className="cursor-pointer transition-opacity duration-200 hover:opacity-[0.82] text-white bg-[#020A25] border-none rounded-[var(--radius)] inline-flex items-center gap-2"
                      style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.65rem,0.8vw,0.72rem)", fontWeight: 500, letterSpacing: "0.08em", padding: "clamp(14px,1.8vh,16px) clamp(24px,3vw,36px)" }}>
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
