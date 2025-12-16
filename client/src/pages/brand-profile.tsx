import { useState } from "react";
import { useLocation } from "wouter";
import { AuthLayout } from "@/components/auth-layout";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useToast } from "@/hooks/use-toast";
import { onboardingAPI } from "@/services/onboarding.api";
import { ArrowLeft } from "lucide-react";

export default function BrandProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [productsServices, setProductsServices] = useState("");
  const [customers, setCustomers] = useState("");
  const [location, setCustomerLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    brandName?: string;
    customers?: string;
    location?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Brand name validation (required)
    if (!brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }

    // Customers validation (required)
    if (!customers.trim()) {
      newErrors.customers = "Customer description is required";
    }

    // Location validation (required)
    if (!location.trim()) {
      newErrors.location = "Customer location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setErrors({});

      try {
        await onboardingAPI.submitStep1({
          brandName,
          productsOrServices: productsServices,
          customerDescription: customers,
          customerLocation: location,
        });

        toast({
          title: "Brand profile saved!",
          description: "Let's continue with your business type.",
        });

        setLocation("/business-type");
      } catch (error: any) {
        const errorMessage = error.message || "Failed to save brand profile. Please try again.";
        setErrors({ general: errorMessage });
        toast({
          variant: "destructive",
          title: "Failed to save",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout>
      <div
        className="bg-white rounded-lg border flex flex-col w-full max-w-[676px] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12"
        style={{
          borderRadius: '8px',
          borderWidth: '1px',
          borderColor: '#E8E8E8'
        }}
        data-testid="card-brand-profile"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => setLocation("/sign-in")}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-800 transition-colors self-start"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 400
            }}
          >
            Back
          </span>
        </button>

        {/* Heading */}
        <h2
          className="mb-2"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '24px',
            fontWeight: 600,
            lineHeight: '34px',
            color: '#202020'
          }}
          data-testid="text-heading"
        >
          Let's create your Brand Profile
        </h2>

        {/* Subheading */}
        <p
          className="mb-8"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: '#484848'
          }}
          data-testid="text-subheading"
        >
          We'll need some information to build a more tailored Brand Profile.
        </p>

        <form onSubmit={handleContinue} className="flex flex-col gap-6">
          {/* Brand Name - Required (Single-line, 48px) */}
          <FloatingLabelInput
            id="brand-name"
            label="What is your brand's name?"
            value={brandName}
            onChange={(value) => {
              setBrandName(value);
              if (errors.brandName) setErrors({ ...errors, brandName: undefined });
            }}
            required
            error={errors.brandName}
            testId="input-brand-name"
          />

          {/* Products/Services - Optional (Multiline, resizable, starts at 48px) */}
          <FloatingLabelInput
            id="products-services"
            label="What products or services do you offer?"
            value={productsServices}
            onChange={setProductsServices}
            multiline
            rows={1}
            maxHeight="240px"
            testId="input-products-services"
          />

          {/* Customers - Required (Multiline, resizable, starts at 48px) */}
          <FloatingLabelInput
            id="customers"
            label="Describe your typical customers. Be specific."
            value={customers}
            onChange={(value) => {
              setCustomers(value);
              if (errors.customers) setErrors({ ...errors, customers: undefined });
            }}
            required
            error={errors.customers}
            multiline
            rows={1}
            maxHeight="240px"
            testId="input-customers"
          />

          {/* Customer Location - Required (Single-line, 48px) */}
          <FloatingLabelInput
            id="location"
            label="Where are your customers located?"
            value={location}
            onChange={(value) => {
              setCustomerLocation(value);
              if (errors.location) setErrors({ ...errors, location: undefined });
            }}
            required
            error={errors.location}
            testId="input-location"
          />

          {/* Error Message */}
          {errors.general && (
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#DC2626',
                  textAlign: 'center'
                }}
              >
                {errors.general}
              </p>
            </div>
          )}

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{
              height: '48px',
              borderRadius: '4px',
              backgroundColor: '#CEA54F',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500
            }}
            data-testid="button-continue"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
