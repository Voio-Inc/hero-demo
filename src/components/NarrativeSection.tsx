import { useEffect, useRef, useState, useCallback } from "react";

/* ─── counting animation hook ─── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, duration]);

  return value;
}

/* ─── intersection observer hook ─── */
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ─── beat wrapper ─── */
function Beat({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative flex min-h-screen items-center ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
        {children}
      </div>
    </div>
  );
}

/* ─── fade-in wrapper ─── */
function FadeIn({
  inView,
  delay = 0,
  children,
  className = "",
}: {
  inView: boolean;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── document icon SVG ─── */
function DocIcon() {
  return (
    <svg
      width="28"
      height="34"
      viewBox="0 0 28 34"
      fill="none"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1"
        width="26"
        height="32"
        rx="3"
        stroke="#7ECEC1"
        strokeWidth="1.5"
        fill="none"
      />
      <line x1="6" y1="10" x2="22" y2="10" stroke="#7ECEC1" strokeWidth="1" />
      <line x1="6" y1="15" x2="22" y2="15" stroke="#7ECEC1" strokeWidth="1" />
      <line x1="6" y1="20" x2="16" y2="20" stroke="#7ECEC1" strokeWidth="1" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   BEAT 1 — THE PROBLEM
   ═══════════════════════════════════════════════════ */
function Beat1() {
  const { ref, inView } = useInView(0.3);
  const count = useCountUp(20_000_000, 2500, inView);

  return (
    <Beat>
      <div ref={ref} className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* text – left */}
        <FadeIn inView={inView} className="flex-1">
          <h2 className="text-[32px] font-bold leading-[1.1] md:text-[56px]">
            20–30 million people die every&nbsp;year
          </h2>
          <p className="mt-6 max-w-[540px] text-[18px] leading-[1.6] text-white/60 md:text-[20px]">
            From diseases that could be prevented, caught earlier, or
            effectively treated with tools we largely already have.
          </p>
        </FadeIn>

        {/* visual – right */}
        <FadeIn inView={inView} delay={0.15} className="flex flex-1 flex-col items-center md:items-end">
          <span
            className="block font-bold tabular-nums"
            style={{
              fontSize: "clamp(64px, 10vw, 130px)",
              color: "#7ECEC1",
              lineHeight: 1,
            }}
          >
            {count.toLocaleString()}
          </span>
          <span className="mt-3 text-[14px] tracking-wide text-white/60 md:text-[15px]">
            preventable deaths per year
          </span>
        </FadeIn>
      </div>
    </Beat>
  );
}

/* ═══════════════════════════════════════════════════
   BEAT 2 — THE MISSION
   ═══════════════════════════════════════════════════ */
function Beat2() {
  const { ref, inView } = useInView(0.3);

  return (
    <Beat>
      <div ref={ref} className="flex flex-col-reverse gap-12 md:flex-row md:items-center md:gap-16">
        {/* visual – left */}
        <FadeIn inView={inView} delay={0.15} className="flex flex-1 flex-col items-center md:items-start">
          {/* divider line that draws itself */}
          <div className="relative mb-6 h-[2px] w-full max-w-[320px] bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-[#7ECEC1]"
              style={{
                width: inView ? "100%" : "0%",
                transition: "width 1.2s ease-in-out 0.3s",
              }}
            />
          </div>
          <span
            className="block font-bold tabular-nums"
            style={{
              fontSize: "clamp(64px, 10vw, 130px)",
              color: "#7ECEC1",
              lineHeight: 1,
            }}
          >
            10,000,000+
          </span>
          <span className="mt-3 text-[14px] tracking-wide text-white/60 md:text-[15px]">
            lives saved every year
          </span>
        </FadeIn>

        {/* text – right */}
        <FadeIn inView={inView} className="flex-1 md:text-right">
          <h2 className="text-[32px] font-bold leading-[1.1] md:text-[56px]">
            We're cutting that number in&nbsp;half.
          </h2>
          <p className="mt-6 max-w-[540px] text-[18px] leading-[1.6] text-white/60 md:ml-auto md:text-[20px]">
            10 million lives saved every year. That's what we're building
            toward.
          </p>
        </FadeIn>
      </div>
    </Beat>
  );
}

/* ═══════════════════════════════════════════════════
   BEAT 3 — WHY RADIOLOGY
   ═══════════════════════════════════════════════════ */
function Beat3() {
  const { ref, inView } = useInView(0.3);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setCollapsed(true), 800);
      return () => clearTimeout(t);
    }
    setCollapsed(false);
  }, [inView]);

  return (
    <Beat>
      <div ref={ref} className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* text – left */}
        <FadeIn inView={inView} className="flex-1">
          <h2 className="text-[32px] font-bold leading-[1.1] md:text-[56px]">
            Starting with radiology
          </h2>
          <p className="mt-6 max-w-[540px] text-[18px] leading-[1.6] text-white/60 md:text-[20px]">
            We empower doctors to treat more patients and get diagnoses faster,
            preventing tragedies like late-stage cancer that could have been
            caught months earlier.
          </p>
        </FadeIn>

        {/* visual – right: timeline */}
        <FadeIn inView={inView} delay={0.15} className="flex flex-1 items-center justify-center">
          <div className="relative flex w-full max-w-[400px] items-center">
            {/* left node */}
            <div className="z-10 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-[#7ECEC1]" />
              <span className="mt-2 text-[13px] font-medium text-white/80">
                Scan
              </span>
            </div>

            {/* connecting line + label */}
            <div
              className="relative mx-2 flex-1"
              style={{
                transition: "flex 1.2s ease-in-out",
                flex: collapsed ? "0.15 1 0%" : "1 1 0%",
              }}
            >
              <div className="h-[2px] w-full bg-white/40" />
              <span className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[13px] text-white/60">
                {collapsed ? "minutes" : "months of waiting"}
              </span>
            </div>

            {/* right node */}
            <div className="z-10 flex flex-col items-center">
              <div className="h-4 w-4 rounded-full bg-[#7ECEC1]" />
              <span className="mt-2 text-[13px] font-medium text-white/80">
                Diagnosis
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </Beat>
  );
}

