import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus, MoreHorizontal, PenSquare, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Content Performance Header Card */}
        <div
          className="bg-white rounded-xl p-5"
          style={{
            border: "1px solid #E5E7EB",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "2px",
                }}
                data-testid="text-content-performance"
              >
                Content Performance
              </h2>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#9CA3AF",
                }}
                data-testid="text-performance-subtitle"
              >
                Displaying the data from June 2025
              </p>
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                height: "40px",
                background: "linear-gradient(135deg, #CEA54F 0%, #D4AF6A 100%)",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#FFFFFF",
                boxShadow: "0 2px 8px rgba(206, 165, 79, 0.25)",
              }}
              data-testid="button-start-new-post"
            >
              <Plus size={18} />
              Start New Post
            </button>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Posts Published */}
          <div
            className="bg-white rounded-xl p-5"
            style={{
              border: "1px solid #E5E7EB",
            }}
            data-testid="card-posts-published"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#F3F4F6",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="5"
                    width="14"
                    height="12"
                    rx="2"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 3V5M14 3V5"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <button
                className="flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                style={{
                  width: "32px",
                  height: "32px",
                }}
                data-testid="button-more-posts"
              >
                <MoreHorizontal size={16} color="#9CA3AF" />
              </button>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Posts Published this Month
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                  data-testid="text-posts-count"
                >
                  $ 1,284.00
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} color="#10B981" />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#10B981",
                  }}
                >
                  11%
                </span>
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div
            className="bg-white rounded-xl p-5"
            style={{
              border: "1px solid #E5E7EB",
            }}
            data-testid="card-engagement-rate"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#F3F4F6",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 6V10L13 12"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <button
                className="flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                style={{
                  width: "32px",
                  height: "32px",
                }}
                data-testid="button-more-engagement"
              >
                <MoreHorizontal size={16} color="#9CA3AF" />
              </button>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Engagement Rate
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                  data-testid="text-engagement-rate"
                >
                  7.81
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={14} color="#EF4444" />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#EF4444",
                  }}
                >
                  0%
                </span>
              </div>
            </div>
          </div>

          {/* Best Performing Channel */}
          <div
            className="bg-white rounded-xl p-5"
            style={{
              border: "1px solid #E5E7EB",
            }}
            data-testid="card-best-channel"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#F3F4F6",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="8"
                    width="4"
                    height="9"
                    rx="1"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="8"
                    y="5"
                    width="4"
                    height="12"
                    rx="1"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="13"
                    y="3"
                    width="4"
                    height="14"
                    rx="1"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded-lg"
                  style={{
                    height: "28px",
                    background: "linear-gradient(135deg, #CEA54F 0%, #D4AF6A 100%)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                  }}
                  data-testid="button-create-post"
                >
                  <PenSquare size={12} />
                  Create Post
                </button>
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Best Performing Channel
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                  data-testid="text-best-channel"
                >
                  7.81
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp size={14} color="#10B981" />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#10B981",
                  }}
                >
                  1.7%
                </span>
              </div>
            </div>
          </div>

          {/* Next Scheduled Post Card */}
          <div
            className="bg-white rounded-xl p-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
            data-testid="card-next-scheduled"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-1">
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                >
                  8
                </span>
              </div>

              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="8"
                  width="4"
                  height="9"
                  rx="1"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                />
                <rect
                  x="8"
                  y="5"
                  width="4"
                  height="12"
                  rx="1"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                />
                <rect
                  x="13"
                  y="3"
                  width="4"
                  height="14"
                  rx="1"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="mb-3">
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#6B7280",
                  marginBottom: "2px",
                }}
              >
                Actions
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "4px",
                }}
                data-testid="text-next-scheduled-post"
              >
                Next Scheduled Post
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 400,
                  color: "#9CA3AF",
                }}
              >
                Receive update
              </p>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all"
              style={{
                height: "32px",
                background: "linear-gradient(135deg, #CEA54F 0%, #D4AF6A 100%)",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#FFFFFF",
              }}
              data-testid="button-create-post-small"
            >
              <PenSquare size={12} />
              Create Post
            </button>
          </div>
        </div>

        {/* Next Post Scheduled Section */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#202020",
                marginBottom: "2px",
              }}
              data-testid="text-next-post-scheduled"
            >
              Next Post Scheduled
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "#9CA3AF",
              }}
              data-testid="text-scheduled-time"
            >
              Tomorrow at 2:00 PM
            </p>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              height: "40px",
              backgroundColor: "#202020",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#FFFFFF",
            }}
            data-testid="button-edit-post"
          >
            <PenSquare size={18} />
            Edit Post
          </button>
        </div>

        {/* Post Preview */}
        <div
          className="bg-white rounded-xl p-5 flex gap-4"
          style={{
            border: "1px solid #E5E7EB",
          }}
          data-testid="card-post-preview"
        >
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop"
            alt="Post preview"
            className="rounded-lg object-cover"
            style={{
              width: "120px",
              height: "120px",
            }}
            data-testid="img-post-preview"
          />

          <div className="flex-1">
            <h3
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#202020",
                marginBottom: "4px",
              }}
              data-testid="text-post-title"
            >
              5 Essential Hair Care Tips for Healthy Hair
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "#6B7280",
              }}
              data-testid="text-post-schedule"
            >
              Tomorrow at 2:00 PM
            </p>
          </div>
        </div>

        {/* Engagement Over Time Section */}
        <div className="flex items-center justify-between mb-3">
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 600,
              color: "#202020",
            }}
            data-testid="text-engagement-over-time"
          >
            Engagement Over Time
          </h2>

          <div className="flex items-center gap-2">
            {/* Time Period Toggle */}
            <div
              className="inline-flex items-center rounded-lg p-1"
              style={{
                backgroundColor: "#F3F4F6",
              }}
            >
              {["Daily", "Weekly", "Monthly"].map((period) => (
                <button
                  key={period}
                  className="px-4 py-2 rounded-md transition-all"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    backgroundColor:
                      period === "Monthly" ? "#202020" : "transparent",
                    color: period === "Monthly" ? "#FFFFFF" : "#6B7280",
                  }}
                  data-testid={`button-period-${period.toLowerCase()}`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* View Total Sales */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 transition-all"
              style={{
                height: "40px",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#6B7280",
              }}
              data-testid="button-view-total-sales"
            >
              View Total Sales
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6H9M9 6L6 3M9 6L6 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #E5E7EB",
            height: "400px",
          }}
          data-testid="card-chart"
        >
          <div className="w-full h-full flex items-center justify-center">
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#9CA3AF",
              }}
            >
              Chart visualization will be displayed here
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
