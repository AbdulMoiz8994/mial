import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Type, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import contentImage1 from "@assets/stock_images/woman_with_beautiful_9897c48b.jpg";
import contentImage2 from "@assets/stock_images/woman_with_beautiful_067e63a9.jpg";
import contentImage3 from "@assets/stock_images/woman_with_beautiful_13b91479.jpg";

type TabType = "templates" | "drafts";

interface Template {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface Draft {
  id: number;
  image: string;
  caption: string;
  hashtags: string[];
  savedAt: string;
}

const DesignIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ElementsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke="white"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke="white"
      strokeWidth="2"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
      stroke="white"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
      stroke="white"
      strokeWidth="2"
    />
  </svg>
);

export default function Editors() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [captionText, setCaptionText] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: 1,
      image: contentImage1,
      caption: "Check out this amazing transformation! 🌟",
      hashtags: ["#HairStyle", "#Salon"],
      savedAt: new Date().toISOString(),
    },
  ]);

  // Template thumbnails data with different images - converted to state
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 0,
      image: contentImage1,
      title: "5 Trending Hairstyles for Fall",
      description:
        "Showcase autumn-inspired balayage tones and seasonal color trends",
    },
    {
      id: 1,
      image: contentImage2,
      title: "Summer Hair Trends 2024",
      description:
        "Beach waves and sun-kissed highlights for the perfect summer look",
    },
    {
      id: 2,
      image: contentImage3,
      title: "Classic Elegance",
      description: "Timeless hairstyles that never go out of fashion",
    },
    {
      id: 3,
      image: contentImage1,
      title: "Bold & Beautiful",
      description: "Make a statement with these bold hair color choices",
    },
    {
      id: 4,
      image: contentImage2,
      title: "Wedding Hair Inspiration",
      description: "Perfect hairstyles for your special day",
    },
    {
      id: 5,
      image: contentImage3,
      title: "Quick & Easy Styles",
      description: "Effortless hairstyles for busy mornings",
    },
  ]);

  const tabs = [
    { id: "templates" as const, label: "Templates" },
    { id: "drafts" as const, label: "Drafts" },
  ];

  const maxCharacters = 2200;

  const hashtags = [
    "#hairstyle",
    "#Salon",
    "#Haircare",
    "#Beauty",
    "#Hairstyle",
    "#HairGoals",
    "#SalonLife",
    "#BeautyTips",
    "#HairInspiration",
    "#StyleGoals",
  ];

  const currentTemplate = templates[selectedTemplate];

  // Handlers
  const handleSaveAsDraft = () => {
    const newDraft: Draft = {
      id: Date.now(),
      image: currentTemplate.image,
      caption: captionText,
      hashtags: hashtags.slice(0, 3),
      savedAt: new Date().toISOString(),
    };
    setDrafts([newDraft, ...drafts]);
    toast({
      title: "Draft Saved",
      description: "Your content has been saved to drafts.",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Published Successfully",
      description: "Your content has been published and is now live!",
    });
  };

  const handleCopyHashtag = (hashtag: string) => {
    navigator.clipboard.writeText(hashtag);
    toast({
      title: "Copied",
      description: `${hashtag} copied to clipboard`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onloadstart = () => {
          toast({
            title: "Upload Started",
            description: `Uploading ${file.name}...`,
          });
        };

        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;

          // Add the new image as a template
          const newTemplate: Template = {
            id: templates.length,
            image: imageUrl,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            description: "Your uploaded custom image",
          };

          // Add to templates array using state setter
          setTemplates([...templates, newTemplate]);

          // Select the newly uploaded template
          setSelectedTemplate(newTemplate.id);

          toast({
            title: "Upload Complete",
            description: `${file.name} has been added to your templates!`,
          });

          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };

        reader.onerror = () => {
          toast({
            title: "Upload Failed",
            description: "There was an error uploading your file.",
            variant: "destructive",
          });
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please upload an image file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      toast({
        title: "Error",
        description: "File upload is not available. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToolClick = (tool: string) => {
    toast({
      title: `${tool} Tool`,
      description: `${tool} tool functionality coming soon!`,
    });
  };

  const handleDeleteDraft = (draftId: number) => {
    setDrafts(drafts.filter((d) => d.id !== draftId));
    toast({
      title: "Draft Deleted",
      description: "The draft has been removed.",
    });
  };

  return (
    <DashboardLayout>
      {/* Page with light gray background */}
      <div
        className="p-4 md:p-6 space-y-4 md:space-y-5"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        {/* Main White Card Container */}
        <div
          className="h-max flex flex-col"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            paddingTop: "24px",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Page Header */}
          <div className="px-4 md:px-6 mb-4">
            <h1
              className="text-lg sm:text-xl mb-1"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "#202020",
              }}
            >
              Editors
            </h1>
            <p
              className="text-xs sm:text-sm"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                color: "#6B7280",
              }}
            >
              Here's what's happening with your content today
            </p>
          </div>

          {/* Divider Line */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#EBEBEB",
              marginTop: "16px",
            }}
          />

          {/* Main Content Area - Three Column Layout */}
          <div className="flex flex-col lg:flex-row justify-center items-start gap-4 m-3 md:m-6">
            {activeTab === "templates" && (
              <div className="flex flex-col lg:flex-row flex-wrap justify-center items-start gap-4">
                {/* Left Panel - Templates Sidebar */}
                <div
                  className="w-full lg:w-[370px] xl:w-[30%]"
                  style={{
                    maxHeight: "660px",
                    backgroundColor: "#F0F0F0",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    padding: "18px",
                    gap: "15px",
                    border: "1px solid #DADADA",
                    borderRadius: "12px",
                  }}
                >
                  {/* Tabs above everything */}
                  <div
                    className="flex items-center"
                    style={{
                      position: "relative",
                      borderBottom: "1px solid #E0E0E0",
                    }}
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="transition-all"
                        style={{
                          width: "100%",
                          padding: "12px 10px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          backgroundColor: "transparent",
                          color: activeTab === tab.id ? "#000000" : "#B0B0B0",
                          border: "none",
                          borderBottom:
                            activeTab === tab.id ? "2px solid #000000" : "none",
                          cursor: "pointer",
                          position: "relative",
                          marginBottom: "-1px",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Main content area - Icons LEFT, Templates RIGHT */}
                  <div className="flex flex-row overflow-hidden gap-3 sm:gap-5">
                    {/* Left side - Tools Section */}
                    <div className="flex flex-col gap-2 sm:gap-[10px]">
                      <button
                        onClick={() => handleToolClick("Design")}
                        className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                        style={{
                          backgroundColor: "#1A1A1A",
                          borderRadius: "16px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          gap: "4px",
                        }}
                      >
                        <DesignIcon />
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#FFFFFF",
                            fontWeight: 500,
                          }}
                        >
                          Design
                        </span>
                      </button>
                      <button
                        onClick={() => handleToolClick("Elements")}
                        className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                        style={{
                          backgroundColor: "#1A1A1A",
                          borderRadius: "16px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          gap: "4px",
                        }}
                      >
                        <ElementsIcon />
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#FFFFFF",
                            fontWeight: 500,
                          }}
                        >
                          Elements
                        </span>
                      </button>
                      <button
                        onClick={() => handleToolClick("Text")}
                        className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                        style={{
                          backgroundColor: "#1A1A1A",
                          borderRadius: "16px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          gap: "4px",
                        }}
                      >
                        <Type size={24} color="white" />
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#FFFFFF",
                            fontWeight: 500,
                          }}
                        >
                          Text
                        </span>
                      </button>
                      <button
                        onClick={handleUploadClick}
                        className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                        style={{
                          backgroundColor: "#1A1A1A",
                          borderRadius: "16px",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          gap: "4px",
                        }}
                      >
                        <Upload size={24} color="white" />
                        <span
                          style={{
                            fontSize: "9px",
                            color: "#FFFFFF",
                            fontWeight: 500,
                          }}
                        >
                          Uploads
                        </span>
                      </button>
                    </div>

                    {/* Right side - Template Thumbnails Grid */}
                    <div
                      className="custom-scrollbar overflow-y-auto"
                      style={{ maxHeight: "500px" }}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 sm:gap-[10px]">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className="transition-all"
                            style={{
                              width: "100%",
                              aspectRatio: "3/4",
                              borderRadius: "16px",
                              border:
                                selectedTemplate === template.id
                                  ? "3px solid #D4A855"
                                  : "2px solid #DADADA",
                              padding: "0",
                              backgroundColor: "#FFFFFF",
                              cursor: "pointer",
                              overflow: "hidden",
                              boxSizing: "border-box",
                              boxShadow:
                                selectedTemplate === template.id
                                  ? "0 4px 14px rgba(212, 168, 85, 0.35)"
                                  : "0 2px 6px rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            <img
                              src={template.image}
                              alt={`Template ${template.id + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "13px",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Upload Media Button */}
                  <div className="my-5">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <button
                      onClick={handleUploadClick}
                      className="w-full transition-all hover:opacity-90"
                      style={{
                        padding: "10px 24px",
                        borderRadius: "50px",
                        backgroundColor: "#000000",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      Upload Media
                    </button>
                  </div>
                </div>

                {/* Center Panel - Preview */}
                <div className="w-full lg:flex-1 xl:w-[40%]">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#F2F2F2",
                      padding: "16px",
                      overflow: "auto",
                      borderRadius: "18px",
                      border: "1px solid #DADADA",
                    }}
                  >
                    {/* Image Section */}
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "7/5",
                        overflow: "hidden",
                        borderRadius: "15px",
                      }}
                    >
                      <img
                        src={currentTemplate.image}
                        alt={currentTemplate.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                        }}
                      />
                    </div>

                    {/* Content Section Below Image */}
                    <div
                      style={{
                        padding: "20px 5px 0px 5px",
                        width: "100%",
                      }}
                    >
                      {/* Title */}
                      <h2
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "22px",
                          fontWeight: 700,
                          color: "#1F2937",
                          marginBottom: "14px",
                          lineHeight: "1.3",
                        }}
                      >
                        {currentTemplate.title}
                      </h2>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#000000B2",
                          marginBottom: "18px",
                          lineHeight: "1.6",
                        }}
                      >
                        {currentTemplate.description}
                      </p>

                      {/* Hashtags */}
                      <div className="flex gap-3 flex-wrap mb-5">
                        <span
                          style={{
                            padding: "10px 18px",
                            borderRadius: "25px",
                            backgroundColor: "#CCCCCC",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#00000080",
                          }}
                        >
                          #HairCare
                        </span>
                        <span
                          style={{
                            padding: "10px 18px",
                            borderRadius: "25px",
                            backgroundColor: "#CCCCCC",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#00000080",
                          }}
                        >
                          #FallVibes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-stretch sm:items-center mt-5 gap-3">
                    <button
                      onClick={handleSaveAsDraft}
                      className="transition-all hover:opacity-90 flex-1 sm:flex-initial"
                      style={{
                        padding: "8px 50px",
                        borderRadius: "20px",
                        backgroundColor: "#FFFFFF",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1A1A1A",
                        border: "1px solid #E5E7EB",
                        cursor: "pointer",
                      }}
                    >
                      Draft
                    </button>
                    <button
                      onClick={handlePublish}
                      className="transition-all hover:opacity-90 flex-1 sm:flex-initial"
                      style={{
                        padding: "8px 50px",
                        borderRadius: "20px",
                        background:
                          "linear-gradient(135deg, #D4A855 0%, #CEA54F 100%)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 3px 12px rgba(206, 165, 79, 0.4)",
                      }}
                    >
                      Publish
                    </button>
                  </div>
                </div>

                {/* Right Panel - AI Captions */}
                <div
                  className="w-full lg:w-[340px] xl:w-[30%]"
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #DADADA",
                    display: "flex",
                    flexDirection: "column",
                    height: "660px",
                    overflow: "hidden",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                >
                  {/* Header */}
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000000B2",
                    }}
                  >
                    Ai Captions
                  </h3>

                  {/* Caption Content */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      marginTop: "20px",
                    }}
                  >
                    {/* Caption Text */}
                    <div
                      style={{
                        padding: "16px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      <textarea
                        value={captionText}
                        onChange={(e) => setCaptionText(e.target.value)}
                        onBlur={() => {
                          if (captionText.length > maxCharacters) {
                            setCaptionText(captionText.slice(0, maxCharacters));
                          }
                        }}
                        autoFocus
                        maxLength={maxCharacters}
                        placeholder="Transform your look with our expert stylists! Swipe to see the amazing results. What style would we try next? 🌟"
                        className="w-full focus:outline-none"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#374151",
                          lineHeight: "1.5",
                          backgroundColor: "transparent",
                          border: "none",
                          resize: "none",
                          minHeight: "100px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#000000B2",
                        marginLeft: "10px",
                      }}
                    >
                      {captionText.length} / {maxCharacters} characters
                    </div>

                    {/* Hashtags Section */}
                    <div className="mt-7">
                      <h4
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#1F2937",
                          marginBottom: "12px",
                        }}
                      >
                        Hashtags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hashtags.map((hashtag, index) => (
                          <button
                            key={index}
                            onClick={() => handleCopyHashtag(hashtag)}
                            className="transition-all hover:bg-[#E5E7EB] hover:scale-105"
                            style={{
                              padding: "8px 14px",
                              borderRadius: "18px",
                              backgroundColor: "#EAEAEA",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#6B7280",
                              cursor: "pointer",
                            }}
                          >
                            {hashtag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Drafts Tab Content */}
            {activeTab === "drafts" && (
              <div
                className="flex-1 p-4 sm:p-6 md:p-8"
                style={{ backgroundColor: "#F9FAFB" }}
              >
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <h2
                    className="text-base sm:text-lg"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "24px",
                    }}
                  >
                    Your Drafts ({drafts.length})
                  </h2>

                  {drafts.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "80px 20px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "16px",
                          color: "#6B7280",
                        }}
                      >
                        No drafts yet. Create your first draft from the
                        Templates tab!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {drafts.map((draft) => (
                        <div
                          key={draft.id}
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                            border: "1px solid #E5E7EB",
                          }}
                        >
                          {/* Draft Image */}
                          <div style={{ position: "relative" }}>
                            <img
                              src={draft.image}
                              alt="Draft"
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                          </div>

                          {/* Draft Content */}
                          <div style={{ padding: "20px" }}>
                            <p
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#374151",
                                lineHeight: "1.6",
                                marginBottom: "12px",
                              }}
                            >
                              {draft.caption}
                            </p>

                            {/* Hashtags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {draft.hashtags.map((hashtag, index) => (
                                <span
                                  key={index}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "16px",
                                    backgroundColor: "#F3F4F6",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#4B5563",
                                  }}
                                >
                                  {hashtag}
                                </span>
                              ))}
                            </div>

                            {/* Draft Metadata */}
                            <p
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                color: "#9CA3AF",
                                marginBottom: "16px",
                              }}
                            >
                              Saved{" "}
                              {new Date(draft.savedAt).toLocaleDateString()}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setActiveTab("templates");
                                  setCaptionText(draft.caption);
                                }}
                                className="flex-1 transition-all hover:opacity-90"
                                style={{
                                  padding: "10px",
                                  borderRadius: "20px",
                                  backgroundColor: "#FFFFFF",
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#1A1A1A",
                                  border: "1px solid #E5E7EB",
                                  cursor: "pointer",
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDraft(draft.id)}
                                className="flex-1 transition-all hover:opacity-90"
                                style={{
                                  padding: "10px",
                                  borderRadius: "20px",
                                  backgroundColor: "#FEE2E2",
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#DC2626",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
