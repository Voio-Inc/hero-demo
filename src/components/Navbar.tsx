import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Research", href: "/research" },
  { label: "For Physicians", href: "/physicians" },
  { label: "Careers", href: "/careers" },
];

const REVEAL_AT_SLICE = 50;

/* Geometric asterisk — 6 lines at 60° intervals with endpoint dots */
function VoioIcon() {
  const r = 8;
  const dotR = 1.6;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 * Math.PI) / 180;
    return { x: 9 + r * Math.cos(a), y: 9 + r * Math.sin(a) };
  });
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      {pts.map((p, i) => (
        <g key={i}>
          <line x1="9" y1="9" x2={p.x} y2={p.y} stroke="white" strokeWidth="1.1" />
          <circle cx={p.x} cy={p.y} r={dotR} fill="white" />
        </g>
      ))}
      <circle cx="9" cy="9" r="1.4" fill="white" />
    </svg>
  );
}

export function Navbar({ currentSlice }: { currentSlice: number }) {
  const [revealed, setRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const locked = useRef(false);

  // Reveal once at slice 50, then stay forever
  useEffect(() => {
    if (locked.current) return;
    if (currentSlice >= REVEAL_AT_SLICE) {
      locked.current = true;
      setRevealed(true);
    }
  }, [currentSlice]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Floating pill header ── */}
      <header
        className="fixed z-[1000]"
        style={{
          top: 16,
          left: "50%",
          width: "min(90%, 1100px)",
          transform: revealed
            ? "translate(-50%, 0)"
            : "translate(-50%, calc(-100% - 32px))",
          opacity: revealed ? 1 : 0,
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "#1A1A1A",
          borderRadius: 100,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          height: 54,
        }}
      >
        <div
          className="flex h-full items-center"
          style={{ padding: "6px 6px 6px 24px" }}
        >
          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center gap-2">
            <VoioIcon />
            <span className="text-[20px] text-white">
              Voio
            </span>
          </a>

          {/* Nav link pills — desktop */}
          <nav className="mx-auto hidden items-center gap-1.5 md:flex" style={{ fontFamily: "var(--font-sans)" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] text-white/50 transition-[background,color] duration-200 hover:bg-white/10 hover:text-white"
                style={{ background: "rgba(255, 255, 255, 0.06)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side — desktop */}
          <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex" style={{ fontFamily: "var(--font-sans)" }}>
            <a
              href="/login"
              className="px-3 py-1.5 text-[13px] font-medium uppercase tracking-[0.06em] text-white/50 transition-colors duration-200 hover:text-white"
            >
              Log In
            </a>
            <a
              href="/get-started"
              className="rounded-full bg-[#7ECEC1] px-5 py-2 text-[13px] font-semibold uppercase tracking-[0.04em] text-[#0A0A0A] transition-colors duration-200 hover:bg-[#95D8CE]"
            >
              Get Started
            </a>
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="ml-auto flex shrink-0 items-center justify-center pr-3 md:hidden"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 14" fill="none">
              <line x1="0" y1="1" x2="18" y2="1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="7" x2="18" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="13" x2="18" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        className="fixed inset-0 z-[1001] flex flex-col bg-[#0A0A0A] md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          transition: "opacity 0.3s ease-out",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {/* Top bar */}
        <div className="flex h-[58px] items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <VoioIcon />
            <span className="text-[20px] text-white">
              Voio
            </span>
          </a>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[28px] text-white transition-colors duration-200 hover:text-white/60"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-10">
            <a
              href="/get-started"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#7ECEC1] px-8 py-3 text-[14px] font-semibold uppercase tracking-[0.04em] text-[#0A0A0A] transition-colors duration-200 hover:bg-[#95D8CE]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Get Started
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
