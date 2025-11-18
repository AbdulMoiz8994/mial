import logoImage from "@assets/MIA logo_1763490424237.png";
import gradientImage from "@assets/Abstract Gradient Background_1763490507573.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  topRightText?: string;
  topRightLink?: {
    text: string;
    onClick: () => void;
  };
}

export function AuthLayout({ children, topRightText, topRightLink }: AuthLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Header - Logo and Link */}
      <div className="md:hidden bg-[#F5F5F5] px-6 pt-6 pb-4">
        <div className="flex items-center justify-between max-w-[436px] mx-auto">
          <img
            src={logoImage}
            alt="MIA - THE AI SOCIAL AGENT"
            className="w-auto h-auto max-w-[120px]"
            data-testid="img-logo-mobile"
          />
          {topRightText && topRightLink && (
            <div className="text-right">
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: '#202020'
                }}
              >
                {topRightText}{' '}
              </span>
              <button
                type="button"
                onClick={topRightLink.onClick}
                className="font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#CEA54F'
                }}
                data-testid="link-auth-top-mobile"
              >
                {topRightLink.text}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Left Side - Hero Section with Gradient Background (Desktop Only) - FIXED */}
      <div className="relative hidden md:flex md:w-[60%] lg:w-[56%] h-screen overflow-hidden">
        {/* Background Gradient Image */}
        <img
          src={gradientImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Content Overlay - Logo at top, Hero text at bottom */}
        <div className="relative z-10 w-full flex flex-col justify-between py-12 px-12 lg:px-16">
          {/* Logo at Top */}
          <div>
            <img
              src={logoImage}
              alt="MIA - THE AI SOCIAL AGENT"
              className="w-auto h-auto max-w-[200px]"
              data-testid="img-logo"
            />
          </div>
          
          {/* Hero Text at Bottom */}
          <div className="max-w-[405px]">
            <h1
              className="text-white font-bold mb-4 md:mb-6 text-3xl md:text-[44px]"
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                lineHeight: '46px',
                letterSpacing: '0px'
              }}
              data-testid="text-hero-title"
            >
              Hi, I'm MIA
            </h1>
            
            <p
              className="text-white text-base md:text-[20px]"
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                lineHeight: '31px',
                fontWeight: 400,
                letterSpacing: '0px'
              }}
              data-testid="text-hero-description"
            >
              Your intelligent content agent. Let me help you create stunning social media content that grows your beauty business.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form Content (SCROLLABLE) */}
      <div className="flex flex-1 flex-col md:h-screen md:overflow-y-auto bg-[#F5F5F5]">
        <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-8 md:py-20">
          {/* Top Right Link - Desktop */}
          {topRightText && topRightLink && (
            <div className="hidden md:block absolute top-12 right-12">
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#202020'
                }}
              >
                {topRightText}{' '}
              </span>
              <button
                type="button"
                onClick={topRightLink.onClick}
                className="font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#CEA54F'
                }}
                data-testid="link-auth-top"
              >
                {topRightLink.text}
              </button>
            </div>
          )}

          {/* Form Card */}
          {children}
        </div>
      </div>
    </div>
  );
}
