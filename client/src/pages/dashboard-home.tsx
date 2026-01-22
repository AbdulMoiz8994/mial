import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus, MoreHorizontal, TrendingUp, TrendingDown, Maximize2, ChevronDown, X, Minimize2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const monthlyData = [
  { name: "2 Jun", engagement: 1300, reach: 900 },
  { name: "9 Jun", engagement: 1300, reach: 900 },
  { name: "15 Jun", engagement: 1950, reach: 950 },
  { name: "21 Jun", engagement: 1500, reach: 900 },
  { name: "28 Jun", engagement: 1700, reach: 850 },
];

const weeklyData = [
  { name: "Mon", engagement: 1100, reach: 750 },
  { name: "Tue", engagement: 1350, reach: 820 },
  { name: "Wed", engagement: 1800, reach: 950 },
  { name: "Thu", engagement: 1650, reach: 880 },
  { name: "Fri", engagement: 1950, reach: 1050 },
  { name: "Sat", engagement: 2100, reach: 1200 },
  { name: "Sun", engagement: 1750, reach: 980 },
];

const dailyData = [
  { name: "6AM", engagement: 450, reach: 280 },
  { name: "9AM", engagement: 850, reach: 520 },
  { name: "12PM", engagement: 1450, reach: 920 },
  { name: "3PM", engagement: 1850, reach: 1150 },
  { name: "6PM", engagement: 2200, reach: 1380 },
  { name: "9PM", engagement: 1650, reach: 980 },
  { name: "12AM", engagement: 750, reach: 420 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#202020",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "#CEA54F",
            marginBottom: "4px",
          }}
        >
          Engagement
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#FFFFFF",
            marginBottom: "8px",
          }}
        >
          {payload[0]?.value?.toLocaleString()}
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "#9CA3AF",
            marginBottom: "4px",
          }}
        >
          • Reach
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#FFFFFF",
          }}
        >
          {payload[1]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardHome() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Monthly");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check for payment success on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');

    if (paymentStatus === 'success') {
      // Show success toast
      toast({
        title: "Payment Successful!",
        description: "Your subscription is now active. Welcome aboard!",
      });

      // Refresh subscription data to get the latest info
      refreshSubscription();

      // Clean up the URL by removing the query parameter after a short delay
      setTimeout(() => {
        window.history.replaceState({}, '', '/home');
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChartData = () => {
    switch (selectedPeriod) {
      case "Daily":
        return dailyData;
      case "Weekly":
        return weeklyData;
      case "Monthly":
      default:
        return monthlyData;
    }
  };

  const getYAxisTicks = () => {
    switch (selectedPeriod) {
      case "Daily":
        return [0, 500, 1000, 1500, 2000, 2500];
      case "Weekly":
        return [0, 500, 1000, 1500, 2000, 2500];
      case "Monthly":
      default:
        return [0, 900, 1300, 1950, 2600];
    }
  };

  const getYAxisDomain = () => {
    switch (selectedPeriod) {
      case "Daily":
        return [0, 2500];
      case "Weekly":
        return [0, 2500];
      case "Monthly":
      default:
        return [0, 2600];
    }
  };

  const chartData = getChartData();

  return (
    <DashboardLayout>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          data-testid="modal-fullscreen-chart"
        >
          <div
            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 relative w-full h-full sm:w-[95vw] sm:h-[90vh] md:w-[90vw] md:h-[85vh]"
            style={{
              maxWidth: "1400px",
            }}
          >
            {/* Header - Stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2
                className="text-lg sm:text-xl md:text-2xl"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  color: "#202020",
                }}
              >
                Engagement Over Time
              </h2>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Time Period Toggle */}
                <div
                  className="inline-flex items-center rounded-full p-0.5 sm:p-1"
                  style={{
                    backgroundColor: "#F3F4F6",
                  }}
                >
                  {(["Daily", "Weekly", "Monthly"] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full transition-all text-xs sm:text-sm"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        backgroundColor:
                          period === selectedPeriod ? "#202020" : "transparent",
                        color: period === selectedPeriod ? "#FFFFFF" : "#6B7280",
                      }}
                      data-testid={`button-fullscreen-period-${period.toLowerCase()}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center justify-center rounded-lg border transition-all hover:bg-gray-50 shrink-0"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderColor: "#E5E7EB",
                  }}
                  data-testid="button-close-fullscreen"
                >
                  <Minimize2 size={16} color="#6B7280" />
                </button>
              </div>
            </div>

            {/* Fullscreen Chart */}
            <div className="h-[calc(100%-80px)] sm:h-[calc(100%-70px)]" data-testid="chart-fullscreen-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ 
                      fontFamily: "Inter, sans-serif", 
                      fontSize: 13, 
                      fill: "#9CA3AF" 
                    }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ 
                      fontFamily: "Inter, sans-serif", 
                      fontSize: 13, 
                      fill: "#9CA3AF" 
                    }}
                    ticks={getYAxisTicks()}
                    domain={getYAxisDomain() as [number, number]}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#202020" 
                    strokeWidth={3}
                    dot={{ fill: "#202020", strokeWidth: 0, r: 5 }}
                    activeDot={{ fill: "#202020", strokeWidth: 0, r: 7 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reach" 
                    stroke="#CEA54F" 
                    strokeWidth={3}
                    dot={{ fill: "#CEA54F", strokeWidth: 0, r: 5 }}
                    activeDot={{ fill: "#CEA54F", strokeWidth: 0, r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 space-y-4 md:space-y-5">
        {/* Content Performance Card */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #E5E7EB",
          }}
          data-testid="card-content-performance"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-5">
            <div>
              <h2
                className="text-base md:text-lg"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "2px",
                }}
                data-testid="text-content-performance"
              >
                Content Performance
              </h2>
              <p
                className="text-xs md:text-sm"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  color: "#9CA3AF",
                }}
                data-testid="text-performance-subtitle"
              >
                Displaying the data from June 2025
              </p>
            </div>

            <button
              onClick={() => setLocation('/ai-studio')}
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all text-sm md:text-base w-full sm:w-auto"
              style={{
                height: "40px",
                background: "linear-gradient(135deg, #CEA54F 0%, #D4AF6A 100%)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                color: "#FFFFFF",
              }}
              data-testid="button-start-new-post"
            >
              Start New Post
              <Plus size={16} />
            </button>
          </div>

          {/* Performance Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Posts Published */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
              data-testid="card-posts-published"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#F3F4F6",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
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
                  className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                  data-testid="button-more-posts"
                >
                  <MoreHorizontal size={14} color="#9CA3AF" />
                </button>
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Posts Published this Month
              </p>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#202020",
                  marginBottom: "8px",
                }}
                data-testid="text-posts-count"
              >
                $ 1,284.00
              </h3>
              <div className="flex items-center gap-1">
                <TrendingUp size={12} color="#10B981" />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#10B981",
                  }}
                >
                  11%
                </span>
              </div>
            </div>

            {/* Engagement Rate */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
              data-testid="card-engagement-rate"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#F3F4F6",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
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
                  className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                  data-testid="button-more-engagement"
                >
                  <MoreHorizontal size={14} color="#9CA3AF" />
                </button>
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Engagement Rate
              </p>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#202020",
                  marginBottom: "8px",
                }}
                data-testid="text-engagement-rate"
              >
                7.81
              </h3>
              <div className="flex items-center gap-1">
                <TrendingDown size={12} color="#EF4444" />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#EF4444",
                  }}
                >
                  0%
                </span>
              </div>
            </div>

            {/* Best Performing Channel */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
              data-testid="card-best-channel"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center rounded-lg"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#F3F4F6",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
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
                <button
                  className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  style={{
                    width: "24px",
                    height: "24px",
                  }}
                  data-testid="button-more-channel"
                >
                  <MoreHorizontal size={14} color="#9CA3AF" />
                </button>
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Best Performing Channel
              </p>
              <div className="flex items-center gap-2 mb-2">
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                  data-testid="text-best-channel"
                >
                  7.81
                </h3>
                <div className="flex items-center gap-0.5">
                  <div style={{ width: "3px", height: "8px", backgroundColor: "#D1D5DB", borderRadius: "1px" }} />
                  <div style={{ width: "3px", height: "12px", backgroundColor: "#9CA3AF", borderRadius: "1px" }} />
                  <div style={{ width: "3px", height: "16px", backgroundColor: "#6B7280", borderRadius: "1px" }} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={12} color="#EF4444" />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#EF4444",
                  }}
                >
                  1.7%
                </span>
              </div>
            </div>

            {/* Next Scheduled Post Card */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
              data-testid="card-next-scheduled"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#202020",
                    }}
                  >
                    8
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 400,
                      color: "#6B7280",
                      marginLeft: "2px",
                    }}
                  >
                    Actions
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  <div style={{ width: "3px", height: "8px", backgroundColor: "#D1D5DB", borderRadius: "1px" }} />
                  <div style={{ width: "3px", height: "12px", backgroundColor: "#9CA3AF", borderRadius: "1px" }} />
                  <div style={{ width: "3px", height: "16px", backgroundColor: "#6B7280", borderRadius: "1px" }} />
                </div>
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "2px",
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
                  marginBottom: "12px",
                }}
              >
                Realtime update
              </p>

              <button
                onClick={() => setLocation('/ai-studio')}
                className="w-full flex items-center justify-center gap-2 rounded-lg transition-all"
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
                Create Post
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Next Post Scheduled Section */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #E5E7EB",
          }}
          data-testid="card-next-post-section"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-5">
            <div>
              <h2
                className="text-base md:text-lg"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "2px",
                }}
                data-testid="text-next-post-scheduled"
              >
                Next Post Scheduled
              </h2>
              <p
                className="text-xs md:text-sm"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  color: "#9CA3AF",
                }}
                data-testid="text-scheduled-time"
              >
                Tomorrow at 2:00 PM
              </p>
            </div>

            <button
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all text-xs md:text-sm w-full sm:w-auto"
              style={{
                height: "36px",
                backgroundColor: "#202020",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                color: "#FFFFFF",
              }}
              data-testid="button-edit-post"
            >
              Edit Post
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 1.5L12.5 3.5L4.5 11.5H2.5V9.5L10.5 1.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Post Preview */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-5" data-testid="post-preview">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop"
              alt="Post preview"
              className="rounded-lg object-cover w-full sm:w-28 md:w-32 h-48 sm:h-28 md:h-32"
              data-testid="img-post-preview"
            />

            <div className="flex flex-col justify-center">
              <h3
                className="text-base md:text-lg"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "6px",
                }}
                data-testid="text-post-title"
              >
                5 Essential Hair Care Tips for Healthy Hair
              </h3>
              <p
                className="text-sm md:text-base"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  color: "#6B7280",
                }}
                data-testid="text-post-schedule"
              >
                Tomorrow at 2:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Engagement Over Time Section */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #E5E7EB",
          }}
          data-testid="card-engagement-over-time"
        >
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
            <h2
              className="text-base md:text-lg"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "#202020",
              }}
              data-testid="text-engagement-over-time"
            >
              Engagement Over Time
            </h2>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* Time Period Toggle */}
              <div
                className="inline-flex items-center rounded-full p-1"
                style={{
                  backgroundColor: "#F3F4F6",
                }}
              >
                {(["Daily", "Weekly", "Monthly"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className="px-3 md:px-4 py-1 md:py-1.5 rounded-full transition-all text-xs md:text-sm"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      backgroundColor:
                        period === selectedPeriod ? "#202020" : "transparent",
                      color: period === selectedPeriod ? "#FFFFFF" : "#6B7280",
                    }}
                    data-testid={`button-period-${period.toLowerCase()}`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* View Total Sales Dropdown */}
              <button
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs"
                style={{
                  height: "32px",
                  borderColor: "#E5E7EB",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  color: "#6B7280",
                }}
                data-testid="button-view-total-sales"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 7H10.5M3.5 4H10.5M3.5 10H7" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden md:inline">View Total Sales</span>
                <ChevronDown size={14} color="#6B7280" />
              </button>

              {/* Expand Icon */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center justify-center rounded-lg border transition-all hover:bg-gray-50 shrink-0"
                style={{
                  width: "32px",
                  height: "32px",
                  borderColor: "#E5E7EB",
                }}
                data-testid="button-expand-chart"
              >
                <Maximize2 size={14} color="#6B7280" />
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48 sm:h-64 md:h-72" data-testid="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontFamily: "Inter, sans-serif", 
                    fontSize: 11, 
                    fill: "#9CA3AF" 
                  }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fontFamily: "Inter, sans-serif", 
                    fontSize: 11, 
                    fill: "#9CA3AF" 
                  }}
                  ticks={getYAxisTicks()}
                  domain={getYAxisDomain() as [number, number]}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#202020" 
                  strokeWidth={2}
                  dot={{ fill: "#202020", strokeWidth: 0, r: 4 }}
                  activeDot={{ fill: "#202020", strokeWidth: 0, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#CEA54F" 
                  strokeWidth={2}
                  dot={{ fill: "#CEA54F", strokeWidth: 0, r: 4 }}
                  activeDot={{ fill: "#CEA54F", strokeWidth: 0, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
