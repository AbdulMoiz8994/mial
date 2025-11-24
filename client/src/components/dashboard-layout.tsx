import { Link, useLocation } from "wouter";
import { Search, Bell, Settings } from "lucide-react";
import logoSvg from "@assets/Pasted--svg-width-92-height-52-viewBox-0-0-92-52-fill-none-xmlns-http-www-w3-org-2000-svg-xmlns-1763982229563_1763982229565.txt?raw";
import homeIconSvg from "@assets/Pasted--svg-width-19-height-19-viewBox-0-0-19-19-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982268297_1763982268297.txt?raw";
import aiStudioIconSvg from "@assets/Pasted--svg-width-19-height-19-viewBox-0-0-19-19-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982245282_1763982245282.txt?raw";
import editorsIconSvg from "@assets/Pasted--svg-width-17-height-17-viewBox-0-0-17-17-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982214090_1763982214090.txt?raw";
import calendarsIconSvg from "@assets/Pasted--svg-width-17-height-17-viewBox-0-0-17-17-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982290991_1763982290992.txt?raw";

const analyticsIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.0381 0.683594C15.4156 0.683627 15.7217 0.989697 15.7217 1.36719C15.7217 1.74466 15.4156 2.05075 15.0381 2.05078H15.0312V9.6377C15.0312 10.4012 14.8292 11.0975 14.3271 11.5996C13.8251 12.1017 13.1288 12.3037 12.3652 12.3037H8.88574V13.248L11.2432 14.4268C11.5804 14.5957 11.7175 15.0063 11.5488 15.3438C11.3801 15.6812 10.9694 15.8179 10.6318 15.6494L8.20215 14.4346L5.77344 15.6494C5.43589 15.818 5.02529 15.6812 4.85645 15.3438C4.68783 15.0062 4.8247 14.5956 5.16211 14.4268L7.51855 13.248V12.3037H4.0332C3.26943 12.3037 2.57391 12.1017 2.07129 11.6006C1.56898 11.0996 1.36438 10.4045 1.36035 9.6416V2.0498C0.985986 2.04616 0.68362 1.74241 0.683594 1.36719C0.683594 0.989676 0.989676 0.683594 1.36719 0.683594H15.0381ZM2.72754 9.63477L2.73438 9.82422C2.76542 10.2422 2.892 10.4871 3.03711 10.6318C3.20265 10.7969 3.49846 10.9365 4.0332 10.9365H12.3652C12.9003 10.9365 13.196 10.7972 13.3604 10.6328C13.5247 10.4684 13.6641 10.1727 13.6641 9.6377V2.05078H2.72754V9.63477ZM10.8408 4.94434C11.1306 4.70243 11.5617 4.74063 11.8037 5.03027C12.0454 5.32004 12.0064 5.75129 11.7168 5.99316L9.56348 7.79102C9.55993 7.79397 9.55634 7.79692 9.55273 7.7998C9.32813 7.97948 9.03525 8.06927 8.73633 8.01953C8.43483 7.96924 8.18262 7.78615 8.02832 7.53223L8.02734 7.5293L7.41016 6.50195L5.56543 8.04395C5.27575 8.28578 4.84453 8.24652 4.60254 7.95703C4.36083 7.66741 4.39916 7.23711 4.68848 6.99512L6.8418 5.19727C7.07045 5.00579 7.37087 4.91315 7.67578 4.9668C7.94096 5.01361 8.16397 5.16254 8.31641 5.36523L8.37891 5.45898L8.99414 6.48535L10.8408 4.94434Z" fill="white" fill-opacity="0.4"/>
</svg>`;

const settingsIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.8753 5.80164L13.8336 5.2083C13.7628 5.10206 13.6874 4.99581 13.612 4.89664L13.0187 3.85497C12.9407 3.70872 12.8062 3.59789 12.6462 3.54122L11.3837 3.06622C11.3062 2.97414 11.2003 2.89622 11.0745 2.85372L9.76946 2.43914C9.5528 2.37539 9.31154 2.42497 9.14446 2.56747L8.22696 3.34706C8.08446 3.36122 7.94196 3.36122 7.79946 3.34706L6.88196 2.56747C6.71488 2.43206 6.47363 2.37539 6.25696 2.43914L4.95196 2.85372C4.82696 2.89622 4.72071 2.96706 4.64279 3.06622L3.37988 3.54122C3.22655 3.59789 3.09196 3.70872 3.01405 3.85497L2.42071 4.89664C2.34988 4.99581 2.27196 5.10206 2.20113 5.2083L1.15946 5.80164C1.00613 5.88664 0.88821 6.02206 0.83863 6.18206L0.434631 7.43706C0.392131 7.56206 0.378965 7.68706 0.406215 7.81206L0.679048 9.15289C0.679048 9.29539 0.650465 9.43789 0.601048 9.57331L0.111215 10.8283C0.0474818 11.0308 0.0899817 11.2616 0.211215 11.4358L1.07613 12.5162C1.1328 12.6483 1.1753 12.7875 1.19654 12.9337L1.53446 14.3383C1.57696 14.5337 1.71238 14.6941 1.89654 14.7858L3.08029 15.3437C3.22279 15.4145 3.35738 15.492 3.48238 15.5841L4.43154 16.4633C4.58488 16.6025 4.78654 16.6662 4.99529 16.6308L6.32904 16.4679C6.48237 16.4891 6.63571 16.4891 6.78904 16.4679L8.12279 16.6308C8.32446 16.6662 8.53321 16.6025 8.68654 16.4633L9.63571 15.5841C9.76779 15.492 9.89988 15.4145 10.0249 15.3437L11.2087 14.7858C11.3928 14.6941 11.5282 14.5337 11.5707 14.3383L11.9087 12.9337C11.9299 12.7875 11.9724 12.6483 12.0291 12.5162L12.894 11.4358C13.0153 11.2616 13.0578 11.0308 12.994 10.8283L12.5041 9.57331C12.4547 9.43789 12.4262 9.29539 12.4262 9.15289L12.699 7.81206C12.7262 7.68706 12.7132 7.56206 12.6707 7.43706L12.2666 6.18206C12.217 6.02206 12.0991 5.88664 11.9457 5.80164L14.8753 5.80164ZM8.05279 11.9962C6.34279 11.9962 4.94529 10.5987 4.94529 8.88872C4.94529 7.17872 6.34279 5.78122 8.05279 5.78122C9.76279 5.78122 11.1603 7.17872 11.1603 8.88872C11.1603 10.5987 9.76279 11.9962 8.05279 11.9962Z" fill="white" fill-opacity="0.36"/>
</svg>`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  const menuItems = [
    { path: "/home", label: "Home", icon: editorsIconSvg },
    { path: "/ai-studio", label: "AI Studio", icon: aiStudioIconSvg },
    { path: "/editors", label: "Editors", icon: homeIconSvg },
    { path: "/calendars", label: "Calendars", icon: calendarsIconSvg },
    { path: "/analytics", label: "Analytics", icon: analyticsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Exact Figma Design */}
      <div
        className="flex flex-col"
        style={{
          width: "240px",
          backgroundColor: "#1A1A1A",
          padding: "24px 20px",
        }}
        data-testid="sidebar"
      >
        {/* Logo */}
        <div className="mb-16" data-testid="logo-container">
          <div
            dangerouslySetInnerHTML={{ __html: logoSvg }}
            className="w-full"
            style={{ height: "28px" }}
            data-testid="img-logo"
          />
        </div>

        {/* Main Menu Section */}
        <div className="flex-1">
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: "16px",
              paddingBottom: "12px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            Main Menu
          </div>

          <nav className="space-y-4">
            {menuItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block"
                  data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className="flex items-center gap-2 py-3 cursor-pointer rounded transition-all"
                    style={{
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                      paddingLeft: isActive ? "12px" : "0",
                      paddingRight: isActive ? "12px" : "0",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.paddingLeft = "12px";
                        e.currentTarget.style.paddingRight = "12px";
                      }
                      const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
                      const text = e.currentTarget.querySelector('[data-text]') as HTMLElement;
                      if (icon) icon.style.opacity = "1";
                      if (text) text.style.color = "rgba(255, 255, 255, 1)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.paddingLeft = "0";
                        e.currentTarget.style.paddingRight = "0";
                      }
                      if (!isActive) {
                        const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
                        const text = e.currentTarget.querySelector('[data-text]') as HTMLElement;
                        if (icon) icon.style.opacity = "0.5";
                        if (text) text.style.color = "rgba(255, 255, 255, 0.6)";
                      }
                    }}
                  >
                    <div
                      data-icon
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                      style={{
                        width: item.icon.includes('width="19"') ? "19px" : "17px",
                        height: item.icon.includes('height="19"') ? "19px" : "17px",
                        opacity: isActive ? 1 : 0.5,
                        flexShrink: 0,
                        transition: "opacity 0.2s",
                      }}
                    />
                    <span
                      data-text
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: isActive ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.6)",
                        transition: "color 0.2s",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Preference Section */}
        <div className="mt-auto pt-6 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: "16px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Preference
          </div>

          <div
            className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded transition-colors"
            data-testid="link-settings"
            style={{
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: settingsIcon }}
              style={{
                width: "17px",
                height: "17px",
                opacity: 0.5,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Settings
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-4 bg-white border-b"
          data-testid="header"
        >
          {/* Left Side: Greeting */}
          <div>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: "#1A1A1A",
              }}
            >
              Good afternoon, Maya 👋
            </h1>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "rgba(26, 26, 26, 0.6)",
                marginTop: "2px",
              }}
            >
              Here's what is happening with your content today
            </p>
          </div>

          {/* Right Side: Search + Icons + Avatar */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(26, 26, 26, 0.4)",
                }}
              />
              <input
                type="text"
                placeholder="Search or ask with AI"
                style={{
                  width: "280px",
                  height: "36px",
                  paddingLeft: "40px",
                  paddingRight: "12px",
                  border: "1px solid rgba(26, 26, 26, 0.1)",
                  borderRadius: "8px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  outline: "none",
                }}
                data-testid="input-search"
              />
              <span
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  color: "rgba(26, 26, 26, 0.4)",
                  backgroundColor: "rgba(26, 26, 26, 0.05)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                ⌘
              </span>
            </div>

            {/* Action Icons */}
            <button
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid rgba(26, 26, 26, 0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              data-testid="button-notifications"
            >
              <Bell size={18} style={{ color: "rgba(26, 26, 26, 0.6)" }} />
            </button>

            <button
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid rgba(26, 26, 26, 0.1)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              data-testid="button-settings"
            >
              <Settings size={18} style={{ color: "rgba(26, 26, 26, 0.6)" }} />
            </button>

            {/* Avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#CEA54F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
              }}
              data-testid="avatar-user"
            >
              M
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
