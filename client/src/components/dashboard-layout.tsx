import { Link, useLocation } from "wouter";
import { Search, Bell, Settings } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoSvg from "@assets/Pasted--svg-width-92-height-52-viewBox-0-0-92-52-fill-none-xmlns-http-www-w3-org-2000-svg-xmlns-1763982229563_1763982229565.txt?raw";
import homeIconSvg from "@assets/Pasted--svg-width-19-height-19-viewBox-0-0-19-19-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982268297_1763982268297.txt?raw";
import aiStudioIconSvg from "@assets/Pasted--svg-width-19-height-19-viewBox-0-0-19-19-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982245282_1763982245282.txt?raw";
import editorsIconSvg from "@assets/Pasted--svg-width-17-height-17-viewBox-0-0-17-17-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982214090_1763982214090.txt?raw";
import calendarsIconSvg from "@assets/Pasted--svg-width-17-height-17-viewBox-0-0-17-17-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982290991_1763982290992.txt?raw";

const analyticsIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.0381 0.683594C15.4156 0.683627 15.7217 0.989697 15.7217 1.36719C15.7217 1.74466 15.4156 2.05075 15.0381 2.05078H15.0312V9.6377C15.0312 10.4012 14.8292 11.0975 14.3271 11.5996C13.8251 12.1017 13.1288 12.3037 12.3652 12.3037H8.88574V13.248L11.2432 14.4268C11.5804 14.5957 11.7175 15.0063 11.5488 15.3438C11.3801 15.6812 10.9694 15.8179 10.6318 15.6494L8.20215 14.4346L5.77344 15.6494C5.43589 15.818 5.02529 15.6812 4.85645 15.3438C4.68783 15.0062 4.8247 14.5956 5.16211 14.4268L7.51855 13.248V12.3037H4.0332C3.26943 12.3037 2.57391 12.1017 2.07129 11.6006C1.56898 11.0996 1.36438 10.4045 1.36035 9.6416V2.0498C0.985986 2.04616 0.68362 1.74241 0.683594 1.36719C0.683594 0.989676 0.989676 0.683594 1.36719 0.683594H15.0381ZM2.72754 9.63477L2.73438 9.82422C2.76542 10.2422 2.892 10.4871 3.03711 10.6318C3.20265 10.7969 3.49846 10.9365 4.0332 10.9365H12.3652C12.9003 10.9365 13.196 10.7972 13.3604 10.6328C13.5247 10.4684 13.6641 10.1727 13.6641 9.6377V2.05078H2.72754V9.63477ZM10.8408 4.94434C11.1306 4.70243 11.5617 4.74063 11.8037 5.03027C12.0454 5.32004 12.0064 5.75129 11.7168 5.99316L9.56348 7.79102C9.55993 7.79397 9.55634 7.79692 9.55273 7.7998C9.32813 7.97948 9.03525 8.06927 8.73633 8.01953C8.43483 7.96924 8.18262 7.78615 8.02832 7.53223L8.02734 7.5293L7.41016 6.50195L5.56543 8.04395C5.27575 8.28578 4.84453 8.24652 4.60254 7.95703C4.36083 7.66741 4.39916 7.23711 4.68848 6.99512L6.8418 5.19727C7.07045 5.00579 7.37087 4.91315 7.67578 4.9668C7.94096 5.01361 8.16397 5.16254 8.31641 5.36523L8.37891 5.45898L8.99414 6.48535L10.8408 4.94434Z" fill="white" fill-opacity="0.4"/>
</svg>`;

const settingsIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.20273 10.2531C9.33527 10.2531 10.2534 9.33502 10.2534 8.20249C10.2534 7.06996 9.33527 6.15186 8.20273 6.15186C7.0702 6.15186 6.1521 7.06996 6.1521 8.20249C6.1521 9.33502 7.0702 10.2531 8.20273 10.2531Z" stroke="white" stroke-opacity="0.4" stroke-width="1.36709" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.36707 8.80404V7.601C1.36707 6.89011 1.94808 6.30227 2.6658 6.30227C3.90301 6.30227 4.40884 5.42733 3.78681 4.35416C3.43137 3.73897 3.64327 2.93923 4.26529 2.58378L5.44782 1.90707C5.98783 1.58581 6.68504 1.7772 7.00631 2.3172L7.0815 2.44707C7.69669 3.52024 8.70833 3.52024 9.33036 2.44707L9.40555 2.3172C9.72681 1.7772 10.424 1.58581 10.964 1.90707L12.1466 2.58378C12.7686 2.93923 12.9805 3.73897 12.625 4.35416C12.003 5.42733 12.5088 6.30227 13.7461 6.30227C14.4569 6.30227 15.0448 6.88328 15.0448 7.601V8.80404C15.0448 9.51492 14.4638 10.1028 13.7461 10.1028C12.5088 10.1028 12.003 10.9777 12.625 12.0509C12.9805 12.6729 12.7686 13.4658 12.1466 13.8213L10.964 14.498C10.424 14.8192 9.72681 14.6278 9.40555 14.0878L9.33036 13.958C8.71517 12.8848 7.70352 12.8848 7.0815 13.958L7.00631 14.0878C6.68504 14.6278 5.98783 14.8192 5.44782 14.498L4.26529 13.8213C3.64327 13.4658 3.43137 12.6661 3.78681 12.0509C4.40884 10.9777 3.90301 10.1028 2.6658 10.1028C1.94808 10.1028 1.36707 9.51492 1.36707 8.80404Z" stroke="white" stroke-opacity="0.4" stroke-width="1.36709" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user } = useUser();

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
        <div className="mt-auto">
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
            className="pt-4 border-t" 
            style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
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
              data-testid="text-greeting"
            >
              {getGreeting()}, {user?.name || "User"} 👋
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
            <Avatar className="w-9 h-9" data-testid="avatar-user">
              {user?.profilePicture && (
                <AvatarImage src={user.profilePicture} alt={user.name || "User"} />
              )}
              <AvatarFallback 
                style={{
                  backgroundColor: "#CEA54F",
                  color: "white",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
