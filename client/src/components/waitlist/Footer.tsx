import { InstagramIcon, TiktokIcon, PinterestIcon } from "./icons";

const socials = [
  { icon: InstagramIcon, label: "Instagram" },
  { icon: TiktokIcon, label: "TikTok" },
  { icon: PinterestIcon, label: "Pinterest" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] bg-[var(--color-ink-soft)] px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-3xl tracking-[0.15em] text-[var(--color-gold-light)]">
            MIA.
          </p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-body)]">
            Redefining the Future.
          </p>
          <div className="title-rule mt-4" style={{ marginLeft: 0 }} />
        </div>

        <div className="flex items-start gap-10">
          {socials.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              className="group flex flex-col items-center gap-2 text-[var(--color-body)] transition-colors duration-300 hover:text-[var(--color-accent)]"
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-medium uppercase tracking-[0.18em]">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
