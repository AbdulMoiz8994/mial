import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AuthLayout } from "@/components/auth-layout";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import googleIcon from "@assets/google_1763490580644.png";
import facebookIcon from "@assets/facebook_1763490580645.png";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const { register, loginWithGoogle, loginWithFacebook, isAuthenticated, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const [hasSignedUp, setHasSignedUp] = useState(false);

  // Redirect if already authenticated (but NOT if we just signed up)
  useEffect(() => {
    if (!userLoading && isAuthenticated && !hasSignedUp) {
      setLocation("/home");
    }
  }, [isAuthenticated, userLoading, hasSignedUp, setLocation]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    terms?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Password validation - API requires 8+ chars, uppercase, lowercase, and number
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Terms validation
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms of Use and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setErrors({});
      setHasSignedUp(true); // Mark that we're signing up

      try {
        await register({ email, password, firstName, lastName });
        toast({
          title: "Account created successfully!",
          description: `Welcome, ${firstName}! Let's set up your profile.`,
        });
        // Use window.location to ensure hard navigation (prevents race condition with useEffect)
        window.location.href = "/brand-profile";
      } catch (error: any) {
        const errorMessage = error.message || "Failed to sign up. Please try again.";
        setErrors({ general: errorMessage });
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: errorMessage,
        });
        setHasSignedUp(false); // Reset on error
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      loginWithGoogle();
    } else if (provider === 'facebook') {
      loginWithFacebook();
    }
  };

  return (
    <AuthLayout
      topRightText="Already have an account?"
      topRightLink={{
        text: "Sign In",
        onClick: () => setLocation("/sign-in")
      }}
    >
      <div
        className="bg-white rounded-lg border flex flex-col w-full max-w-[436px] px-5 py-6 sm:px-6 sm:py-8 md:px-[33px] md:py-12"
        style={{
          borderRadius: '8px',
          borderWidth: '1px',
          borderColor: '#E8E8E8'
        }}
        data-testid="card-signup"
      >
        {/* Sign Up Heading */}
        <h2
          className="mb-5 sm:mb-6"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: '32px',
            color: '#202020'
          }}
          data-testid="text-signup-heading"
        >
          Sign up
        </h2>

        <form onSubmit={handleSignUp} className="flex-1 flex flex-col">
          {/* Email Input */}
          <div className="mb-5 sm:mb-6">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className="w-full border rounded focus:outline-none focus:border-[#CEA54F] transition-colors"
              style={{
                height: '48px',
                borderRadius: '4px',
                borderWidth: '1px',
                borderColor: errors.email ? '#EF4444' : '#E8E8E8',
                padding: '0 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#202020'
              }}
              data-testid="input-email"
            />
            {errors.email && (
              <p
                className="mt-1"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#EF4444'
                }}
                data-testid="error-email"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* First Name and Last Name - Stack on mobile, side by side on desktop */}
          <div className="flex flex-col sm:flex-row gap-4 mb-5 sm:mb-6">
            <div className="w-full sm:flex-1">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                }}
                className="w-full border rounded focus:outline-none focus:border-[#CEA54F] transition-colors"
                style={{
                  height: '48px',
                  borderRadius: '4px',
                  borderWidth: '1px',
                  borderColor: errors.firstName ? '#EF4444' : '#E8E8E8',
                  padding: '0 16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#202020'
                }}
                data-testid="input-firstname"
              />
              {errors.firstName && (
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#EF4444'
                  }}
                  data-testid="error-firstname"
                >
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="w-full sm:flex-1">
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                }}
                className="w-full border rounded focus:outline-none focus:border-[#CEA54F] transition-colors"
                style={{
                  height: '48px',
                  borderRadius: '4px',
                  borderWidth: '1px',
                  borderColor: errors.lastName ? '#EF4444' : '#E8E8E8',
                  padding: '0 16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#202020'
                }}
                data-testid="input-lastname"
              />
              {errors.lastName && (
                <p
                  className="mt-1"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#EF4444'
                  }}
                  data-testid="error-lastname"
                >
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6 sm:mb-8">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                className="w-full border rounded focus:outline-none focus:border-[#CEA54F] transition-colors"
                style={{
                  height: '48px',
                  borderRadius: '4px',
                  borderWidth: '1px',
                  borderColor: errors.password ? '#EF4444' : '#E8E8E8',
                  paddingLeft: '16px',
                  paddingRight: '48px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#202020'
                }}
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p
                className="mt-1"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#EF4444'
                }}
                data-testid="error-password"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div
              className="mb-4 p-3 rounded"
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

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              height: '48px',
              borderRadius: '4px',
              backgroundColor: '#CEA54F',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500
            }}
            data-testid="button-signup"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {/* Divider */}
          <div className="flex items-center my-5 sm:my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span
              className="px-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#484848'
              }}
            >
              or
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 border rounded hover:bg-gray-50 transition-colors"
              style={{
                height: '48px',
                borderRadius: '4px',
                borderWidth: '1px',
                borderColor: '#E8E8E8',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#202020'
              }}
              data-testid="button-google"
            >
              <img src={googleIcon} alt="Google" className="w-5 h-5 object-contain" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 border rounded hover:bg-gray-50 transition-colors"
              style={{
                height: '48px',
                borderRadius: '4px',
                borderWidth: '1px',
                borderColor: '#E8E8E8',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#202020'
              }}
              data-testid="button-facebook"
            >
              <img src={facebookIcon} alt="Facebook" className="w-5 h-5 object-contain" />
              Facebook
            </button>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="mt-auto">
            <label className="flex items-start gap-2 cursor-pointer" data-testid="label-terms">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: undefined });
                }}
                className="mt-1 w-4 h-4 border-2 rounded cursor-pointer accent-[#CEA54F]"
                style={{
                  borderColor: '#CEA54F'
                }}
                data-testid="checkbox-terms"
              />
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '19px',
                  color: '#484848'
                }}
              >
                By clicking Create account, I agree that I have read and accepted the{' '}
                <button
                  type="button"
                  onClick={() => {}}
                  className="hover:underline cursor-pointer bg-transparent border-0 p-0"
                  style={{ color: '#CEA54F' }}
                  data-testid="link-terms"
                >
                  Terms of Use
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => {}}
                  className="hover:underline cursor-pointer bg-transparent border-0 p-0"
                  style={{ color: '#CEA54F' }}
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>
            {errors.terms && (
              <p
                className="mt-2"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#EF4444'
                }}
                data-testid="error-terms"
              >
                {errors.terms}
              </p>
            )}
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
