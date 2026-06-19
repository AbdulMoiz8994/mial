import { LockIcon, GiftIcon, StarIcon, MailIcon } from "./icons";

const features = [
  {
    icon: LockIcon,
    title: "Exclusive Access",
    body: "Unlock MIA before public release.",
  },
  {
    icon: GiftIcon,
    title: "Early Launch Perks",
    body: "Special rewards reserved for early members.",
  },
  {
    icon: StarIcon,
    title: "Member Only Offers",
    body: "Receive experiences and benefits not available later.",
  },
  {
    icon: MailIcon,
    title: "First to Know",
    body: "Priority announcements and insider updates.",
  },
];

export default function WhyJoinEarly() {
  return (
    <section className="bg-[var(--color-ink)] px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-serif text-4xl font-medium uppercase tracking-wide text-white sm:text-5xl">
          Why Join Early
        </h2>
        <div className="title-rule mx-auto mt-5" />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border px-7 py-9 text-center transition-colors duration-300 hover:border-[rgba(224,168,134,0.3)]"
              style={{
                borderColor: "var(--color-border-faint)",
                background:
                  "linear-gradient(180deg, rgba(24,19,16,0.7) 0%, rgba(16,13,11,0.7) 100%)",
              }}
            >
              <Icon className="mx-auto h-8 w-8 text-[var(--color-accent)]" />
              <h3 className="mt-5 font-serif text-xl font-medium uppercase tracking-[0.04em] leading-tight text-gold-gradient">
                {title}
              </h3>
              <p className="mt-3 text-[13px] font-light leading-relaxed text-[var(--color-body)]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
