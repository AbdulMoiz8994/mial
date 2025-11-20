import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

type PlanType = "basic" | "pro" | null;

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(null);

  const handleBack = () => {
    setLocation("/social-media-focus");
  };

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId);
    console.log("Selected plan:", planId);
    // TODO: Navigate to payment/dashboard
  };

  return (
    <AuthLayout>
      <div className="flex flex-col w-full max-w-[1000px] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-800 transition-colors self-start"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            Back
          </span>
        </button>

        {/* Heading - Left Aligned */}
        <h2
          className="mb-2"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "26px",
            fontWeight: 700,
            lineHeight: "32px",
            color: "#202020",
          }}
          data-testid="text-heading"
        >
          Choose Your Perfect Plan
        </h2>

        {/* Subheading - Left Aligned */}
        <p
          className="mb-8"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#9CA3AF",
          }}
          data-testid="text-subheading"
        >
          Start your 7-day free trial. No credit card required.
        </p>

        {/* Pricing Layout - Responsive: stacks on smaller screens */}
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          {/* Basic Plan - BLACK CARD with Two-Column Layout */}
          <div
            className="w-full xl:w-1/2 xl:max-w-[500px]"
            style={{
              backgroundColor: "#000000",
              borderRadius: "16px",
              padding: "24px",
            }}
            data-testid="card-plan-basic"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center justify-center mb-5"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "4px",
                padding: "4px 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "capitalize",
                color: "#FFFFFF",
              }}
              data-testid="badge-basic"
            >
              Basic
            </div>

            {/* Two-Column Layout: Left (Price/Description) | Border | Right (Features) */}
            <div className="flex gap-6 mb-6">
              {/* LEFT COLUMN: Price and Description */}
              <div className="flex-shrink-0" style={{ width: "140px" }}>
                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "40px",
                      fontWeight: 700,
                      color: "#FFFFFF",
                      letterSpacing: "-0.02em",
                      lineHeight: "1",
                    }}
                    data-testid="price-basic"
                  >
                    $10
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#94A3B8",
                    }}
                  >
                    /month
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "17px",
                    color: "#94A3B8",
                  }}
                  data-testid="description-basic"
                >
                  Perfect for solo beauty professionals
                </p>
              </div>

              {/* VERTICAL DASHED BORDER */}
              <div
                style={{
                  width: "1px",
                  backgroundImage: "repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0px, rgba(255, 255, 255, 0.2) 4px, transparent 4px, transparent 8px)",
                  flexShrink: 0,
                }}
              />

              {/* RIGHT COLUMN: Features List */}
              <div className="flex-1">
                <ul className="space-y-3">
                  {[
                    "10+ AI Generators",
                    "AI caption generation",
                    "Basic templates library",
                    "Instagram & Facebook",
                    "Email support",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2.5"
                      data-testid={`feature-basic-${index}`}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: "transparent",
                          border: "1.5px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "18px",
                          color: "#E5E7EB",
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button - Full Width */}
            <button
              type="button"
              onClick={() => handleSelectPlan("basic")}
              className="w-full rounded-lg font-semibold transition-opacity hover:opacity-90"
              style={{
                height: "44px",
                borderRadius: "8px",
                backgroundColor: "#CEA54F",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#FFFFFF",
              }}
              data-testid="button-select-basic"
            >
              Start for free
            </button>
          </div>

          {/* Pro Plan - Light Container with Two-Column Layout */}
          <div
            className="w-full xl:w-1/2 xl:max-w-[500px]"
            data-testid="section-plan-pro"
          >
            <div
              className="h-full"
              style={{
                backgroundColor: "#FAFAFA",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center justify-center mb-5"
                style={{
                  backgroundColor: "#CEA54F",
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "capitalize",
                  color: "#FFFFFF",
                }}
                data-testid="badge-pro"
              >
                Pro
              </div>

              {/* Two-Column Layout: Left (Price/Description) | Border | Right (Features) */}
              <div className="flex gap-6 mb-6">
                {/* LEFT COLUMN: Price and Description */}
                <div className="flex-shrink-0" style={{ width: "140px" }}>
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "40px",
                        fontWeight: 700,
                        color: "#202020",
                        letterSpacing: "-0.02em",
                        lineHeight: "1",
                      }}
                      data-testid="price-pro"
                    >
                      $49
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#64748B",
                      }}
                    >
                      /month
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      lineHeight: "17px",
                      color: "#64748B",
                    }}
                    data-testid="description-pro"
                  >
                    For growing salons and professionals
                  </p>
                </div>

                {/* VERTICAL DASHED BORDER */}
                <div
                  style={{
                    width: "1px",
                    backgroundImage: "repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 4px, transparent 4px, transparent 8px)",
                    flexShrink: 0,
                  }}
                />

                {/* RIGHT COLUMN: Features List */}
                <div className="flex-1">
                  <ul className="space-y-3">
                    {[
                      "Unlimited posts",
                      "Autopilot AI content ideas",
                      "All social platforms",
                      "Analytics & insights",
                      "Priority support",
                    ].map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2.5"
                        data-testid={`feature-pro-${index}`}
                      >
                        <div
                          className="flex items-center justify-center flex-shrink-0"
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            backgroundColor: "#202020",
                          }}
                        >
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "18px",
                            color: "#202020",
                          }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Button - Full Width */}
              <button
                type="button"
                onClick={() => handleSelectPlan("pro")}
                className="w-full rounded-lg font-semibold transition-all hover:bg-gray-50"
                style={{
                  height: "44px",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  border: "2px solid #202020",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#202020",
                }}
                data-testid="button-select-pro"
              >
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
