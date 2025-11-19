import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

type PlanType = "basic" | "pro" | null;

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: PlanType;
  name: string;
  badge: string;
  price: number;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  isDark?: boolean;
}

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(null);

  const plans: PricingPlan[] = [
    {
      id: "basic",
      name: "Basic",
      badge: "Basic",
      price: 10,
      description: "Perfect for solo beauty professionals",
      features: [
        { text: "10+ AI Generations", included: true },
        { text: "AI caption generation", included: true },
        { text: "Basic templates library", included: true },
        { text: "Instagram & Facebook", included: true },
        { text: "Email support", included: true },
      ],
      buttonText: "Start for free",
      isDark: true,
    },
    {
      id: "pro",
      name: "Pro",
      badge: "PRO",
      price: 49,
      description: "For growing salons and professionals",
      features: [
        { text: "Unlimited posts", included: true },
        { text: "Autopilot AI content ideas", included: true },
        { text: "All social platforms", included: true },
        { text: "Analytics & insights", included: true },
        { text: "Priority support", included: true },
      ],
      buttonText: "Choose Plan",
      isDark: false,
    },
  ];

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
      <div
        className="bg-[#FBFAF7] rounded-lg flex flex-col w-full max-w-[920px] px-5 py-8 sm:px-8 sm:py-12 md:px-16 md:py-16"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
        data-testid="card-pricing"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 mb-10 text-gray-600 hover:text-gray-800 transition-colors self-start"
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

        {/* Heading */}
        <h2
          className="mb-3 text-center max-w-[520px] mx-auto"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: "38px",
            color: "#202020",
            letterSpacing: "-0.02em",
          }}
          data-testid="text-heading"
        >
          Choose Your Perfect Plan
        </h2>

        {/* Subheading */}
        <p
          className="mb-12 text-center max-w-[520px] mx-auto"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            color: "#484848",
          }}
          data-testid="text-subheading"
        >
          Start your 7-day free trial. No credit card required.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl flex flex-col shadow-md"
              style={{
                backgroundColor: plan.isDark ? "#060606" : "#FFFFFF",
                borderRadius: "12px",
                padding: "40px 32px",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              }}
              data-testid={`card-plan-${plan.id}`}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center justify-center self-start mb-6 px-4 py-1.5"
                style={{
                  backgroundColor: plan.id === "pro" ? "#CEA54F" : "transparent",
                  border: plan.id === "basic" ? "1px solid rgba(206, 165, 79, 0.4)" : "none",
                  borderRadius: "6px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: plan.id === "pro" ? "#FFFFFF" : "#CEA54F",
                }}
                data-testid={`badge-${plan.id}`}
              >
                {plan.badge}
              </div>

              {/* Price */}
              <div className="mb-3">
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "48px",
                    fontWeight: 700,
                    color: plan.isDark ? "#FFFFFF" : "#202020",
                    letterSpacing: "-0.02em",
                  }}
                  data-testid={`price-${plan.id}`}
                >
                  ${plan.price}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "18px",
                    fontWeight: 400,
                    color: plan.isDark ? "#A0A0A0" : "#484848",
                  }}
                >
                  /month
                </span>
              </div>

              {/* Description */}
              <p
                className="mb-8"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  color: plan.isDark ? "#B8B8B8" : "#484848",
                }}
                data-testid={`description-${plan.id}`}
              >
                {plan.description}
              </p>

              {/* Features List */}
              <div className="flex-1 mb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                      data-testid={`feature-${plan.id}-${index}`}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: "#CEA54F",
                        }}
                      >
                        <Check
                          style={{
                            width: "14px",
                            height: "14px",
                            color: "#FFFFFF",
                            strokeWidth: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "16px",
                          fontWeight: 400,
                          lineHeight: "24px",
                          color: plan.isDark ? "#FFFFFF" : "#202020",
                        }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan.id as PlanType)}
                className="w-full rounded font-medium transition-all"
                style={{
                  height: "52px",
                  borderRadius: "8px",
                  backgroundColor: plan.id === "basic" ? "#CEA54F" : "transparent",
                  border: plan.id === "pro" ? "2px solid #202020" : "none",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: plan.id === "basic" ? "#FFFFFF" : "#202020",
                }}
                data-testid={`button-select-${plan.id}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
