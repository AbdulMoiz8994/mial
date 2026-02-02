import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Type,
  Upload,
  X,
  Star,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIStudio } from "@/contexts/AIStudioContext";
import { useLocation } from "wouter";
import { aiStudioAPI, Post, PostTemplate, PictureElement, SVGShape } from "@/services/ai-studio.api";
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
import { UploadImageModal } from "@/components/upload-image-modal";
import { GenerationProgressModal } from "@/components/generation-progress-modal";

type LeftTabType = "templates" | "drafts";
type EditorPanelType = "templates" | "elements" | "text";

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

// Icon Components
const DesignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ElementsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="2" />
  </svg>
);

export default function Editors() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { updatePost, createPostFromImage, activeJobs } = useAIStudio();

  // URL and Post State
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  // Left Panel State
  const [leftTab, setLeftTab] = useState<LeftTabType>("templates");
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [hasMoreTemplates, setHasMoreTemplates] = useState(false);
  const [templatesOffset, setTemplatesOffset] = useState(0);
  const TEMPLATES_LIMIT = 10;

  // Editor Panel State (Left Sidebar Tools)
  const [editorPanel, setEditorPanel] = useState<EditorPanelType>("templates");

  // Editing State
  const [titleText, setTitleText] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [activeHashtags, setActiveHashtags] = useState<string[]>([]);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);

  // Unsaved Changes Tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalState, setOriginalState] = useState<{
    title: string;
    caption: string;
    hashtags: string[];
    elements: CanvasElement[];
  } | null>(null);

  // Canvas Interaction State
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Shape/Text Customization
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedFontSize, setSelectedFontSize] = useState("16px");
  const [recentElements, setRecentElements] = useState<Array<{ type: "shape" | "text"; content: string; timestamp: number }>>([]);

  // Color Palette
  const colorPalette = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"];

  // Shape Options - fetched from API
  const [shapes, setShapes] = useState<SVGShape[]>([]);
  const [isLoadingShapes, setIsLoadingShapes] = useState(false);

  // Text Styles
  const textStyles = ["Heading 1", "Heading 2", "Heading 3", "Font Combo 1", "Font Combo 2", "Font Combo 3", "Font Combo 4", "Font Combo 5", "Font Combo 6"];

  // Font Size Options
  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];

  // Character Limit
  const maxCharacters = 2200;

  // Save Confirmation Dialog State
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Undo/Redo History
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Image Preview State
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Upload Image Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadJobId, setUploadJobId] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Extract postId from URL
  const getPostIdFromUrl = (): string | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get('postId');
  };

  // Load post from URL on mount
  useEffect(() => {
    const postId = getPostIdFromUrl();
    if (postId) {
      loadPost(postId);
    }
  }, []);

  // Keyboard shortcuts for undo/redo and closing preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close preview with Escape key
      if (e.key === 'Escape' && showImagePreview) {
        e.preventDefault();
        setShowImagePreview(false);
        return;
      }

      // Undo/Redo shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, showImagePreview]);

  // Load Templates when Templates tab is active
  useEffect(() => {
    if (leftTab === 'templates') {
      loadTemplates();
    }
  }, [leftTab]);

  // Load Drafts when Drafts tab is active
  useEffect(() => {
    if (leftTab === 'drafts') {
      loadDrafts();
    }
  }, [leftTab]);

  // Load shapes from API on mount
  useEffect(() => {
    loadShapes();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    if (!originalState) return;

    const hasChanges =
      titleText !== originalState.title ||
      captionText !== originalState.caption ||
      JSON.stringify(activeHashtags) !== JSON.stringify(originalState.hashtags) ||
      JSON.stringify(canvasElements) !== JSON.stringify(originalState.elements);

    setHasUnsavedChanges(hasChanges);
  }, [titleText, captionText, activeHashtags, canvasElements, originalState]);

  /**
   * Load a specific post by ID
   */
  const loadPost = async (postId: string) => {
    try {
      setIsLoadingPost(true);
      const post = await aiStudioAPI.getPost(postId);
      setCurrentPost(post);

      // Populate editing fields
      setTitleText(post.title || "");
      setCaptionText(post.caption || "");
      setActiveHashtags(post.hashtags?.map(tag => tag.startsWith('#') ? tag : `#${tag}`) || []);

      // Convert API pictureElements to canvas elements
      // pictureElements might be an array of arrays or a flat array
      let flattenedElements: any[] = [];

      if (Array.isArray(post.pictureElements)) {
        // Check if it's already a flat array of objects
        if (post.pictureElements.length > 0 && post.pictureElements[0] && typeof post.pictureElements[0] === 'object' && !Array.isArray(post.pictureElements[0])) {
          flattenedElements = post.pictureElements;
        } else {
          // It's nested, flatten it
          flattenedElements = post.pictureElements.flat().filter((el: any) => el && typeof el === 'object');
        }
      }

      const elements: CanvasElement[] = flattenedElements.map((el: PictureElement, idx: number) => {
        // Handle position - API uses absolute coordinates, convert to percentage
        // Position represents the CENTER of the element, so we need to adjust
        const xPercent = post.dimensions ? (el.position?.x / post.dimensions.width) * 100 : 50;
        const yPercent = post.dimensions ? (el.position?.y / post.dimensions.height) * 100 : 50;

        // Calculate size in percentage of canvas for responsive scaling
        let widthPercent = 20; // Default 20% of canvas width
        let heightPercent = 8; // Default 8% of canvas height

        if (el.size && post.dimensions) {
          // If size is provided, convert to percentage
          widthPercent = (el.size / post.dimensions.width) * 100;
          heightPercent = (el.size / post.dimensions.height) * 100;
        } else if (el.type === 'text' && el.fontSize && post.dimensions) {
          // Estimate text size based on fontSize and content length
          const textLength = (el.text || '').length;
          widthPercent = Math.min(80, (textLength * el.fontSize * 0.6 / post.dimensions.width) * 100);
          heightPercent = (el.fontSize * 1.5 / post.dimensions.height) * 100;
        }

        // Scale font size for canvas display (reduce by 40% for better fit)
        const scaledFontSize = el.fontSize ? Math.round(el.fontSize * 0.6) : 16;

        return {
          id: `element-${idx}`,
          type: el.type === 'text' ? 'text' : 'shape',
          content: el.text || el.shape || '',
          position: { x: xPercent, y: yPercent },
          size: { width: widthPercent, height: heightPercent }, // Now in percentage
          style: el.type === 'text' ? {
            fontSize: `${scaledFontSize}px`,
            fontWeight: el.fontWeight || '600',
            color: el.color || '#000000',
            fontFamily: el.fontFamily || 'Inter, sans-serif',
          } : {
            color: el.color || '#000000',
          }
        };
      });

      setCanvasElements(elements);

      // Initialize history with loaded elements
      setHistory([elements]);
      setHistoryIndex(0);

      // Save original state for change tracking
      setOriginalState({
        title: post.title || "",
        caption: post.caption || "",
        hashtags: post.hashtags?.map(tag => tag.startsWith('#') ? tag : `#${tag}`) || [],
        elements: elements,
      });

      setHasUnsavedChanges(false);
    } catch (error: any) {
      console.error('Failed to load post:', error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: error.message || "Failed to load post",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  /**
   * Load templates from API using dedicated templates endpoint
   */
  const loadTemplates = async (append: boolean = false) => {
    try {
      setIsLoadingTemplates(true);
      const offset = append ? templatesOffset : 0;
      const response = await aiStudioAPI.listPostTemplates(undefined, undefined, TEMPLATES_LIMIT, offset);

      if (append) {
        setTemplates(prev => [...prev, ...response.templates]);
      } else {
        setTemplates(response.templates);
        setTemplatesOffset(0);
      }

      setHasMoreTemplates(response.hasMore);
      setTemplatesOffset(offset + TEMPLATES_LIMIT);
    } catch (error: any) {
      console.error('Failed to load templates:', error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Failed to load templates",
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  /**
   * Load more templates (pagination)
   */
  const loadMoreTemplates = async () => {
    await loadTemplates(true);
  };

  /**
   * Load drafts from API
   */
  const loadDrafts = async () => {
    try {
      setIsLoadingDrafts(true);
      const response = await aiStudioAPI.listPosts('draft', 50, 0);

      // Filter out deleted drafts (isDeleted: true)
      const activeDrafts = response.posts.filter((post: any) => !post.isDeleted);

      setDrafts(activeDrafts);
    } catch (error: any) {
      console.error('Failed to load drafts:', error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Failed to load drafts",
      });
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  /**
   * Load shapes from API
   */
  const loadShapes = async () => {
    try {
      setIsLoadingShapes(true);
      const response = await aiStudioAPI.getShapes();
      setShapes(response.shapes);
    } catch (error: any) {
      console.error('Failed to load shapes:', error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: "Failed to load shapes",
      });
    } finally {
      setIsLoadingShapes(false);
    }
  };

  /**
   * Handle template click - customize template
   */
  const handleTemplateClick = async (templateId: string) => {
    const action = async () => {
      try {
        setSelectedTemplateId(templateId);
        setIsLoadingPost(true);
        const newPost = await aiStudioAPI.customizePostTemplate(templateId);

        // Update URL
        setLocation(`/editors?postId=${newPost.id}`);

        // Load the post data directly (no additional API call needed)
        setCurrentPost(newPost);

        // Populate editing fields
        setTitleText(newPost.title || "");
        setCaptionText(newPost.caption || "");
        setActiveHashtags(newPost.hashtags?.map(tag => tag.startsWith('#') ? tag : `#${tag}`) || []);

        // Convert API pictureElements to canvas elements
        // pictureElements might be an array of arrays or a flat array
        let flattenedElements: any[] = [];

        if (Array.isArray(newPost.pictureElements)) {
          // Check if it's already a flat array of objects
          if (newPost.pictureElements.length > 0 && newPost.pictureElements[0] && typeof newPost.pictureElements[0] === 'object' && !Array.isArray(newPost.pictureElements[0])) {
            flattenedElements = newPost.pictureElements;
          } else {
            // It's nested, flatten it
            flattenedElements = newPost.pictureElements.flat().filter((el: any) => el && typeof el === 'object');
          }
        }

        const elements: CanvasElement[] = flattenedElements.map((el: PictureElement, idx: number) => {
          // Handle position - API uses absolute coordinates, convert to percentage
          // Position represents the CENTER of the element, so we need to adjust
          const xPercent = newPost.dimensions ? (el.position?.x / newPost.dimensions.width) * 100 : 50;
          const yPercent = newPost.dimensions ? (el.position?.y / newPost.dimensions.height) * 100 : 50;

          // Calculate size in percentage of canvas for responsive scaling
          let widthPercent = 20; // Default 20% of canvas width
          let heightPercent = 8; // Default 8% of canvas height

          if (el.size && newPost.dimensions) {
            // If size is provided, convert to percentage
            widthPercent = (el.size / newPost.dimensions.width) * 100;
            heightPercent = (el.size / newPost.dimensions.height) * 100;
          } else if (el.type === 'text' && el.fontSize && newPost.dimensions) {
            // Estimate text size based on fontSize and content length
            const textLength = (el.text || '').length;
            widthPercent = Math.min(80, (textLength * el.fontSize * 0.6 / newPost.dimensions.width) * 100);
            heightPercent = (el.fontSize * 1.5 / newPost.dimensions.height) * 100;
          }

          // Scale font size for canvas display (reduce by 40% for better fit)
          const scaledFontSize = el.fontSize ? Math.round(el.fontSize * 0.6) : 16;

          return {
            id: `element-${idx}`,
            type: el.type === 'text' ? 'text' : 'shape',
            content: el.text || el.shape || '',
            position: { x: xPercent, y: yPercent },
            size: { width: widthPercent, height: heightPercent }, // Now in percentage
            style: el.type === 'text' ? {
              fontSize: `${scaledFontSize}px`,
              fontWeight: el.fontWeight || '600',
              color: el.color || '#000000',
              fontFamily: el.fontFamily || 'Inter, sans-serif',
            } : {
              color: el.color || '#000000',
            }
          };
        });

        setCanvasElements(elements);

        // Initialize history with loaded elements
        setHistory([elements]);
        setHistoryIndex(0);

        // Save original state for change tracking
        setOriginalState({
          title: newPost.title || "",
          caption: newPost.caption || "",
          hashtags: newPost.hashtags?.map(tag => tag.startsWith('#') ? tag : `#${tag}`) || [],
          elements: elements,
        });

        // Clear unsaved changes flag since we just loaded fresh data
        setHasUnsavedChanges(false);

        setIsLoadingPost(false);

        // Reload drafts to include the newly created draft
        loadDrafts();

        toast({
          title: "Template Applied",
          description: "Template has been customized for editing",
        });
      } catch (error: any) {
        setIsLoadingPost(false);
        toast({
          variant: "destructive",
          title: "Failed",
          description: error.message || "Failed to apply template",
        });
      }
    };

    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setShowSaveDialog(true);
    } else {
      await action();
    }
  };

  /**
   * Handle draft click - load draft for editing
   */
  const handleDraftClick = async (draftId: string) => {
    const action = async () => {
      setLocation(`/editors?postId=${draftId}`);
      await loadPost(draftId);
    };

    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setShowSaveDialog(true);
    } else {
      await action();
    }
  };

  /**
   * Handle left tab change - no unsaved changes check needed
   * Just switching the view between Templates and Drafts tabs
   */
  const handleLeftTabChange = (tab: LeftTabType) => {
    setLeftTab(tab);
  };

  /**
   * Handle editor panel change - no unsaved changes check needed
   * These are just tool panels, not content navigation
   */
  const handleEditorPanelChange = (panel: EditorPanelType) => {
    setEditorPanel(panel);
  };

  /**
   * Save current changes
   */
  const saveChanges = async (_statusOverride?: 'draft' | 'ready') => {
    if (!currentPost) {
      toast({
        variant: "destructive",
        title: "No Post",
        description: "Please select or create a post first",
      });
      return false;
    }

    try {
      // Only send the fields that were changed, preserve the original structure
      const updateData: any = {
        title: titleText,
        caption: captionText,
        hashtags: activeHashtags, // Keep hashtags as-is (with # symbols if they have them)
      };

      // Add status if provided
      if (_statusOverride) {
        updateData.status = _statusOverride;
      }

      // Convert canvas elements back to API pictureElements format
      if (canvasElements.length > 0 && currentPost.dimensions) {
        const pictureElements: PictureElement[] = canvasElements.map((el) => {
          // Convert percentage position back to absolute coordinates
          const absoluteX = (el.position.x / 100) * currentPost.dimensions!.width;
          const absoluteY = (el.position.y / 100) * currentPost.dimensions!.height;

          if (el.type === 'text') {
            // Scale font size back up (reverse the 60% reduction we did on load)
            const originalFontSize = el.style?.fontSize
              ? Math.round(parseInt(el.style.fontSize) / 0.6)
              : 26;

            return {
              type: 'text',
              text: el.content,
              fontFamily: el.style?.fontFamily || 'Inter, sans-serif',
              fontSize: originalFontSize,
              fontWeight: el.style?.fontWeight || '600',
              color: el.style?.color || '#000000',
              alignment: 'center' as const,
              position: {
                x: absoluteX,
                y: absoluteY,
              },
              rotation: 0,
            };
          } else {
            // For shapes, calculate size from percentage
            const size = Math.round((el.size.width / 100) * currentPost.dimensions!.width);

            return {
              type: 'svg',
              shape: el.content, // el.content now contains the API shape ID
              size: size,
              position: {
                x: absoluteX,
                y: absoluteY,
              },
              rotation: 0,
              color: el.style?.color,
            };
          }
        });

        updateData.pictureElements = pictureElements;
      } else if (currentPost.pictureElements) {
        // If no canvas elements but original had picture elements, preserve them
        updateData.pictureElements = currentPost.pictureElements;
      }

      // Store current state before reloading to prevent false unsaved changes detection
      const savedTitle = titleText;
      const savedCaption = captionText;
      const savedHashtags = [...activeHashtags];
      const savedElements = [...canvasElements];

      // Determine which API to call based on isTemplate field
      if (currentPost.isTemplate) {
        // If editing a template, customize it (creates new post)
        const newPost = await aiStudioAPI.customizePostTemplate(currentPost.id);
        // Then update the new post with changes
        await aiStudioAPI.updatePost(newPost.id, updateData);

        setLocation(`/editors?postId=${newPost.id}`);
        await loadPost(newPost.id);
      } else {
        // Regular post update
        await updatePost(currentPost.id, updateData);

        await loadPost(currentPost.id);
      }

      // After reloading, restore the saved state as the new original state
      // This prevents false positives when the API returns slightly different formatting
      setOriginalState({
        title: savedTitle,
        caption: savedCaption,
        hashtags: savedHashtags,
        elements: savedElements,
      });

      setHasUnsavedChanges(false);
      return true;
    } catch (error: any) {
      console.error('Save failed:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Failed to save changes",
      });
      return false;
    }
  };

  /**
   * Handle Draft button - save as draft
   */
  const handleSaveAsDraft = async () => {
    const success = await saveChanges('draft');
    if (success) {
      toast({
        title: "Saved as Draft",
        description: "Your post has been saved as a draft",
      });
      // Refresh drafts list
      await loadDrafts();
    }
  };

  /**
   * Handle Save button - save with ready status
   */
  const handleSave = async () => {
    const success = await saveChanges('ready');
    if (success) {
      toast({
        title: "Saved",
        description: "Your changes have been saved",
      });
    }
  };

  /**
   * Handle Publish button - placeholder for future publish API
   */
  const handlePublish = () => {
    toast({
      title: "Publish API Pending",
      description: "Please save your changes first. Publish functionality will be implemented soon.",
    });
  };

  /**
   * Handle save confirmation dialog actions
   */
  const handleSaveAndProceed = async () => {
    const success = await saveChanges();
    if (success && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowSaveDialog(false);
  };

  const handleDiscardAndProceed = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setHasUnsavedChanges(false);
    setShowSaveDialog(false);
  };

  const handleCancelDialog = () => {
    setPendingAction(null);
    setShowSaveDialog(false);
  };

  /**
   * Save current canvas state to history for undo/redo
   */
  const saveToHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  /**
   * Undo last action
   */
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCanvasElements([...history[newIndex]]);
      toast({
        title: "Undo",
        description: "Reverted last change",
      });
    }
  };

  /**
   * Redo last undone action
   */
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCanvasElements([...history[newIndex]]);
      toast({
        title: "Redo",
        description: "Reapplied change",
      });
    }
  };

  // Canvas interaction handlers (shapes, text, drag, resize, etc.)
  const addToRecent = (type: "shape" | "text", content: string) => {
    const newRecent = { type, content, timestamp: Date.now() };
    const filtered = recentElements.filter(
      (el) => !(el.type === type && el.content === content)
    );
    setRecentElements([newRecent, ...filtered].slice(0, 6));
  };

  const handleShapeClick = (shapeId: string, shapeName: string) => {
    // Set same small initial size for all shapes
    const initialSize = { width: 8, height: 8 };

    const newElement: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      content: shapeId, // Store the API shape ID
      position: { x: 50, y: 50 },
      size: initialSize,
      style: { color: selectedColor },
    };
    const newElements = [...canvasElements, newElement];
    saveToHistory(newElements);
    setCanvasElements(newElements);
    addToRecent("shape", shapeId);
    toast({
      title: "Shape Added",
      description: `${shapeName} added. Drag to move, resize corners, double-click to remove.`,
    });
  };

  const handleTextStyleClick = (style: string) => {
    let fontSize = selectedFontSize;
    let fontWeight = "600";
    let fontFamily = "Inter, sans-serif";
    let fontStyle = "normal";
    let letterSpacing = "normal";
    let textTransform = "none";
    let content = "";

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
    } else if (style === "Font Combo 1") {
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
      size: { width: 30, height: 10 }, // Smaller default size in percentage
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
    const newElements = [...canvasElements, newElement];
    saveToHistory(newElements);
    setCanvasElements(newElements);
    addToRecent("text", style);
    toast({
      title: "Text Added",
      description: `Drag to move, resize corners, double-click to remove.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        // Handle image upload - you might want to update the post's image
        toast({
          title: "Upload Complete",
          description: `${file.name} uploaded successfully`,
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload an image file",
      });
    }
  };

  /**
   * Handle upload button click - check for unsaved changes first
   */
  const handleUploadClick = () => {
    const openUploadModal = () => {
      setShowUploadModal(true);
    };

    if (hasUnsavedChanges && currentPost) {
      setPendingAction(() => openUploadModal);
      setShowSaveDialog(true);
    } else {
      openUploadModal();
    }
  };

  /**
   * Handle image upload submission
   */
  const handleUploadImageSubmit = async (data: {
    image: File;
    platform: 'instagram' | 'instagram-story' | 'facebook' | 'twitter';
    style: 'professional' | 'modern' | 'elegant' | 'playful' | 'natural';
    additionalContext?: string;
  }) => {
    try {
      setIsUploadingImage(true);

      // Call API to create post from image
      const postId = await createPostFromImage(data);

      // Store the job ID and show progress modal
      setUploadJobId(postId);
      setShowUploadModal(false);
      setShowProgressModal(true);

      toast({
        title: "Upload Started!",
        description: "Your image is being processed. This may take a moment...",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  /**
   * Handle generation completion - navigate to the new post
   */
  const handleGenerationComplete = () => {
    if (uploadJobId) {
      setLocation(`/editors?postId=${uploadJobId}`);
      loadPost(uploadJobId);
      setUploadJobId(null);
    }
  };

  const handleRemoveElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newElements = canvasElements.filter((el) => el.id !== id);
    saveToHistory(newElements);
    setCanvasElements(newElements);
    // Clear selection if the removed element was selected
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    toast({
      title: "Element Removed",
      description: "Element removed from canvas",
    });
  };

  const handleMouseDown = (id: string, e: React.MouseEvent, isPreview: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    const element = canvasElements.find((el) => el.id === id);
    const targetCanvas = isPreview ? previewCanvasRef.current : canvasRef.current;
    if (!element || !targetCanvas) return;
    const rect = targetCanvas.getBoundingClientRect();
    const offsetX = ((e.clientX - rect.left) / rect.width) * 100 - element.position.x;
    const offsetY = ((e.clientY - rect.top) / rect.height) * 100 - element.position.y;
    setDraggingId(id);
    setDragOffset({ x: offsetX, y: offsetY });
    // Select the element when clicked
    setSelectedElementId(id);
  };

  const handleMouseMove = (e: React.MouseEvent, isPreview: boolean = false) => {
    const targetCanvas = isPreview ? previewCanvasRef.current : canvasRef.current;
    if (!targetCanvas) return;
    const rect = targetCanvas.getBoundingClientRect();

    if (draggingId) {
      const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x));
      const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y));
      setCanvasElements(
        canvasElements.map((el) =>
          el.id === draggingId ? { ...el, position: { x, y } } : el
        )
      );
    }

    if (resizingId) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const deltaX = mouseX - resizeStart.x;
      const deltaY = mouseY - resizeStart.y;

      // Convert pixel deltas to percentage changes
      const deltaWidthPercent = (deltaX / rect.width) * 100;
      const deltaHeightPercent = (deltaY / rect.height) * 100;

      setCanvasElements(
        canvasElements.map((el) => {
          if (el.id === resizingId) {
            const newWidth = Math.max(5, resizeStart.width + deltaWidthPercent);
            const newHeight = Math.max(3, resizeStart.height + deltaHeightPercent);
            return { ...el, size: { width: newWidth, height: newHeight } };
          }
          return el;
        })
      );
    }
  };

  const handleMouseUp = () => {
    // Save to history if we were dragging or resizing
    if (draggingId || resizingId) {
      saveToHistory(canvasElements);
    }
    setDraggingId(null);
    setResizingId(null);
  };

  const handleResizeStart = (id: string, e: React.MouseEvent, isPreview: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    const element = canvasElements.find((el) => el.id === id);
    const targetCanvas = isPreview ? previewCanvasRef.current : canvasRef.current;
    if (!element || !targetCanvas) return;
    const rect = targetCanvas.getBoundingClientRect();
    setResizingId(id);
    setResizeStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: element.size.width,
      height: element.size.height,
    });
  };

  const handleTextClick = (elementId: string, currentText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(elementId);
    setEditingText(currentText);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const handleTextBlur = () => {
    if (editingId && editingText.trim()) {
      const newElements = canvasElements.map((el) =>
        el.id === editingId ? { ...el, content: editingText } : el
      );
      saveToHistory(newElements);
      setCanvasElements(newElements);
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

  const handleAddHashtag = (hashtag: string) => {
    if (!activeHashtags.includes(hashtag)) {
      setActiveHashtags([...activeHashtags, hashtag]);
      toast({
        title: "Hashtag Added",
        description: `${hashtag} added to post`,
      });
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setActiveHashtags(activeHashtags.filter(tag => tag !== hashtag));
    toast({
      title: "Hashtag Removed",
      description: `${hashtag} removed from post`,
    });
  };

  // Hidden file input
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileUpload}
      style={{ display: "none" }}
    />
  );

  return (
    <DashboardLayout>
      {fileInput}
      <div className="p-4 md:p-6 space-y-4 md:space-y-5" style={{ backgroundColor: "#F5F5F5" }}>
        <div className="h-max flex flex-col" style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", paddingTop: "24px", border: "1px solid #E5E7EB" }}>

          {/* Page Header */}
          <div className="px-4 md:px-6 mb-4">
            <h1 className="text-lg sm:text-xl mb-1" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#202020" }}>
              Editor
            </h1>
            <p className="text-xs sm:text-sm" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#6B7280" }}>
              Edit and customize your content
            </p>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "#EBEBEB", marginTop: "16px" }} />

          {/* Main Content - Three Column Layout */}
          <div className="flex flex-col lg:flex-row items-start gap-4 px-4 md:px-6 pt-6 pb-6">

            {/* LEFT PANEL - Templates/Drafts */}
            <div className="w-full lg:w-[28%]" style={{ maxHeight: "660px", backgroundColor: "#F0F0F0", display: "flex", flexDirection: "column", overflow: "hidden", padding: "18px", gap: "15px", border: "1px solid #DADADA", borderRadius: "12px" }}>

              {/* Tabs */}
              <div className="flex items-center" style={{ position: "relative", borderBottom: "1px solid #E0E0E0" }}>
                <button
                  onClick={() => handleLeftTabChange('templates')}
                  className="transition-all"
                  style={{
                    width: "100%",
                    padding: "12px 10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    color: leftTab === 'templates' ? "#000000" : "#B0B0B0",
                    border: "none",
                    borderBottom: leftTab === 'templates' ? "2px solid #000000" : "none",
                    cursor: "pointer",
                    position: "relative",
                    marginBottom: "-1px",
                  }}
                >
                  Templates
                </button>
                <button
                  onClick={() => handleLeftTabChange('drafts')}
                  className="transition-all"
                  style={{
                    width: "100%",
                    padding: "12px 10px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    backgroundColor: "transparent",
                    color: leftTab === 'drafts' ? "#000000" : "#B0B0B0",
                    border: "none",
                    borderBottom: leftTab === 'drafts' ? "2px solid #000000" : "none",
                    cursor: "pointer",
                    position: "relative",
                    marginBottom: "-1px",
                  }}
                >
                  Drafts
                </button>
              </div>

              {/* Templates Tab Content */}
              {leftTab === 'templates' && (
                <div className="flex flex-row overflow-hidden gap-3 sm:gap-5">
                  {/* Tool Icons */}
                  <div className="flex flex-col gap-2 sm:gap-[10px]">
                    <button
                      onClick={() => handleEditorPanelChange("templates")}
                      className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                      style={{
                        backgroundColor: editorPanel === "templates" ? "#D4A855" : "#1A1A1A",
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
                      <span style={{ fontSize: "9px", color: "#FFFFFF", fontWeight: 500 }}>Design</span>
                    </button>
                    <button
                      onClick={() => handleEditorPanelChange("elements")}
                      className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                      style={{
                        backgroundColor: editorPanel === "elements" ? "#D4A855" : "#1A1A1A",
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
                      <span style={{ fontSize: "9px", color: "#FFFFFF", fontWeight: 500 }}>Elements</span>
                    </button>
                    <button
                      onClick={() => handleEditorPanelChange("text")}
                      className="transition-all hover:opacity-80 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[68px] md:h-[68px]"
                      style={{
                        backgroundColor: editorPanel === "text" ? "#D4A855" : "#1A1A1A",
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
                      <span style={{ fontSize: "9px", color: "#FFFFFF", fontWeight: 500 }}>Text</span>
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
                      <span style={{ fontSize: "9px", color: "#FFFFFF", fontWeight: 500 }}>Uploads</span>
                    </button>
                  </div>

                  {/* Dynamic Content Panel */}
                  <div className="custom-scrollbar overflow-y-auto flex-1" style={{ maxHeight: "500px" }}>

                    {/* Templates Grid */}
                    {editorPanel === "templates" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 sm:gap-[10px]">
                          {isLoadingTemplates && templates.length === 0 ? (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF" }}>
                              Loading templates...
                            </div>
                          ) : templates.length > 0 ? (
                            templates.map((template) => (
                              <button
                                key={template.id}
                                onClick={() => handleTemplateClick(template.id)}
                                className="transition-all"
                                style={{
                                  width: "100%",
                                  aspectRatio: "3/4",
                                  borderRadius: "16px",
                                  border: selectedTemplateId === template.id ? "3px solid #D4A855" : "2px solid #DADADA",
                                  padding: "0",
                                  backgroundColor: "#FFFFFF",
                                  cursor: "pointer",
                                  overflow: "hidden",
                                  boxSizing: "border-box",
                                  boxShadow: selectedTemplateId === template.id ? "0 4px 14px rgba(212, 168, 85, 0.35)" : "0 2px 6px rgba(0, 0, 0, 0.08)",
                                }}
                              >
                                <img
                                  src={(template as any).pictureUrl || template.previewImageUrl}
                                  alt={(template as any).title || template.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "13px" }}
                                />
                              </button>
                            ))
                          ) : (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", backgroundColor: "#F9FAFB", borderRadius: "16px" }}>
                              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#6B7280", marginBottom: "8px" }}>
                                No templates available
                              </p>
                              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF" }}>
                                Check back later for templates
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Load More Button for Templates */}
                        {templates.length > 0 && hasMoreTemplates && (
                          <div className="flex justify-center pt-2">
                            <button
                              onClick={loadMoreTemplates}
                              disabled={isLoadingTemplates}
                              className="transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                padding: "8px 20px",
                                borderRadius: "20px",
                                backgroundColor: "#1A1A1A",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "#FFFFFF",
                                border: "none",
                                cursor: isLoadingTemplates ? "not-allowed" : "pointer",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                              }}
                            >
                              {isLoadingTemplates ? "Loading..." : "Load More"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Elements Panel (Shapes) */}
                    {editorPanel === "elements" && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#000000" }}>Shapes</h3>
                          <button onClick={() => setEditorPanel("templates")} className="transition-all hover:opacity-70" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                            <X size={20} color="#666666" />
                          </button>
                        </div>

                        {/* Color Picker */}
                        <div>
                          <h4 style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#666666", marginBottom: "12px" }}>Shape Color</h4>
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
                                  border: selectedColor === color ? "3px solid #D4A855" : color === "#FFFFFF" ? "2px solid #DADADA" : "2px solid transparent",
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  boxShadow: selectedColor === color ? "0 2px 8px rgba(212, 168, 85, 0.4)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
                                }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Shapes Grid */}
                        <div>
                          <h4 style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#666666", marginBottom: "12px" }}>Shapes</h4>
                          {isLoadingShapes ? (
                            <div style={{ textAlign: "center", padding: "20px", fontSize: "12px", color: "#9CA3AF" }}>
                              Loading shapes...
                            </div>
                          ) : shapes.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                              {shapes.map((shape) => (
                                <button
                                  key={shape.id}
                                  onClick={() => handleShapeClick(shape.id, shape.name)}
                                  className="transition-all hover:bg-gray-100"
                                  style={{
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid #E5E7EB",
                                    backgroundColor: "#FFFFFF",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <div
                                    style={{ width: "24px", height: "24px" }}
                                    dangerouslySetInnerHTML={{
                                      __html: (() => {
                                        let svg = shape.svg;
                                        // Add fill to shapes
                                        if (!svg.includes('fill=')) {
                                          svg = svg.replace(/<(path|circle|rect|polygon|line)/g, '<$1 fill="#000000"');
                                        }
                                        // For line shapes, add stroke
                                        if (shape.id === 'line' || shape.id === 'arrow') {
                                          svg = svg.replace(/<line/g, '<line stroke="#000000"');
                                        }
                                        return svg;
                                      })()
                                    }}
                                  />
                                  <span style={{ fontSize: "9px", color: "#666", fontWeight: 500 }}>{shape.name}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: "center", padding: "20px", fontSize: "12px", color: "#9CA3AF" }}>
                              No shapes available
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Text Panel */}
                    {editorPanel === "text" && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#000000" }}>Text Styles</h3>
                          <button onClick={() => setEditorPanel("templates")} className="transition-all hover:opacity-70" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                            <X size={20} color="#666666" />
                          </button>
                        </div>

                        {/* Font Size Selector */}
                        <div>
                          <h4 style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#666666", marginBottom: "12px" }}>Font Size</h4>
                          <div className="flex gap-2 flex-wrap">
                            {fontSizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => {
                                  setSelectedFontSize(size);
                                  // Apply font size to selected text element
                                  if (selectedElementId) {
                                    const selectedElement = canvasElements.find(el => el.id === selectedElementId);
                                    if (selectedElement && selectedElement.type === 'text') {
                                      const newElements = canvasElements.map((el) =>
                                        el.id === selectedElementId
                                          ? { ...el, style: { ...el.style, fontSize: size } }
                                          : el
                                      );
                                      saveToHistory(newElements);
                                      setCanvasElements(newElements);
                                      toast({
                                        title: "Font Size Updated",
                                        description: `Font size changed to ${size}`,
                                      });
                                    }
                                  }
                                }}
                                className="transition-all hover:scale-105"
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  border: selectedFontSize === size ? "2px solid #D4A855" : "1px solid #E5E7EB",
                                  backgroundColor: selectedFontSize === size ? "#FEF3C7" : "#FFFFFF",
                                  cursor: "pointer",
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  color: "#666",
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Text Styles */}
                        <div>
                          <h4 style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#666666", marginBottom: "12px" }}>Text Styles</h4>
                          <div className="space-y-2">
                            {textStyles.map((style) => (
                              <button
                                key={style}
                                onClick={() => handleTextStyleClick(style)}
                                className="w-full transition-all hover:bg-gray-100"
                                style={{
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid #E5E7EB",
                                  backgroundColor: "#FFFFFF",
                                  cursor: "pointer",
                                  textAlign: "left",
                                }}
                              >
                                <span style={{ fontSize: "13px", color: "#666", fontWeight: 500 }}>{style}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Drafts Tab Content */}
              {leftTab === 'drafts' && (
                <div className="custom-scrollbar overflow-y-auto" style={{ maxHeight: "580px" }}>
                  {isLoadingDrafts ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF" }}>
                      Loading drafts...
                    </div>
                  ) : drafts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {drafts.map((draft) => (
                        <button
                          key={draft.id}
                          onClick={() => handleDraftClick(draft.id)}
                          className="transition-all hover:opacity-80"
                          style={{
                            width: "100%",
                            aspectRatio: "3/4",
                            borderRadius: "12px",
                            border: currentPost?.id === draft.id ? "3px solid #D4A855" : "2px solid #DADADA",
                            padding: "0",
                            backgroundColor: "#FFFFFF",
                            cursor: "pointer",
                            overflow: "hidden",
                            boxSizing: "border-box",
                            boxShadow: currentPost?.id === draft.id ? "0 4px 14px rgba(212, 168, 85, 0.35)" : "0 2px 6px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          {(draft as any).flattenedImageUrl || draft.pictureUrl || draft.imageUrl ? (
                            <img
                              src={(draft as any).flattenedImageUrl || draft.pictureUrl || draft.imageUrl}
                              alt={draft.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                            />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F5F5F5" }}>
                              <Sparkles className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: "#F9FAFB", borderRadius: "16px" }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#6B7280", marginBottom: "8px" }}>
                        No drafts yet
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9CA3AF" }}>
                        Your saved drafts will appear here
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CENTER PANEL - Canvas Preview */}
            <div className="w-full lg:w-[45%]" style={{ backgroundColor: "#FFFFFF", border: "1px solid #DADADA", borderRadius: "12px", padding: "13px" }}>
              {isLoadingPost ? (
                <div style={{ textAlign: "center", padding: "200px 20px", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9CA3AF" }}>
                  Loading post...
                </div>
              ) : currentPost ? (
                <>
                  {/* Canvas */}
                  <div
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                      width: "100%",
                      aspectRatio: currentPost.dimensions ? `${currentPost.dimensions.width}/${currentPost.dimensions.height}` : "1/1",
                      borderRadius: "12px",
                      backgroundColor: "#E5E7EB",
                      position: "relative",
                      overflow: "hidden",
                      marginBottom: "20px",
                    }}
                  >
                    {/* Background Image */}
                    {(currentPost.pictureUrl || currentPost.imageUrl) && (
                      <>
                        <img
                          src={currentPost.pictureUrl || currentPost.imageUrl}
                          alt={currentPost.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                        />
                        {/* Preview Icon */}
                        <button
                          onClick={() => setShowImagePreview(true)}
                          className="transition-all hover:bg-opacity-90"
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 100,
                            backdropFilter: "blur(4px)",
                          }}
                          title="View full image preview"
                        >
                          <Maximize2 size={20} color="#FFFFFF" />
                        </button>
                      </>
                    )}

                    {/* Canvas Elements */}
                    {canvasElements.map((element) => (
                      <div
                        key={element.id}
                        onMouseDown={(e) => handleMouseDown(element.id, e)}
                        onMouseEnter={() => setHoveredId(element.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onDoubleClick={(e) => handleRemoveElement(element.id, e)}
                        style={{
                          position: "absolute",
                          left: `${element.position.x}%`,
                          top: `${element.position.y}%`,
                          width: `${element.size.width}%`,
                          height: `${element.size.height}%`,
                          transform: 'translate(-50%, -50%)', // Center the element on its position
                          cursor: draggingId === element.id ? "grabbing" : "grab",
                          border: selectedElementId === element.id ? "2px solid #D4A855" : hoveredId === element.id ? "1px dashed #D4A855" : "none",
                          zIndex: selectedElementId === element.id ? 11 : hoveredId === element.id ? 10 : 1,
                          maxHeight: "fit-content", // Prevent excessive vertical height
                          padding: "2px", // Minimal padding
                        }}
                      >
                        {element.type === "shape" && (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {(() => {
                              const shape = shapes.find(s => s.id === element.content);
                              if (shape) {
                                // Apply color to SVG (both fill and stroke for lines)
                                const color = element.style?.color || "#000000";
                                let svgWithColor = shape.svg.replace(/fill="[^"]*"/g, `fill="${color}"`);
                                // If no fill attribute exists, add it to the SVG elements
                                if (!svgWithColor.includes('fill=')) {
                                  svgWithColor = svgWithColor.replace(/<(path|circle|rect|polygon|line)/g, `<$1 fill="${color}"`);
                                }
                                // For line shapes, also set stroke
                                if (shape.id === 'line' || shape.id === 'arrow') {
                                  svgWithColor = svgWithColor.replace(/stroke-width="[^"]*"/g, `stroke="${color}" stroke-width="2"`);
                                  if (!svgWithColor.includes('stroke=')) {
                                    svgWithColor = svgWithColor.replace(/<line/g, `<line stroke="${color}"`);
                                  }
                                }
                                return (
                                  <div
                                    style={{ width: "100%", height: "100%" }}
                                    dangerouslySetInnerHTML={{ __html: svgWithColor }}
                                  />
                                );
                              }
                              // Fallback for legacy shapes or if shape not found
                              return <div style={{ width: "100%", height: "100%", backgroundColor: element.style?.color || "#000000" }} />;
                            })()}
                          </div>
                        )}

                        {element.type === "text" && (
                          <div
                            onClick={(e) => handleTextClick(element.id, element.content, e)}
                            style={{
                              fontFamily: element.style?.fontFamily || "Inter, sans-serif",
                              fontSize: element.style?.fontSize || "16px",
                              fontWeight: element.style?.fontWeight || "600",
                              color: element.style?.color || "#000000",
                              backgroundColor: "transparent",
                              padding: "0",
                              borderRadius: "8px",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "visible",
                              textOverflow: "ellipsis",
                              fontStyle: element.style?.fontStyle || "normal",
                              letterSpacing: element.style?.letterSpacing || "normal",
                              textTransform: (element.style?.textTransform || "none") as any,
                              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)",
                              WebkitTextStroke: "0.5px rgba(0, 0, 0, 0.3)",
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
                                  fontFamily: element.style?.fontFamily || "Inter, sans-serif",
                                  fontSize: element.style?.fontSize || "16px",
                                  fontWeight: element.style?.fontWeight || "600",
                                  color: element.style?.color || "#000000",
                                  backgroundColor: "transparent",
                                  border: "2px solid #D4A855",
                                  borderRadius: "4px",
                                  padding: "4px 8px",
                                  width: "100%",
                                  textAlign: "center",
                                  outline: "none",
                                }}
                              />
                            ) : (
                              element.content
                            )}
                          </div>
                        )}

                        {/* Resize Handle */}
                        {hoveredId === element.id && (
                          <div
                            onMouseDown={(e) => handleResizeStart(element.id, e)}
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
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Post Info Below Canvas */}
                  <div style={{ padding: "10px 5px" }}>
                    <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 700, color: "#1F2937", marginBottom: "14px", lineHeight: "1.3" }}>
                      {titleText || currentPost.title || "Untitled"}
                    </h2>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500, color: "#000000B2", marginBottom: "18px", lineHeight: "1.6" }}>
                      {captionText || currentPost.caption || "No caption"}
                    </p>
                    <div className="flex gap-3 flex-wrap mb-5">
                      {activeHashtags.length > 0 ? (
                        activeHashtags.map((hashtag, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleRemoveHashtag(hashtag)}
                            className="transition-all hover:bg-red-100 hover:scale-95"
                            style={{
                              padding: "10px 18px",
                              borderRadius: "25px",
                              backgroundColor: "#CCCCCC",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "#00000080",
                              cursor: "pointer",
                              border: "none",
                            }}
                            title="Click to remove"
                          >
                            {hashtag}
                          </button>
                        ))
                      ) : (
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9CA3AF", fontStyle: "italic" }}>
                          No hashtags added yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-stretch sm:items-center mt-5 gap-2">
                    <button
                      onClick={handleSaveAsDraft}
                      className="transition-all hover:opacity-90"
                      style={{
                        padding: "10px 24px",
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
                      onClick={handleSave}
                      className="transition-all hover:opacity-90"
                      style={{
                        padding: "10px 24px",
                        borderRadius: "20px",
                        backgroundColor: "#4CAF50",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handlePublish}
                      className="transition-all hover:opacity-90"
                      style={{
                        padding: "10px 24px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #D4A855 0%, #CEA54F 100%)",
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
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "200px 20px", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9CA3AF" }}>
                  <Sparkles className="h-12 w-12 text-gray-300 mb-4 mx-auto" />
                  <p>Select a template or draft to start editing</p>
                </div>
              )}
            </div>

            {/* RIGHT PANEL - Editing Controls */}
            <div className="w-full lg:w-[27%]" style={{ backgroundColor: "#F2F2F2", border: "1px solid #DADADA", display: "flex", flexDirection: "column", height: "660px", overflow: "hidden", borderRadius: "12px", padding: "15px" }}>
              <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#000000B2", marginBottom: "20px" }}>
                Edit Content
              </h3>

              {currentPost ? (
                <div style={{ flex: 1, overflowY: "auto" }} className="space-y-4">
                  {/* Title Input */}
                  <div style={{ padding: "16px", backgroundColor: "#FFFFFF", borderRadius: "12px" }}>
                    <label style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#6B7280", marginBottom: "8px", display: "block" }}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={titleText}
                      onChange={(e) => setTitleText(e.target.value)}
                      placeholder="Enter post title..."
                      className="w-full focus:outline-none"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1F2937",
                        backgroundColor: "transparent",
                        border: "none",
                        padding: "0",
                      }}
                    />
                  </div>

                  {/* Caption Textarea */}
                  <div style={{ padding: "16px", backgroundColor: "#FFFFFF", borderRadius: "12px" }}>
                    <label style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#6B7280", marginBottom: "8px", display: "block" }}>
                      Caption
                    </label>
                    <textarea
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      maxLength={maxCharacters}
                      placeholder="Write your caption here..."
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
                        minHeight: "120px",
                      }}
                    />
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#000000B2", marginTop: "8px" }}>
                      {captionText.length} / {maxCharacters} characters
                    </div>
                  </div>

                  {/* Hashtags Section */}
                  <div>
                    <h4 style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1F2937", marginBottom: "12px" }}>
                      Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPost.hashtags?.map((hashtag, idx) => {
                        const formattedTag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
                        const isActive = activeHashtags.includes(formattedTag);
                        return (
                          <button
                            key={idx}
                            onClick={() => isActive ? handleRemoveHashtag(formattedTag) : handleAddHashtag(formattedTag)}
                            className="transition-all hover:scale-95"
                            style={{
                              padding: "8px 14px",
                              borderRadius: "20px",
                              backgroundColor: isActive ? "#CEA54F" : "#E5E7EB",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "12px",
                              fontWeight: 500,
                              color: isActive ? "#FFFFFF" : "#6B7280",
                              cursor: "pointer",
                              border: "none",
                            }}
                          >
                            {formattedTag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "14px" }}>
                  No post selected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && currentPost && (currentPost.pictureUrl || currentPost.imageUrl) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Scrollable Content Wrapper */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "50px 20px",
              overflowY: "auto",
            }}
          >
          {/* Close button */}
          <button
            onClick={() => setShowImagePreview(false)}
            className="transition-all hover:bg-opacity-90"
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10001,
              backdropFilter: "blur(8px)",
            }}
            title="Close preview (Esc)"
          >
            <X size={28} color="#FFFFFF" strokeWidth={2.5} />
          </button>

          {/* Interactive Canvas with Image */}
          <div
            ref={previewCanvasRef}
            onMouseMove={(e) => handleMouseMove(e, true)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: "relative",
              width: "40vw",
              aspectRatio: currentPost.dimensions ? `${currentPost.dimensions.width}/${currentPost.dimensions.height}` : "1/1",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Background Image */}
            <img
              src={currentPost.pictureUrl || currentPost.imageUrl}
              alt={currentPost.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />

            {/* Canvas Elements - Interactive */}
            {canvasElements.map((element) => (
              <div
                key={element.id}
                onMouseDown={(e) => handleMouseDown(element.id, e, true)}
                onMouseEnter={() => setHoveredId(element.id)}
                onMouseLeave={() => setHoveredId(null)}
                onDoubleClick={(e) => handleRemoveElement(element.id, e)}
                style={{
                  position: "absolute",
                  left: `${element.position.x}%`,
                  top: `${element.position.y}%`,
                  width: `${element.size.width}%`,
                  height: `${element.size.height}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: draggingId === element.id ? "grabbing" : "grab",
                  border: selectedElementId === element.id ? "3px solid #D4A855" : hoveredId === element.id ? "2px dashed #D4A855" : "none",
                  zIndex: selectedElementId === element.id ? 11 : hoveredId === element.id ? 10 : 1,
                  maxHeight: "fit-content",
                  padding: "2px",
                }}
              >
                {element.type === "shape" && (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {(() => {
                      const shape = shapes.find(s => s.id === element.content);
                      if (shape) {
                        // Apply color to SVG (both fill and stroke for lines)
                        const color = element.style?.color || "#000000";
                        let svgWithColor = shape.svg.replace(/fill="[^"]*"/g, `fill="${color}"`);
                        // If no fill attribute exists, add it to the SVG elements
                        if (!svgWithColor.includes('fill=')) {
                          svgWithColor = svgWithColor.replace(/<(path|circle|rect|polygon|line)/g, `<$1 fill="${color}"`);
                        }
                        // For line shapes, also set stroke
                        if (shape.id === 'line' || shape.id === 'arrow') {
                          svgWithColor = svgWithColor.replace(/stroke-width="[^"]*"/g, `stroke="${color}" stroke-width="2"`);
                          if (!svgWithColor.includes('stroke=')) {
                            svgWithColor = svgWithColor.replace(/<line/g, `<line stroke="${color}"`);
                          }
                        }
                        return (
                          <div
                            style={{ width: "100%", height: "100%" }}
                            dangerouslySetInnerHTML={{ __html: svgWithColor }}
                          />
                        );
                      }
                      // Fallback for legacy shapes or if shape not found
                      return <div style={{ width: "100%", height: "100%", backgroundColor: element.style?.color || "#000000" }} />;
                    })()}
                  </div>
                )}

                {element.type === "text" && (
                  <div
                    onClick={(e) => handleTextClick(element.id, element.content, e)}
                    style={{
                      fontFamily: element.style?.fontFamily || "Inter, sans-serif",
                      fontSize: element.style?.fontSize || "16px",
                      fontWeight: element.style?.fontWeight || "600",
                      color: element.style?.color || "#000000",
                      backgroundColor: "transparent",
                      padding: "0",
                      borderRadius: "8px",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "visible",
                      textOverflow: "ellipsis",
                      fontStyle: element.style?.fontStyle || "normal",
                      letterSpacing: element.style?.letterSpacing || "normal",
                      textTransform: (element.style?.textTransform || "none") as any,
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)",
                      WebkitTextStroke: "0.5px rgba(0, 0, 0, 0.3)",
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
                          fontFamily: element.style?.fontFamily || "Inter, sans-serif",
                          fontSize: element.style?.fontSize || "16px",
                          fontWeight: element.style?.fontWeight || "600",
                          color: element.style?.color || "#000000",
                          backgroundColor: "transparent",
                          border: "2px solid #D4A855",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          width: "100%",
                          textAlign: "center",
                          outline: "none",
                        }}
                      />
                    ) : (
                      element.content
                    )}
                  </div>
                )}

                {/* Resize Handle */}
                {hoveredId === element.id && (
                  <div
                    onMouseDown={(e) => handleResizeStart(element.id, e, true)}
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
                )}
              </div>
            ))}
          </div>
          </div>

          {/* Hint text - Fixed at bottom of viewport */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: "16px 24px",
              textAlign: "center",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 10002,
            }}
          >
            Drag to move • Resize corners • Double-click to remove • Press Esc to close
          </div>
        </div>
      )}

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before continuing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardAndProceed} className="bg-red-600 hover:bg-red-700">
              Discard Changes
            </AlertDialogAction>
            <AlertDialogAction onClick={handleSaveAndProceed} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Image Modal */}
      <UploadImageModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUploadImageSubmit}
        isLoading={isUploadingImage}
      />

      {/* Generation Progress Modal */}
      {uploadJobId && (
        <GenerationProgressModal
          isOpen={showProgressModal}
          onClose={() => setShowProgressModal(false)}
          type="post"
          status={activeJobs.find(job => job.id === uploadJobId)?.status || 'queued'}
          progress={activeJobs.find(job => job.id === uploadJobId)?.progress || 0}
          message={activeJobs.find(job => job.id === uploadJobId)?.message}
          error={activeJobs.find(job => job.id === uploadJobId)?.error}
          onComplete={handleGenerationComplete}
        />
      )}
    </DashboardLayout>
  );
}
