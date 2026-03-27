import { useEffect, useMemo, useRef, useState } from "react";

import { FindingsPanel } from "./components/FindingsPanel";
import { HeroViewer } from "./components/HeroViewer";
import { Navbar } from "./components/Navbar";
import { NarrativeSection } from "./components/NarrativeSection";
import { findings } from "./data/findings";

function App() {
  const [currentSlice, setCurrentSlice] = useState(0);

  const activeFindingIndex = useMemo(
    () =>
      findings.findIndex(
        (finding) => currentSlice >= finding.sliceRange[0] && currentSlice <= finding.sliceRange[1],
      ),
    [currentSlice],
  );

  const activeFinding = activeFindingIndex >= 0 ? findings[activeFindingIndex] : null;

  const [pastHero, setPastHero] = useState(false);
  const pastHeroLocked = useRef(false);

  useEffect(() => {
    const target = document.getElementById("narrative");
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pastHeroLocked.current) {
          pastHeroLocked.current = true;
          setPastHero(true);
        }
      },
      { threshold: 0 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--panel)] text-white">
      <Navbar currentSlice={currentSlice} />
      <HeroViewer findings={findings} activeFinding={activeFinding} onSliceChange={setCurrentSlice} hidePanels={pastHero} />
      <FindingsPanel finding={activeFinding} findingIndex={activeFindingIndex} hidden={pastHero} />

      <NarrativeSection />
    </main>
  );
}

export default App;
