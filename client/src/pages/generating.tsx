import { useEffect } from "react";
import { useLocation } from "wouter";
import { AuthLayout } from "@/components/auth-layout";
import { Sparkles } from "lucide-react";

export default function Generating() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/home");
    }, 6000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-full h-full min-h-[600px] px-5 py-6">
        <div
          className="bg-white rounded-2xl flex flex-col items-center justify-center"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "80px 60px",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
          }}
          data-testid="card-generating"
        >
          {/* Animated Gold Spinner */}
          <div
            className="relative mb-8"
            style={{
              width: "64px",
              height: "64px",
            }}
          >
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center animate-spin"
              style={{
                background: "linear-gradient(135deg, #CEA54F 0%, #D4AF6A 50%, #CEA54F 100%)",
                animation: "spin 2s linear infinite",
              }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#CEA54F",
                }}
              >
                <Sparkles
                  className="text-white animate-pulse"
                  style={{
                    width: "28px",
                    height: "28px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Generating Text */}
          <h2
            className="mb-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 600,
              color: "#202020",
              textAlign: "center",
            }}
            data-testid="text-generating"
          >
            Generating....
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#9CA3AF",
              textAlign: "center",
            }}
            data-testid="text-subtitle"
          >
            Building your ideas
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
