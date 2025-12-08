import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

export default function NotificationSettings() {
  const [, setLocation] = useLocation();

  const [notifications, setNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [postSchedulingReminders, setPostSchedulingReminders] = useState(true);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState(true);
  const [aiTipsTrends, setAiTipsTrends] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState("Weekly");
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);

  const emailFrequencyOptions = [
    { id: "daily", label: "Daily", value: "Daily" },
    { id: "weekly", label: "Weekly", value: "Weekly" },
    { id: "monthly", label: "Monthly", value: "Monthly" },
  ];

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
                Notifications
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

          {/* Settings Sections */}
          <div className="space-y-4">
            {/* Row 1: Notifications and Push Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Notifications */}
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
                      Notifications
                    </h3>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      Manage how you receive updates and alerts
                    </p>
                  </div>
                  <ToggleSwitch checked={notifications} onChange={() => setNotifications(!notifications)} />
                </div>
              </div>

              {/* Push Notifications */}
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
                      Push Notifications
                    </h3>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      Receive notifications on your device
                    </p>
                  </div>
                  <ToggleSwitch checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
                </div>
              </div>
            </div>

            {/* Email Updates */}
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
                    Email Updates
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#6B7280",
                    }}
                  >
                    Get updates via email
                  </p>
                </div>
                <ToggleSwitch checked={emailUpdates} onChange={() => setEmailUpdates(!emailUpdates)} />
              </div>
            </div>

            {/* Reminder Preferences */}
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
                Reminder Preferences
              </h3>

              <div className="space-y-3 mt-4">
                {/* Post Scheduling Reminders */}
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                  >
                    Post Scheduling Reminders
                  </span>
                  <ToggleSwitch
                    checked={postSchedulingReminders}
                    onChange={() => setPostSchedulingReminders(!postSchedulingReminders)}
                  />
                </div>

                {/* Weekly Analytics Summary */}
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                  >
                    Weekly Analytics Summary
                  </span>
                  <ToggleSwitch checked={weeklyAnalytics} onChange={() => setWeeklyAnalytics(!weeklyAnalytics)} />
                </div>

                {/* AI Tips & Trends */}
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                  >
                    AI Tips & Trends
                  </span>
                  <ToggleSwitch checked={aiTipsTrends} onChange={() => setAiTipsTrends(!aiTipsTrends)} />
                </div>
              </div>
            </div>

            {/* Email Frequency */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "#F2F2F2",
                border: "1px solid #DADADA",
                position: "relative",
              }}
            >
              <button
                onClick={() => setEmailDropdownOpen(!emailDropdownOpen)}
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
                    Email Frequently
                  </h3>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#6B7280",
                    }}
                  >
                    {emailFrequency}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  color="#6B7280"
                  style={{
                    transform: emailDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {emailDropdownOpen && (
                <div
                  className="mt-3"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    overflow: "hidden",
                  }}
                >
                  {emailFrequencyOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setEmailFrequency(option.value);
                        setEmailDropdownOpen(false);
                      }}
                      className="w-full transition-colors"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: emailFrequency === option.value ? "#202020" : "#6B7280",
                        backgroundColor: emailFrequency === option.value ? "#F3F4F6" : "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        padding: "12px 16px",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        if (emailFrequency !== option.value) {
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (emailFrequency !== option.value) {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      {option.label}
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
