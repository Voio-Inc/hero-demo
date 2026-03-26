import { useMemo, useState } from "react";

import { FindingsPanel } from "./components/FindingsPanel";
import { HeroViewer } from "./components/HeroViewer";
import { Navbar } from "./components/Navbar";
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

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--panel)] text-white">
      <Navbar />
      <HeroViewer findings={findings} activeFinding={activeFinding} onSliceChange={setCurrentSlice} />
      <FindingsPanel finding={activeFinding} findingIndex={activeFindingIndex} />

      <section className="relative z-10 border-t border-[var(--border)] bg-[var(--panel-dark)] px-4 py-16 md:px-6">
        <div className="mx-auto max-w-[1440px] rounded bg-[var(--panel)]">
          <div className="h-6 bg-[var(--panel-light)] px-2.5" />
          <div className="px-3 py-3 text-[12px] text-[#707070]">Placeholder</div>
        </div>
      </section>
    </main>
  );
}

export default App;
