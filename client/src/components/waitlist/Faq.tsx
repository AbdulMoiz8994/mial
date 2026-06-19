import { LockIcon, GiftIcon, StarIcon, MailIcon } from "./icons";

const faqs = [
  {
    q: "What is MIA?",
    a: "MIA is an upcoming beauty experience built around innovation, exclusivity, and community.",
  },
  {
    q: "When does MIA launch?",
    a: "Launch details will be shared first with waitlist members.",
  },
  {
    q: "Is it free to join?",
    a: "Yes. Joining the waitlist is completely free.",
  },
  {
    q: "Can I leave anytime?",
    a: "Yes, you can unsubscribe whenever you choose.",
  },
];

const tags = [
  { icon: LockIcon, label: "Exclusive Access" },
  { icon: GiftIcon, label: "Early Launch Perks" },
  { icon: StarIcon, label: "Member Only Offers" },
  { icon: MailIcon, label: "Be the First to Know" },
];

export default function Faq() {
  return (
    <section className="bg-[var(--color-ink)] px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-serif text-5xl font-medium tracking-wide text-white">
          FAQ
        </h2>
        <div className="title-rule mx-auto mt-5" />

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
          {faqs.map((item) => (
            <div key={item.q}>
              <h3 className="font-serif text-xl font-medium text-[var(--color-gold-light)]">
                {item.q}
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-[var(--color-body)]">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 border-t border-[var(--color-border-soft)] pt-12">
          {tags.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-label)]"
            >
              <Icon className="h-4 w-4 text-[var(--color-accent)]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
