import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, CreditCard, Zap } from "lucide-react";
import { useLocation } from "wouter";
import downloadIcon from "../../../attached_assets/document.png";
import documentDownloadIcon from "../../../attached_assets/document-download.png";

export default function BillingSettings() {
  const [, setLocation] = useLocation();

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
                Billing & Subscription
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

          {/* Billing & Subscription Section */}
          <div
            className="rounded-xl p-4 md:p-5"
            style={{
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
              Billing & Subscription
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
              Manage your plan and payment information
            </p>

            {/* Content */}
            <div className="space-y-3">
              {/* Pro Plan Card */}
              <div
                className="rounded-xl px-4 py-3 md:px-5 md:py-4"
                style={{
                  backgroundColor: "#F2F2F2",
                  border: "1px solid #DADADA",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={16} fill="#CEA64F" color="#CEA64F" />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#CEA64F",
                      }}
                    >
                      Pro Plan
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#6B7280",
                      backgroundColor: "#E5E7EB",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Active
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                    >
                      Renewal Date
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#202020",
                      }}
                    >
                      November 7, 2025
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                    >
                      Next Payment:
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#202020",
                      }}
                    >
                      $49.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div
                className="rounded-xl px-4 py-3 md:px-5 md:py-4 flex items-center justify-between gap-3"
                style={{
                  backgroundColor: "#F2F2F2",
                  border: "1px solid #DADADA",
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "40px",
                      height: "40px",
                      background:
                        "linear-gradient(135deg, #CEA64F 0%, #AF7700 100%)",
                      borderRadius: "8px",
                    }}
                  >
                    <CreditCard size={20} color="#FFFFFF" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h4
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#202020",
                        marginBottom: "2px",
                      }}
                    >
                      •••• •••• •••• 4242
                    </h4>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      Expires 12/2025
                    </p>
                  </div>
                </div>
                <button
                  className="transition-all flex-shrink-0"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#6B7280",
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    padding: "6px 16px",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffffaa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  Update
                </button>
              </div>

              {/* Download Invoices */}
              <button
                onClick={() => setLocation("/settings/billings/invoice")}
                className="w-full rounded-xl px-4 py-3 md:px-5 md:py-4 flex items-center justify-between gap-3 transition-all"
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
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "#202020",
                      borderRadius: "50%",
                    }}
                  >
                    <img
                      src={documentDownloadIcon}
                      alt="Download"
                      style={{ width: "14px", height: "14px" }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#202020",
                    }}
                  >
                    Download Invoices
                  </span>
                </div>
                <img
                  src={downloadIcon}
                  alt="Download"
                  style={{ width: "16px", height: "16px" }}
                />
              </button>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Upgrade Plan */}
                <button
                  className="rounded-xl px-4 py-3 md:px-5 md:py-4 transition-all"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#202020",
                    backgroundColor: "#E5E7EB",
                    border: "1px solid #DADADA",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#D1D5DB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#E5E7EB";
                  }}
                >
                  Upgrade Plan
                </button>

                {/* Cancel Subscription */}
                <button
                  className="rounded-xl px-4 py-3 md:px-5 md:py-4 transition-all"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#EF4444",
                    backgroundColor: "#E5E7EB",
                    border: "1px solid #DADADA",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FEE2E2";
                    e.currentTarget.style.borderColor = "#EF4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#E5E7EB";
                    e.currentTarget.style.borderColor = "#DADADA";
                  }}
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
