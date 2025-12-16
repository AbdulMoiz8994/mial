import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronDown } from "lucide-react";

// Mock data for Instagram posts grouped by date
const mockPostsByDate = [
  {
    date: "Oct 6 Mon",
    isHighlighted: true,
    posts: [
      {
        id: 1,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
      },
      {
        id: 2,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
      },
    ],
  },
  {
    date: "Oct 7 Mon",
    posts: [
      {
        id: 3,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
        hasCaption: true,
        caption: "This new EQA is the perfect electric car. Change it to new C3 Aircross and drive in ever...more",
        hasMoreInfo: true,
        reactions: "24",
        responses: "3 responses",
      },
      {
        id: 4,
        time: "09:00",
        title: "Mercedes-Benz Belgium",
        account: "mercedesbenzbelgium",
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop",
        hasCaption: true,
        caption: "This new EQA is the perfect electric car. Change it to new C3 Aircross and drive in ever...more",
        hasMoreInfo: true,
        reactions: "24",
        responses: "3 responses",
      },
      {
        id: 5,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
        hasCaption: true,
        caption: "Yummy, really!",
      },
    ],
  },
  {
    date: "Oct 8 Mon",
    posts: [
      {
        id: 6,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
        hasCaption: true,
        caption: "This new EQA is the perfect electric car. Change it to new C3 Aircross and drive in ever...more",
        hasMoreInfo: true,
        reactions: "24",
        responses: "3 responses",
      },
      {
        id: 7,
        time: "09:00",
        title: "Mercedes-Benz Belgium",
        account: "mercedesbenzbelgium",
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop",
        hasCaption: true,
        caption: "This new EQA is the perfect electric car. Change it to new C3 Aircross and drive in ever...more",
        hasMoreInfo: true,
        reactions: "24",
        responses: "3 responses",
      },
      {
        id: 8,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
      },
    ],
  },
  {
    date: "Oct 9 Mon",
    posts: [
      {
        id: 9,
        time: "09:00",
        title: "Mercedes-Benz Belgium",
        account: "mercedesbenzbelgium",
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop",
        hasCaption: true,
        caption: "This new EQA is the perfect electric car. Change it to new C3 Aircross and drive in ever...more",
        hasMoreInfo: true,
        reactions: "24",
        responses: "3 responses",
      },
    ],
  },
  {
    date: "Oct 10 Mon",
    posts: [
      {
        id: 10,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
      },
      {
        id: 11,
        time: "09:00",
        title: "Before & After Transformation",
        account: "mia_art",
        verified: true,
        image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop",
        likes: "359",
        timeAgo: "5 days ago",
      },
    ],
  },
];

