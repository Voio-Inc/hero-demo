export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1440px] items-center px-4 py-4 md:px-6">
        <a
          href="#top"
          className="flex items-center gap-3 rounded bg-[rgba(22,24,23,0.82)] px-2.5 py-2 backdrop-blur-sm transition hover:bg-[rgba(30,32,31,0.9)]"
        >
          <img src="/voio_symbol_white.svg" alt="Voio" className="h-5 w-5 opacity-90" />
          <div className="text-[14px] font-medium text-white">Voio</div>
        </a>
      </div>
    </header>
  );
}
