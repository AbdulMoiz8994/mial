import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus } from "lucide-react";

import contentImage1 from "@assets/stock_images/woman_with_beautiful_9897c48b.jpg";
import contentImage2 from "@assets/stock_images/woman_with_beautiful_067e63a9.jpg";
import contentImage3 from "@assets/stock_images/woman_with_beautiful_13b91479.jpg";
import contentImage4 from "@assets/stock_images/woman_with_beautiful_6bbdb2fc.jpg";

type TabType = "ai-ideas" | "caption-hashtags" | "graphics-template" | "script-generator";
type PlatformType = "linkedin" | "instagram" | "facebook" | "youtube";

interface ContentCard {
  id: string;
  image: string;
  title: string;
  description: string;
  hashtags: string[];
}

export default function AIStudio() {
  const [activeTab, setActiveTab] = useState<TabType>("ai-ideas");
  const [postIdea, setPostIdea] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(["linkedin", "instagram", "facebook", "youtube"]);

  const tabs = [
    { id: "ai-ideas" as const, label: "AI Ideas" },
    { id: "caption-hashtags" as const, label: "Caption & Hashtags" },
    { id: "graphics-template" as const, label: "Graphics / Template" },
    { id: "script-generator" as const, label: "Script Generator" },
  ];

  const quickSuggestions = [
    { id: "transformation", label: "+ Before & After Transformation", isPrimary: true },
    { id: "hair-tip", icon: "💡", label: "Hair Tip Tuesday", isPrimary: false },
    { id: "promo", icon: "🎁", label: "Promotional Offer", isPrimary: false },
    { id: "review", icon: "⭐", label: "Client Review", isPrimary: false },
  ];

  const platforms = [
    { id: "linkedin" as const, color: "#0A66C2" },
    { id: "instagram" as const, color: "#E4405F" },
    { id: "facebook" as const, color: "#1877F2" },
    { id: "youtube" as const, color: "#FF0000" },
  ];

  const contentCards: ContentCard[] = [
    {
      id: "1",
      image: contentImage1,
      title: "5 Trending Hairstyles for Fall",
      description: "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
    {
      id: "2",
      image: contentImage2,
      title: "5 Trending Hairstyles for Fall",
      description: "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
    {
      id: "3",
      image: contentImage3,
      title: "5 Trending Hairstyles for Fall",
      description: "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
    {
      id: "4",
      image: contentImage4,
      title: "5 Trending Hairstyles for Fall",
      description: "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
  ];

  const togglePlatform = (platform: PlatformType) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setPostIdea(suggestion);
  };

  const handleGenerateIdea = () => {
    console.log("Generating idea for:", postIdea, "on platforms:", selectedPlatforms);
  };

  const getPlatformIcon = (platform: string, isSelected: boolean, color: string) => {
    const bgColor = isSelected ? color : "#E5E7EB";
    const iconColor = isSelected ? "white" : "#9CA3AF";

    switch (platform) {
      case "linkedin":
        return (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={iconColor}>
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </div>
        );
      case "instagram":
        return (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={iconColor}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        );
      case "facebook":
        return (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={iconColor}>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case "youtube":
        return (
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={iconColor}>
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Page with light gray background */}
      <div 
        className="p-6 lg:p-8 min-h-full"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        {/* Main White Card Container */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Page Header */}
          <div className="mb-6">
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#202020",
                marginBottom: "4px",
              }}
              data-testid="text-ai-studio-heading"
            >
              AI Studio
            </h1>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#9CA3AF",
              }}
              data-testid="text-ai-studio-subtitle"
            >
              Here's what's happening with your content today
            </p>
          </div>

          {/* Divider Line */}
          <div style={{ height: "1px", backgroundColor: "#E5E7EB", marginBottom: "24px" }} />

          {/* Content Creation Section */}
          <div data-testid="card-content-creation">
            {/* Header with Title and Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
              <h2
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#202020",
                }}
                data-testid="text-post-question"
              >
                What do you want to post about?
              </h2>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="transition-all"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      backgroundColor: activeTab === tab.id ? "#202020" : "#FFFFFF",
                      color: activeTab === tab.id ? "#FFFFFF" : "#6B7280",
                      border: activeTab === tab.id ? "none" : "1px solid #E5E7EB",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    data-testid={`button-tab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={postIdea}
              onChange={(e) => setPostIdea(e.target.value)}
              placeholder="Describe your post idea..."
              className="w-full focus:outline-none focus:border-[#CEA54F] transition-colors"
              style={{
                minHeight: "100px",
                padding: "16px",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#202020",
                resize: "none",
                backgroundColor: "#FFFFFF",
              }}
              data-testid="textarea-post-idea"
            />

            {/* Quick Suggestions and Platform Selection Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-5">
              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleQuickSuggestion(suggestion.label)}
                    className="flex items-center gap-1.5 transition-all hover:opacity-90"
                    style={{
                      padding: "8px 14px",
                      borderRadius: "20px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      backgroundColor: suggestion.isPrimary ? "#CEA54F" : "#FFFFFF",
                      color: suggestion.isPrimary ? "#FFFFFF" : "#6B7280",
                      border: suggestion.isPrimary ? "none" : "1px solid #E5E7EB",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    data-testid={`button-suggestion-${suggestion.id}`}
                  >
                    {suggestion.icon && <span>{suggestion.icon}</span>}
                    {suggestion.label}
                  </button>
                ))}
              </div>

              {/* Platform Selection and Generate Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Select Platform */}
                <div className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#6B7280",
                      whiteSpace: "nowrap",
                    }}
                    data-testid="text-select-platform"
                  >
                    Select Platform
                  </span>
                  <div className="flex items-center gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className="transition-transform hover:scale-105"
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                        data-testid={`button-platform-${platform.id}`}
                      >
                        {getPlatformIcon(platform.id, selectedPlatforms.includes(platform.id), platform.color)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Idea Button */}
                <button
                  onClick={handleGenerateIdea}
                  className="flex items-center gap-2 transition-all hover:opacity-90"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    backgroundColor: "#CEA54F",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  data-testid="button-generate-idea"
                >
                  <Plus size={16} />
                  Generate Idea
                </button>
              </div>
            </div>
          </div>

          {/* Content Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {contentCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: "#F9FAFB",
                }}
                data-testid={`card-content-${card.id}`}
              >
                {/* Card Image */}
                <div
                  className="w-full overflow-hidden"
                  style={{ 
                    aspectRatio: "1/1",
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    data-testid={`img-content-${card.id}`}
                  />
                </div>

                {/* Card Content */}
                <div style={{ padding: "16px" }}>
                  {/* Title */}
                  <h3
                    className="line-clamp-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#202020",
                      lineHeight: "1.4",
                      marginBottom: "6px",
                    }}
                    data-testid={`text-title-${card.id}`}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="line-clamp-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#9CA3AF",
                      lineHeight: "1.5",
                      marginBottom: "12px",
                    }}
                    data-testid={`text-description-${card.id}`}
                  >
                    {card.description}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-2" style={{ marginBottom: "14px" }}>
                    {card.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "14px",
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: "#6B7280",
                        }}
                        data-testid={`tag-${card.id}-${index}`}
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 transition-all hover:opacity-90"
                      style={{
                        padding: "10px 0",
                        borderRadius: "8px",
                        backgroundColor: "#CEA54F",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                      }}
                      data-testid={`button-generate-caption-${card.id}`}
                    >
                      Generate Caption
                    </button>
                    <button
                      className="flex-1 transition-all hover:opacity-90"
                      style={{
                        padding: "10px 0",
                        borderRadius: "8px",
                        backgroundColor: "#F0A090",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                      }}
                      data-testid={`button-open-editor-${card.id}`}
                    >
                      Open Editor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
