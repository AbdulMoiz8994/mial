import { Sparkles, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "48px",
                fontWeight: 700,
                color: "#202020",
              }}
              data-testid="text-welcome"
            >
              MIA
            </h1>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#CEA54F",
              }}
            >
              <Sparkles className="text-white" size={24} />
            </div>
          </div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "#64748B",
            }}
            data-testid="text-tagline"
          >
            Your AI Social Agent for Beauty & Barbering
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div
            className="bg-white rounded-xl p-8"
            style={{
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            }}
            data-testid="card-feature-1"
          >
            <div
              className="rounded-full inline-flex items-center justify-center mb-4"
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#CEA54F",
              }}
            >
              <Sparkles className="text-white" size={28} />
            </div>
            <h3
              className="mb-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#202020",
              }}
            >
              AI-Powered Content
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#64748B",
                lineHeight: "1.6",
              }}
            >
              Generate stunning social media content tailored for your beauty business
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-8"
            style={{
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            }}
            data-testid="card-feature-2"
          >
            <div
              className="rounded-full inline-flex items-center justify-center mb-4"
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#CEA54F",
              }}
            >
              <TrendingUp className="text-white" size={28} />
            </div>
            <h3
              className="mb-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#202020",
              }}
            >
              Grow Your Business
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#64748B",
                lineHeight: "1.6",
              }}
            >
              Reach more clients and build your brand with consistent posting
            </p>
          </div>

          <div
            className="bg-white rounded-xl p-8"
            style={{
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            }}
            data-testid="card-feature-3"
          >
            <div
              className="rounded-full inline-flex items-center justify-center mb-4"
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#CEA54F",
              }}
            >
              <Zap className="text-white" size={28} />
            </div>
            <h3
              className="mb-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#202020",
              }}
            >
              Save Time
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#64748B",
                lineHeight: "1.6",
              }}
            >
              Focus on your clients while MIA handles your social media strategy
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
          }}
          data-testid="card-welcome"
        >
          <h2
            className="mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "#202020",
            }}
          >
            Welcome to Your Dashboard
          </h2>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              color: "#64748B",
              lineHeight: "1.6",
            }}
          >
            Your account is all set up! Start creating amazing content for your beauty business.
          </p>
        </div>
      </div>
    </div>
  );
}
