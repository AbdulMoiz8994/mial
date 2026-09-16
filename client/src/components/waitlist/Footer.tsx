import { InstagramIcon, FacebookIcon, TiktokIcon } from "./icons";

const socials = [
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/myintelligentagent/",
  },
  {
    icon: FacebookIcon,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61586707512619",
  },
  // TODO: add the href once the MIA TikTok handle is supplied
  { icon: TiktokIcon, label: "TikTok", href: "" },
];

const socialClass =
  "group flex flex-col items-center gap-2 text-[var(--color-body)] transition-colors duration-300 hover:text-[var(--color-accent)]";

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
          {socials.map(({ icon: Icon, label, href }) => {
            const content = (
              <>
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-medium uppercase tracking-[0.18em]">
                  {label}
                </span>
              </>
            );

            return href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`MIA on ${label}`}
                className={socialClass}
              >
                {content}
              </a>
            ) : (
              <span key={label} className={socialClass}>
                {content}
              </span>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
