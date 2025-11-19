import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Instagram, Facebook, Linkedin, Music, Youtube, Twitter } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

type SocialPlatform = "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "twitter";

interface Platform {
  id: SocialPlatform;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

export default function SocialMediaFocus() {
  const [, setLocation] = useLocation();
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);

  const platforms: Platform[] = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
    { id: "tiktok", name: "TikTok", icon: Music, color: "#000000" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000" },
    { id: "twitter", name: "X/Twitter", icon: Twitter, color: "#000000" },
  ];

  const togglePlatform = (platformId: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleBack = () => {
    setLocation("/brand-colors");
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected social media platforms:", selectedPlatforms);
    // TODO: Navigate to dashboard/content plan page
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
        data-testid="card-social-media-focus"
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
          className="mb-8"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "24px",
            fontWeight: 600,
            lineHeight: "34px",
            color: "#202020",
          }}
          data-testid="text-heading"
        >
          Tell Autopilot where to focus
        </h2>

        <form onSubmit={handleGeneratePlan} className="flex flex-col gap-6">
          {/* Social Media Section */}
          <div>
            <h3
              className="mb-4"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "24px",
                color: "#202020",
              }}
              data-testid="text-social-media-heading"
            >
              Social Media
            </h3>

            <div className="flex flex-col gap-3" role="group" aria-label="Social media platform selection">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                const IconComponent = platform.icon;
                
                return (
                  <label
                    key={platform.id}
                    className="flex items-center gap-3 cursor-pointer"
                    data-testid={`option-platform-${platform.id}`}
                  >
                    <input
                      type="checkbox"
                      name="social-platforms"
                      value={platform.id}
                      checked={isSelected}
                      onChange={() => togglePlatform(platform.id)}
                      className="sr-only"
                      data-testid={`input-platform-${platform.id}`}
                    />
                    
                    {/* Custom Checkbox */}
                    <div
                      className="flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        borderWidth: "2px",
                        borderColor: isSelected ? "#CEA54F" : "#E8E8E8",
                        backgroundColor: isSelected ? "#CEA54F" : "white",
                      }}
                      data-testid={`checkbox-${platform.id}`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Platform Icon */}
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: "24px",
                        height: "24px",
                      }}
                      data-testid={`icon-${platform.id}`}
                    >
                      <IconComponent
                        style={{
                          width: "20px",
                          height: "20px",
                          color: platform.color,
                        }}
                      />
                    </div>

                    {/* Platform Name */}
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                      data-testid={`text-${platform.id}`}
                    >
                      {platform.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={selectedPlatforms.length === 0}
            className="w-full rounded text-white font-medium transition-opacity mt-2"
            style={{
              height: "48px",
              borderRadius: "4px",
              backgroundColor: "#CEA54F",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              opacity: selectedPlatforms.length === 0 ? 0.5 : 1,
              cursor: selectedPlatforms.length === 0 ? "not-allowed" : "pointer",
            }}
            data-testid="button-generate"
          >
            Generate My Content Plan
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