export default function Calendars() {
  const [selectedMonth] = useState("October 2025");
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  // Handle like button
  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Handle save/bookmark button
  const handleSave = (postId: number) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Handle comment button
  const handleComment = (postId: number) => {
    console.log("Comment on post:", postId);
    // You can implement a modal or redirect to comment section
  };

  // Handle share button
  const handleShare = (postId: number) => {
    console.log("Share post:", postId);
    // You can implement share functionality
  };

  // Handle menu actions
  const handleMenuClick = (postId: number) => {
    console.log("Menu clicked for post:", postId);
    // You can implement a dropdown menu
  };

  // Handle more info button
  const handleMoreInfo = (postId: number) => {
    console.log("More info for post:", postId);
    // You can implement expanding the post or showing a modal
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 min-h-full" style={{ backgroundColor: "#F5F5F5" }}>
        {/* White Container */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            padding: "24px",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Top Row - Month Title and Platform Selector */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
            {/* Month Section */}
            <div>
              <h1
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                  marginBottom: "4px",
                }}
              >
                {selectedMonth}
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#6B7280",
                }}
              >
                Here's what's happening with your content today
              </p>
            </div>

            {/* Platform Selector */}
            <div className="flex flex-col items-end gap-1">
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Select Platform
              </div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="focus:outline-none focus:border-[#CEA54F] transition-all"
                    style={{
                      padding: "6px 32px 6px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1A1A1A",
                      backgroundColor: "#FFFFFF",
                      cursor: "pointer",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                    }}
                  >
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Twitter</option>
                    <option>LinkedIn</option>
                    <option>TikTok</option>
                  </select>
                  <ChevronDown
                    size={14}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#6B7280",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid - Date Columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "0",
              alignItems: "start",
            }}
          >
            {mockPostsByDate.map((dateGroup, index) => (
              <div
                key={dateGroup.date}
                className="flex flex-col gap-4"
                style={{
                  paddingLeft: index === 0 ? "0" : "16px",
                  paddingRight: index === mockPostsByDate.length - 1 ? "0" : "16px",
                  borderRight: index === mockPostsByDate.length - 1 ? "none" : "1px solid #E5E7EB",
                }}
              >
                {/* Date Header */}
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: dateGroup.isHighlighted ? "20px" : "0",
                    backgroundColor: dateGroup.isHighlighted ? "#CEA54F" : "transparent",
                    width: dateGroup.isHighlighted ? "fit-content" : "100%",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: dateGroup.isHighlighted ? "#FFFFFF" : "#1A1A1A",
                    }}
                  >
                    {dateGroup.date}
                  </div>
                </div>

                {/* Posts for this date */}
                <div className="flex flex-col gap-4">
                  {dateGroup.posts.map((post) => (
                    <div
                      key={post.id}
                      className="transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        overflow: "hidden",
                      }}
                    >
                      {/* Post Header */}
                      <div
                        style={{
                          padding: "12px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                backgroundColor: "#1A1A1A",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#1F2937",
                                }}
                              >
                                {post.account}
                              </span>
                              {post.verified && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#3B82F6">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "10px",
                                fontWeight: 400,
                                color: "#9CA3AF",
                              }}
                            >
                              {post.title}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleMenuClick(post.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                            <circle cx="2" cy="2" r="2" fill="#D1D5DB" />
                            <circle cx="8" cy="2" r="2" fill="#D1D5DB" />
                            <circle cx="14" cy="2" r="2" fill="#D1D5DB" />
                          </svg>
                        </button>
                      </div>

                      {/* Post Time */}
                      <div
                        style={{
                          padding: "0 14px 12px 14px",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#1F2937",
                          }}
                        >
                          {post.time}
                        </div>
                      </div>

                      {/* Post Image */}
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "1/1",
                          position: "relative",
                        }}
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      {/* Post Actions */}
                      <div
                        style={{
                          padding: "12px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="transition-all hover:scale-110"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={likedPosts.has(post.id) ? "#EF4444" : "none"} stroke={likedPosts.has(post.id) ? "#EF4444" : "#1A1A1A"} strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleComment(post.id)}
                            className="transition-all hover:scale-110"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShare(post.id)}
                            className="transition-all hover:scale-110"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
                              <line x1="22" y1="2" x2="11" y2="13" />
                              <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => handleSave(post.id)}
                          className="transition-all hover:scale-110"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={savedPosts.has(post.id) ? "#1A1A1A" : "none"} stroke="#1A1A1A" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      </div>

                      {/* Likes and Time */}
                      {post.likes && (
                        <div
                          style={{
                            padding: "0 14px 12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#1F2937",
                            }}
                          >
                            {post.likes} likes
                          </div>
                          <div
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "10px",
                              fontWeight: 400,
                              color: "#9CA3AF",
                              marginTop: "2px",
                            }}
                          >
                            {post.timeAgo}
                          </div>
                        </div>
                      )}

                      {/* Caption */}
                      {post.hasCaption && post.caption && (
                        <div
                          style={{
                            padding: "0 14px 12px 14px",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              fontWeight: 400,
                              color: "#4B5563",
                              lineHeight: "1.4",
                            }}
                          >
                            {post.caption}
                          </p>
                        </div>
                      )}

                      {/* More Info Button */}
                      {post.hasMoreInfo && (
                        <div
                          style={{
                            padding: "12px 14px",
                            borderTop: "1px solid #F3F4F6",
                          }}
                        >
                          <button
                            onClick={() => handleMoreInfo(post.id)}
                            className="transition-all hover:opacity-80 hover:bg-gray-50"
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: "6px",
                              backgroundColor: "transparent",
                              border: "1px solid #E5E7EB",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#1A1A1A",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                            }}
                          >
                            More information
                          </button>
                          {post.reactions && post.responses && (
                            <div
                              className="flex items-center gap-3 mt-3"
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              <div className="flex items-center gap-1">
                                <div
                                  style={{
                                    display: "flex",
                                    marginLeft: "-4px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      borderRadius: "50%",
                                      backgroundColor: "#3B82F6",
                                      border: "2px solid white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span style={{ fontSize: "10px" }}>👍</span>
                                  </div>
                                  <div
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      borderRadius: "50%",
                                      backgroundColor: "#EF4444",
                                      border: "2px solid white",
                                      marginLeft: "-6px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span style={{ fontSize: "10px" }}>❤️</span>
                                  </div>
                                  <div
                                    style={{
                                      width: "18px",
                                      height: "18px",
                                      borderRadius: "50%",
                                      backgroundColor: "#F59E0B",
                                      border: "2px solid white",
                                      marginLeft: "-6px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <span style={{ fontSize: "10px" }}>😮</span>
                                  </div>
                                </div>
                                <span
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "11px",
                                    fontWeight: 400,
                                    color: "#6B7280",
                                    marginLeft: "4px",
                                  }}
                                >
                                  {post.reactions}
                                </span>
                              </div>
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "11px",
                                  fontWeight: 400,
                                  color: "#6B7280",
                                }}
                              >
                                {post.responses}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
