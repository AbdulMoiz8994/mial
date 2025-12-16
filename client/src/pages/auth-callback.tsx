import { useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/services/auth.api";
import { onboardingAPI } from "@/services/onboarding.api";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { setUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL query params
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const error = params.get('error');

      if (error) {
        console.error('OAuth error:', error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "OAuth authentication failed. Please try again.",
        });
        setLocation('/sign-in?error=' + encodeURIComponent(error));
        return;
      }

      if (token) {
        try {
          // Save token
          authAPI.saveToken(token);

          // Fetch user data
          const userData = await authAPI.getMe();

          setUser({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`,
          });

          toast({
            title: "Welcome!",
            description: "You have successfully signed in.",
          });

          // Check onboarding status to determine where to redirect
          try {
            const status = await onboardingAPI.getStatus();

            // If onboarding is not complete, redirect to the current step
            if (!status.isComplete) {
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
              } else {
                setLocation("/brand-profile");
              }
            } else {
              // Onboarding complete, go to home
              setLocation('/home');
            }
          } catch (statusError) {
            console.error("Failed to check onboarding status:", statusError);
            // On error, default to home page
            setLocation('/home');
          }
        } catch (error) {
          console.error('Failed to authenticate:', error);
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: "Failed to complete authentication. Please try again.",
          });
          setLocation('/sign-in?error=authentication_failed');
        }
      } else {
        // No token, redirect to sign-in
        setLocation('/sign-in');
      }
    };

    handleCallback();
  }, [setLocation, setUser, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CEA54F] mx-auto mb-4"></div>
        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
