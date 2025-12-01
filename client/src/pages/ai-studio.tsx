import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Sparkles } from "lucide-react";

import contentImage1 from "@assets/stock_images/woman_with_beautiful_9897c48b.jpg";
import contentImage2 from "@assets/stock_images/woman_with_beautiful_067e63a9.jpg";
import contentImage3 from "@assets/stock_images/woman_with_beautiful_13b91479.jpg";
import contentImage4 from "@assets/stock_images/woman_with_beautiful_6bbdb2fc.jpg";

type TabType =
  | "ai-ideas"
  | "caption-hashtags"
  | "graphics-template"
  | "script-generator";
type PlatformType = "linkedin" | "instagram" | "facebook" | "twitter" | "tiktok";

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
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    "instagram",
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    "transformation",
  );

  const tabs = [
    { id: "ai-ideas" as const, label: "AI Ideas" },
    { id: "caption-hashtags" as const, label: "Caption & Hashtags" },
    { id: "graphics-template" as const, label: "Graphics / Template" },
    { id: "script-generator" as const, label: "Script Generator" },
  ];

  const quickSuggestions = [
    {
      id: "transformation",
      icon: "✨",
      label: "Before & After Transformation",
      isPrimary: true,
    },
    { id: "hair-tip", icon: "💡", label: "Hair Tip Tuesday", isPrimary: false },
    { id: "promo", icon: "🎁", label: "Promotional Offer", isPrimary: false },
    { id: "review", icon: "⭐", label: "Client Review", isPrimary: false },
  ];

  const platforms = [
    { id: "linkedin" as const, color: "#0A66C2" },
    { id: "instagram" as const, color: "#E4405F" },
    { id: "facebook" as const, color: "#1877F2" },
    { id: "twitter" as const, color: "#000000" },
    { id: "tiktok" as const, color: "#000000" },
  ];

  const contentCards: ContentCard[] = [
    {
      id: "1",
      image: contentImage1,
      title: "5 Trending Hairstyles for Fall",
      description:
        "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
    {
      id: "2",
      image: contentImage2,
      title: "5 Trending Hairstyles for Fall",
      description:
        "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
    {
      id: "3",
      image: contentImage3,
      title: "5 Trending Hairstyles for Fall",
      description:
        "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
    {
      id: "4",
      image: contentImage4,
      title: "5 Trending Hairstyles for Fall",
      description:
        "Showcase autumn-inspired balayage tones and seasonal color trends",
      hashtags: ["#HairCare", "#FallVibes"],
    },
  ];

  const togglePlatform = (platform: PlatformType) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        // Prevent deselecting if it's the last one
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((p) => p !== platform);
      }
      return [...prev, platform];
    });
  };

  const handleQuickSuggestion = (suggestionId: string) => {
    // User must always have one selected, can only switch between options
    if (selectedSuggestion !== suggestionId) {
      setSelectedSuggestion(suggestionId);
    }
  };

  const handleGenerateIdea = () => {
    console.log(
      "Generating idea for:",
      postIdea,
      "on platforms:",
      selectedPlatforms,
    );
  };

  const getPlatformIcon = (
    platform: string,
    isSelected: boolean,
    color: string,
  ) => {
    const iconStyle = {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      opacity: isSelected ? 1 : 0.5,
      transform: isSelected ? "scale(1)" : "scale(0.9)",
    };

    switch (platform) {
      case "linkedin":
        return (
          <div style={iconStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </div>
        );
      case "instagram":
        return (
          <div style={iconStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
        );
      case "facebook":
        return (
          <div style={iconStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );
      case "twitter":
        return (
          <div style={iconStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        );
      case "tiktok":
        return (
          <div style={iconStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
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
            padding: "32px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
                color: "#6B7280",
              }}
              data-testid="text-ai-studio-subtitle"
            >
              Here's what's happening with your content today
            </p>
          </div>

          {/* Divider Line */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              marginBottom: "24px",
            }}
          />

          {/* Content Creation Section */}
          <div data-testid="card-content-creation">
            {/* Header with Title and Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
              {activeTab !== "graphics-template" && (
                <h2
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#202020",
                  }}
                  data-testid="text-post-question"
                >
                  {activeTab === "caption-hashtags"
                    ? "Describe your next post"
                    : "What do you want to post about?"}
                </h2>
              )}

              {/* Tabs */}
              <div
                className="flex items-center gap-1.5"
                style={
                  activeTab === "graphics-template"
                    ? { marginLeft: "auto" }
                    : {}
                }
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="transition-all"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "16px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      backgroundColor:
                        activeTab === tab.id ? "#1A1A1A" : "#FFFFFF",
                      color: activeTab === tab.id ? "#FFFFFF" : "#9CA3AF",
                      border:
                        activeTab === tab.id
                          ? "1px solid #1A1A1A"
                          : "1px solid #D1D5DB",
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

            {/* Content based on active tab */}
            {activeTab === "ai-ideas" && (
              <>
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
                    backgroundColor: "#F9FAFB",
                  }}
                  data-testid="textarea-post-idea"
                />

                {/* Quick Suggestions and Platform Selection Row */}
                <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-4 mt-5">
                  {/* Quick Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion) => {
                      const isSelected = selectedSuggestion === suggestion.id;
                      return (
                        <button
                          key={suggestion.id}
                          onClick={() => handleQuickSuggestion(suggestion.id)}
                          className="flex items-center gap-1.5 transition-all hover:opacity-90"
                          style={{
                            padding: "8px 14px",
                            borderRadius: "20px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            fontWeight: 500,
                            backgroundColor: isSelected ? "#CEA54F" : "#FFFFFF",
                            color: isSelected ? "#FFFFFF" : "#6B7280",
                            border: isSelected ? "none" : "1px solid #E5E7EB",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            boxShadow: isSelected
                              ? "0 2px 8px rgba(206, 165, 79, 0.35)"
                              : "0 1px 4px rgba(0, 0, 0, 0.06)",
                          }}
                          data-testid={`button-suggestion-${suggestion.id}`}
                        >
                          <span>{suggestion.icon}</span>
                          <span>{suggestion.label}</span>
                        </button>
                      );
                    })}
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
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                            data-testid={`button-platform-${platform.id}`}
                          >
                            {getPlatformIcon(
                              platform.id,
                              selectedPlatforms.includes(platform.id),
                              platform.color
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Idea Button */}
                    <button
                      onClick={handleGenerateIdea}
                      className="flex items-center gap-2 transition-all hover:opacity-90"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "24px",
                        background:
                          "linear-gradient(135deg, #D4A855 0%, #CEA54F 100%)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 12px rgba(206, 165, 79, 0.4)",
                      }}
                      data-testid="button-generate-idea"
                    >
                      <Sparkles size={16} />
                      <span>Generate Idea</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Graphics / Template Tab */}
            {activeTab === "graphics-template" && (
              <>
                {/* Filters Section - Type and Style */}
                <div
                  className="flex flex-col sm:flex-row gap-4 mb-10"
                  style={{
                    padding: "20px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {/* Type Dropdown */}
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Type
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "11px 16px",
                          paddingRight: "40px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#6B7280",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                        }}
                      >
                        <option>All Type</option>
                        <option>Social Media Post</option>
                        <option>Story</option>
                        <option>Banner</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Style Dropdown */}
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Style
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "11px 16px",
                          paddingRight: "40px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#6B7280",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                        }}
                      >
                        <option>All Style</option>
                        <option>Minimal</option>
                        <option>Elegant</option>
                        <option>Bold</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Cards Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(270px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {contentCards.map((card) => (
                    <div
                      key={card.id}
                      className="transition-all hover:shadow-md"
                      style={{
                        backgroundColor: "#F2F2F2",
                        borderRadius: "16px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #DADADA",
                        padding: "13px",
                      }}
                    >
                      {/* Card Image */}
                      <div
                        style={{
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>

                      {/* Card Content */}
                      <div style={{ padding: "0 4px" }}>
                        {/* Title */}
                        <h3
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#1F2937",
                            lineHeight: "1.5",
                            marginBottom: "10px",
                          }}
                        >
                          {card.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="line-clamp-2"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#9CA3AF",
                            lineHeight: "1.6",
                            marginBottom: "16px",
                          }}
                        >
                          {card.description}
                        </p>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-2">
                          {card.hashtags.map((hashtag, index) => (
                            <span
                              key={index}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                backgroundColor: "#D9D9D9",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#3F3F3F",
                              }}
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Caption & Hashtags Tab */}
            {activeTab === "caption-hashtags" && (
              <>
                {/* Textarea */}
                <textarea
                  placeholder="Describe your post idea..."
                  className="w-full focus:outline-none focus:border-[#CEA54F] transition-colors"
                  style={{
                    minHeight: "140px",
                    padding: "16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#202020",
                    resize: "none",
                    backgroundColor: "#FAFBFC",
                    marginBottom: "24px",
                    lineHeight: "1.6",
                  }}
                />

                {/* Select Tone and Platform Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  {/* Select Tone */}
                  <div>
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Select Tone
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "13px 16px",
                          paddingRight: "44px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "10px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#1F2937",
                          backgroundColor: "#F9FAFB",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <option>Playful</option>
                        <option>Professional</option>
                        <option>Casual</option>
                        <option>Inspirational</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="14"
                          height="9"
                          viewBox="0 0 14 9"
                          fill="none"
                        >
                          <path
                            d="M1 1.5L7 7.5L13 1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Platform */}
                  <div>
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Platform
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "13px 16px",
                          paddingRight: "44px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "10px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#1F2937",
                          backgroundColor: "#F9FAFB",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <option>Instagram</option>
                        <option>Facebook</option>
                        <option>LinkedIn</option>
                        <option>TikTok</option>
                        <option>Twitter</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="14"
                          height="9"
                          viewBox="0 0 14 9"
                          fill="none"
                        >
                          <path
                            d="M1 1.5L7 7.5L13 1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Idea Button */}
                <div className="mb-8">
                  <button
                    className="flex items-center gap-2 transition-all hover:opacity-90"
                    style={{
                      padding: "12px 24px",
                      borderRadius: "24px",
                      background:
                        "linear-gradient(135deg, #D4A855 0%, #CEA54F 100%)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 12px rgba(206, 165, 79, 0.4)",
                    }}
                  >
                    <Sparkles size={16} />
                    <span>+ Generate Idea</span>
                  </button>
                </div>

                {/* Suggested Hashtags */}
                <div
                  style={{
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "24px",
                    backgroundColor: "#FFFFFF",
                    marginBottom: "28px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "6px",
                    }}
                  >
                    Suggested Hashtags
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#9CA3AF",
                      marginBottom: "18px",
                    }}
                  >
                    Click to copy
                  </p>

                  {/* Hashtags Grid */}
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      "#hairstyle",
                      "#Salon",
                      "#Haircare",
                      "#Beauty",
                      "#Hairstyle",
                      "#hairstyle",
                      "#Salon",
                      "#Haircare",
                      "#Beauty",
                      "#Hairstyle",
                    ].map((hashtag, index) => (
                      <button
                        key={index}
                        className="transition-all hover:bg-[#D1D5DB] hover:scale-105"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "20px",
                          backgroundColor: "#F3F4F6",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#4B5563",
                          border: "1px solid #E5E7EB",
                          cursor: "pointer",
                        }}
                        onClick={() => navigator.clipboard.writeText(hashtag)}
                      >
                        {hashtag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Date & Time */}
                <div>
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#202020",
                      marginBottom: "12px",
                    }}
                  >
                    Select Date & Time
                  </h3>
                  {/* Date and time inputs would go here */}
                </div>
              </>
            )}
          </div>

          {/* Content Cards Grid - Only show for AI Ideas tab */}
          {activeTab === "ai-ideas" && (
            <div
              className="mt-8"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {contentCards.map((card) => (
                <div
                  key={card.id}
                  className="overflow-hidden"
                  style={{
                    backgroundColor: "#F5F3F0",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #E8E5E0",
                  }}
                  data-testid={`card-content-${card.id}`}
                >
                  {/* Card Image - With padding */}
                  <div style={{ padding: "12px 12px 0 12px" }}>
                    <div
                      className="w-full overflow-hidden"
                      style={{
                        aspectRatio: "4/3",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        data-testid={`img-content-${card.id}`}
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: "16px" }}>
                    {/* Title */}
                    <h3
                      className="line-clamp-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1F2937",
                        lineHeight: "1.4",
                        marginBottom: "8px",
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
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#6B7280",
                        lineHeight: "1.5",
                        marginBottom: "12px",
                      }}
                      data-testid={`text-description-${card.id}`}
                    >
                      {card.description}
                    </p>

                    {/* Hashtags */}
                    <div
                      className="flex flex-wrap gap-2"
                      style={{ marginBottom: "14px" }}
                    >
                      {card.hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "5px 12px",
                            borderRadius: "16px",
                            backgroundColor: "#E8E5E0",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
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
                          padding: "11px 16px",
                          borderRadius: "24px",
                          backgroundColor: "#CEA54F",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#FFFFFF",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(206, 165, 79, 0.4)",
                          whiteSpace: "nowrap",
                        }}
                        data-testid={`button-generate-caption-${card.id}`}
                      >
                        Generate Caption
                      </button>
                      <button
                        className="flex-1 transition-all hover:opacity-90"
                        style={{
                          padding: "11px 16px",
                          borderRadius: "24px",
                          backgroundColor: "#E8DCC8",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#6B5A3D",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(232, 220, 200, 0.5)",
                          whiteSpace: "nowrap",
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
