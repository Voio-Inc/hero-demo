import { useEffect, useState } from "react";

import { study, type Finding } from "../data/findings";

type FindingsPanelProps = {
  finding: Finding | null;
  findingIndex: number;
};

export function FindingsPanel({ finding, findingIndex }: FindingsPanelProps) {
  const [displayFinding, setDisplayFinding] = useState<Finding | null>(finding);
  const [displayIndex, setDisplayIndex] = useState(findingIndex);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);

    const timeout = window.setTimeout(() => {
      setDisplayFinding(finding);
      setDisplayIndex(findingIndex);
      setVisible(true);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [finding, findingIndex]);

  const currentFinding = displayFinding ?? finding;
  const currentIndex = displayIndex >= 0 ? displayIndex + 1 : 0;
  const previousSlice = currentFinding ? Math.max(currentFinding.sliceRange[0] - 6, 0) : "--";
  const currentSlice = currentFinding ? currentFinding.sliceRange[0] : "--";
  const nextSlice = currentFinding ? currentFinding.sliceRange[1] : "--";

  return (
    <aside className="pointer-events-none fixed bottom-4 left-4 z-30 w-[calc(100vw-2rem)] max-w-[360px] md:left-6">
      <div className="overflow-hidden rounded bg-[rgba(22,24,23,0.95)] text-[11px] text-white/72 shadow-[0_12px_32px_rgba(0,0,0,0.34)] backdrop-blur-sm">
        <div className="flex items-center justify-between bg-[rgba(30,32,31,0.96)] px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#707070]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-600)]" />
            <span>{currentFinding ? `Finding ${currentIndex}` : "Findings"}</span>
          </div>
          <div className="text-[10px] font-mono text-[#909090]">
            {typeof currentSlice === "number" ? currentSlice.toString().padStart(3, "0") : "--"}
          </div>
        </div>
        <div className="bg-[rgba(22,24,23,0.95)] px-3 py-2.5">
        <div className={`transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className="space-y-3">
            <section>
              <div className="text-[14px] leading-snug text-white">
                {currentFinding?.label ?? "No finding in view"}
              </div>
            </section>

            <section>
              <div className="max-w-[19rem] text-[12px] leading-relaxed text-[#c7ccca]">
                {currentFinding?.detail ?? "Inspect the series to review the annotated region."}
              </div>
            </section>

            <section className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 pt-1 text-[10px]">
              <div className="truncate text-[#707070]">{currentFinding?.series ?? study.seriesLabel}</div>
              <div className="font-mono text-[#606060]">{previousSlice}</div>
              <div className="font-mono text-[var(--brand-300)]">{currentSlice}</div>
              <div className="font-mono text-[#606060]">{nextSlice}</div>
            </section>
          </div>
        </div>
        </div>
      </div>
    </aside>
  );
}
