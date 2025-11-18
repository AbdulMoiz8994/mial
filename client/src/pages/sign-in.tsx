import { useState } from "react";
import { useLocation } from "wouter";
import { AuthLayout } from "@/components/auth-layout";
import { Eye, EyeOff } from "lucide-react";
import googleIcon from "@assets/google_1763490580644.png";
import facebookIcon from "@assets/facebook_1763490580645.png";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Handle sign in logic
      console.log("Sign in:", { email, password });
      // TODO: Implement actual sign-in logic
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic
    console.log("Social login:", provider);
  };

  return (
    <AuthLayout
      topRightText="Don't have an account?"
      topRightLink={{
        text: "Sign Up",
        onClick: () => setLocation("/sign-up")
      }}
    >
      <div
        className="bg-white rounded-lg border flex flex-col w-full max-w-[436px] px-5 py-6 sm:px-6 sm:py-8 md:px-[33px] md:py-12"
        style={{
          borderRadius: '8px',
          borderWidth: '1px',
          borderColor: '#E8E8E8'
        }}
        data-testid="card-signin"
      >
          {/* Sign In Heading */}
          <h2
            className="mb-1"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '22px',
              fontWeight: 600,
              lineHeight: '32px',
              color: '#202020'
            }}
            data-testid="text-signin-heading"
          >
            Sign in
          </h2>

          {/* Sign Up Link - Inside Card */}
          <p className="mb-5 sm:mb-6">
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#202020'
              }}
            >
              Don't have an account?{' '}
            </span>
            <button
              type="button"
              onClick={() => setLocation("/sign-up")}
              className="hover:underline cursor-pointer bg-transparent border-0 p-0"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                color: '#CEA54F'
              }}
              data-testid="link-signup"
            >
              Sign Up
            </button>
          </p>

          <form onSubmit={handleSignIn} className="flex-1 flex flex-col">
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

            {/* Password Input */}
            <div className="mb-2 relative">
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

            {/* Forgot Password */}
            <div className="mb-6 sm:mb-8">
              <button
                type="button"
                onClick={() => console.log('Forgot password - page not yet implemented')}
                className="hover:underline cursor-pointer bg-transparent border-0 p-0"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#484848'
                }}
                data-testid="link-forgot-password"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full rounded text-white font-medium hover:opacity-90 transition-opacity"
              style={{
                height: '38px',
                borderRadius: '4px',
                backgroundColor: '#CEA54F',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500
              }}
              data-testid="button-signin"
            >
              Sign In
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
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

            {/* reCAPTCHA Notice */}
            <div className="mt-auto">
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '19px',
                  color: '#484848',
                  textAlign: 'center'
                }}
                data-testid="text-recaptcha"
              >
                Protected by reCAPTCHA and subject to the Prism{' '}
                <a
                  href="/privacy-policy"
                  className="hover:underline"
                  style={{ color: '#CEA54F' }}
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a
                  href="/terms"
                  className="hover:underline"
                  style={{ color: '#CEA54F' }}
                  data-testid="link-terms"
                >
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </form>
        </div>
    </AuthLayout>
  );
}
