import { Link, useLocation } from "wouter";
import { Search, Bell, Settings } from "lucide-react";
import logoSvg from "@assets/Pasted--svg-width-92-height-52-viewBox-0-0-92-52-fill-none-xmlns-http-www-w3-org-2000-svg-xmlns-1763982229563_1763982229565.txt?raw";
import homeIconSvg from "@assets/Pasted--svg-width-19-height-19-viewBox-0-0-19-19-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982268297_1763982268297.txt?raw";
import aiStudioIconSvg from "@assets/Pasted--svg-width-19-height-19-viewBox-0-0-19-19-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982245282_1763982245282.txt?raw";
import editorsIconSvg from "@assets/Pasted--svg-width-17-height-17-viewBox-0-0-17-17-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982214090_1763982214090.txt?raw";
import calendarsIconSvg from "@assets/Pasted--svg-width-17-height-17-viewBox-0-0-17-17-fill-none-xmlns-http-www-w3-org-2000-svg-pat-1763982290991_1763982290992.txt?raw";

const analyticsIcon = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8229 6.42289C15.8229 3.73705 13.6504 1.56455 10.9646 1.56455C10.8779 1.56455 10.7912 1.56455 10.7046 1.57164C10.5446 1.58581 10.3987 1.65664 10.2954 1.77455C10.192 1.89247 10.1404 2.04997 10.1475 2.21706C10.1687 2.66456 10.0679 3.07622 9.84498 3.43831C9.50707 3.99623 8.94207 4.34123 8.32748 4.39081C8.20248 4.40497 8.08457 4.43331 7.9879 4.48289C7.71873 4.61039 7.52748 4.87248 7.49915 5.16289C7.47081 5.46039 7.61331 5.74373 7.85456 5.90289C8.29498 6.20039 8.62581 6.62706 8.81706 7.11498C9.35623 8.51248 8.69915 10.0546 7.30165 10.5937C7.0254 10.6929 6.90748 11.0096 7.00665 11.2859C7.06331 11.4458 7.17415 11.5771 7.32748 11.6621C7.49457 11.7487 7.66165 11.7983 7.83581 11.8196C8.19081 11.8621 8.54581 11.8267 8.89373 11.7204C10.7046 11.1696 11.8954 9.29081 11.652 7.37456C11.5812 6.87956 11.4212 6.40581 11.1804 5.97539C11.1237 5.86455 11.1237 5.73705 11.1591 5.62622C11.2016 5.51539 11.2937 5.41622 11.3929 5.37372C11.5954 5.30289 11.7979 5.24622 12.0004 5.20372C12.6008 5.09997 13.1729 5.21081 13.6962 5.50831C13.8279 5.58622 13.9879 5.60747 14.1337 5.56497C14.2796 5.52247 14.4112 5.41872 14.4891 5.28414C14.8129 4.71497 15.1296 4.23997 15.462 3.81664C15.8087 3.36914 15.8229 6.43706 15.8229 6.42289Z" fill="white" fill-opacity="0.36"/>
<path d="M8.5 0.771973C7.97666 0.771973 7.555 1.19363 7.555 1.71697V4.61739C8.01666 4.60322 8.46416 4.44572 8.83333 4.15531C9.055 3.98114 9.24625 3.75822 9.39958 3.50322C9.58375 3.19864 9.71125 2.84364 9.76791 2.4603C9.795 2.23739 9.80916 2.00739 9.795 1.77739C9.75958 1.22656 9.31208 0.800476 8.76833 0.778226C8.68333 0.771973 8.59833 0.771973 8.5 0.771973ZM8.5 0.000390768C8.65333 0.000390768 8.79583 0.00747268 8.94208 0.0216393C10.105 0.127556 10.9725 1.06489 11.0546 2.23031C11.0758 2.56114 11.055 2.88489 11.005 3.20156C10.9058 3.82322 10.6862 4.39239 10.3625 4.88031C10.1037 5.26364 9.77291 5.60864 9.38958 5.88489C8.79583 6.30656 8.08333 6.53656 7.33041 6.53656C7.28791 6.53656 7.23833 6.53656 7.19583 6.53656C6.77416 6.52239 6.42208 6.20572 6.39375 5.78406C6.37958 5.56822 6.43625 5.36656 6.55416 5.19239C6.6792 5.01822 6.85333 4.88989 7.0629 4.82614C7.12666 4.81197 7.19583 4.79072 7.25958 4.78364C7.40583 4.76239 7.55208 4.73406 7.68666 4.69156C7.995 4.60656 8.26416 4.42239 8.44125 4.18114C8.5279 4.06322 8.59708 3.93572 8.65375 3.79322C8.75291 3.54531 8.79541 3.27614 8.78125 3.01406C8.78125 2.97864 8.775 2.93614 8.775 2.90072V1.71697C8.775 0.757556 9.5475 -0.00661015 8.5 0.000390768Z" fill="white" fill-opacity="0.36"/>
<path d="M10.9645 2.34372C11.0141 2.34372 11.0637 2.35081 11.1062 2.35789C12.7862 2.72706 14.1554 3.88789 14.8254 5.41581C14.9291 5.64581 14.9575 5.90081 14.9008 6.14206C14.8441 6.38331 14.7025 6.59914 14.5 6.74539C14.3754 6.83748 14.2366 6.87997 14.0837 6.87997C13.7041 6.87997 13.3633 6.63872 13.2454 6.26956C12.8091 4.93456 11.7358 3.94289 10.3737 3.65247C9.87583 3.54872 9.61375 3.03956 9.7175 2.54164C9.785 2.23706 10.0116 1.98914 10.3 1.87831C10.5125 1.79331 10.7433 1.77914 10.9645 2.34372Z" fill="white" fill-opacity="0.36"/>
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
    { path: "/home", label: "Home", icon: homeIconSvg },
    { path: "/ai-studio", label: "AI Studio", icon: aiStudioIconSvg },
    { path: "/editors", label: "Editors", icon: editorsIconSvg },
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
        <div className="mb-8" data-testid="logo-container">
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
              letterSpacing: "0.5px",
              textTransform: "uppercase",
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
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded transition-colors"
                    style={{
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                      style={{
                        width: item.icon.includes('width="19"') ? "19px" : "17px",
                        height: item.icon.includes('height="19"') ? "19px" : "17px",
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
