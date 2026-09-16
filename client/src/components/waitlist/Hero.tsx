import { ArrowRight } from "./icons";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-ink)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 py-24 sm:px-10 lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16 lg:py-0">
        {/* copy */}
        <div className="max-w-xl">
          <p className="mb-5 text-xs font-light uppercase tracking-[0.32em] text-[var(--color-gold)]">
            Coming Soon
          </p>

          <h1 className="font-serif text-3xl font-semibold leading-[1.1] tracking-[0.02em]">
            Something exceptional for your social media{" "}
            <span className="text-gold-gradient">is coming</span>, built by
            industry professionals for salons.
          </h1>

          <p className="mt-7 max-w-md text-base font-medium leading-relaxed text-[var(--color-label)] sm:text-[15px] sm:font-normal">
            MIA is your intelligent content partner, built for hair, beauty and
            barbering businesses. Create better content, plan your social media
            and grow your brand, all in one place.
          </p>

          <a
            href="#waitlist"
            className="group mt-9 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-[var(--color-accent)]"
          >
            Be the First to Know
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* MIA social media manager */}
        <div className="order-last flex items-center justify-center lg:justify-end">
          <img
            src="/profile.png"
            alt="MIA, the AI social media manager for salons"
            className="h-auto max-h-[42vh] w-auto max-w-[240px] object-contain sm:max-h-[50vh] sm:max-w-xs lg:max-h-[78vh] lg:max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
