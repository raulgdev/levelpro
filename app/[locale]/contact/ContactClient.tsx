"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import { Locale, TRANSLATIONS } from "../../translations";
import { NAVY, useLocale, useLogoFloating, Preloader, NavBar, FooterCTA } from "../../components/shared";

// ─── Eyebrow — small square dot + uppercase label, same pattern as About/Services ────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <span style={{ width: "6px", height: "6px", background: NAVY, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(0.58rem,0.7vw,0.64rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--lp-text-meta)" }}>{children}</span>
    </span>
  );
}

function FieldIcon({ type }: { type: "name" | "email" | "message" }) {
  const paths = {
    name: (
      <>
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.75 19c.6-3.25 2.7-5 6.25-5s5.65 1.75 6.25 5" />
      </>
    ),
    email: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.25" />
        <path d="m5 7 7 5.4L19 7" />
      </>
    ),
    message: (
      <>
        <path d="M5.5 18.5 4 21l4-1.5h9.25A2.75 2.75 0 0 0 20 16.75v-9.5a2.75 2.75 0 0 0-2.75-2.75H6.75A2.75 2.75 0 0 0 4 7.25v8.5a2.75 2.75 0 0 0 1.5 2.75Z" />
        <path d="M8 9h8M8 13h5.5" />
      </>
    ),
  };

  return (
    <span className={`contact-field-icon${type === "message" ? " contact-field-icon-message" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {paths[type]}
      </svg>
    </span>
  );
}

export default function ContactClient({ locale: initialLocale }: { locale: Locale }) {
  const [locale, setLocale] = useLocale(initialLocale);
  const t = TRANSLATIONS[locale];
  const cp = t.contactPage;
  const logoFloating = useLogoFloating();

  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [isFastLoader, setIsFastLoader] = useState(false);
  const pendingLocaleRef = useRef<Locale | null>(null);

  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });

      if (!response.ok) throw new Error("Contact request failed");
      setSubmitted(true);
    } catch {
      setSubmitError(cp.form.errors.sendFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (submitError) setSubmitError("");
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  // Touch target: 14px vertical floor (was 12px) clears 44px tap height on mobile
  // once combined with the 1.4 line-height, instead of landing just under it.
  const fieldBase: React.CSSProperties = {
    width: "100%",
    fontFamily: "var(--font-inter),sans-serif",
    fontSize: "var(--lp-body-fs)",
    fontWeight: 300,
    color: NAVY,
    padding: "clamp(14px,1.8vh,16px) 16px clamp(14px,1.8vh,16px) clamp(48px,4vw,54px)",
    lineHeight: 1.4,
  };
  const fieldClass = "bg-white rounded-[var(--radius)]";

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
        .shared-nav-active{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px;}
        .shared-lang-active{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
        .contact-form-card{background:#f7f8fa;border:1px solid rgba(2,10,37,0.13);box-shadow:none;}
        .contact-field-wrap{position:relative;}
        .contact-field{outline:none;background:#fff;transition:border-color 0.25s ease,box-shadow 0.25s ease,background-color 0.25s ease;appearance:none;-webkit-appearance:none;}
        .contact-field::placeholder{color:rgba(2,10,37,0.42);opacity:1;}
        .contact-field:hover{border-color:rgba(2,10,37,0.32)!important;}
        .contact-field:focus{border-color:${NAVY}!important;background:#fff;box-shadow:0 0 0 3px rgba(2,10,37,0.08),0 8px 24px rgba(2,10,37,0.04);}
        .contact-field.field-error{border-color:rgba(200,40,40,0.55)!important;}
        .contact-field-icon{position:absolute;left:16px;top:50%;width:20px;height:20px;transform:translateY(-50%);color:rgba(2,10,37,0.42);pointer-events:none;transition:color 0.25s ease,transform 0.25s ease;z-index:1;}
        .contact-field-icon svg{display:block;width:100%;height:100%;}
        .contact-field-icon-message{top:20px;transform:none;}
        .contact-field-wrap:focus-within .contact-field-icon{color:${NAVY};transform:translateY(-50%) scale(1.04);}
        .contact-field-wrap:focus-within .contact-field-icon-message{transform:scale(1.04);}
        .contact-honeypot{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;}
        .contact-info-primary{display:grid;grid-template-columns:max-content max-content;gap:clamp(20px,2.4vw,36px);align-items:start;justify-content:start;}
        .contact-info-link{display:inline-block;max-width:100%;overflow-wrap:anywhere;}
        .contact-info-secondary{display:grid;grid-template-columns:minmax(220px,290px) max-content;gap:clamp(24px,3vw,44px);align-items:start;justify-content:start;padding-top:clamp(18px,2.5vh,24px);border-top:1px solid rgba(2,10,37,0.1);}
        .contact-info-secondary address{font-style:normal;}
        /* Small-laptop band (1024-1366px): the two-column split gives the text
           column only ~55% of the viewport, but its heading scales off the full
           viewport width (vw unit) — without this it overshoots the column in
           exactly the 13-14in laptop range. Pulls the vw coefficient back. */
        @media(min-width:1024px) and (max-width:1366px){
          .contact-hero-title{font-size:clamp(2.4rem,4.6vw,4.6rem)!important;}
        }
        @media(max-width:767px){
          .contact-info-primary{grid-template-columns:1fr;gap:22px;}
          .contact-info-secondary{grid-template-columns:1fr;gap:20px;}
          .contact-fact-hours{order:1;}
          .contact-fact-address{
            order:2;
          }
        }
      ` }} />

      {preloaderVisible && <Preloader key={preloaderKey} onComplete={handlePreloaderComplete} onCovered={handlePreloaderCovered} fast={isFastLoader} />}
      <NavBar locale={locale} onLocaleChange={handleLocaleChange} logoFloating={logoFloating} logoFloatingTone="light" logoFloatingDesktopOnly />

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

            <h1 className="contact-hero-title" style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 200, fontSize: "clamp(2.6rem,5.2vw,5.6rem)", lineHeight: 1.0, color: NAVY, margin: "0 0 clamp(20px,2.8vh,28px) 0", letterSpacing: "-0.03em", animation: "fadeUp 0.9s ease 0.2s both" }}>
              {cp.hero.headingLine1}<br />
              <span style={{ color: "rgba(2,10,37,0.35)" }}>{cp.hero.headingLine2}</span><br />
              {cp.hero.headingLine3}
            </h1>

            <div style={{ animation: "fadeUp 0.8s ease 0.4s both" }}>
              <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: "0 0 clamp(36px,5vh,48px) 0", maxWidth: "400px" }}>
                {cp.hero.tagline}
              </p>

              {/* Contact details */}
              <div style={{ borderTop: "1px solid rgba(2,10,37,0.1)", paddingTop: "clamp(28px,4vh,40px)", marginBottom: "clamp(28px,4vh,36px)" }}>
                <div style={{ marginBottom: "clamp(14px,2vh,18px)" }}>
                  <Eyebrow>{cp.info.label}</Eyebrow>
                </div>

                <div className="contact-info-primary" style={{ marginBottom: "clamp(16px,2.2vh,20px)" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: "0 0 8px 0" }}>
                      {cp.info.phone.label}
                    </p>
                    <a className="contact-info-link" href={`tel:${cp.info.phone.val.replace(/\s/g, "")}`} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(1.45rem,2.25vw,2.05rem)", color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.08 }}>
                      {cp.info.phone.val}
                    </a>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--lp-text-meta)", margin: "0 0 8px 0" }}>
                      {cp.info.email.label}
                    </p>
                    <a className="contact-info-link" href={`mailto:${cp.info.email.val}`} style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, fontSize: "clamp(1.15rem,1.7vw,1.55rem)", color: NAVY, letterSpacing: "-0.015em", lineHeight: 1.15 }}>
                      {cp.info.email.val}
                    </a>
                  </div>
                </div>

                <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "clamp(0.78rem,0.95vw,0.9rem)", lineHeight: 1.55, color: "var(--lp-text-body)", margin: 0, maxWidth: "440px" }}>
                  {cp.info.note}
                </p>
              </div>

              {/* Secondary details — one quiet, aligned block below the primary contacts. */}
              <div className="contact-info-secondary">
                <div className="contact-fact-address">
                  <span style={{ display: "block", fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.58rem,0.7vw,0.66rem)", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>{cp.hero.factLabels[0]}</span>
                  <address style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "clamp(0.78rem,1vw,0.9rem)", color: NAVY, display: "block", lineHeight: 1.45, marginBottom: "4px", letterSpacing: "0.005em", maxWidth: "290px" }}>
                    Carrer Riu Montnegre, 7C<br />L&apos;Alfàs del Pi, Alicante
                  </address>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Carrer%20Riu%20Montnegre%207C%2C%2003581%20L%27Alf%C3%A0s%20del%20Pi%2C%20Alicante%2C%20Espa%C3%B1a"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.65rem,0.78vw,0.73rem)", color: NAVY, borderBottom: "1px solid rgba(2,10,37,0.28)", paddingBottom: "2px", marginTop: "3px" }}
                  >
                    {cp.hero.mapsLink} <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <div className="contact-fact-hours">
                  <span style={{ display: "block", fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.58rem,0.7vw,0.66rem)", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>{cp.hero.hoursLabel}</span>
                  <span style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 400, fontSize: "clamp(0.85rem,1vw,0.95rem)", color: NAVY, display: "block", lineHeight: 1.2, marginBottom: "7px", letterSpacing: "0.005em" }}>{cp.hero.weekdays ?? "Mon-Fri"}</span>
                  <span style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.65rem,0.78vw,0.73rem)", letterSpacing: "0.1em", color: "var(--lp-text-meta)" }}>8:00 - 18:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: the form, unchanged — housed in a bordered white card so it
              reads as a distinct panel against the white page ── */}
          <div className="contact-form-card" style={{ borderRadius: "var(--radius)", padding: "clamp(32px,4.5vw,52px)", animation: "fadeUp 0.9s ease 0.3s both" }}>
            {submitted ? (
              /* Success state */
              <div>
                <div style={{ width: "2px", height: "clamp(18px,2.5vh,24px)", background: NAVY, marginBottom: "clamp(16px,2.2vh,22px)" }} />
                <h3 style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "clamp(1.6rem,2.8vw,2.8rem)", color: NAVY, letterSpacing: "-0.025em", margin: "0 0 clamp(12px,1.8vh,18px) 0", lineHeight: 1 }}>
                  {cp.form.success.heading}
                </h3>
                <p style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 300, fontSize: "var(--lp-body-fs)", lineHeight: "var(--lp-body-lh)", color: "var(--lp-text-body)", margin: 0 }}>
                  {cp.form.success.body}
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    value={form.website}
                    onChange={e => handleChange("website", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(22px,3.2vh,32px)" }}>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="contact-name" style={{ display: "block", fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>
                      {cp.form.name.label}
                    </label>
                    <div className="contact-field-wrap">
                      <FieldIcon type="name" />
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        maxLength={120}
                        className={`contact-field ${fieldClass}${errors.name ? " field-error" : ""}`}
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                        placeholder={cp.form.name.placeholder}
                        style={{ ...fieldBase, border: `1px solid ${errors.name ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.22)"}` }}
                      />
                    </div>
                    {errors.name && <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" style={{ display: "block", fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>
                      {cp.form.email.label}
                    </label>
                    <div className="contact-field-wrap">
                      <FieldIcon type="email" />
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        className={`contact-field ${fieldClass}${errors.email ? " field-error" : ""}`}
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        placeholder={cp.form.email.placeholder}
                        style={{ ...fieldBase, border: `1px solid ${errors.email ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.22)"}` }}
                      />
                    </div>
                    {errors.email && <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" style={{ display: "block", fontFamily: "var(--font-inter),sans-serif", fontWeight: 500, fontSize: "clamp(0.52rem,0.64vw,0.58rem)", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "var(--lp-text-meta)", marginBottom: "8px" }}>
                      {cp.form.message.label}
                    </label>
                    <div className="contact-field-wrap">
                      <FieldIcon type="message" />
                      <textarea
                        id="contact-message"
                        name="message"
                        maxLength={5000}
                        className={`contact-field ${fieldClass}${errors.message ? " field-error" : ""}`}
                        value={form.message}
                        onChange={e => handleChange("message", e.target.value)}
                        placeholder={cp.form.message.placeholder}
                        rows={6}
                        style={{ ...fieldBase, border: `1px solid ${errors.message ? "rgba(200,40,40,0.45)" : "rgba(2,10,37,0.22)"}`, lineHeight: 1.72, resize: "vertical" as const }}
                      />
                    </div>
                    {errors.message && <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.52rem,0.62vw,0.58rem)", color: "rgba(200,40,40,0.8)", margin: "6px 0 0 0", letterSpacing: "0.04em" }}>{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <div>
                    {submitError && (
                      <p role="alert" style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "var(--lp-body-fs)", color: "rgba(180,30,30,0.9)", lineHeight: 1.5, margin: "0 0 14px 0", maxWidth: "520px" }}>
                        {submitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer transition-opacity duration-200 hover:opacity-[0.82] disabled:cursor-wait disabled:opacity-60 text-white bg-[#020A25] border-none rounded-[var(--radius)] inline-flex items-center gap-2"
                      style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "clamp(0.65rem,0.8vw,0.72rem)", fontWeight: 500, letterSpacing: "0.08em", padding: "clamp(14px,1.8vh,16px) clamp(24px,3vw,36px)" }}>
                      {isSubmitting ? cp.form.sending : cp.form.submit} <span aria-hidden="true">→</span>
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
