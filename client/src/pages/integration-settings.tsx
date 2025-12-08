import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function IntegrationSettings() {
  const [, setLocation] = useLocation();

  const [autoPost, setAutoPost] = useState(true);

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      className="transition-all duration-300"
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        backgroundColor: checked ? "#202020" : "#E5E7EB",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        padding: "2px",
        flexShrink: 0,
      }}
      onClick={onChange}
    >
      <div
        className="transition-all duration-300"
        style={{
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          width: "20px",
          height: "20px",
          backgroundColor: "#FFFFFF",
          borderRadius: "50%",
        }}
      />
    </button>
  );

  const InstagramIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="url(#instagram-gradient)" />
      <path
        d="M20 14.5C22.485 14.5 22.785 14.51 23.71 14.55C24.56 14.585 25.025 14.73 25.34 14.85C25.765 15.015 26.07 15.21 26.39 15.53C26.71 15.85 26.905 16.155 27.07 16.58C27.19 16.895 27.335 17.36 27.37 18.21C27.41 19.135 27.42 19.435 27.42 21.92C27.42 24.405 27.41 24.705 27.37 25.63C27.335 26.48 27.19 26.945 27.07 27.26C26.905 27.685 26.71 27.99 26.39 28.31C26.07 28.63 25.765 28.825 25.34 28.99C25.025 29.11 24.56 29.255 23.71 29.29C22.785 29.33 22.485 29.34 20 29.34C17.515 29.34 17.215 29.33 16.29 29.29C15.44 29.255 14.975 29.11 14.66 28.99C14.235 28.825 13.93 28.63 13.61 28.31C13.29 27.99 13.095 27.685 12.93 27.26C12.81 26.945 12.665 26.48 12.63 25.63C12.59 24.705 12.58 24.405 12.58 21.92C12.58 19.435 12.59 19.135 12.63 18.21C12.665 17.36 12.81 16.895 12.93 16.58C13.095 16.155 13.29 15.85 13.61 15.53C13.93 15.21 14.235 15.015 14.66 14.85C14.975 14.73 15.44 14.585 16.29 14.55C17.215 14.51 17.515 14.5 20 14.5ZM20 13C17.48 13 17.16 13.01 16.22 13.055C15.285 13.095 14.64 13.245 14.08 13.465C13.5 13.695 13.01 14.005 12.525 14.49C12.04 14.975 11.73 15.465 11.5 16.045C11.28 16.605 11.13 17.25 11.09 18.185C11.05 19.125 11.04 19.445 11.04 21.965C11.04 24.485 11.05 24.805 11.09 25.745C11.13 26.68 11.28 27.325 11.5 27.885C11.73 28.465 12.04 28.955 12.525 29.44C13.01 29.925 13.5 30.235 14.08 30.465C14.64 30.685 15.285 30.835 16.22 30.875C17.16 30.915 17.48 30.93 20 30.93C22.52 30.93 22.84 30.92 23.78 30.875C24.715 30.835 25.36 30.685 25.92 30.465C26.5 30.235 26.99 29.925 27.475 29.44C27.96 28.955 28.27 28.465 28.5 27.885C28.72 27.325 28.87 26.68 28.91 25.745C28.95 24.805 28.96 24.485 28.96 21.965C28.96 19.445 28.95 19.125 28.91 18.185C28.87 17.25 28.72 16.605 28.5 16.045C28.27 15.465 27.96 14.975 27.475 14.49C26.99 14.005 26.5 13.695 25.92 13.465C25.36 13.245 24.715 13.095 23.78 13.055C22.84 13.015 22.52 13 20 13Z"
        fill="white"
      />
      <path
        d="M20 17.38C17.37 17.38 15.245 19.505 15.245 22.135C15.245 24.765 17.37 26.89 20 26.89C22.63 26.89 24.755 24.765 24.755 22.135C24.755 19.505 22.63 17.38 20 17.38ZM20 25.335C18.23 25.335 16.8 23.905 16.8 22.135C16.8 20.365 18.23 18.935 20 18.935C21.77 18.935 23.2 20.365 23.2 22.135C23.2 23.905 21.77 25.335 20 25.335Z"
        fill="white"
      />
      <circle cx="24.945" cy="17.19" r="0.885" fill="white" />
      <defs>
        <linearGradient id="instagram-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CEA64F" />
          <stop offset="1" stopColor="#AF7700" />
        </linearGradient>
      </defs>
    </svg>
  );

  const FacebookIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="url(#facebook-gradient)" />
      <path
        d="M27.5 20.0625C27.5 15.625 23.8625 12 19.375 12C14.8875 12 11.25 15.625 11.25 20.0625C11.25 24.05 14.1125 27.375 17.9 28V21.9625H15.6875V20.0625H17.9V18.6625C17.9 16.475 19.025 15.4375 21.0375 15.4375C22 15.4375 23.0125 15.6125 23.0125 15.6125V17.775H21.9C20.8 17.775 20.45 18.425 20.45 19.0875V20.0625H22.9125L22.5125 21.9625H20.45V28C24.2375 27.375 27.5 24.05 27.5 20.0625Z"
        fill="white"
      />
      <defs>
        <linearGradient id="facebook-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CEA64F" />
          <stop offset="1" stopColor="#AF7700" />
        </linearGradient>
      </defs>
    </svg>
  );

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
          <div
            className="mb-5 pb-5"
            style={{ borderBottom: "1px solid #E5E7EB" }}
          >
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
                Social Integrations
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
          </div>

          {/* Social Integrations Section */}
          <div
            className="rounded-xl p-4 md:p-5"
            style={{
              backgroundColor: "#F9F9F9",
              border: "1px solid #E5E7EB",
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
              Social Integrations
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "#6B7280",
                marginBottom: "16px",
              }}
              className="md:mb-5"
            >
              Manage your connected platforms and posting settings
            </p>

            {/* Integration Cards Grid */}
            <div className="space-y-3">
              {/* Row 1: Instagram and Facebook */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Instagram */}
                <div
                  className="rounded-xl px-4 py-3 md:px-5 md:py-4 flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #DADADA",
                  }}
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <InstagramIcon />
                    </div>
                    <div className="min-w-0">
                      <h4
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#202020",
                          marginBottom: "2px",
                        }}
                      >
                        Instagram
                      </h4>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#6B7280",
                          backgroundColor: "#E5E7EB",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Connected
                      </span>
                    </div>
                  </div>
                  <button
                    className="transition-colors flex-shrink-0"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#6B7280",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#202020";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6B7280";
                    }}
                  >
                    Disconnect
                  </button>
                </div>

                {/* Facebook */}
                <div
                  className="rounded-xl px-4 py-3 md:px-5 md:py-4 flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #DADADA",
                  }}
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <FacebookIcon />
                    </div>
                    <div className="min-w-0">
                      <h4
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#202020",
                          marginBottom: "2px",
                        }}
                      >
                        Facebook
                      </h4>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#6B7280",
                          backgroundColor: "#E5E7EB",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Connected
                      </span>
                    </div>
                  </div>
                  <button
                    className="transition-colors flex-shrink-0"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#6B7280",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px 8px",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#202020";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#6B7280";
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Row 2: Auto-Post and Add New Connection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Auto-Post */}
                <div
                  className="rounded-xl px-4 py-3 md:p-5 flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #DADADA",
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <h4
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#202020",
                        marginBottom: "4px",
                      }}
                    >
                      Auto-Post
                    </h4>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      Automatically publish scheduled posts to all platforms
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <ToggleSwitch
                      checked={autoPost}
                      onChange={() => setAutoPost(!autoPost)}
                    />
                  </div>
                </div>

                {/* Add New Connection */}
                <button
                  className="rounded-xl px-4 py-3 md:p-5 flex items-center justify-center gap-2 transition-all"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DADADA",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F2F2F2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "#202020",
                      borderRadius: "50%",
                    }}
                  >
                    <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#202020",
                    }}
                  >
                    Add New Connection
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
