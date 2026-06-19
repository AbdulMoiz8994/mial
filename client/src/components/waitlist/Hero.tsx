import { ArrowRight } from "./icons";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[var(--color-ink)]">
      {/* right-side model image */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[62%]">
        <div
          className="h-full w-full bg-cover bg-[right_top] lg:bg-[center_top]"
          style={{
            backgroundImage: "url('/hero.jpg')",
          }}
        />
        {/* soft fade only on the left edge so the model stays fully visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-ink) 0%, rgba(11,9,8,0.7) 14%, rgba(11,9,8,0.15) 34%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,9,8,0.35) 0%, transparent 18%, transparent 82%, rgba(11,9,8,0.4) 100%)",
          }}
        />
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 sm:px-10">
        <div className="max-w-xl">
          <p className="mb-5 text-xs font-light uppercase tracking-[0.32em] text-[var(--color-gold)]">
            Something Exceptional
          </p>

          <h1 className="font-serif text-6xl font-semibold leading-[0.95] tracking-[0.04em] sm:text-7xl md:text-8xl">
            <span className="text-gold-gradient">IS COMING</span>
          </h1>

          <p className="mt-7 max-w-md text-sm font-light leading-relaxed text-[var(--color-body)]">
            MIA is redefining beauty standards. Creating a new era of beauty
            experiences. Designed for those who expect more.
          </p>

          <a
            href="#waitlist"
            className="group mt-9 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-[var(--color-accent)]"
          >
            Be the First to Know
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
