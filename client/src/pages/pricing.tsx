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
  highlighted?: boolean;
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
      highlighted: true,
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
        className="bg-white rounded-lg border flex flex-col w-full max-w-[900px] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12"
        style={{
          borderRadius: "8px",
          borderWidth: "1px",
          borderColor: "#E8E8E8",
        }}
        data-testid="card-pricing"
      >
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

        {/* Heading */}
        <h2
          className="mb-2 text-center"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "24px",
            fontWeight: 600,
            lineHeight: "34px",
            color: "#202020",
          }}
          data-testid="text-heading"
        >
          Choose Your Perfect Plan
        </h2>

        {/* Subheading */}
        <p
          className="mb-10 text-center"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#484848",
          }}
          data-testid="text-subheading"
        >
          Start your 7-day free trial. No credit card required.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border p-6 flex flex-col ${
                plan.highlighted ? "bg-[#040404] border-[#040404]" : "bg-white border-[#E8E8E8]"
              }`}
              style={{
                borderRadius: "12px",
              }}
              data-testid={`card-plan-${plan.id}`}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center justify-center self-start mb-4 px-3 py-1 rounded-full"
                style={{
                  backgroundColor: plan.highlighted ? "#CEA54F" : "#F5F5F5",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: plan.highlighted ? "#FFFFFF" : "#202020",
                }}
                data-testid={`badge-${plan.id}`}
              >
                {plan.badge}
              </div>

              {/* Price */}
              <div className="mb-2">
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "36px",
                    fontWeight: 700,
                    color: plan.highlighted ? "#FFFFFF" : "#202020",
                  }}
                  data-testid={`price-${plan.id}`}
                >
                  ${plan.price}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 400,
                    color: plan.highlighted ? "#E8E8E8" : "#484848",
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
                  color: plan.highlighted ? "#E8E8E8" : "#484848",
                }}
                data-testid={`description-${plan.id}`}
              >
                {plan.description}
              </p>

              {/* Features List */}
              <div className="flex-1 mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                      data-testid={`feature-${plan.id}-${index}`}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: plan.highlighted ? "#CEA54F" : "#CEA54F",
                        }}
                      >
                        <Check
                          style={{
                            width: "10px",
                            height: "10px",
                            color: "#FFFFFF",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "20px",
                          color: plan.highlighted ? "#FFFFFF" : "#202020",
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
                className="w-full rounded font-medium transition-opacity hover:opacity-90"
                style={{
                  height: "48px",
                  borderRadius: "8px",
                  backgroundColor: "#CEA54F",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#FFFFFF",
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
