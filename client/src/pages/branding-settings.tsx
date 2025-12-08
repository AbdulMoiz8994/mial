import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, ChevronDown, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function BrandingSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [selectedColor, setSelectedColor] = useState("#8B5CF6"); // Purple default
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [selectedFont, setSelectedFont] = useState("Modern Sans");
  const [selectedTone, setSelectedTone] = useState("Friendly & Warm");
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [toneDropdownOpen, setToneDropdownOpen] = useState(false);

  const accentColors = [
    { id: "purple", color: "#8B5CF6" },
    { id: "pink", color: "#EC4899" },
    { id: "teal", color: "#14B8A6" },
    { id: "cyan", color: "#06B6D4" },
    { id: "orange", color: "#F59E0B" },
  ];

  const fontOptions = [
    { id: "modern", label: "Modern Sans", value: "Modern Sans" },
    { id: "classic", label: "Classic Serif", value: "Classic Serif" },
    { id: "playful", label: "Playful Round", value: "Playful Round" },
  ];

  const toneOptions = [
    { id: "friendly", label: "Friendly & Warm", value: "Friendly & Warm" },
    { id: "professional", label: "Professional", value: "Professional" },
    { id: "casual", label: "Casual & Fun", value: "Casual & Fun" },
  ];

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your branding preferences have been updated successfully",
    });
  };

  const handleReset = () => {
    setSelectedColor("#8B5CF6");
    setThemeMode("light");
    setSelectedFont("Modern Sans");
    setSelectedTone("Friendly & Warm");
    toast({
      title: "Settings Reset",
      description: "Your branding preferences have been reset to defaults",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Single Card containing all content */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #DDDDDD",
          }}
        >
          {/* Back Button + Header */}
          <div className="mb-5 pb-5" style={{ borderBottom: "1px solid #E5E7EB" }}>
            <button
              onClick={() => setLocation("/settings")}
              className="flex items-center gap-2 mb-4 transition-colors hover:opacity-70"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ChevronLeft size={20} color="#6B7280" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6B7280",
                }}
              >
                Back to Settings
              </span>
            </button>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#202020",
                    marginBottom: "4px",
                  }}
                >
                  Branding Settings
                </h1>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#6B7280",
                  }}
                >
                  Manage your preferences, integrations, and app controls
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <button
                  className="flex items-center gap-2 transition-all"
                  onClick={handleSave}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    background: "linear-gradient(135deg, #CEA54F 0%, #D4AF6A 100%)",
                    border: "none",
                    borderRadius: "24px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(206, 165, 79, 0.3)",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <Zap size={14} fill="#FFFFFF" />
                  <span className="hidden sm:inline">Pro Plan</span>
                  <span className="sm:hidden">Pro</span>
                </button>

                <button
                  className="flex items-center gap-2 transition-all"
                  onClick={handleReset}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#6B7280",
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    borderRadius: "24px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#E5E7EB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                  }}
                >
                  Reset
                </button>

                <button
                  className="transition-all"
                  onClick={handleSave}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    backgroundColor: "#202020",
                    border: "none",
                    borderRadius: "24px",
                    padding: "8px 24px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1A1A1A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#202020";
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-4">
            {/* Row 1: Brand & Personalization and Theme Mode */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Brand & Personalization */}
              <div
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "#F2F2F2",
                  border: "1px solid #DADADA",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#202020",
                    marginBottom: "4px",
                  }}
                >
                  Brand & Personalization
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#6B7280",
                  }}
                >
                  Customize the look and feel of your content
                </p>
              </div>

              {/* Theme Mode */}
              <div
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "#F2F2F2",
                  border: "1px solid #DADADA",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#202020",
                        marginBottom: "4px",
                      }}
                    >
                      Theme Mode
                    </h3>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <button
                    className="transition-all duration-300"
                    style={{
                      position: "relative",
                      width: "72px",
                      height: "36px",
                      backgroundColor: themeMode === "light" ? "#E5E7EB" : "#202020",
                      border: "none",
                      borderRadius: "18px",
                      cursor: "pointer",
                      padding: "3px",
                    }}
                    onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                  >
                    {/* Toggle Circle with Icon */}
                    <div
                      className="transition-all duration-300"
                      style={{
                        position: "absolute",
                        top: "3px",
                        left: themeMode === "light" ? "3px" : "39px",
                        width: "30px",
                        height: "30px",
                        backgroundColor: themeMode === "light" ? "#202020" : "#FFFFFF",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="3.5"
                          fill="none"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                        />
                        <line
                          x1="10"
                          y1="2"
                          x2="10"
                          y2="4"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="10"
                          y1="16"
                          x2="10"
                          y2="18"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="4.93"
                          y1="4.93"
                          x2="6.34"
                          y2="6.34"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="13.66"
                          y1="13.66"
                          x2="15.07"
                          y2="15.07"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="2"
                          y1="10"
                          x2="4"
                          y2="10"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="16"
                          y1="10"
                          x2="18"
                          y2="10"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="4.93"
                          y1="15.07"
                          x2="6.34"
                          y2="13.66"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <line
                          x1="13.66"
                          y1="6.34"
                          x2="15.07"
                          y2="4.93"
                          stroke={themeMode === "light" ? "#FFFFFF" : "#202020"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Accent Color */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "#F2F2F2",
                border: "1px solid #DADADA",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#202020",
                      marginBottom: "4px",
                    }}
                  >
                    Accent Color
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#6B7280",
                    }}
                  >
                    This color will be used throughout your brand materials
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {accentColors.map((colorOption) => (
                    <button
                      key={colorOption.id}
                      onClick={() => setSelectedColor(colorOption.color)}
                      className="transition-all flex-shrink-0"
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: selectedColor === colorOption.color ? "#FFFFFF" : "transparent",
                        border: selectedColor === colorOption.color ? "2px solid #202020" : "none",
                        cursor: "pointer",
                        padding: selectedColor === colorOption.color ? "6px" : "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: selectedColor === colorOption.color ? "28px" : "40px",
                          height: selectedColor === colorOption.color ? "28px" : "40px",
                          borderRadius: "50%",
                          backgroundColor: colorOption.color,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Default Modern Style */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "#F2F2F2",
                border: "1px solid #DADADA",
                position: "relative",
              }}
            >
              <button
                onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                className="w-full flex items-center justify-between"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#202020",
                      marginBottom: "4px",
                    }}
                  >
                    Default Modern Style
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#6B7280",
                    }}
                  >
                    {selectedFont}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  color="#6B7280"
                  style={{
                    transform: fontDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {fontDropdownOpen && (
                <div
                  className="mt-3"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                  }}
                >
                  {fontOptions.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => {
                        setSelectedFont(font.value);
                        setFontDropdownOpen(false);
                      }}
                      className="w-full transition-colors"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: selectedFont === font.value ? "#202020" : "#6B7280",
                        backgroundColor: selectedFont === font.value ? "#F3F4F6" : "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        padding: "12px 16px",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFont !== font.value) {
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFont !== font.value) {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Tone of Voice */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "#F2F2F2",
                border: "1px solid #DADADA",
                position: "relative",
              }}
            >
              <button
                onClick={() => setToneDropdownOpen(!toneDropdownOpen)}
                className="w-full flex items-center justify-between"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#202020",
                      marginBottom: "4px",
                    }}
                  >
                    AI Tone of Voice
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#6B7280",
                    }}
                  >
                    {selectedTone}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  color="#6B7280"
                  style={{
                    transform: toneDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {toneDropdownOpen && (
                <div
                  className="mt-3"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                  }}
                >
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => {
                        setSelectedTone(tone.value);
                        setToneDropdownOpen(false);
                      }}
                      className="w-full transition-colors"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: selectedTone === tone.value ? "#202020" : "#6B7280",
                        backgroundColor: selectedTone === tone.value ? "#F3F4F6" : "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        padding: "12px 16px",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTone !== tone.value) {
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTone !== tone.value) {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
