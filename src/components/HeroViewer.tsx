import { useEffect, useMemo, useState } from "react";

import { study, type Finding } from "../data/findings";

export const NUM_SLICES = study.sliceCount;
const SCROLL_PER_SLICE = 80;
const MAX_STAGE_WIDTH = 1120;
const DESKTOP_STAGE_WIDTH_RATIO = 0.78;

type HeroViewerProps = {
  findings: Finding[];
  activeFinding: Finding | null;
  onSliceChange: (slice: number) => void;
  hidePanels?: boolean;
};

export function HeroViewer({
  findings,
  activeFinding,
  onSliceChange,
  hidePanels,
}: HeroViewerProps) {
  const imageSources = useMemo(
    () =>
      Array.from(
        { length: NUM_SLICES },
        (_, index) => `${study.imageBasePath}/slice_${index.toString().padStart(3, "0")}.webp`,
      ),
    [],
  );
  const [currentSlice, setCurrentSlice] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [displayFinding, setDisplayFinding] = useState<Finding | null>(activeFinding);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [viewport, setViewport] = useState({
    width: typeof window === "undefined" ? 0 : window.innerWidth,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
  });

  useEffect(() => {
    let cancelled = false;
    let completed = 0;

    imageSources.forEach((src) => {
      const image = new Image();
      const handleDone = () => {
        completed += 1;
        if (cancelled) {
          return;
        }

        if (image.naturalWidth > 0 && image.naturalHeight > 0) {
          setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
        }

        setLoadedCount(completed);
        if (completed === imageSources.length) {
          setReady(true);
        }
      };

      image.onload = handleDone;
      image.onerror = handleDone;
      image.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [imageSources]);

  useEffect(() => {
    const updateSlice = () => {
      const slice = Math.min(NUM_SLICES - 1, Math.max(0, Math.round(window.scrollY / SCROLL_PER_SLICE)));
      setCurrentSlice(slice);
      onSliceChange(slice);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSlice();
    window.addEventListener("scroll", updateSlice, { passive: true });
    window.addEventListener("resize", updateSlice);

    return () => {
      window.removeEventListener("scroll", updateSlice);
      window.removeEventListener("resize", updateSlice);
    };
  }, [onSliceChange]);

  useEffect(() => {
    setOverlayVisible(false);

    const timeout = window.setTimeout(() => {
      setDisplayFinding(activeFinding);
      setOverlayVisible(true);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [activeFinding]);

  const progress = Math.round((loadedCount / imageSources.length) * 100);
  const displayedSrc = imageSources[currentSlice];
  const overlayFinding = displayFinding ?? activeFinding;
  const imageAspectRatio = imageSize.width / imageSize.height;
  const viewportAspectRatio = viewport.width > 0 && viewport.height > 0 ? viewport.width / viewport.height : 1;
  const containedWidth =
    viewportAspectRatio > imageAspectRatio ? viewport.height * imageAspectRatio : viewport.width;
  const stageMaxWidth =
    viewport.width >= 1024 ? Math.min(MAX_STAGE_WIDTH, viewport.width * DESKTOP_STAGE_WIDTH_RATIO) : viewport.width;
  const renderedWidth = Math.min(containedWidth, stageMaxWidth);
  const renderedHeight = renderedWidth / imageAspectRatio;
  const imageOffsetX = (viewport.width - renderedWidth) / 2;
  const imageOffsetY = (viewport.height - renderedHeight) / 2;

  return (
    <section className="relative" id="top">
      <div className="fixed inset-0 overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={displayedSrc}
            alt={`CT slice ${currentSlice}`}
            className="object-contain object-center"
            style={{ width: `${renderedWidth}px`, height: `${renderedHeight}px` }}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "rgba(9, 12, 12, 0.34)", mixBlendMode: "multiply" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(100,221,177,0.12),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.44))]"
        />
      </div>

      <svg className="pointer-events-none fixed inset-0 z-20 h-screen w-screen">
        <g className={`transition-opacity duration-150 ${overlayVisible ? "opacity-100" : "opacity-0"}`}>
          {overlayFinding?.bboxes.map((bbox, index) => {
            const x = imageOffsetX + bbox.x * renderedWidth;
            const y = imageOffsetY + bbox.y * renderedHeight;
            const width = bbox.w * renderedWidth;
            const height = bbox.h * renderedHeight;

            return (
              <g key={`${overlayFinding.label}-${index}`}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="rgba(100, 221, 177, 0.06)"
                  stroke="#95ecbf"
                  strokeWidth="1.2"
                />
                <text x={x + width - 4} y={y + 12} fill="#95ecbf" fontSize="11" textAnchor="end">
                  {`${bbox.x.toFixed(2)}, ${bbox.y.toFixed(2)}`}
                </text>
                <text x={x + 6} y={y + 12} fill="#95ecbf" fontSize="11">
                  ×
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-8 z-20 mx-auto flex max-w-[1440px] justify-end px-4 md:px-6"
        style={{
          opacity: hidePanels ? 0 : 1,
          transform: hidePanels ? "translateY(20px)" : "translateY(0)",
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        }}
      >
        <div className="hidden min-w-[170px] rounded bg-[rgba(22,24,23,0.9)] px-3 py-2 text-[11px] shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-sm md:block" style={{ fontFamily: "var(--font-sans)" }}>
          <div className="mb-0.5 text-[10px] uppercase tracking-wide text-[#707070]">Slice</div>
          <div className="text-[12px] text-white">
            Slice {currentSlice.toString().padStart(3, "0")} / {(NUM_SLICES - 1).toString().padStart(3, "0")}
          </div>
          <div className="mt-0.5 text-[10px] text-[#909090]">{study.seriesLabel}</div>
        </div>
      </div>

      {!ready && (
        <div className="fixed inset-x-4 top-22 z-30 mx-auto max-w-md rounded-lg border border-[var(--border)] bg-[rgba(22,24,23,0.94)] px-3 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.3)] backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between text-[10px] text-[#7f8a87]">
            <span>Preloading slices</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div
              className="h-full rounded-full bg-[#7befd5] transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="relative z-10" style={{ height: `${findings.length ? NUM_SLICES * SCROLL_PER_SLICE : 0}px` }} />
    </section>
  );
}
