import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, ShieldAlert, UserX } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AccountSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    email: "",
    language: "",
    timezone: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFieldActive = (field: keyof typeof formData) => {
    return focusedField === field || formData[field] !== "";
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change functionality coming soon",
    });
  };

  const handleDeactivateAccount = () => {
    toast({
      title: "Deactivate Account",
      description: "Are you sure you want to deactivate your account?",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Single Card containing all content */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #E5E7EB",
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

            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#202020",
                marginBottom: "4px",
              }}
            >
              Account Settings
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

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            {/* Full Name and Phone No - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: isFieldActive("fullName") ? "-8px" : "10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: isFieldActive("fullName") ? "12px" : "14px",
                    fontWeight: 500,
                    color: focusedField === "fullName" ? "#CEA54F" : "#6B7280",
                    backgroundColor: "#FFFFFF",
                    padding: "0 4px",
                    transition: "all 0.2s ease",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: "100%",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#202020",
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${focusedField === "fullName" ? "#CEA54F" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    padding: "10px 14px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>

              {/* Phone No */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: isFieldActive("phoneNo") ? "-8px" : "10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: isFieldActive("phoneNo") ? "12px" : "14px",
                    fontWeight: 500,
                    color: focusedField === "phoneNo" ? "#CEA54F" : "#6B7280",
                    backgroundColor: "#FFFFFF",
                    padding: "0 4px",
                    transition: "all 0.2s ease",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  Phone No.
                </label>
                <input
                  type="tel"
                  value={formData.phoneNo}
                  onChange={(e) => handleInputChange("phoneNo", e.target.value)}
                  onFocus={() => setFocusedField("phoneNo")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: "100%",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#202020",
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${focusedField === "phoneNo" ? "#CEA54F" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    padding: "10px 14px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  position: "absolute",
                  left: "14px",
                  top: isFieldActive("email") ? "-8px" : "10px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: isFieldActive("email") ? "12px" : "14px",
                  fontWeight: 500,
                  color: focusedField === "email" ? "#CEA54F" : "#6B7280",
                  backgroundColor: "#FFFFFF",
                  padding: "0 4px",
                  transition: "all 0.2s ease",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: "100%",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#202020",
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${focusedField === "email" ? "#CEA54F" : "#E5E7EB"}`,
                  borderRadius: "8px",
                  padding: "10px 14px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            {/* Language and Timezone - Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Language */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: isFieldActive("language") ? "-8px" : "10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: isFieldActive("language") ? "12px" : "14px",
                    fontWeight: 500,
                    color: focusedField === "language" ? "#CEA54F" : "#6B7280",
                    backgroundColor: "#FFFFFF",
                    padding: "0 4px",
                    transition: "all 0.2s ease",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  Language
                </label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  onFocus={() => setFocusedField("language")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: "100%",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#202020",
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${focusedField === "language" ? "#CEA54F" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    padding: "10px 14px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>

              {/* Timezone */}
              <div style={{ position: "relative" }}>
                <label
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: isFieldActive("timezone") ? "-8px" : "10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: isFieldActive("timezone") ? "12px" : "14px",
                    fontWeight: 500,
                    color: focusedField === "timezone" ? "#CEA54F" : "#6B7280",
                    backgroundColor: "#FFFFFF",
                    padding: "0 4px",
                    transition: "all 0.2s ease",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                  onFocus={() => setFocusedField("timezone")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: "100%",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#202020",
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${focusedField === "timezone" ? "#CEA54F" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    padding: "10px 14px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Change Password Button */}
          <button
            onClick={handleChangePassword}
            className="w-full flex items-center gap-3 transition-all mb-3"
            style={{
              backgroundColor: "#F3F4F6",
              border: "1px solid #E5E7EB",
              cursor: "pointer",
              padding: "14px 16px",
              borderRadius: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E5E7EB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6";
            }}
          >
            <ShieldAlert size={18} color="#202020" strokeWidth={2} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: "#202020",
              }}
            >
              Change Password
            </span>
          </button>

          {/* Deactivate Account Button */}
          <button
            onClick={handleDeactivateAccount}
            className="w-full flex items-center gap-3 transition-all"
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #EF4444",
              cursor: "pointer",
              padding: "14px 16px",
              borderRadius: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FEE2E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FEF2F2";
            }}
          >
            <UserX size={18} color="#EF4444" strokeWidth={2} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: "#EF4444",
              }}
            >
              Deactivate Account
            </span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
