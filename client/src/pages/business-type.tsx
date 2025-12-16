import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AuthLayout } from "@/components/auth-layout";
import { ArrowLeft } from "lucide-react";
import { onboardingAPI, type BusinessType as APIBusinessType } from "@/services/onboarding.api";
import { useToast } from "@/hooks/use-toast";

export default function BusinessType() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [businessTypes, setBusinessTypes] = useState<APIBusinessType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});
  const { toast } = useToast();

  // Fetch business types on mount
  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        const types = await onboardingAPI.getBusinessTypes();
        setBusinessTypes(types);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load business types",
          description: error.message,
        });
      }
    };
    loadBusinessTypes();
  }, [toast]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await onboardingAPI.submitStep2({ businessTypeId: selectedType });
      toast({
        title: "Business type saved!",
        description: "Let's continue with your goals.",
      });
      setLocation("/goals");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save business type. Please try again.";
      setErrors({ general: errorMessage });
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback to hardcoded options if API fails (for UI compatibility)
  const businessOptions = businessTypes.length > 0
    ? businessTypes.map(type => ({
        id: type.id,
        emoji: "📋", // Default emoji
        label: type.name,
      }))
    : [
        { id: "hair-salon", emoji: "💇", label: "Hair Salon" },
        { id: "nail-bar", emoji: "💅", label: "Nail Bar" },
        { id: "barber", emoji: "💈", label: "Barber" },
        { id: "spa-other", emoji: "💆", label: "Spa / Other" },
      ];

  return (
    <AuthLayout>
      <div
        className="bg-white rounded-lg border flex flex-col w-full max-w-[676px] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12"
        style={{
          borderRadius: '8px',
          borderWidth: '1px',
          borderColor: '#E8E8E8'
        }}
        data-testid="card-business-type"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => setLocation("/brand-profile")}
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
          What type of business are you?
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
          This helps me create content that fits your clientele
        </p>

        <form onSubmit={handleContinue} className="flex flex-col gap-4">
          {/* Business Type Options */}
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Business type selection">
            {businessOptions.map((option) => (
              <label
                key={option.id}
                className="w-full flex items-center justify-between px-4 py-3 border rounded-md transition-all hover:border-[#CEA54F] cursor-pointer"
                style={{
                  borderWidth: '1px',
                  borderColor: selectedType === option.id ? '#CEA54F' : '#E8E8E8',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
                data-testid={`option-business-type-${option.id}`}
              >
                <input
                  type="radio"
                  name="business-type"
                  value={option.id}
                  checked={selectedType === option.id}
                  onChange={() => setSelectedType(option.id)}
                  className="sr-only"
                  data-testid={`input-business-type-${option.id}`}
                />
                <div className="flex items-center gap-3">
                  <span 
                    style={{ fontSize: '20px' }}
                    data-testid={`emoji-${option.id}`}
                  >
                    {option.emoji}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#202020'
                    }}
                    data-testid={`text-${option.id}`}
                  >
                    {option.label}
                  </span>
                </div>
                
                {/* Radio Circle Indicator */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    borderWidth: '2px',
                    borderColor: selectedType === option.id ? '#CEA54F' : '#E8E8E8',
                    backgroundColor: 'white'
                  }}
                  data-testid={`indicator-${option.id}`}
                  aria-hidden="true"
                >
                  {selectedType === option.id && (
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#CEA54F'
                      }}
                    />
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
              }}
              data-testid="error-general"
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
            disabled={!selectedType || isLoading}
            className="w-full rounded text-white font-medium transition-opacity mt-4"
            style={{
              height: '48px',
              borderRadius: '4px',
              backgroundColor: '#CEA54F',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              opacity: selectedType && !isLoading ? 1 : 0.5,
              cursor: selectedType && !isLoading ? 'pointer' : 'not-allowed'
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
