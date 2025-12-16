import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { onboardingAPI, type Goal as APIGoal } from "@/services/onboarding.api";
import { useToast } from "@/hooks/use-toast";

export default function Goals() {
  const [, setLocation] = useLocation();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goals, setGoals] = useState<APIGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});
  const { toast } = useToast();

  // Fetch goals on mount
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await onboardingAPI.getGoals();
        setGoals(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load goals",
          description: error.message,
        });
        // Fallback to hardcoded goals
        setGoals([
          { id: "1", name: "Get more clients" },
          { id: "2", name: "Post consistently" },
          { id: "3", name: "Build brand awareness" },
          { id: "4", name: "Grow followers" },
        ]);
      }
    };
    loadGoals();
  }, [toast]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleBack = () => {
    setLocation("/business-type");
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGoals.length === 0) {
      toast({
        variant: "destructive",
        title: "Please select at least one goal",
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await onboardingAPI.submitStep3({ goalIds: selectedGoals });
      toast({
        title: "Goals saved!",
        description: "Let's customize your brand.",
      });
      setLocation("/brand-colors");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save goals. Please try again.";
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

  return (
    <AuthLayout>
      <div
        className="bg-white rounded-lg border flex flex-col w-full max-w-[676px] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12"
        style={{
          borderRadius: "8px",
          borderWidth: "1px",
          borderColor: "#E8E8E8",
        }}
        data-testid="card-goals"
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
            className="mb-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "24px",
              fontWeight: 600,
              lineHeight: "34px",
              color: "#202020",
            }}
            data-testid="text-heading"
          >
            What are your goals?
          </h2>

          {/* Subheading */}
          <p
            className="mb-8"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color: "#484848",
            }}
            data-testid="text-subheading"
          >
            This helps me create content that fits your industry
          </p>

          <form onSubmit={handleContinue} className="flex flex-col gap-4">
            {/* Goal Options */}
            <div className="flex flex-col gap-3" role="group" aria-label="Goal selection">
              {goals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <label
                    key={goal.id}
                    className="w-full flex items-center justify-between px-4 py-3 border rounded-md transition-all hover:border-[#CEA54F] cursor-pointer"
                    style={{
                      borderWidth: "1px",
                      borderColor: isSelected ? "#CEA54F" : "#E8E8E8",
                      borderRadius: "8px",
                      backgroundColor: "white",
                    }}
                    data-testid={`option-goal-${goal.id}`}
                  >
                    <input
                      type="checkbox"
                      name="goals"
                      value={goal.id}
                      checked={isSelected}
                      onChange={() => toggleGoal(goal.id)}
                      className="sr-only"
                      data-testid={`input-goal-${goal.id}`}
                    />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                      data-testid={`text-${goal.id}`}
                    >
                      {goal.name}
                    </span>

                    {/* Checkbox Circle Indicator */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        borderWidth: "2px",
                        borderColor: isSelected ? "#CEA54F" : "#E8E8E8",
                        backgroundColor: isSelected ? "#CEA54F" : "white",
                      }}
                      data-testid={`indicator-${goal.id}`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <Check
                          className="text-white"
                          style={{
                            width: "12px",
                            height: "12px",
                          }}
                        />
                      )}
                    </div>
                  </label>
                );
              })}
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
              disabled={selectedGoals.length === 0 || isLoading}
              className="w-full rounded text-white font-medium transition-opacity mt-4"
              style={{
                height: "48px",
                borderRadius: "4px",
                backgroundColor: "#CEA54F",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                opacity: selectedGoals.length === 0 || isLoading ? 0.5 : 1,
                cursor: selectedGoals.length === 0 || isLoading ? "not-allowed" : "pointer",
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
