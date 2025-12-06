import { useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { TrendingUp, TrendingDown, MoreHorizontal, Maximize2, X, Minimize2, RefreshCw, ChevronDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";

// Chart data
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

// Bottom chart data
const chartData1 = [
  { name: "A", value: 30 },
  { name: "B", value: 60 },
  { name: "C", value: 90 },
  { name: "D", value: 50 },
];

const chartData2 = [
  { name: "Segment 1", value: 400, color: "#CEA54F" },
  { name: "Segment 2", value: 300, color: "#D4AF6A" },
  { name: "Segment 3", value: 200, color: "#E5C98E" },
];

const chartData3 = [
  { name: "A", value: 40 },
  { name: "B", value: 80 },
  { name: "C", value: 30 },
  { name: "D", value: 60 },
];

const chartData4 = [
  { name: "A", value: 50 },
  { name: "B", value: 30 },
  { name: "C", value: 70 },
  { name: "D", value: 90 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }> }) => {
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

// Donut Chart Component
const DonutChart = ({ data }: { data: typeof chartData2 }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  let cumulativePercent = 0;

  const createArc = (startPercent: number, endPercent: number) => {
    const startAngle = startPercent * 360;
    const endAngle = endPercent * 360;
    const startRadians = (startAngle - 90) * (Math.PI / 180);
    const endRadians = (endAngle - 90) * (Math.PI / 180);

    const innerRadius = 60;
    const outerRadius = 100;
    const centerX = 100;
    const centerY = 100;

    const x1 = centerX + outerRadius * Math.cos(startRadians);
    const y1 = centerY + outerRadius * Math.sin(startRadians);
    const x2 = centerX + outerRadius * Math.cos(endRadians);
    const y2 = centerY + outerRadius * Math.sin(endRadians);
    const x3 = centerX + innerRadius * Math.cos(endRadians);
    const y3 = centerY + innerRadius * Math.sin(endRadians);
    const x4 = centerX + innerRadius * Math.cos(startRadians);
    const y4 = centerY + innerRadius * Math.sin(startRadians);

    const largeArc = endPercent - startPercent > 0.5 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
      {data.map((entry, index) => {
        const startPercent = cumulativePercent;
        cumulativePercent += entry.value / total;
        const endPercent = cumulativePercent;
        const path = createArc(startPercent, endPercent);

        return (
          <path
            key={index}
            d={path}
            fill={entry.color}
          />
        );
      })}
    </svg>
  );
};

export default function Analytics() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Monthly");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const chartData = getChartData();

  const handleCreatePost = () => {
    setLocation("/editors");
    toast({
      title: "Redirecting to Editor",
      description: "Creating a new post...",
    });
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing Analytics",
      description: "Updating your latest data...",
    });
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Your analytics are up to date!",
      });
    }, 1500);
  };

  const handleMoreOptions = (cardName: string) => {
    toast({
      title: `${cardName} Options`,
      description: "View detailed analytics, export data, or customize this metric.",
    });
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

  return (
    <DashboardLayout>
      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 relative w-full h-full sm:w-[95vw] sm:h-[90vh] md:w-[90vw] md:h-[85vh]"
            style={{
              maxWidth: "1400px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                >
                  <Minimize2 size={16} color="#6B7280" />
                </button>
              </div>
            </div>

            {/* Fullscreen Chart */}
            <div className="h-[calc(100%-80px)] sm:h-[calc(100%-70px)]">
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
        {/* Content Performance Header Section */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Header */}
          <div className="mb-4 md:mb-5">
            <h2
              className="text-base md:text-lg"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "#202020",
                marginBottom: "2px",
              }}
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
            >
              Displaying the data from June 2025
            </p>
          </div>

          {/* Metrics Grid - 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Total Posts */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div className="flex items-start justify-between mb-3">
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
                    stroke="#202020"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 3V5M14 3V5"
                    stroke="#202020"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <button
                  onClick={() => handleMoreOptions("Total Posts")}
                  className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <MoreHorizontal size={16} color="#9CA3AF" />
                </button>
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "6px",
                }}
              >
                Total Posts
              </p>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#202020",
                  marginBottom: "6px",
                  lineHeight: "1.2",
                }}
              >
                $ 1,284.00
              </h3>
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

            {/* Avg Engagement */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                    stroke="#202020"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 6V10L13 12"
                    stroke="#202020"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <button
                  onClick={() => handleMoreOptions("Avg Engagement")}
                  className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <MoreHorizontal size={16} color="#9CA3AF" />
                </button>
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "6px",
                }}
              >
                Avg Engagement
              </p>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#202020",
                  marginBottom: "6px",
                  lineHeight: "1.2",
                }}
              >
                7.81
              </h3>
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

            {/* Follower Growth */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 16V14C16 12.8954 15.1046 12 14 12H6C4.89543 12 4 12.8954 4 14V16"
                    stroke="#202020"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="10"
                    cy="6"
                    r="3"
                    stroke="#202020"
                    strokeWidth="1.5"
                  />
                </svg>
                <button
                  onClick={() => handleMoreOptions("Follower Growth")}
                  className="flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <MoreHorizontal size={16} color="#9CA3AF" />
                </button>
              </div>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#6B7280",
                  marginBottom: "6px",
                }}
              >
                Follower Growth
              </p>
              <h3
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#202020",
                  marginBottom: "6px",
                  lineHeight: "1.2",
                }}
              >
                7.81
              </h3>
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

            {/* Actions Card */}
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
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
                onClick={handleCreatePost}
                className="w-full flex items-center justify-center gap-2 rounded-lg transition-all hover:opacity-90"
                style={{
                  height: "32px",
                  background: "linear-gradient(135deg, #CEA54F 0%, #D4AF6A 100%)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#FFFFFF",
                }}
              >
                Create Post
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Engagement Over Time Chart */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #E5E7EB",
          }}
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
                  >
                    {period}
                  </button>
                ))}
              </div>

              {/* View Total Sales - Dropdown */}
              <button
                onClick={() => toast({
                  title: "View Total Sales",
                  description: "Viewing detailed sales analytics...",
                })}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs hover:bg-gray-50"
                style={{
                  height: "32px",
                  borderColor: "#E5E7EB",
                  backgroundColor: "#FFFFFF",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  color: "#6B7280",
                }}
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
              >
                <Maximize2 size={14} color="#6B7280" />
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 md:h-80">
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

        {/* Bottom 4 Charts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Chart Card 1 - Bar Chart */}
          <div
            className="bg-white rounded-xl p-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#202020",
                    marginBottom: "2px",
                  }}
                >
                  Title goes here
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                >
                  00
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: "#9CA3AF",
                  }}
                >
                  00
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData1} margin={{ left: -20, right: 10, top: 15, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 9,
                      fill: "#9CA3AF"
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 9,
                      fill: "#D1D5DB"
                    }}
                    ticks={[0, 50, 100]}
                    orientation="left"
                    dy={-3}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData1.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? "#CEA54F" : "#D1D5DB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#6B7280" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#CEA54F" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D4AF6A" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
            </div>
          </div>

          {/* Chart Card 2 - Donut Chart */}
          <div
            className="bg-white rounded-xl p-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#202020",
                    marginBottom: "2px",
                  }}
                >
                  Title goes here
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                >
                  00
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: "#9CA3AF",
                  }}
                >
                  00
                </p>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="h-32 mb-4 flex items-center justify-center">
              <div style={{ width: "120px", height: "120px" }}>
                <DonutChart data={chartData2} />
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#CEA54F" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D4AF6A" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#E5C98E" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
            </div>
          </div>

          {/* Chart Card 3 - Bar Chart */}
          <div
            className="bg-white rounded-xl p-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#202020",
                    marginBottom: "2px",
                  }}
                >
                  Title goes here
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                >
                  00
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: "#9CA3AF",
                  }}
                >
                  00
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData3} margin={{ left: -20, right: 10, top: 15, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 9,
                      fill: "#9CA3AF"
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 9,
                      fill: "#D1D5DB"
                    }}
                    ticks={[0, 50, 100]}
                    orientation="left"
                    dy={-3}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData3.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? "#1A1A1A" : index === 1 ? "#CEA54F" : "#D1D5DB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#6B7280" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#CEA54F" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D4AF6A" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
            </div>
          </div>

          {/* Chart Card 4 - Bar Chart */}
          <div
            className="bg-white rounded-xl p-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#202020",
                    marginBottom: "2px",
                  }}
                >
                  Title goes here
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#202020",
                  }}
                >
                  00
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: "#9CA3AF",
                  }}
                >
                  00
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData4} margin={{ left: -20, right: 10, top: 15, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                    tickLine={false}
                    tick={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 9,
                      fill: "#9CA3AF"
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 9,
                      fill: "#D1D5DB"
                    }}
                    ticks={[0, 50, 100]}
                    orientation="left"
                    dy={-3}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData4.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? "#CEA54F" : "#D1D5DB"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#6B7280" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#CEA54F" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#D4AF6A" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}>Key title goes here</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>00%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
