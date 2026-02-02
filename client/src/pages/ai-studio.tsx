import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Sparkles, Trash2, ChevronDown, Download } from "lucide-react";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { GenerationProgressModal } from "@/components/generation-progress-modal";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { aiStudioAPI } from "@/services/ai-studio.api";
import Masonry from "react-masonry-css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type TabType =
  | "ai-ideas"
  | "caption-hashtags"
  | "graphics-template"
  | "script-generator";
type PlatformType = "instagram" | "instagram-story" | "facebook" | "twitter";

export default function AIStudio() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Context
  const {
    generatePost,
    generateScript,
    posts,
    scripts,
    activeJobs,
    isLoadingPosts,
    isLoadingScripts,
    deletePost,
    deleteScript,
    postTemplates,
    isLoadingTemplates,
    loadPostTemplates,
    refreshPosts,
    refreshScripts,
    hasMorePosts,
    loadMorePosts,
    hasMoreScripts,
    loadMoreScripts,
  } = useAIStudio();
  const { subscription, creditBalance } = useSubscription();

  // UI State
  const [activeTab, setActiveTab] = useState<TabType>("ai-ideas");
  const [postIdea, setPostIdea] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    "instagram",
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    "transformation",
  );

  // Script Generator State
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptDuration, setScriptDuration] = useState<number>(30);
  const [scriptFormat, setScriptFormat] = useState<'reel' | 'story' | 'tiktok' | 'youtube-short'>('reel');

  // Template Filter State
  const [templateType, setTemplateType] = useState<string>("all");
  const [templateStyle, setTemplateStyle] = useState<string>("all");

  // Generation Progress Modal State
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Get current job progress
  const currentJob = activeJobs.find(job => job.id === currentJobId);

  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'post' | 'script' } | null>(null);

  /**
   * Handle delete confirmation - opens the dialog
   */
  const handleDeleteClick = (id: string, type: 'post' | 'script') => {
    setItemToDelete({ id, type });
    setDeleteConfirmOpen(true);
  };

  /**
   * Handle actual deletion after confirmation
   */
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'post') {
        await deletePost(itemToDelete.id);
        toast({
          title: "Post Deleted",
          description: "Your post has been deleted successfully",
        });
      } else {
        await deleteScript(itemToDelete.id);
        toast({
          title: "Script Deleted",
          description: "Your script has been deleted successfully",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message || "Failed to delete item",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  /**
   * Refresh posts and scripts when page loads
   */
  useEffect(() => {
    // Refresh posts and scripts when component mounts
    refreshPosts();
    refreshScripts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  /**
   * Load post templates when Graphics/Template tab is opened
   */
  useEffect(() => {
    if (activeTab === 'graphics-template') {
      const platform = templateType !== 'all' ? templateType : undefined;
      const style = templateStyle !== 'all' ? templateStyle : undefined;
      loadPostTemplates(platform, style);
    }
  }, [activeTab, templateType, templateStyle, loadPostTemplates]);

  const tabs = [
    { id: "ai-ideas" as const, label: "AI Ideas" },
    { id: "caption-hashtags" as const, label: "Caption & Hashtags" },
    { id: "graphics-template" as const, label: "Graphics / Template" },
    { id: "script-generator" as const, label: "Script Generator" },
  ];

  const quickSuggestions = [
    {
      id: "transformation",
      icon: "✨",
      label: "Before & After Transformation",
      isPrimary: true,
    },
    { id: "hair-tip", icon: "💡", label: "Hair Tip Tuesday", isPrimary: false },
    { id: "promo", icon: "🎁", label: "Promotional Offer", isPrimary: false },
    { id: "review", icon: "⭐", label: "Client Review", isPrimary: false },
  ];

  const platforms = [
    { id: "instagram" as const, color: "#E4405F", label: "Instagram Post" },
    { id: "instagram-story" as const, color: "#E4405F", label: "Instagram Story" },
    { id: "facebook" as const, color: "#1877F2", label: "Facebook" },
    { id: "twitter" as const, color: "#000000", label: "Twitter" },
  ];

  const togglePlatform = (platform: PlatformType) => {
    // Only allow one platform selection at a time
    setSelectedPlatforms([platform]);
  };

  const handleQuickSuggestion = (suggestionId: string) => {
    // User must always have one selected, can only switch between options
    if (selectedSuggestion !== suggestionId) {
      setSelectedSuggestion(suggestionId);
    }
  };

  /**
   * Handle Generate Post (AI Ideas tab)
   */
  const handleGenerateIdea = async () => {
    // Validation
    if (!postIdea.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please describe your post idea",
      });
      return;
    }

    if (!subscription) {
      toast({
        variant: "destructive",
        title: "No Subscription",
        description: "Please subscribe to a plan to generate posts",
      });
      setLocation("/pricing");
      return;
    }

    if (creditBalance <= 0) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "You don't have enough credits. Please upgrade your plan.",
      });
      setLocation("/settings/billings");
      return;
    }

    try {
      setIsGenerating(true);

      // Map category from selected suggestion
      const categoryMap: Record<string, any> = {
        'transformation': 'before-after',
        'hair-tip': 'tips',
        'promo': 'promotional-offer',
        'review': 'client-review',
      };

      // Generate post - ensure platform is valid
      const platform = selectedPlatforms[0];
      const validPlatforms: Array<'instagram' | 'instagram-story' | 'facebook' | 'twitter'> = ['instagram', 'instagram-story', 'facebook', 'twitter'];

      if (!validPlatforms.includes(platform as any)) {
        throw new Error('Please select a valid platform (Instagram, Instagram Story, Facebook, or Twitter)');
      }

      const postId = await generatePost({
        prompt: postIdea,
        platform: platform as 'instagram' | 'instagram-story' | 'facebook' | 'twitter',
        style: 'professional',
        category: selectedSuggestion ? categoryMap[selectedSuggestion] : undefined,
      });

      // Show progress modal
      setCurrentJobId(postId);
      setShowProgressModal(true);

      toast({
        title: "Generation Started",
        description: "Your post is being generated. This usually takes 15-30 seconds.",
      });
    } catch (error: any) {
      console.error('Failed to generate post:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to start generation",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handle Generate Script (Script Generator tab)
   */
  const handleGenerateScript = async () => {
    // Validation
    if (!scriptTopic.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please describe what your video is about",
      });
      return;
    }

    if (!subscription) {
      toast({
        variant: "destructive",
        title: "No Subscription",
        description: "Please subscribe to a plan to generate scripts",
      });
      setLocation("/pricing");
      return;
    }

    if (creditBalance <= 0) {
      toast({
        variant: "destructive",
        title: "Insufficient Credits",
        description: "You don't have enough credits. Please upgrade your plan.",
      });
      setLocation("/settings/billings");
      return;
    }

    try {
      setIsGenerating(true);

      // Generate script
      const scriptId = await generateScript({
        topic: scriptTopic,
        duration: scriptDuration,
        format: scriptFormat,
      });

      // Show progress modal
      setCurrentJobId(scriptId);
      setShowProgressModal(true);

      toast({
        title: "Generation Started",
        description: "Your script is being generated. This usually takes 15-30 seconds.",
      });
    } catch (error: any) {
      console.error('Failed to generate script:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to start generation",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handle generation completion
   */
  const handleGenerationComplete = () => {
    setShowProgressModal(false);
    setCurrentJobId(null);

    // Clear the input fields
    setPostIdea("");
    setScriptTopic("");

    // Just show success message - user can click "Open Editor" if they want to edit
    toast({
      title: "Success!",
      description: "Your content is ready. Click 'Open Editor' to customize it.",
    });
  };

  /**
   * Handle Export Script - Download script as text file
   */
  const handleExportScript = (script: any) => {
    try {
      // Build the export content
      let exportContent = `Script: ${script.title || "Untitled Script"}\n`;
      exportContent += `Duration: ${script.scriptData?.totalDuration || 0}s\n`;
      exportContent += `Format: ${script.scriptData?.format || 'video'}\n`;
      if (script.topic) {
        exportContent += `Topic: ${script.topic}\n`;
      }
      exportContent += `\n`;

      // Add caption if available
      if (script.caption) {
        exportContent += `Caption:\n${script.caption}\n\n`;
      }

      // Add hashtags if available
      if (script.hashtags && script.hashtags.length > 0) {
        exportContent += `Hashtags:\n${script.hashtags.join(' ')}\n\n`;
      }

      // Add scenes
      if (script.scriptData?.scenes && script.scriptData.scenes.length > 0) {
        exportContent += `\n${'='.repeat(60)}\n`;
        exportContent += `SCENES\n`;
        exportContent += `${'='.repeat(60)}\n\n`;

        script.scriptData.scenes.forEach((scene: any, index: number) => {
          exportContent += `Scene ${scene.sceneNumber || (index + 1)} - ${scene.duration}s\n`;
          exportContent += `${'-'.repeat(60)}\n`;
          exportContent += `Description: ${scene.description}\n`;

          if (scene.voiceover) {
            exportContent += `\nVoiceover:\n"${scene.voiceover}"\n`;
          }

          if (scene.visualNotes) {
            exportContent += `\nVisual Notes:\n${scene.visualNotes}\n`;
          }

          if (scene.musicSuggestion) {
            exportContent += `\nMusic Suggestion:\n${scene.musicSuggestion}\n`;
          }

          exportContent += `\n`;
        });
      }

      // Create a blob and download
      const blob = new Blob([exportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${script.title || 'script'}_${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Script Exported",
        description: "Your script has been downloaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error.message || "Failed to export script",
      });
    }
  };

  const getPlatformIcon = (
    platform: string,
    isSelected: boolean,
    color: string,
    label?: string,
  ) => {
    const iconStyle = {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      opacity: isSelected ? 1 : 0.5,
      transform: isSelected ? "scale(1)" : "scale(0.9)",
      position: "relative" as const,
    };

    const renderIcon = () => {
      switch (platform) {
        case "instagram":
        case "instagram-story":
          return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          );
        case "facebook":
          return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          );
        case "twitter":
          return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div style={iconStyle} title={label}>
        {renderIcon()}
        {platform === "instagram-story" && (
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              backgroundColor: "#9333ea",
              borderRadius: "50%",
              width: "14px",
              height: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px",
              fontWeight: 700,
              color: "white",
              border: "2px solid white",
            }}
          >
            S
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      {/* Page with light gray background */}
      <div
        className="p-4 md:p-6 space-y-4 md:space-y-5 min-h-full"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        {/* Main White Card Container */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            paddingTop: "24px",
            border: "1px solid #E5E7EB",
            // boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Page Header */}
          <div className="mx-6 mb-6">
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#202020",
                marginBottom: "4px",
              }}
              data-testid="text-ai-studio-heading"
            >
              AI Studio
            </h1>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#6B7280",
              }}
              data-testid="text-ai-studio-subtitle"
            >
              Here's what's happening with your content today
            </p>
          </div>

          {/* Divider Line */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              marginBottom: "24px",
            }}
          />

          {/* Content Creation Section */}
          <div data-testid="card-content-creation">
            {/* Header with Title and Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 m-6">
              {activeTab !== "graphics-template" &&
                activeTab !== "script-generator" && (
                  <h2
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#202020",
                    }}
                    data-testid="text-post-question"
                  >
                    {activeTab === "caption-hashtags"
                      ? "Describe your next post"
                      : "What do you want to post about?"}
                  </h2>
                )}

              {/* Tabs */}
              <div
                className="flex items-center gap-1.5"
                style={
                  activeTab === "graphics-template" ||
                  activeTab === "script-generator"
                    ? { marginLeft: "auto" }
                    : {}
                }
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="transition-all"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "16px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      backgroundColor:
                        activeTab === tab.id ? "#1A1A1A" : "#FFFFFF",
                      color: activeTab === tab.id ? "#FFFFFF" : "#9CA3AF",
                      border:
                        activeTab === tab.id
                          ? "1px solid #1A1A1A"
                          : "1px solid #D1D5DB",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    data-testid={`button-tab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === "ai-ideas" && (
              <>
                {/* Textarea */}
                <textarea
                  value={postIdea}
                  onChange={(e) => setPostIdea(e.target.value)}
                  placeholder="Describe your post idea..."
                  className="w-[calc(100%-48px)] focus:outline-none focus:border-[#CEA54F] transition-colors mx-6"
                  style={{
                    minHeight: "100px",
                    padding: "16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    color: "#202020",
                    resize: "none",
                    backgroundColor: "#F9FAFB",
                  }}
                  data-testid="textarea-post-idea"
                />

                {/* Quick Suggestions and Platform Selection Row */}
                <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-4 mt-5 mx-6">
                  {/* Quick Suggestions */}
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion) => {
                      const isSelected = selectedSuggestion === suggestion.id;
                      return (
                        <button
                          key={suggestion.id}
                          onClick={() => handleQuickSuggestion(suggestion.id)}
                          className="flex items-center gap-1.5 transition-all hover:opacity-90"
                          style={{
                            padding: "8px 14px",
                            borderRadius: "20px",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            fontWeight: 500,
                            backgroundColor: isSelected ? "#CEA54F" : "#FFFFFF",
                            color: isSelected ? "#FFFFFF" : "#6B7280",
                            border: isSelected ? "none" : "1px solid #E5E7EB",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            boxShadow: isSelected
                              ? "0 2px 8px rgba(206, 165, 79, 0.35)"
                              : "0 1px 4px rgba(0, 0, 0, 0.06)",
                          }}
                          data-testid={`button-suggestion-${suggestion.id}`}
                        >
                          <span>{suggestion.icon}</span>
                          <span>{suggestion.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Platform Selection and Generate Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Select Platform */}
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#6B7280",
                          whiteSpace: "nowrap",
                        }}
                        data-testid="text-select-platform"
                      >
                        Select Platform
                      </span>
                      <div className="flex items-center gap-2">
                        {platforms.map((platform) => (
                          <button
                            key={platform.id}
                            onClick={() => togglePlatform(platform.id)}
                            className="transition-transform hover:scale-105"
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                            }}
                            data-testid={`button-platform-${platform.id}`}
                          >
                            {getPlatformIcon(
                              platform.id,
                              selectedPlatforms.includes(platform.id),
                              platform.color,
                              platform.label
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Idea Button */}
                    <button
                      onClick={handleGenerateIdea}
                      disabled={isGenerating}
                      className="flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        padding: "10px 20px",
                        borderRadius: "24px",
                        background:
                          "linear-gradient(135deg, #D4A855 0%, #CEA54F 100%)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: isGenerating ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 12px rgba(206, 165, 79, 0.4)",
                      }}
                      data-testid="button-generate-idea"
                    >
                      <Sparkles size={16} />
                      <span>{isGenerating ? "Generating..." : "Generate Idea"}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Graphics / Template Tab */}
            {activeTab === "graphics-template" && (
              <>
                {/* Filters Section - Platform and Style */}
                <div
                  className="flex flex-col sm:flex-row gap-4 mb-10 mx-6"
                  style={{
                    padding: "20px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {/* Platform Dropdown */}
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Platform
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={templateType}
                        onChange={(e) => setTemplateType(e.target.value)}
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "11px 16px",
                          paddingRight: "40px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#6B7280",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                        }}
                      >
                        <option value="all">All Platforms</option>
                        <option value="instagram">Instagram</option>
                        <option value="instagram-story">Instagram Story</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Style Dropdown */}
                  <div className="flex-1">
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Style
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={templateStyle}
                        onChange={(e) => setTemplateStyle(e.target.value)}
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "11px 16px",
                          paddingRight: "40px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#6B7280",
                          backgroundColor: "#FFFFFF",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                        }}
                      >
                        <option value="all">All Styles</option>
                        <option value="professional">Professional</option>
                        <option value="modern">Modern</option>
                        <option value="elegant">Elegant</option>
                        <option value="playful">Playful</option>
                        <option value="natural">Natural</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loading State */}
                {isLoadingTemplates && (
                  <div className="flex items-center justify-center py-12 mx-6">
                    <p className="text-gray-500">Loading templates...</p>
                  </div>
                )}

                {/* No Templates Message */}
                {!isLoadingTemplates && postTemplates.length === 0 && (
                  <div className="mx-6 mb-8">
                    <div
                      className="flex flex-col items-center justify-center py-16 text-center"
                      style={{
                        backgroundColor: "#FAFAFA",
                        borderRadius: "12px",
                        border: "1px dashed #D1D5DB",
                      }}
                    >
                      <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-1">No templates available</p>
                      <p className="text-sm text-gray-400">Try different filters or create your own post in the AI Ideas tab</p>
                    </div>
                  </div>
                )}

                {/* Template Cards Grid */}
                {!isLoadingTemplates && postTemplates.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(270px, 1fr))",
                      gap: "15px",
                      margin: '0 24px 30px 24px'
                    }}
                  >
                    {postTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="transition-all hover:shadow-md"
                        style={{
                          backgroundColor: "#F2F2F2",
                          borderRadius: "16px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                          border: "1px solid #DADADA",
                          padding: "13px",
                        }}
                      >
                        {/* Card Image */}
                        <div
                          style={{
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: "12px",
                            marginBottom: "16px",
                          }}
                        >
                          {template.pictureUrl || template.previewImageUrl ? (
                            <img
                              src={template.pictureUrl || template.previewImageUrl}
                              alt={template.title || template.name || 'Template'}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              className="w-full flex items-center justify-center"
                              style={{
                                height: "200px",
                                backgroundColor: "#E5E7EB",
                              }}
                            >
                              <Sparkles className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div style={{ padding: "0 4px" }}>
                          {/* Title */}
                          <h3
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#1F2937",
                              lineHeight: "1.5",
                              marginBottom: "10px",
                            }}
                          >
                            {template.title || template.name || 'Untitled Template'}
                          </h3>

                          {/* Description */}
                          <p
                            className="line-clamp-2"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#9CA3AF",
                              lineHeight: "1.6",
                              marginBottom: "16px",
                            }}
                          >
                            {template.caption || template.description || 'No description'}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "16px",
                                backgroundColor: "#E8E5E0",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#6B7280",
                              }}
                            >
                              {template.platform}
                            </span>
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "16px",
                                backgroundColor: "#E8E5E0",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                fontWeight: 500,
                                color: "#6B7280",
                              }}
                            >
                              {template.style}
                            </span>
                          </div>

                          {/* Use Template Button */}
                          <button
                            onClick={async () => {
                              try {
                                // Customize template - creates a new post draft from the template
                                const newPost = await aiStudioAPI.customizePostTemplate(template.id);

                                // Validate response has an ID
                                if (!newPost || !newPost.id) {
                                  throw new Error('Invalid response from server: missing post ID');
                                }

                                // Show success message
                                toast({
                                  title: "Template Applied",
                                  description: "Opening editor with your new post",
                                });

                                // Navigate to editors page with the new post ID
                                // The editors page will load this post data automatically
                                setLocation(`/editors?postId=${newPost.id}`);
                              } catch (error: any) {
                                console.error('Failed to customize template:', error);
                                toast({
                                  variant: "destructive",
                                  title: "Failed to Use Template",
                                  description: error.message || "Could not customize template",
                                });
                              }
                            }}
                            className="w-full transition-all hover:opacity-90"
                            style={{
                              padding: "10px 16px",
                              borderRadius: "20px",
                              backgroundColor: "#CEA54F",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#FFFFFF",
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 2px 6px rgba(206, 165, 79, 0.3)",
                            }}
                          >
                            Use Template
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Script Generator Tab */}
            {activeTab === "script-generator" && (
              <>
                {/* What your video about */}
                <div className="mb-6 mx-6">
                  <label
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#111827",
                      marginBottom: "10px",
                      display: "block",
                    }}
                  >
                    What your video about
                  </label>
                  <textarea
                    value={scriptTopic}
                    onChange={(e) => setScriptTopic(e.target.value)}
                    placeholder="Showcase a haircut transformation"
                    className="w-full focus:outline-none focus:border-[#CEA54F] transition-colors placeholder:text-[#9CA3AF]"
                    style={{
                      minHeight: "100px",
                      padding: "18px 20px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      color: "#1F2937",
                      resize: "none",
                      backgroundColor: "#F5F5F5",
                      lineHeight: "1.5",
                    }}
                  />
                </div>

                {/* Duration and Format Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 mx-6">
                  {/* Duration */}
                  <div>
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Duration
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={scriptDuration}
                        onChange={(e) => setScriptDuration(Number(e.target.value))}
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "14px 18px",
                          paddingRight: "44px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#1F2937",
                          backgroundColor: "#F5F5F5",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                        }}
                      >
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="60">60</option>
                        <option value="90">90</option>
                        <option value="120">120</option>
                        <option value="180">180</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "18px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Format */}
                  <div>
                    <label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#111827",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Format
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={scriptFormat}
                        onChange={(e) => setScriptFormat(e.target.value as any)}
                        className="w-full focus:outline-none focus:border-[#CEA54F] transition-all"
                        style={{
                          padding: "14px 18px",
                          paddingRight: "44px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "12px",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          color: "#1F2937",
                          backgroundColor: "#F5F5F5",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                        }}
                      >
                        <option value="reel">Reel</option>
                        <option value="story">Story</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube-short">YouTube Short</option>
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "18px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9CA3AF",
                        }}
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Script Button */}
                <div className="mb-8 mx-6">
                  <button
                    onClick={handleGenerateScript}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "20px",
                      background:
                        "linear-gradient(135deg, #D4A855 0%, #CEA54F 100%)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      border: "none",
                      cursor: isGenerating ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: "0 3px 10px rgba(206, 165, 79, 0.35)",
                    }}
                  >
                    <Sparkles size={16} />
                    <span>{isGenerating ? "Generating..." : "+ Generate Script"}</span>
                  </button>
                </div>

                {/* Your Video Scripts Section - Display real scripts from API */}
                {scripts.length > 0 && (
                  <div style={{ marginBottom: "24px", marginLeft: "24px", marginRight: "24px" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <h3
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#1F1F1F",
                          marginBottom: "2px",
                        }}
                      >
                        Your Video Scripts
                      </h3>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 400,
                          color: "#8A8A8A",
                        }}
                      >
                        {scripts.length} script{scripts.length !== 1 ? 's' : ''} generated
                      </p>
                    </div>

                    {/* Scripts List - Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                      {scripts.map((script) => (
                        <AccordionItem
                          key={script.id}
                          value={script.id}
                          style={{
                            backgroundColor: "#FAFAFA",
                            borderRadius: "12px",
                            marginBottom: "12px",
                            border: "1px solid #E5E7EB",
                            overflow: "hidden",
                          }}
                        >
                          {/* Accordion Header/Trigger */}
                          <AccordionTrigger
                            style={{
                              padding: "16px",
                              border: "none",
                              textAlign: "left",
                            }}
                            className="hover:no-underline"
                          >
                            <div className="flex items-start justify-between w-full pr-4">
                              <div style={{ flex: 1 }}>
                                <h4
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#1F2937",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {script.title || "Untitled Script"}
                                </h4>
                                <p
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    color: "#6B7280",
                                    marginBottom: "6px",
                                  }}
                                >
                                  {script.scriptData?.totalDuration || 0}s {script.scriptData?.format || 'video'} • {script.scriptData?.scenes?.length || 0} scenes
                                </p>
                                {(script as any).topic && (
                                  <p
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "11px",
                                      fontWeight: 400,
                                      color: "#9CA3AF",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    Topic: {(script as any).topic}
                                  </p>
                                )}
                              </div>
                              <span
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  color: script.status === 'draft' ? '#F59E0B' : '#10B981',
                                  backgroundColor: script.status === 'draft' ? '#FEF3C7' : '#D1FAE5',
                                  padding: "4px 10px",
                                  borderRadius: "12px",
                                  flexShrink: 0,
                                }}
                              >
                                {script.status}
                              </span>
                            </div>
                          </AccordionTrigger>

                          {/* Accordion Content */}
                          <AccordionContent style={{ padding: "0 16px 16px 16px" }}>
                            {/* Caption and Hashtags */}
                            {(script.caption || (script.hashtags && script.hashtags.length > 0)) && (
                              <div style={{ marginBottom: "12px" }}>
                                {script.caption && (
                                  <p
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "12px",
                                      fontWeight: 400,
                                      color: "#4B5563",
                                      lineHeight: "1.5",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    {script.caption}
                                  </p>
                                )}
                                {script.hashtags && script.hashtags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {script.hashtags.map((tag: string, idx: number) => (
                                      <span
                                        key={idx}
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "10px",
                                          fontWeight: 500,
                                          color: "#6B7280",
                                          backgroundColor: "#E8E5E0",
                                          padding: "3px 8px",
                                          borderRadius: "10px",
                                        }}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Scene Cards */}
                          {script.scriptData?.scenes && script.scriptData.scenes.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                marginBottom: "12px",
                              }}
                            >
                              {script.scriptData.scenes.map((scene, index) => (
                                <div
                                  key={index}
                                  style={{
                                    backgroundColor: "#F5F5F5",
                                    borderRadius: "10px",
                                    padding: "12px",
                                    border: "1px solid #E0E0E0",
                                  }}
                                >
                                  {/* Scene Header */}
                                  <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          borderRadius: "8px",
                                          backgroundColor: "#D4D4D4",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          flexShrink: 0,
                                        }}
                                      >
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="#707070"
                                          strokeWidth="2"
                                        >
                                          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                      <h5
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "13px",
                                          fontWeight: 600,
                                          color: "#2B2B2B",
                                        }}
                                      >
                                        Scene {(scene as any).sceneNumber || scene.sequence || (index + 1)}
                                      </h5>
                                    </div>
                                    <span
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "11px",
                                        fontWeight: 500,
                                        color: "#6B6B6B",
                                        backgroundColor: "#DADADA",
                                        padding: "3px 10px",
                                        borderRadius: "6px",
                                      }}
                                    >
                                      {scene.duration}s
                                    </span>
                                  </div>

                                  {/* Description / Instruction */}
                                  <p
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      color: "#1F2937",
                                      lineHeight: "1.4",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    {(scene as any).description || scene.instruction}
                                  </p>

                                  {/* Voiceover / Dialogue */}
                                  {((scene as any).voiceover || scene.dialogue) && (
                                    <div style={{ marginBottom: "6px" }}>
                                      <span
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "10px",
                                          fontWeight: 600,
                                          color: "#6B7280",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        🎤 Voiceover:
                                      </span>
                                      <p
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "11px",
                                          fontWeight: 400,
                                          color: "#4B5563",
                                          lineHeight: "1.4",
                                          marginTop: "2px",
                                          fontStyle: "italic",
                                        }}
                                      >
                                        "{(scene as any).voiceover || scene.dialogue}"
                                      </p>
                                    </div>
                                  )}

                                  {/* Visual Notes / Cues */}
                                  {((scene as any).visualNotes || scene.visualCue) && (
                                    <div style={{ marginBottom: "6px" }}>
                                      <span
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "10px",
                                          fontWeight: 600,
                                          color: "#6B7280",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        📹 Visual:
                                      </span>
                                      <p
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "11px",
                                          fontWeight: 400,
                                          color: "#4B5563",
                                          lineHeight: "1.4",
                                          marginTop: "2px",
                                        }}
                                      >
                                        {(scene as any).visualNotes || scene.visualCue}
                                      </p>
                                    </div>
                                  )}

                                  {/* Music Suggestion */}
                                  {(scene as any).musicSuggestion && (
                                    <div>
                                      <span
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "10px",
                                          fontWeight: 600,
                                          color: "#6B7280",
                                          textTransform: "uppercase",
                                          letterSpacing: "0.5px",
                                        }}
                                      >
                                        🎵 Music:
                                      </span>
                                      <p
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontSize: "11px",
                                          fontWeight: 400,
                                          color: "#4B5563",
                                          lineHeight: "1.4",
                                          marginTop: "2px",
                                        }}
                                      >
                                        {(scene as any).musicSuggestion}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleExportScript(script)}
                                className="flex-1 transition-all hover:opacity-90 flex items-center justify-center gap-2"
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: "18px",
                                  backgroundColor: "#1A1A1A",
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#FFFFFF",
                                  border: "none",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 4px rgba(26, 26, 26, 0.3)",
                                }}
                              >
                                <Download className="h-4 w-4" />
                                <span>Export Script</span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(script.id, 'script')}
                                className="flex-shrink-0 transition-all hover:opacity-90 flex items-center justify-center"
                                style={{
                                  padding: "8px 14px",
                                  borderRadius: "18px",
                                  backgroundColor: "#EF4444",
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#FFFFFF",
                                  border: "none",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}

                {/* No scripts message */}
                {!isLoadingScripts && scripts.length === 0 && (
                  <div style={{ marginBottom: "24px", marginLeft: "24px", marginRight: "24px" }}>
                    <div
                      className="flex flex-col items-center justify-center py-12 text-center"
                      style={{
                        backgroundColor: "#FAFAFA",
                        borderRadius: "12px",
                        border: "1px dashed #D1D5DB",
                      }}
                    >
                      <Sparkles className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-1">No scripts yet</p>
                      <p className="text-sm text-gray-400">Generate your first script above to get started!</p>
                    </div>
                  </div>
                )}

                {/* Load More Button for Scripts */}
                {!isLoadingScripts && scripts.length > 0 && hasMoreScripts && (
                  <div className="flex justify-center mx-6 mb-6">
                    <button
                      onClick={() => loadMoreScripts()}
                      disabled={isLoadingScripts}
                      className="transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        padding: "12px 32px",
                        borderRadius: "24px",
                        backgroundColor: "#1A1A1A",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: isLoadingScripts ? "not-allowed" : "pointer",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {isLoadingScripts ? "Loading..." : "Load More Scripts"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Caption & Hashtags Tab */}
            {activeTab === "caption-hashtags" && (
              <>
                {/* Coming Soon Notice */}
                <div className="mx-6 mb-8">
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    style={{
                      backgroundColor: "#FAFAFA",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
                    <h3
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#1F2937",
                        marginBottom: "8px",
                      }}
                    >
                      Caption & Hashtags Generator
                    </h3>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#6B7280",
                        marginBottom: "4px",
                      }}
                    >
                      This feature is coming soon!
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#9CA3AF",
                      }}
                    >
                      Use the "AI Ideas" tab to generate complete posts with captions and hashtags
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Content Cards Grid - Only show for AI Ideas tab */}
          {activeTab === "ai-ideas" && (
            <>
              {/* Show loading state only when no posts exist yet */}
              {isLoadingPosts && posts.length === 0 && (
                <div className="my-8 mx-6 flex items-center justify-center py-12">
                  <p className="text-gray-500">Loading your posts...</p>
                </div>
              )}

              {/* Show empty state only when not loading and no posts */}
              {!isLoadingPosts && posts.length === 0 && (
                <div className="my-8 mx-6 flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">No posts yet</p>
                  <p className="text-sm text-gray-400">Generate your first post above to get started!</p>
                </div>
              )}

              {/* Render real posts from API - Always show posts if they exist, even while loading more */}
              {posts.length > 0 && (
                <Masonry
                  breakpointCols={{
                    default: 4,
                    1536: 3,
                    1280: 3,
                    1024: 3,
                    768: 2,
                    640: 1,
                  }}
                  className="my-masonry-grid my-8 mx-6"
                  columnClassName="my-masonry-grid_column"
                >
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="overflow-hidden flex flex-col"
                      style={{
                        backgroundColor: "#F5F3F0",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #E8E5E0",
                      }}
                      data-testid={`card-content-${post.id}`}
                    >
                  {/* Card Image - With padding */}
                  <div style={{ padding: "12px 12px 0 12px", position: "relative" }}>
                    <div
                      className="w-full overflow-hidden"
                      style={{
                        aspectRatio: post.dimensions ? `${post.dimensions.width}/${post.dimensions.height}` : "1/1",
                        borderRadius: "8px",
                        backgroundColor: "#E5E7EB",
                        position: "relative",
                      }}
                    >
                      {((post as any).flattenedImageUrl || post.imageUrl || post.pictureUrl) ? (
                        <img
                          src={(post as any).flattenedImageUrl || post.imageUrl || post.pictureUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          data-testid={`img-content-${post.id}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Sparkles className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Status Badge - Top Right */}
                    {post.status && (
                      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: post.status === 'draft' ? '#F59E0B' : post.status === 'ready' ? '#10B981' : '#6B7280',
                            backgroundColor: post.status === 'draft' ? 'rgba(254, 243, 199, 0.95)' : post.status === 'ready' ? 'rgba(209, 250, 229, 0.95)' : 'rgba(243, 244, 246, 0.95)',
                            padding: "4px 10px",
                            borderRadius: "12px",
                            textTransform: "capitalize",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          {post.status}
                        </span>
                      </div>
                    )}

                    {/* Badges - Bottom Row */}
                    <div style={{ position: "absolute", bottom: "8px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {/* Template Badge - Bottom Left */}
                      {post.isTemplate ? (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            backgroundColor: "rgba(147, 51, 234, 0.95)",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          Template
                        </span>
                      ) : (
                        <div></div>
                      )}

                      {/* Platform Badge - Bottom Right */}
                      {post.platform && (
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            backgroundColor: "rgba(206, 165, 79, 0.95)",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            textTransform: "capitalize",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          {post.platform.replace('-', ' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content - Flex grow to push buttons to bottom */}
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    {/* Title & Timestamp Row */}
                    <div style={{ marginBottom: "8px" }}>
                      <h3
                        className="line-clamp-2"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#1F2937",
                          lineHeight: "1.4",
                          marginBottom: "4px",
                        }}
                        data-testid={`text-title-${post.id}`}
                        title={post.title || "Untitled Post"}
                      >
                        {post.title || "Untitled Post"}
                      </h3>

                    </div>

                    {/* Description/Caption - with title attribute to show full text on hover */}
                    <div style={{ marginBottom: "10px" }}>
                      <p
                        className="line-clamp-3"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "#6B7280",
                          lineHeight: "1.5",
                        }}
                        data-testid={`text-description-${post.id}`}
                        title={post.caption || "No caption"}
                      >
                        {post.caption || "No caption"}
                      </p>
                    </div>

                    {/* Hashtags - Show all hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div
                        className="flex flex-wrap gap-2"
                        style={{ marginBottom: "12px" }}
                      >
                        {post.hashtags.map((hashtag: string, index: number) => (
                          <span
                            key={index}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "12px",
                              backgroundColor: "#E8E5E0",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "11px",
                              fontWeight: 500,
                              color: "#6B7280",
                            }}
                            data-testid={`tag-${post.id}-${index}`}
                          >
                            {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Spacer to push buttons to bottom */}
                    <div style={{ flexGrow: 1 }}></div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLocation(`/editors?postId=${post.id}`)}
                        className="flex-1 transition-all hover:opacity-90"
                        style={{
                          padding: "9px 14px",
                          borderRadius: "20px",
                          backgroundColor: "#CEA54F",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#FFFFFF",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(206, 165, 79, 0.3)",
                          whiteSpace: "nowrap",
                        }}
                        data-testid={`button-open-editor-${post.id}`}
                      >
                        Open Editor
                      </button>
                      {(post.status === 'draft' || post.status === 'ready') && (
                        <button
                          onClick={() => handleDeleteClick(post.id, 'post')}
                          className="flex-shrink-0 transition-all hover:opacity-90 flex items-center justify-center"
                          style={{
                            padding: "9px 14px",
                            borderRadius: "20px",
                            backgroundColor: "#EF4444",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
                </Masonry>
              )}
            </>
          )}

          {/* Load More Button for Posts - Show below the grid */}
          {activeTab === "ai-ideas" && posts.length > 0 && hasMorePosts && (
            <div className="flex justify-center pb-8">
              <button
                onClick={() => loadMorePosts()}
                disabled={isLoadingPosts}
                className="transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  padding: "12px 32px",
                  borderRadius: "24px",
                  backgroundColor: "#1A1A1A",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  border: "none",
                  cursor: isLoadingPosts ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              >
                {isLoadingPosts ? "Loading..." : "Load More Posts"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Generation Progress Modal */}
      <GenerationProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        type={currentJob?.type || 'post'}
        status={currentJob?.status || 'queued'}
        progress={currentJob?.progress || 0}
        message={currentJob?.message}
        error={currentJob?.error}
        onComplete={handleGenerationComplete}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your {itemToDelete?.type === 'post' ? 'post' : 'script'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
