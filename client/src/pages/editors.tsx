import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Type,
  Upload,
  X,
  Circle,
  Square,
  Star,
  Sparkles,
  Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import contentImage1 from "@assets/stock_images/woman_with_beautiful_9897c48b.jpg";
import contentImage2 from "@assets/stock_images/woman_with_beautiful_067e63a9.jpg";
import contentImage3 from "@assets/stock_images/woman_with_beautiful_13b91479.jpg";

type TabType = "templates" | "drafts";
type EditorPanelType = "templates" | "elements" | "text";

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
  templateId: number;
  canvasElements: CanvasElement[];
}

interface CanvasElement {
  id: string;
  type: "shape" | "text";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    fontFamily?: string;
    fontStyle?: string;
    letterSpacing?: string;
    textTransform?: string;
  };
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
  const [editorPanel, setEditorPanel] = useState<EditorPanelType>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);
  const [captionText, setCaptionText] = useState("");
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [recentElements, setRecentElements] = useState<
    Array<{ type: "shape" | "text"; content: string; timestamp: number }>
  >([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const canvasRef = useRef<HTMLDivElement>(null);

  const colorPalette = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080", // Purple
    "#FFC0CB", // Pink
    "#A52A2A", // Brown
    "#808080", // Gray
    "#FFD700", // Gold
    "#C0C0C0", // Silver
  ];
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: 1,
      image: contentImage1,
      caption: "Check out this amazing transformation! 🌟",
      hashtags: ["#HairStyle", "#Salon"],
      savedAt: new Date().toISOString(),
      templateId: 0,
      canvasElements: [],
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
    // Check if we're actually editing an existing draft by verifying the draft exists and matches current template
    const existingDraft = selectedDraftId !== null
      ? drafts.find(d => d.id === selectedDraftId && d.templateId === selectedTemplate)
      : null;

    if (existingDraft) {
      // Update existing draft
      setDrafts(
        drafts.map((draft) =>
          draft.id === selectedDraftId
            ? {
                ...draft,
                caption: captionText,
                canvasElements: [...canvasElements],
                savedAt: new Date().toISOString(),
              }
            : draft
        )
      );
      toast({
        title: "Draft Updated",
        description: "Your changes have been saved.",
      });
      // Switch to drafts tab to show the updated draft
      setActiveTab("drafts");
    } else {
      // Create new draft
      const newDraft: Draft = {
        id: Date.now(),
        image: currentTemplate.image,
        caption: captionText,
        hashtags: hashtags.slice(0, 3),
        savedAt: new Date().toISOString(),
        templateId: selectedTemplate,
        canvasElements: [...canvasElements],
      };
      setDrafts([newDraft, ...drafts]);
      setSelectedDraftId(newDraft.id); // Set the newly created draft as selected
      toast({
        title: "Draft Saved",
        description: "Your content has been saved to drafts.",
      });
      // Switch to drafts tab to show the new draft
      setActiveTab("drafts");
    }
  };

  const handlePublish = () => {
    toast({
      title: "Published Successfully",
      description: "Your content has been published and is now live!",
    });
  };

  const handleCopyHashtag = (hashtag: string) => {
    // Add hashtag to caption text
    const newCaption = captionText
      ? `${captionText} ${hashtag}`
      : hashtag;

    // Ensure we don't exceed max characters
    if (newCaption.length <= maxCharacters) {
      setCaptionText(newCaption);
      toast({
        title: "Hashtag Added",
        description: `${hashtag} added to caption`,
      });
    } else {
      toast({
        title: "Caption Too Long",
        description: `Adding ${hashtag} would exceed character limit`,
        variant: "destructive",
      });
    }
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
    if (tool === "Elements") {
      setEditorPanel("elements");
    } else if (tool === "Text") {
      setEditorPanel("text");
    } else if (tool === "Design") {
      setEditorPanel("templates");
    } else {
      toast({
        title: `${tool} Tool`,
        description: `${tool} tool functionality coming soon!`,
      });
    }
  };

  const addToRecent = (type: "shape" | "text", content: string) => {
    const newRecent = { type, content, timestamp: Date.now() };
    const filtered = recentElements.filter(
      (el) => !(el.type === type && el.content === content)
    );
    setRecentElements([newRecent, ...filtered].slice(0, 6));
  };

  const handleShapeClick = (shape: string) => {
    const newElement: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      content: shape,
      position: { x: 50, y: 50 },
      size: { width: 50, height: 50 },
      style: { color: selectedColor },
    };
    setCanvasElements([...canvasElements, newElement]);
    addToRecent("shape", shape);
    toast({
      title: "Shape Added",
      description: `Drag to move, resize corners, double-click to remove.`,
    });
  };

  const handleTextStyleClick = (style: string) => {
    let fontSize = selectedFontSize; // Use selected font size by default
    let fontWeight = "600";
    let fontFamily = "Inter, sans-serif";
    let fontStyle = "normal";
    let letterSpacing = "normal";
    let textTransform = "none";
    let content = "";

    // Heading styles - keep their default sizes
    if (style === "Heading 1") {
      fontSize = "32px";
      fontWeight = "700";
      content = "Add your heading";
    } else if (style === "Heading 2") {
      fontSize = "24px";
      fontWeight = "700";
      content = "Add a subheading";
    } else if (style === "Heading 3") {
      fontSize = "18px";
      fontWeight = "700";
      content = "Add text here";
    }
    // Font Combo styles - use selected font size
    else if (style === "Font Combo 1") {
      fontFamily = "Georgia, serif";
      fontWeight = "700";
      content = "Classic Text";
    } else if (style === "Font Combo 2") {
      fontFamily = "Arial, sans-serif";
      fontWeight = "900";
      letterSpacing = "-0.5px";
      content = "BOLD TEXT";
    } else if (style === "Font Combo 3") {
      fontFamily = "Courier New, monospace";
      fontWeight = "700";
      content = "Retro Style";
    } else if (style === "Font Combo 4") {
      fontFamily = "Impact, sans-serif";
      fontWeight = "400";
      textTransform = "uppercase";
      content = "IMPACT";
    } else if (style === "Font Combo 5") {
      fontFamily = "Verdana, sans-serif";
      fontWeight = "600";
      content = "Clean Text";
    } else if (style === "Font Combo 6") {
      fontFamily = "Times New Roman, serif";
      fontWeight = "700";
      fontStyle = "italic";
      content = "Serif Style";
    } else {
      content = `Font ${style}`;
    }

    const newElement: CanvasElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      style: {
        fontSize,
        fontWeight,
        color: selectedColor,
        fontFamily,
        fontStyle,
        letterSpacing,
        textTransform,
      },
    };
    setCanvasElements([...canvasElements, newElement]);
    addToRecent("text", style);
    toast({
      title: "Text Added",
      description: `Drag to move, resize corners, double-click to remove.`,
    });
  };

  const handleColorChange = (elementId: string, color: string) => {
    setCanvasElements(
      canvasElements.map((el) =>
        el.id === elementId ? { ...el, style: { ...el.style, color } } : el
      )
    );
  };

  const handleRemoveElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCanvasElements(canvasElements.filter((el) => el.id !== id));
    toast({
      title: "Element Removed",
      description: "Element removed from canvas",
    });
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const element = canvasElements.find((el) => el.id === id);
    if (!element || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX =
      ((e.clientX - rect.left) / rect.width) * 100 - element.position.x;
    const offsetY =
      ((e.clientY - rect.top) / rect.height) * 100 - element.position.y;

    setDraggingId(id);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();

    // Handle dragging
    if (draggingId) {
      const x = Math.max(
        5,
        Math.min(
          95,
          ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x
        )
      );
      const y = Math.max(
        5,
        Math.min(
          95,
          ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y
        )
      );

      setCanvasElements(
        canvasElements.map((el) =>
          el.id === draggingId ? { ...el, position: { x, y } } : el
        )
      );
    }

    // Handle resizing
    if (resizingId) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const deltaX = mouseX - resizeStart.x;
      const deltaY = mouseY - resizeStart.y;

      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === resizingId) {
            const newWidth = Math.max(30, resizeStart.width + deltaX);
            const newHeight = Math.max(30, resizeStart.height + deltaY);
            return { ...el, size: { width: newWidth, height: newHeight } };
          }
          return el;
        })
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
  };

  const handleResizeStart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const element = canvasElements.find((el) => el.id === id);
    if (!element || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setResizingId(id);
    setResizeStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: element.size.width,
      height: element.size.height,
    });
  };

  const handleDeleteDraft = (draftId: number) => {
    setDrafts(drafts.filter((d) => d.id !== draftId));
    if (selectedDraftId === draftId) {
      setSelectedDraftId(null);
    }
    toast({
      title: "Draft Deleted",
      description: "The draft has been removed.",
    });
  };

  const handleEditDraft = (draftId: number) => {
    const draft = drafts.find((d) => d.id === draftId);
    if (draft) {
      setSelectedDraftId(draftId);
      setSelectedTemplate(draft.templateId);
      setCaptionText(draft.caption);
      setCanvasElements([...draft.canvasElements]);
      setEditorPanel("templates");
    }
  };

  const handleNewContent = () => {
    setSelectedDraftId(null);
    setCaptionText("");
    setCanvasElements([]);
    setEditorPanel("templates");
  };

  const handleTextClick = (
    elementId: string,
    currentText: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingId(elementId);
    setEditingText(currentText);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const handleTextBlur = () => {
    if (editingId && editingText.trim()) {
      setCanvasElements(
        canvasElements.map((el) =>
          el.id === editingId ? { ...el, content: editingText } : el
        )
      );
    }
    setEditingId(null);
    setEditingText("");
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTextBlur();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingText("");
    }
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
            <div className="flex flex-col lg:flex-row flex-wrap justify-center items-start gap-4">
              {/* Left Panel - Templates/Drafts Sidebar */}
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

                {/* Templates Tab Content */}
                {activeTab === "templates" && (
                  <>
                    {/* Main content area - Icons LEFT, Content RIGHT */}
                    <div className="flex flex-row overflow-hidden gap-3 sm:gap-5">
                      {/* Left side - Tools Section */}
                      <div className="flex flex-col gap-2 sm:gap-[10px]">
                        <button
                          onClick={() => handleToolClick("Design")}
                          className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                          style={{
                            backgroundColor:
                              editorPanel === "templates"
                                ? "#D4A855"
                                : "#1A1A1A",
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
                            backgroundColor:
                              editorPanel === "elements"
                                ? "#D4A855"
                                : "#1A1A1A",
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
                            backgroundColor:
                              editorPanel === "text" ? "#D4A855" : "#1A1A1A",
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

                      {/* Right side - Dynamic Content Panel */}
                      <div
                        className="custom-scrollbar overflow-y-auto flex-1"
                        style={{ maxHeight: "500px" }}
                      >
                        {/* Templates Panel */}
                        {editorPanel === "templates" && (
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
                        )}

                        {/* Elements Panel (Shapes) */}
                        {editorPanel === "elements" && (
                          <div className="space-y-5">
                            {/* Title */}
                            <div className="flex items-center justify-between">
                              <h3
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "#000000",
                                }}
                              >
                                Shapes
                              </h3>
                              <button
                                onClick={() => setEditorPanel("templates")}
                                className="transition-all hover:opacity-70"
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <X size={20} color="#666666" />
                              </button>
                            </div>

                            {/* Color Picker */}
                            <div>
                              <h4
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#666666",
                                  marginBottom: "12px",
                                }}
                              >
                                Shape Color
                              </h4>
                              <div className="flex gap-2 flex-wrap items-center">
                                {colorPalette.map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className="transition-all hover:scale-110"
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: color,
                                      border:
                                        selectedColor === color
                                          ? "3px solid #D4A855"
                                          : color === "#FFFFFF"
                                          ? "2px solid #DADADA"
                                          : "2px solid transparent",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                      boxShadow:
                                        selectedColor === color
                                          ? "0 2px 8px rgba(212, 168, 85, 0.4)"
                                          : "0 1px 3px rgba(0, 0, 0, 0.1)",
                                    }}
                                    title={color}
                                  />
                                ))}
                                <div style={{ position: "relative" }}>
                                  <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(e) =>
                                      setSelectedColor(e.target.value)
                                    }
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      border: "none",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                      opacity: 0,
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                    }}
                                    title="Custom color"
                                  />
                                  <div
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      background:
                                        "conic-gradient(from 0deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
                                      border: "2px solid #DADADA",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                      pointerEvents: "none",
                                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Recent Used Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#666666",
                                  }}
                                >
                                  Recent Used
                                </h4>
                                {recentElements.filter(
                                  (el) => el.type === "shape"
                                ).length > 0 && (
                                  <button
                                    onClick={() =>
                                      setRecentElements(
                                        recentElements.filter(
                                          (el) => el.type !== "shape"
                                        )
                                      )
                                    }
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      color: "#999999",
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                              {recentElements.filter(
                                (el) => el.type === "shape"
                              ).length === 0 ? (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100px",
                                    backgroundColor: "#E5E5E5",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "12px",
                                      color: "#999999",
                                    }}
                                  >
                                    No recent shapes
                                  </span>
                                </div>
                              ) : (
                                <div className="flex gap-2 flex-wrap">
                                  {recentElements
                                    .filter((el) => el.type === "shape")
                                    .slice(0, 6)
                                    .map((item, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() =>
                                          handleShapeClick(item.content)
                                        }
                                        className="transition-all hover:opacity-70"
                                        style={{
                                          width: "48px",
                                          height: "48px",
                                          backgroundColor: "#000000",
                                          border: "none",
                                          borderRadius: "8px",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {item.content === "5-Point Star" && (
                                          <Star
                                            size={24}
                                            color="#FFFFFF"
                                            fill="#FFFFFF"
                                          />
                                        )}
                                        {item.content === "4-Point Star" && (
                                          <Sparkles size={24} color="#FFFFFF" />
                                        )}
                                        {item.content === "Decorative Star" && (
                                          <Star size={24} color="#FFFFFF" />
                                        )}
                                        {item.content === "Horizontal Line" && (
                                          <Minus size={24} color="#FFFFFF" />
                                        )}
                                      </button>
                                    ))}
                                </div>
                              )}
                            </div>

                            {/* Lines Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#666666",
                                  }}
                                >
                                  Lines
                                </h4>
                                <button
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#999999",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  See all
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleShapeClick("Horizontal Line")
                                  }
                                  className="transition-all hover:opacity-70"
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #DADADA",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Minus size={24} color="#000000" />
                                </button>
                              </div>
                            </div>

                            {/* Star Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "#666666",
                                  }}
                                >
                                  Star
                                </h4>
                                <button
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    color: "#999999",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  See all
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleShapeClick("5-Point Star")
                                  }
                                  className="transition-all hover:opacity-70"
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "#000000",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Star
                                    size={24}
                                    color="#FFFFFF"
                                    fill="#FFFFFF"
                                  />
                                </button>
                                <button
                                  onClick={() =>
                                    handleShapeClick("4-Point Star")
                                  }
                                  className="transition-all hover:opacity-70"
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "#000000",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Sparkles size={24} color="#FFFFFF" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleShapeClick("Decorative Star")
                                  }
                                  className="transition-all hover:opacity-70"
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    backgroundColor: "#000000",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Star size={24} color="#FFFFFF" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Text Panel */}
                        {editorPanel === "text" && (
                          <div className="space-y-5">
                            {/* Title */}
                            <div className="flex items-center justify-between">
                              <h3
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "#000000",
                                }}
                              >
                                Default text styles
                              </h3>
                              <button
                                onClick={() => setEditorPanel("templates")}
                                className="transition-all hover:opacity-70"
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <X size={20} color="#666666" />
                              </button>
                            </div>

                            {/* Color Picker */}
                            <div>
                              <h4
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#666666",
                                  marginBottom: "12px",
                                }}
                              >
                                Text Color
                              </h4>
                              <div className="flex gap-2 flex-wrap items-center">
                                {colorPalette.map((color) => (
                                  <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className="transition-all hover:scale-110"
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: color,
                                      border:
                                        selectedColor === color
                                          ? "3px solid #D4A855"
                                          : color === "#FFFFFF"
                                          ? "2px solid #DADADA"
                                          : "2px solid transparent",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                      boxShadow:
                                        selectedColor === color
                                          ? "0 2px 8px rgba(212, 168, 85, 0.4)"
                                          : "0 1px 3px rgba(0, 0, 0, 0.1)",
                                    }}
                                    title={color}
                                  />
                                ))}
                                <div style={{ position: "relative" }}>
                                  <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(e) =>
                                      setSelectedColor(e.target.value)
                                    }
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      border: "none",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                      opacity: 0,
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                    }}
                                    title="Custom color"
                                  />
                                  <div
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      background:
                                        "conic-gradient(from 0deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
                                      border: "2px solid #DADADA",
                                      borderRadius: "50%",
                                      cursor: "pointer",
                                      pointerEvents: "none",
                                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Font Size Selector */}
                            <div>
                              <h4
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#666666",
                                  marginBottom: "12px",
                                }}
                              >
                                Font Size
                              </h4>
                              <div className="grid grid-cols-5 gap-2">
                                {[
                                  "12px",
                                  "14px",
                                  "16px",
                                  "18px",
                                  "20px",
                                  "24px",
                                  "28px",
                                  "32px",
                                  "36px",
                                  "48px",
                                ].map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setSelectedFontSize(size)}
                                    className="transition-all hover:border-gray-400"
                                    style={{
                                      padding: "8px 4px",
                                      backgroundColor:
                                        selectedFontSize === size
                                          ? "#D4A855"
                                          : "#FFFFFF",
                                      border:
                                        selectedFontSize === size
                                          ? "2px solid #D4A855"
                                          : "1px solid #E5E5E5",
                                      borderRadius: "8px",
                                      cursor: "pointer",
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      color:
                                        selectedFontSize === size
                                          ? "#FFFFFF"
                                          : "#000000",
                                    }}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Add a heading */}
                            <div>
                              <h4
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#666666",
                                  marginBottom: "12px",
                                }}
                              >
                                Add a heading
                              </h4>
                              <div className="space-y-2">
                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Heading 1")
                                  }
                                  className="w-full transition-all hover:bg-gray-50"
                                  style={{
                                    padding: "12px 16px",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    color: "#000000",
                                  }}
                                >
                                  Add a heading
                                </button>
                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Heading 2")
                                  }
                                  className="w-full transition-all hover:bg-gray-50"
                                  style={{
                                    padding: "12px 16px",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "#000000",
                                  }}
                                >
                                  Add a subheading
                                </button>
                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Heading 3")
                                  }
                                  className="w-full transition-all hover:bg-gray-50"
                                  style={{
                                    padding: "12px 16px",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                    color: "#000000",
                                  }}
                                >
                                  Add a little bit of body text
                                </button>
                              </div>
                            </div>

                            {/* Font Combinations */}
                            <div>
                              <h4
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  color: "#666666",
                                  marginBottom: "12px",
                                }}
                              >
                                Font Combinations
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Font Combo 1")
                                  }
                                  className="transition-all hover:border-gray-400"
                                  style={{
                                    aspectRatio: "1/1",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px",
                                    gap: "4px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Georgia, serif",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      color: "#000000",
                                    }}
                                  >
                                    Classic
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "10px",
                                      fontWeight: 400,
                                      color: "#666666",
                                    }}
                                  >
                                    Elegant
                                  </span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Font Combo 2")
                                  }
                                  className="transition-all hover:border-gray-400"
                                  style={{
                                    aspectRatio: "1/1",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px",
                                    gap: "4px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      fontSize: "14px",
                                      fontWeight: 900,
                                      color: "#000000",
                                      letterSpacing: "-0.5px",
                                    }}
                                  >
                                    BOLD
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      fontSize: "10px",
                                      fontWeight: 300,
                                      color: "#666666",
                                    }}
                                  >
                                    Modern
                                  </span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Font Combo 3")
                                  }
                                  className="transition-all hover:border-gray-400"
                                  style={{
                                    aspectRatio: "1/1",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px",
                                    gap: "4px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Courier New, monospace",
                                      fontSize: "13px",
                                      fontWeight: 700,
                                      color: "#000000",
                                    }}
                                  >
                                    Retro
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Courier New, monospace",
                                      fontSize: "9px",
                                      fontWeight: 400,
                                      color: "#666666",
                                    }}
                                  >
                                    Typewriter
                                  </span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Font Combo 4")
                                  }
                                  className="transition-all hover:border-gray-400"
                                  style={{
                                    aspectRatio: "1/1",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px",
                                    gap: "4px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Impact, sans-serif",
                                      fontSize: "15px",
                                      fontWeight: 400,
                                      color: "#000000",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Impact
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Arial, sans-serif",
                                      fontSize: "9px",
                                      fontWeight: 400,
                                      color: "#666666",
                                    }}
                                  >
                                    Strong
                                  </span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Font Combo 5")
                                  }
                                  className="transition-all hover:border-gray-400"
                                  style={{
                                    aspectRatio: "1/1",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px",
                                    gap: "4px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Verdana, sans-serif",
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      color: "#000000",
                                    }}
                                  >
                                    Clean
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Verdana, sans-serif",
                                      fontSize: "9px",
                                      fontWeight: 400,
                                      color: "#666666",
                                    }}
                                  >
                                    Professional
                                  </span>
                                </button>

                                <button
                                  onClick={() =>
                                    handleTextStyleClick("Font Combo 6")
                                  }
                                  className="transition-all hover:border-gray-400"
                                  style={{
                                    aspectRatio: "1/1",
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E5E5",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "8px",
                                    gap: "4px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Times New Roman, serif",
                                      fontSize: "14px",
                                      fontWeight: 700,
                                      color: "#000000",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    Serif
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: "Times New Roman, serif",
                                      fontSize: "10px",
                                      fontWeight: 400,
                                      color: "#666666",
                                    }}
                                  >
                                    Traditional
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
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
                  </>
                )}

                {/* Drafts Tab Content */}
                {activeTab === "drafts" && (
                  <div
                    className="custom-scrollbar overflow-y-auto flex-1"
                    style={{ maxHeight: "500px" }}
                  >
                    {drafts.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            color: "#6B7280",
                          }}
                        >
                          No drafts yet. Create your first draft!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {drafts.map((draft) => (
                          <div
                            key={draft.id}
                            onClick={() => handleEditDraft(draft.id)}
                            className="transition-all cursor-pointer hover:opacity-80"
                            style={{
                              backgroundColor:
                                selectedDraftId === draft.id
                                  ? "#FFF9E6"
                                  : "#FFFFFF",
                              borderRadius: "12px",
                              overflow: "hidden",
                              border:
                                selectedDraftId === draft.id
                                  ? "2px solid #D4A855"
                                  : "1px solid #E5E5E5",
                              boxShadow:
                                selectedDraftId === draft.id
                                  ? "0 2px 8px rgba(212, 168, 85, 0.3)"
                                  : "0 1px 4px rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            {/* Draft Image */}
                            <img
                              src={draft.image}
                              alt="Draft"
                              style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "cover",
                              }}
                            />
                            {/* Draft Info */}
                            <div style={{ padding: "12px" }}>
                              <p
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  color: "#374151",
                                  lineHeight: "1.4",
                                  marginBottom: "8px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {draft.caption || "Untitled draft"}
                              </p>
                              <div className="flex items-center justify-between">
                                <span
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "10px",
                                    color: "#9CA3AF",
                                  }}
                                >
                                  {new Date(draft.savedAt).toLocaleDateString()}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDraft(draft.id);
                                  }}
                                  className="transition-all hover:opacity-70"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                  }}
                                >
                                  <X size={16} color="#DC2626" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Content Button */}
                    <button
                      onClick={handleNewContent}
                      className="w-full transition-all hover:opacity-90 mt-4"
                      style={{
                        padding: "10px 24px",
                        borderRadius: "50px",
                        backgroundColor: "#D4A855",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(212, 168, 85, 0.3)",
                      }}
                    >
                      + New Content
                    </button>
                  </div>
                )}
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
                  {/* Image Section with Canvas Elements */}
                  <div
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                      width: "100%",
                      aspectRatio: "7/5",
                      overflow: "hidden",
                      borderRadius: "15px",
                      position: "relative",
                      cursor: draggingId ? "grabbing" : "default",
                    }}
                  >
                    <img
                      src={currentTemplate.image}
                      alt={currentTemplate.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Canvas Elements Overlay */}
                    {canvasElements.map((element) => (
                      <div
                        key={element.id}
                        onMouseEnter={() => setHoveredId(element.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onMouseDown={(e) => handleMouseDown(element.id, e)}
                        onDoubleClick={(e) =>
                          handleRemoveElement(element.id, e)
                        }
                        className="transition-opacity"
                        style={{
                          position: "absolute",
                          left: `${element.position.x}%`,
                          top: `${element.position.y}%`,
                          transform: "translate(-50%, -50%)",
                          zIndex: 10,
                          cursor:
                            draggingId === element.id ? "grabbing" : "grab",
                          userSelect: "none",
                          width: `${element.size.width}px`,
                          height: `${element.size.height}px`,
                          border:
                            hoveredId === element.id
                              ? "2px dashed #D4A855"
                              : "2px solid transparent",
                        }}
                      >
                        {element.type === "shape" && (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {element.content === "5-Point Star" && (
                              <Star
                                size={
                                  Math.min(
                                    element.size.width,
                                    element.size.height
                                  ) * 0.8
                                }
                                color={element.style?.color || "#000000"}
                                fill={element.style?.color || "#000000"}
                              />
                            )}
                            {element.content === "4-Point Star" && (
                              <Sparkles
                                size={
                                  Math.min(
                                    element.size.width,
                                    element.size.height
                                  ) * 0.8
                                }
                                color={element.style?.color || "#000000"}
                              />
                            )}
                            {element.content === "Decorative Star" && (
                              <Star
                                size={
                                  Math.min(
                                    element.size.width,
                                    element.size.height
                                  ) * 0.8
                                }
                                color={element.style?.color || "#000000"}
                              />
                            )}
                            {element.content === "Horizontal Line" && (
                              <div
                                style={{
                                  width: "100%",
                                  height: "3px",
                                  backgroundColor:
                                    element.style?.color || "#000000",
                                  borderRadius: "2px",
                                }}
                              />
                            )}
                          </div>
                        )}

                        {element.type === "text" && (
                          <div
                            onClick={(e) =>
                              handleTextClick(element.id, element.content, e)
                            }
                            style={{
                              fontFamily:
                                element.style?.fontFamily ||
                                "Inter, sans-serif",
                              fontSize: element.style?.fontSize || "16px",
                              fontWeight: element.style?.fontWeight || "600",
                              color: element.style?.color || "#000000",
                              backgroundColor: "transparent",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontStyle: element.style?.fontStyle || "normal",
                              letterSpacing:
                                element.style?.letterSpacing || "normal",
                              textTransform: (element.style?.textTransform ||
                                "none") as any,
                            }}
                          >
                            {editingId === element.id ? (
                              <input
                                type="text"
                                value={editingText}
                                onChange={handleTextChange}
                                onBlur={handleTextBlur}
                                onKeyDown={handleTextKeyDown}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  fontFamily:
                                    element.style?.fontFamily ||
                                    "Inter, sans-serif",
                                  fontSize: element.style?.fontSize || "16px",
                                  fontWeight:
                                    element.style?.fontWeight || "600",
                                  color: element.style?.color || "#000000",
                                  backgroundColor: "transparent",
                                  border: "2px solid #D4A855",
                                  borderRadius: "4px",
                                  padding: "4px 8px",
                                  width: "100%",
                                  textAlign: "center",
                                  outline: "none",
                                  fontStyle:
                                    element.style?.fontStyle || "normal",
                                  letterSpacing:
                                    element.style?.letterSpacing || "normal",
                                  textTransform: (element.style
                                    ?.textTransform || "none") as any,
                                }}
                              />
                            ) : (
                              element.content
                            )}
                          </div>
                        )}

                        {/* Controls (Resize Handle & Color Picker) */}
                        {hoveredId === element.id && (
                          <>
                            {/* Resize Handle */}
                            <div
                              onMouseDown={(e) =>
                                handleResizeStart(element.id, e)
                              }
                              style={{
                                position: "absolute",
                                right: "-6px",
                                bottom: "-6px",
                                width: "12px",
                                height: "12px",
                                backgroundColor: "#D4A855",
                                border: "2px solid #FFFFFF",
                                borderRadius: "50%",
                                cursor: "nwse-resize",
                                zIndex: 20,
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                              }}
                            />

                            {/* Color Picker Button */}
                            <div
                              style={{
                                position: "absolute",
                                top: "-32px",
                                right: "0",
                                display: "flex",
                                gap: "4px",
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                padding: "4px",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                zIndex: 20,
                              }}
                            >
                              <div style={{ position: "relative" }}>
                                <input
                                  type="color"
                                  value={element.style?.color || "#000000"}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleColorChange(
                                      element.id,
                                      e.target.value
                                    );
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    border: "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    opacity: 0,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                  }}
                                  title="Change color"
                                />
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    background:
                                      "conic-gradient(from 0deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
                                    border: "2px solid #DADADA",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    pointerEvents: "none",
                                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
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

                    {/* Caption Text - Show dummy if empty, otherwise show user's text without hashtags */}
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
                      {captionText
                        ? captionText.replace(/#\w+/g, '').trim()
                        : currentTemplate.description}
                    </p>

                    {/* Hashtags - Show dummy if caption empty, otherwise show extracted hashtags */}
                    <div className="flex gap-3 flex-wrap mb-5">
                      {!captionText ? (
                        <>
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
                        </>
                      ) : (
                        captionText.match(/#\w+/g)?.map((hashtag, idx) => (
                          <span
                            key={idx}
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
                            {hashtag}
                          </span>
                        ))
                      )}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