/* ═══════════════════════════════════════════════════
   BEAT 4 — TWO LIVES SAVED
   ═══════════════════════════════════════════════════ */
function Beat4() {
  const { ref, inView } = useInView(0.3);

  return (
    <Beat>
      <div ref={ref} className="mx-auto max-w-[960px] text-center">
        <FadeIn inView={inView}>
          <h2 className="text-[32px] font-bold leading-[1.1] md:text-[56px]">
            Every scan saves two&nbsp;lives
          </h2>
        </FadeIn>

        <FadeIn inView={inView} delay={0.15}>
          <div className="mt-12 flex flex-col items-stretch gap-8 md:flex-row md:gap-0">
            {/* patients column */}
            <div className="flex-1 px-4 text-left md:px-8">
              <span className="mb-3 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#7ECEC1]">
                For patients
              </span>
              <p className="max-w-[400px] text-[18px] leading-[1.6] text-white/60 md:text-[19px]">
                Every month of waiting we eliminate between a scan and a
                diagnosis is a life saved. We reduce misdiagnoses. We prevent
                tragedies.
              </p>
            </div>

            {/* divider */}
            <div className="mx-auto hidden w-[1px] self-stretch bg-[#7ECEC1]/40 md:block" style={{ height: "60%" , alignSelf: "center" }} />
            <div className="mx-auto block h-[1px] w-[60%] bg-[#7ECEC1]/40 md:hidden" />

            {/* doctors column */}
            <div className="flex-1 px-4 text-left md:px-8">
              <span className="mb-3 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#7ECEC1]">
                For doctors
              </span>
              <p className="max-w-[400px] text-[18px] leading-[1.6] text-white/60 md:text-[19px]">
                Every case we empower them on buys back time for the providers
                who've sacrificed their lives to serve their community.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </Beat>
  );
}

/* ═══════════════════════════════════════════════════
   BEAT 5 — TRANSITION / PUBLICATIONS
   ═══════════════════════════════════════════════════ */
const publications = [
  "Pillar-0 outperforms models from Google, Microsoft, and Alibaba by 10-17 pts across hundreds of image findings.",
  "Prospective study validating the Mirai mammogram risk assessment model for expediting care for high-risk women.",
  "BRIDGE, a data-reuse trial design, enables faster, lower-cost randomized validation of medical AI models.",
];

function Beat5() {
  const { ref, inView } = useInView(0.3);

  return (
    <Beat>
      <div ref={ref} className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* text – left */}
        <FadeIn inView={inView} className="flex-1">
          <h2 className="text-[32px] font-bold leading-[1.1] md:text-[56px]">
            The best technology has nothing to&nbsp;hide
          </h2>
          <p className="mt-6 max-w-[540px] text-[18px] leading-[1.6] text-white/60 md:text-[20px]">
            Our founding team has a proven track record of rigorous health
            innovation, from model development and large-scale validation to
            clinical translation. We publish everything because the evidence
            speaks for itself.
          </p>
        </FadeIn>

        {/* visual – right: publication cards */}
        <div className="flex flex-1 flex-col gap-4">
          {publications.map((text, i) => (
            <div
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.8s ease-out ${0.15 * (i + 1)}s, transform 0.8s ease-out ${0.15 * (i + 1)}s`,
              }}
              className="flex items-start gap-4 rounded-xl bg-[#F5F5F0] p-6 text-[#1A1A1A]"
            >
              <DocIcon />
              <p className="text-[15px] leading-[1.5] md:text-[16px]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Beat>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════ */
export function NarrativeSection() {
  return (
    <section id="narrative" className="relative z-10 bg-[#0A0A0A]">
      <Beat1 />
      <Beat2 />
      <Beat3 />
      <Beat4 />
      <Beat5 />
    </section>
  );
}
