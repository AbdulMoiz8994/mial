import { QuoteMark } from "./icons";

export default function StatsQuote() {
  return (
    <section className="bg-[var(--color-ink)] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div
          className="grid grid-cols-1 gap-10 rounded-2xl border px-8 py-12 sm:px-12 md:grid-cols-2 md:gap-0"
          style={{
            borderColor: "var(--color-border-faint)",
            background:
              "linear-gradient(180deg, rgba(22,17,15,0.7) 0%, rgba(15,12,10,0.7) 100%)",
          }}
        >
          {/* left — stat */}
          <div className="flex flex-col justify-center md:pr-12">
            <h3 className="font-serif text-2xl font-medium uppercase leading-tight tracking-[0.08em] text-white">
              People Have Already Joined
            </h3>
            <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-[var(--color-body)]">
             Join hair, beauty and barbering professionals getting early access to a simpler way to manage social media. MIA is being built for busy businesses, not tech experts.  Helping you create better content, stay visible and turn more empty chairs into bookings.
            </p>
          </div>

          {/* right — quote */}
          <div className="relative md:border-l md:border-[var(--color-border-faint)] md:pl-12">
            <QuoteMark className="h-9 w-9 text-[#3a2f28]" />
            <p className="mt-3 font-serif text-3xl font-medium italic leading-snug text-[var(--color-gold-light)]">
              Creative industries should never follow standards. They should define them. Join us
            </p>
            <p className="mt-5 font-serif text-lg tracking-[0.3em] text-[var(--color-gold)]">
              — MIA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
