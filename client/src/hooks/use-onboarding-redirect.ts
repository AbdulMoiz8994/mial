import { useEffect } from "react";
import { useLocation } from "wouter";
import { onboardingAPI } from "@/services/onboarding.api";
import { useUser } from "@/contexts/UserContext";

/**
 * Hook to check onboarding status and redirect users to the appropriate step
 * Use this in sign-in page to redirect returning users to incomplete onboarding
 */
export function useOnboardingRedirect() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: userLoading } = useUser();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!userLoading && isAuthenticated) {
        try {
          const status = await onboardingAPI.getStatus();

          // If onboarding is not complete, redirect to the current step
          if (!status.completed) {
            const stepRoutes: Record<number, string> = {
              1: "/brand-profile",
              2: "/business-type",
              3: "/goals",
              4: "/brand-colors",
              5: "/social-media-focus",
            };

            const redirectRoute = stepRoutes[status.currentStep];
            if (redirectRoute) {
              setLocation(redirectRoute);
            }
          } else {
            // Onboarding complete, go to home
            setLocation("/home");
          }
        } catch (error) {
          console.error("Failed to check onboarding status:", error);
          // On error, default to home page
          setLocation("/home");
        }
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, userLoading, setLocation]);
}
