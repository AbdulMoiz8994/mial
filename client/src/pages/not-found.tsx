import { DashboardLayout } from "@/components/dashboard-layout";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <DashboardLayout>
      <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* 404 Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="rounded-full p-4"
              style={{
                backgroundColor: "#FEE2E2",
              }}
            >
              <AlertCircle size={64} color="#EF4444" />
            </div>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "36px",
              fontWeight: 700,
              color: "#202020",
              marginBottom: "12px",
            }}
          >
            404
          </h1>
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "24px",
              fontWeight: 600,
              color: "#202020",
              marginBottom: "16px",
            }}
          >
            Page Not Found
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 400,
              color: "#6B7280",
              marginBottom: "32px",
              lineHeight: "1.6",
            }}
          >
            The page you are looking for doesn't exist or has been moved.
            Please check the URL or navigate back to continue.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#6B7280",
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
              <ArrowLeft size={18} />
              Go Back
            </button>
            <button
              onClick={() => setLocation("/home")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#FFFFFF",
                backgroundColor: "#CEA64F",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#B8924A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#CEA64F";
              }}
            >
              <Home size={18} />
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
