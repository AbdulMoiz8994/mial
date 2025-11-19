import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
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
      <div className="flex flex-col w-full max-w-[1000px] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12">
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
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: "36px",
            color: "#202020",
          }}
          data-testid="text-heading"
        >
          Choose Your Perfect Plan
        </h2>

        {/* Subheading - Left Aligned */}
        <p
          className="mb-10"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#6B7280",
          }}
          data-testid="text-subheading"
        >
          Start your 7-day free trial. No credit card required.
        </p>

        {/* Pricing Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 items-start">
          {/* Basic Plan - BLACK CARD */}
          <div
            className="rounded-xl flex flex-col"
            style={{
              backgroundColor: "#060606",
              borderRadius: "16px",
              padding: "32px 28px",
            }}
            data-testid="card-plan-basic"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center justify-center self-start mb-5"
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(206, 165, 79, 0.5)",
                borderRadius: "4px",
                padding: "4px 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#CEA54F",
              }}
              data-testid="badge-basic"
            >
              Basic
            </div>

            {/* Price */}
            <div className="mb-3">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
                data-testid="price-basic"
              >
                $10
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#9CA3AF",
                }}
              >
                /month
              </span>
            </div>

            {/* Description */}
            <p
              className="mb-6"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#9CA3AF",
              }}
              data-testid="description-basic"
            >
              Perfect for solo beauty professionals
            </p>

            {/* Features List */}
            <div className="flex-1 mb-6">
              <ul className="space-y-3">
                {[
                  "10+ AI Generations",
                  "AI caption generation",
                  "Basic templates library",
                  "Instagram & Facebook",
                  "Email support",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3"
                    data-testid={`feature-basic-${index}`}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#CEA54F",
                      }}
                    >
                      <Check
                        style={{
                          width: "12px",
                          height: "12px",
                          color: "#FFFFFF",
                          strokeWidth: 3,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#FFFFFF",
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleSelectPlan("basic")}
              className="w-full rounded font-medium transition-opacity hover:opacity-90"
              style={{
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "#CEA54F",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
              }}
              data-testid="button-select-basic"
            >
              Start for free
            </button>
          </div>

          {/* Pro Plan - NO CARD, just content */}
          <div className="flex flex-col" data-testid="section-plan-pro">
            {/* Badge */}
            <div
              className="inline-flex items-center justify-center self-start mb-5"
              style={{
                backgroundColor: "#CEA54F",
                borderRadius: "4px",
                padding: "4px 12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
              }}
              data-testid="badge-pro"
            >
              PRO
            </div>

            {/* Price */}
            <div className="mb-3">
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "#202020",
                  letterSpacing: "-0.02em",
                }}
                data-testid="price-pro"
              >
                $49
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#6B7280",
                }}
              >
                /month
              </span>
            </div>

            {/* Description */}
            <p
              className="mb-6"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#6B7280",
              }}
              data-testid="description-pro"
            >
              For growing salons and professionals
            </p>

            {/* Features List */}
            <div className="flex-1 mb-6">
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
                    className="flex items-start gap-3"
                    data-testid={`feature-pro-${index}`}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#202020",
                      }}
                    >
                      <Check
                        style={{
                          width: "12px",
                          height: "12px",
                          color: "#FFFFFF",
                          strokeWidth: 3,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#202020",
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => handleSelectPlan("pro")}
              className="w-full md:w-auto md:self-start rounded font-medium transition-all hover:bg-gray-50"
              style={{
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: "2px solid #202020",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#202020",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
              data-testid="button-select-pro"
            >
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
