import { useState } from "react";
import { CheckIcon } from "./icons";

const badges = [
  "Exclusive Updates",
  "Priority Launch Access",
  "Limited Member Gifts",
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-light text-white outline-none backdrop-blur-sm transition-colors duration-300 placeholder:text-[#6f6760] focus:border-[rgba(224,168,134,0.5)]";

export default function WaitlistForm() {
  const [form, setForm] = useState({
    phone: "",
    email: "",
    business: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // hook up to your API / waitlist provider here
    console.log("waitlist submit", form);
  };

  return (
    <section
      id="waitlist"
      className="relative z-20 px-6 pb-24 sm:px-10"
    >
      <div className="mx-auto -mt-44 max-w-2xl">
        <div
          className="rounded-2xl border px-6 py-10 sm:px-12 sm:py-12"
          style={{
            borderColor: "var(--color-border-faint)",
            background: "transparent",
          }}
        >
          <h2 className="text-center font-serif text-4xl font-medium uppercase tracking-[0.06em] text-white sm:text-[2.7rem]">
            Join the Waitlist
          </h2>
          <p className="mt-2 text-center text-sm font-light text-[var(--color-body)]">
            Be first to experience MIA.
          </p>

          {/* badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {badges.map((b) => (
              <span
                key={b}
                className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-label)]"
              >
                <CheckIcon className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                {b}
              </span>
            ))}
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              className={inputClass}
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              type="email"
              className={inputClass}
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className={inputClass}
              placeholder="Business Type"
              value={form.business}
              onChange={(e) => setForm({ ...form, business: e.target.value })}
            />

            <button
              type="submit"
              className="w-full rounded-md py-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#2a1c14] transition-opacity duration-300 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-strong) 100%)",
              }}
            >
              Join the Waitlist
            </button>
          </form>

          <p className="mt-6 text-center text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--color-body-dim)]">
            No Spam. Early Access Only.
          </p>
        </div>
      </div>
    </section>
  );
}
