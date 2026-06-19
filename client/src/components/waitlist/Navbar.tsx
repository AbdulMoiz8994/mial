export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 z-30 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a
          href="#"
          className="font-serif text-2xl tracking-[0.35em]"
          style={{ color: "var(--color-gold-light)" }}
        >
          MIA
        </a>

        <a
          href="#waitlist"
          className="rounded-md border px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)] transition-colors duration-300 hover:bg-[rgba(224,168,134,0.1)]"
          style={{ borderColor: "rgba(224,168,134,0.35)" }}
        >
          Join the Waitlist
        </a>
      </div>
    </header>
  );
}
