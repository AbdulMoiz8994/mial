const steps = [
  { num: "01", label: "Sign Up" },
  { num: "02", label: "Get Notified" },
  { num: "03", label: "Get Early Access" },
];

export default function HowItWorks() {
  return (
    <section className="bg-[var(--color-ink)] px-6 pb-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div
          className="rounded-2xl border px-6 py-14 sm:px-14"
          style={{
            borderColor: "var(--color-border-faint)",
            background:
              "linear-gradient(180deg, rgba(22,17,15,0.7) 0%, rgba(15,12,10,0.7) 100%)",
          }}
        >
          <h2 className="text-center font-serif text-4xl font-medium uppercase tracking-wide text-white sm:text-5xl">
            How It Works
          </h2>
          <div className="title-rule mx-auto mt-5" />

          <div className="mt-12 flex flex-col items-center justify-between gap-10 sm:flex-row sm:gap-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-1 items-center">
                <div className="flex-1 text-center">
                  <span className="font-serif text-5xl font-medium text-gold-gradient">
                    {step.num}
                  </span>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-label)]">
                    {step.label}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden flex-1 items-center sm:flex">
                    <span className="h-px flex-1 bg-[var(--color-border-faint)]" />
                    <span className="text-[var(--color-accent)]">›</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
