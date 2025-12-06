import { DashboardLayout } from "@/components/dashboard-layout";
import { User, Share2, Bell, Settings as SettingsIcon, CreditCard } from "lucide-react";
import { useLocation } from "wouter";

export default function Settings() {
  const [, setLocation] = useLocation();
  const settingsSections = [
    {
      id: "accounts",
      label: "Accounts",
      icon: User,
      path: "/settings/accounts",
    },
    {
      id: "brandings",
      label: "Brandings",
      icon: Share2,
      path: "/settings/brandings",
    },
    {
      id: "notification",
      label: "Notification",
      icon: Bell,
      path: "/settings/notification",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: SettingsIcon,
      path: "/settings/integrations",
    },
    {
      id: "billings",
      label: "Billings",
      icon: CreditCard,
      path: "/settings/billings",
    },
  ];

  const handleSectionClick = (path: string) => {
    setLocation(path);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Single Card containing Header and Settings Options */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Page Header */}
          <div className="mb-5 pb-5" style={{ borderBottom: "1px solid #E5E7EB" }}>
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
              Manage your account information and security
            </p>
          </div>

          {/* Settings Options */}
          <div className="space-y-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.path)}
                  className="w-full flex items-center gap-3 rounded-lg transition-all hover:bg-gray-100"
                  style={{
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    cursor: "pointer",
                    padding: "14px 16px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#E5E7EB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                  }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <Icon size={18} color="#202020" strokeWidth={2} />
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                  >
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
