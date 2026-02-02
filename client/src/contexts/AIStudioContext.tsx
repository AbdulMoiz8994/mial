/**
 * AI Studio Context
 *
 * Provides global state management for:
 * - Post generation with real-time progress
 * - Script generation with real-time progress
 * - Posts/Scripts lists (drafts and final)
 * - Templates browsing
 * - WebSocket integration for generation updates
 *
 * Usage:
 * import { useAIStudio } from '@/contexts/AIStudioContext';
 *
 * const { generatePost, posts, generationProgress } = useAIStudio();
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  aiStudioAPI,
  GeneratePostDto,
  GenerateScriptDto,
  Post,
  Script,
  PostTemplate,
  ScriptTemplate,
  UpdatePostDto,
  UpdateScriptDto,
  SVGShape,
} from '@/services/ai-studio.api';
import {
  webSocketService,
  ProgressEvent,
  CompletedEvent,
  FailedEvent,
} from '@/services/websocket.service';

// ============================================================================
// Context Type Definition
// ============================================================================

/**
 * Generation job state
 */
interface GenerationJob {
  id: string;
  type: 'post' | 'script';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  error?: string;
  result?: Post | Script;
}

interface AIStudioContextType {
  // Generation Jobs
  activeJobs: GenerationJob[];

  // Posts
  posts: Post[];
  isLoadingPosts: boolean;
  postsError: string | null;
  hasMorePosts: boolean;
  postsTotal: number;

  // Scripts
  scripts: Script[];
  isLoadingScripts: boolean;
  scriptsError: string | null;
  hasMoreScripts: boolean;
  scriptsTotal: number;

  // Templates
  postTemplates: PostTemplate[];
  scriptTemplates: ScriptTemplate[];
  isLoadingTemplates: boolean;
  hasMorePostTemplates: boolean;
  hasMoreScriptTemplates: boolean;

  // Shapes
  shapes: SVGShape[];
  isLoadingShapes: boolean;
  shapesError: string | null;

  // WebSocket
  isConnected: boolean;

  // Methods
  generatePost: (data: GeneratePostDto) => Promise<string>;
  createPostFromImage: (data: {
    image: File;
    platform: 'instagram' | 'instagram-story' | 'facebook' | 'twitter';
    style: 'professional' | 'modern' | 'elegant' | 'playful' | 'natural';
    additionalContext?: string;
  }) => Promise<string>;
  generateScript: (data: GenerateScriptDto) => Promise<string>;
  refreshPosts: (status?: 'draft' | 'final') => Promise<void>;
  loadMorePosts: (status?: 'draft' | 'final') => Promise<void>;
  refreshScripts: (status?: 'draft' | 'final') => Promise<void>;
  loadMoreScripts: (status?: 'draft' | 'final') => Promise<void>;
  getPost: (id: string) => Promise<Post>;
  getScript: (id: string) => Promise<Script>;
  updatePost: (id: string, data: UpdatePostDto) => Promise<Post>;
  updateScript: (id: string, data: UpdateScriptDto) => Promise<Script>;
  deletePost: (id: string) => Promise<void>;
  deleteScript: (id: string) => Promise<void>;
  loadPostTemplates: (platform?: string, style?: string) => Promise<void>;
  loadMorePostTemplates: (platform?: string, style?: string) => Promise<void>;
  loadScriptTemplates: (status?: 'draft' | 'final') => Promise<void>;
  loadMoreScriptTemplates: (status?: 'draft' | 'final') => Promise<void>;
  customizePostTemplate: (templateId: string) => Promise<Post>;
  customizeScriptTemplate: (templateId: string) => Promise<Script>;
  loadShapes: () => Promise<void>;
}

// ============================================================================
// Context Creation
// ============================================================================

const AIStudioContext = createContext<AIStudioContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface AIStudioProviderProps {
  children: ReactNode;
}

export function AIStudioProvider({ children }: AIStudioProviderProps) {
  // Generation Jobs
  const [activeJobs, setActiveJobs] = useState<GenerationJob[]>([]);

  // Posts State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [postsOffset, setPostsOffset] = useState<number>(0);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);
  const [postsTotal, setPostsTotal] = useState<number>(0);

  // Scripts State
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoadingScripts, setIsLoadingScripts] = useState<boolean>(false);
  const [scriptsError, setScriptsError] = useState<string | null>(null);
  const [scriptsOffset, setScriptsOffset] = useState<number>(0);
  const [hasMoreScripts, setHasMoreScripts] = useState<boolean>(true);
  const [scriptsTotal, setScriptsTotal] = useState<number>(0);

  // Templates State
  const [postTemplates, setPostTemplates] = useState<PostTemplate[]>([]);
  const [scriptTemplates, setScriptTemplates] = useState<ScriptTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(false);
  const [postTemplatesOffset, setPostTemplatesOffset] = useState<number>(0);
  const [scriptTemplatesOffset, setScriptTemplatesOffset] = useState<number>(0);
  const [hasMorePostTemplates, setHasMorePostTemplates] = useState<boolean>(true);
  const [hasMoreScriptTemplates, setHasMoreScriptTemplates] = useState<boolean>(true);

  // Shapes State
  const [shapes, setShapes] = useState<SVGShape[]>([]);
  const [isLoadingShapes, setIsLoadingShapes] = useState<boolean>(false);
  const [shapesError, setShapesError] = useState<string | null>(null);

  // WebSocket State
  const [isConnected, setIsConnected] = useState<boolean>(false);

  /**
   * Connect to WebSocket on mount
   */
  useEffect(() => {
    const token = localStorage.getItem('mia_auth_token');
    if (token) {
      webSocketService.connect();

      // Check connection status
      const checkConnection = setInterval(() => {
        setIsConnected(webSocketService.isConnected());
      }, 1000);

      return () => {
        clearInterval(checkConnection);
        webSocketService.disconnect();
      };
    }
  }, []);

  /**
   * Refresh posts list
   */
  const refreshPosts = useCallback(async (status?: 'draft' | 'final') => {
    try {
      setIsLoadingPosts(true);
      setPostsError(null);

      const limit = 10;
      const { posts: fetchedPosts, total, hasMore } = await aiStudioAPI.listPosts(status, limit, 0);

      // Filter out deleted posts (isDeleted: true)
      const activePosts = fetchedPosts.filter((post: any) => !post.isDeleted);

      setPosts(activePosts);
      setPostsOffset(limit);
      setPostsTotal(total);
      // Use the hasMore flag from the API response
      setHasMorePosts(hasMore);
    } catch (err: any) {
      console.error('Failed to load posts:', err);
      setPostsError(err.message || 'Failed to load posts');
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  /**
   * Load more posts (pagination)
   */
  const loadMorePosts = useCallback(async (status?: 'draft' | 'final') => {
    if (!hasMorePosts || isLoadingPosts) return;

    try {
      setIsLoadingPosts(true);

      const limit = 10;
      const { posts: fetchedPosts, total, hasMore } = await aiStudioAPI.listPosts(status, limit, postsOffset);

      // Filter out deleted posts (isDeleted: true)
      const activePosts = fetchedPosts.filter((post: any) => !post.isDeleted);

      setPosts((prev) => [...prev, ...activePosts]);
      setPostsOffset(postsOffset + limit);
      setPostsTotal(total);
      // Use the hasMore flag from the API response
      setHasMorePosts(hasMore);
    } catch (err: any) {
      console.error('Failed to load more posts:', err);
      setPostsError(err.message || 'Failed to load posts');
    } finally {
      setIsLoadingPosts(false);
    }
  }, [postsOffset, hasMorePosts, isLoadingPosts]);

  /**
   * Refresh scripts list
   */
  const refreshScripts = useCallback(async (status?: 'draft' | 'final') => {
    try {
      setIsLoadingScripts(true);
      setScriptsError(null);

      const limit = 10;
      const { scripts: fetchedScripts, total, hasMore } = await aiStudioAPI.listScripts(status, limit, 0);

      // Filter out deleted scripts (isDeleted: true)
      const activeScripts = fetchedScripts.filter((script: any) => !script.isDeleted);

      setScripts(activeScripts);
      setScriptsOffset(limit);
      setScriptsTotal(total);
      // Use the hasMore flag from the API response
      setHasMoreScripts(hasMore);
    } catch (err: any) {
      console.error('Failed to load scripts:', err);
      setScriptsError(err.message || 'Failed to load scripts');
    } finally {
      setIsLoadingScripts(false);
    }
  }, []);

  /**
   * Load more scripts (pagination)
   */
  const loadMoreScripts = useCallback(async (status?: 'draft' | 'final') => {
    if (!hasMoreScripts || isLoadingScripts) return;

    try {
      setIsLoadingScripts(true);

      const limit = 10;
      const { scripts: fetchedScripts, total, hasMore } = await aiStudioAPI.listScripts(status, limit, scriptsOffset);

      // Filter out deleted scripts (isDeleted: true)
      const activeScripts = fetchedScripts.filter((script: any) => !script.isDeleted);

      setScripts((prev) => [...prev, ...activeScripts]);
      setScriptsOffset(scriptsOffset + limit);
      setScriptsTotal(total);
      // Use the hasMore flag from the API response
      setHasMoreScripts(hasMore);
    } catch (err: any) {
      console.error('Failed to load more scripts:', err);
      setScriptsError(err.message || 'Failed to load scripts');
    } finally {
      setIsLoadingScripts(false);
    }
  }, [scriptsOffset, hasMoreScripts, isLoadingScripts]);

  /**
   * Poll for generation status (primary method since WebSocket is not available)
   */
  const pollPostStatus = useCallback(async (postId: string) => {
    const maxAttempts = 120; // Poll for up to 120 attempts (10 minutes with 5s interval)
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        const status = await aiStudioAPI.getPostStatus(postId);

        // Check if the response has isReady/isFailed flags (newer API format)
        const hasFlags = 'isReady' in status || 'isFailed' in status;

        // Map backend status to frontend status
        let mappedStatus: 'queued' | 'processing' | 'completed' | 'failed';

        if (hasFlags) {
          // Use flags if available (newer API)
          if ((status as any).isFailed) {
            mappedStatus = 'failed';
          } else if ((status as any).isReady) {
            mappedStatus = 'completed';
          } else if (status.status === 'generating') {
            mappedStatus = 'processing';
          } else {
            mappedStatus = status.status as any;
          }
        } else {
          // Fallback to status string (older API)
          mappedStatus = status.status === 'generating' ? 'processing' :
                        status.status === 'ready' ? 'completed' :
                        status.status as 'queued' | 'processing' | 'completed' | 'failed';
        }

        // Simulate progress if backend doesn't provide it
        let calculatedProgress = status.progress;
        if (!calculatedProgress && mappedStatus === 'processing') {
          // Show progress from 10% to 90% over ~30 seconds (6 polls at 5s each)
          calculatedProgress = Math.min(10 + (attempts * 13), 90);
        } else if (mappedStatus === 'completed') {
          calculatedProgress = 100;
        }

        // Update job status
        setActiveJobs((prev) =>
          prev.map((job) =>
            job.id === postId
              ? {
                  ...job,
                  status: mappedStatus,
                  progress: calculatedProgress ?? job.progress ?? 0,
                  message: status.message || (mappedStatus === 'processing' ? 'AI is creating your post...' : undefined),
                  error: status.error || ((status as any).isFailed ? 'Generation failed. Please try again.' : undefined),
                  result: status.result,
                }
              : job
          )
        );

        // If completed or failed, stop polling
        if (mappedStatus === 'completed') {
          refreshPosts();
          return;
        } else if (mappedStatus === 'failed') {
          return;
        }

        // Continue polling if not maxed out
        if (attempts < maxAttempts && (mappedStatus === 'queued' || mappedStatus === 'processing')) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else if (attempts >= maxAttempts) {
          setActiveJobs((prev) =>
            prev.map((job) =>
              job.id === postId
                ? {
                    ...job,
                    status: 'failed',
                    error: 'Generation timed out. Please try again.',
                  }
                : job
            )
          );
        }
      } catch (err) {
        console.error('[Polling] Failed to get post status:', err);
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setActiveJobs((prev) =>
            prev.map((job) =>
              job.id === postId
                ? {
                    ...job,
                    status: 'failed',
                    error: 'Failed to check generation status. Please try again.',
                  }
                : job
            )
          );
        }
      }
    };

    // Start polling immediately (no delay needed since WebSocket is disabled)
    poll();
  }, [refreshPosts]);

  /**
   * Generate a post
   */
  const generatePost = useCallback(async (data: GeneratePostDto): Promise<string> => {
    try {
      const { id } = await aiStudioAPI.generatePost(data);

      // Add to active jobs
      setActiveJobs((prev) => [
        ...prev,
        {
          id,
          type: 'post',
          status: 'queued',
          progress: 0,
        },
      ]);

      // Subscribe to WebSocket updates for real-time progress
      webSocketService.subscribe(id, 'post');

      // Start polling as fallback (in case WebSocket fails)
      setTimeout(() => pollPostStatus(id), 3000);

      return id;
    } catch (err: any) {
      console.error('Failed to generate post:', err);
      throw err;
    }
  }, [pollPostStatus]);

  /**
   * Create a post from an uploaded image
   */
  const createPostFromImage = useCallback(async (data: {
    image: File;
    platform: 'instagram' | 'instagram-story' | 'facebook' | 'twitter';
    style: 'professional' | 'modern' | 'elegant' | 'playful' | 'natural';
    additionalContext?: string;
  }): Promise<string> => {
    try {
      const { id } = await aiStudioAPI.createPostFromImage(data);

      // Add to active jobs
      setActiveJobs((prev) => [
        ...prev,
        {
          id,
          type: 'post',
          status: 'queued',
          progress: 0,
          message: 'Processing your image...',
        },
      ]);

      // Subscribe to WebSocket updates for real-time progress
      webSocketService.subscribe(id, 'post');

      // Start polling as fallback (in case WebSocket fails)
      setTimeout(() => pollPostStatus(id), 3000);

      return id;
    } catch (err: any) {
      console.error('Failed to create post from image:', err);
      throw err;
    }
  }, [pollPostStatus]);

  /**
   * Poll for script generation status (primary method since WebSocket is not available)
   */
  const pollScriptStatus = useCallback(async (scriptId: string) => {
    const maxAttempts = 120; // Poll for up to 120 attempts (10 minutes with 5s interval)
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        const status = await aiStudioAPI.getScriptStatus(scriptId);

        // Check if the response has isReady/isFailed flags (newer API format)
        const hasFlags = 'isReady' in status || 'isFailed' in status;

        // Map backend status to frontend status
        let mappedStatus: 'queued' | 'processing' | 'completed' | 'failed';

        if (hasFlags) {
          // Use flags if available (newer API)
          if ((status as any).isFailed) {
            mappedStatus = 'failed';
          } else if ((status as any).isReady) {
            mappedStatus = 'completed';
          } else if (status.status === 'generating') {
            mappedStatus = 'processing';
          } else {
            mappedStatus = status.status as any;
          }
        } else {
          // Fallback to status string (older API)
          mappedStatus = status.status === 'generating' ? 'processing' :
                        status.status === 'ready' ? 'completed' :
                        status.status as 'queued' | 'processing' | 'completed' | 'failed';
        }

        // Simulate progress if backend doesn't provide it
        let calculatedProgress = status.progress;
        if (!calculatedProgress && mappedStatus === 'processing') {
          // Show progress from 10% to 90% over ~30 seconds (6 polls at 5s each)
          calculatedProgress = Math.min(10 + (attempts * 13), 90);
        } else if (mappedStatus === 'completed') {
          calculatedProgress = 100;
        }

        // Update job status
        setActiveJobs((prev) =>
          prev.map((job) =>
            job.id === scriptId
              ? {
                  ...job,
                  status: mappedStatus,
                  progress: calculatedProgress ?? job.progress ?? 0,
                  message: status.message || (mappedStatus === 'processing' ? 'AI is creating your script...' : undefined),
                  error: status.error || ((status as any).isFailed ? 'Generation failed. Please try again.' : undefined),
                  result: status.result,
                }
              : job
          )
        );

        // If completed or failed, stop polling
        if (mappedStatus === 'completed') {
          refreshScripts();
          return;
        } else if (mappedStatus === 'failed') {
          return;
        }

        // Continue polling if not maxed out
        if (attempts < maxAttempts && (mappedStatus === 'queued' || mappedStatus === 'processing')) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else if (attempts >= maxAttempts) {
          setActiveJobs((prev) =>
            prev.map((job) =>
              job.id === scriptId
                ? {
                    ...job,
                    status: 'failed',
                    error: 'Generation timed out. Please try again.',
                  }
                : job
            )
          );
        }
      } catch (err) {
        console.error('[Polling] Failed to get script status:', err);
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        } else {
          setActiveJobs((prev) =>
            prev.map((job) =>
              job.id === scriptId
                ? {
                    ...job,
                    status: 'failed',
                    error: 'Failed to check generation status. Please try again.',
                  }
                : job
            )
          );
        }
      }
    };

    // Start polling immediately (no delay needed since WebSocket is disabled)
    poll();
  }, [refreshScripts]);

  /**
   * Generate a script
   */
  const generateScript = useCallback(async (data: GenerateScriptDto): Promise<string> => {
    try {
      const { id } = await aiStudioAPI.generateScript(data);

      // Add to active jobs
      setActiveJobs((prev) => [
        ...prev,
        {
          id,
          type: 'script',
          status: 'queued',
          progress: 0,
        },
      ]);

      // Subscribe to WebSocket updates for real-time progress
      webSocketService.subscribe(id, 'script');

      // Start polling as fallback (in case WebSocket fails)
      setTimeout(() => pollScriptStatus(id), 3000);

      return id;
    } catch (err: any) {
      console.error('Failed to generate script:', err);
      throw err;
    }
  }, [pollScriptStatus]);

  /**
   * Get a specific post
   */
  const getPost = useCallback(async (id: string): Promise<Post> => {
    return await aiStudioAPI.getPost(id);
  }, []);

  /**
   * Get a specific script
   */
  const getScript = useCallback(async (id: string): Promise<Script> => {
    return await aiStudioAPI.getScript(id);
  }, []);

  /**
   * Update a post
   */
  const updatePost = useCallback(async (id: string, data: UpdatePostDto): Promise<Post> => {
    const updated = await aiStudioAPI.updatePost(id, data);

    // Update in posts list
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? updated : post))
    );

    return updated;
  }, []);

  /**
   * Update a script
   */
  const updateScript = useCallback(async (id: string, data: UpdateScriptDto): Promise<Script> => {
    const updated = await aiStudioAPI.updateScript(id, data);

    // Update in scripts list
    setScripts((prev) =>
      prev.map((script) => (script.id === id ? updated : script))
    );

    return updated;
  }, []);

  /**
   * Delete a post
   */
  const deletePost = useCallback(async (id: string): Promise<void> => {
    await aiStudioAPI.deletePost(id);

    // Remove from posts list
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }, []);

  /**
   * Delete a script
   */
  const deleteScript = useCallback(async (id: string): Promise<void> => {
    await aiStudioAPI.deleteScript(id);

    // Remove from scripts list
    setScripts((prev) => prev.filter((script) => script.id !== id));
  }, []);

  /**
   * Load post templates
   */
  const loadPostTemplates = useCallback(async (platform?: string, style?: string) => {
    try {
      setIsLoadingTemplates(true);

      const limit = 10;
      const { templates, hasMore } = await aiStudioAPI.listPostTemplates(platform, style, limit, 0);

      setPostTemplates(templates);
      setPostTemplatesOffset(limit);
      // Use the hasMore flag from the API response
      setHasMorePostTemplates(hasMore);
    } catch (err: any) {
      console.error('Failed to load post templates:', err);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, []);

  /**
   * Load more post templates (pagination)
   */
  const loadMorePostTemplates = useCallback(async (platform?: string, style?: string) => {
    if (!hasMorePostTemplates || isLoadingTemplates) return;

    try {
      setIsLoadingTemplates(true);

      const limit = 10;
      const { templates, hasMore } = await aiStudioAPI.listPostTemplates(platform, style, limit, postTemplatesOffset);

      setPostTemplates((prev) => [...prev, ...templates]);
      setPostTemplatesOffset(postTemplatesOffset + limit);
      // Use the hasMore flag from the API response
      setHasMorePostTemplates(hasMore);
    } catch (err: any) {
      console.error('Failed to load more post templates:', err);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [postTemplatesOffset, hasMorePostTemplates, isLoadingTemplates]);

  /**
   * Load script templates
   */
  const loadScriptTemplates = useCallback(async (status?: 'draft' | 'final') => {
    try {
      setIsLoadingTemplates(true);

      const limit = 10;
      const { templates, hasMore } = await aiStudioAPI.listScriptTemplates(status, limit, 0);

      setScriptTemplates(templates);
      setScriptTemplatesOffset(limit);
      // Use the hasMore flag from the API response
      setHasMoreScriptTemplates(hasMore);
    } catch (err: any) {
      console.error('Failed to load script templates:', err);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, []);

  /**
   * Load more script templates (pagination)
   */
  const loadMoreScriptTemplates = useCallback(async (status?: 'draft' | 'final') => {
    if (!hasMoreScriptTemplates || isLoadingTemplates) return;

    try {
      setIsLoadingTemplates(true);

      const limit = 10;
      const { templates, hasMore } = await aiStudioAPI.listScriptTemplates(status, limit, scriptTemplatesOffset);

      setScriptTemplates((prev) => [...prev, ...templates]);
      setScriptTemplatesOffset(scriptTemplatesOffset + limit);
      // Use the hasMore flag from the API response
      setHasMoreScriptTemplates(hasMore);
    } catch (err: any) {
      console.error('Failed to load more script templates:', err);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [scriptTemplatesOffset, hasMoreScriptTemplates, isLoadingTemplates]);

  /**
   * Customize a post template
   */
  const customizePostTemplate = useCallback(async (templateId: string): Promise<Post> => {
    const newPost = await aiStudioAPI.customizePostTemplate(templateId);

    // Add to posts list
    setPosts((prev) => [newPost, ...prev]);

    return newPost;
  }, []);

  /**
   * Customize a script template
   */
  const customizeScriptTemplate = useCallback(async (templateId: string): Promise<Script> => {
    const newScript = await aiStudioAPI.customizeScriptTemplate(templateId);

    // Add to scripts list
    setScripts((prev) => [newScript, ...prev]);

    return newScript;
  }, []);

  /**
   * Handle WebSocket progress events
   */
  useEffect(() => {
    const handleProgress = (event: ProgressEvent) => {
      setActiveJobs((prev) =>
        prev.map((job) =>
          job.id === event.id
            ? {
                ...job,
                status: event.status,
                progress: event.progress,
                message: event.message,
              }
            : job
        )
      );
    };

    const handleCompleted = (event: CompletedEvent) => {
      setActiveJobs((prev) =>
        prev.map((job) =>
          job.id === event.id
            ? {
                ...job,
                status: 'completed',
                progress: 100,
                result: event.result,
              }
            : job
        )
      );

      // Refresh posts or scripts list
      if (event.type === 'post') {
        refreshPosts();
      } else {
        refreshScripts();
      }
    };

    const handleFailed = (event: FailedEvent) => {
      setActiveJobs((prev) =>
        prev.map((job) =>
          job.id === event.id
            ? {
                ...job,
                status: 'failed',
                error: event.error,
              }
            : job
        )
      );
    };

    webSocketService.on('progress', handleProgress as any);
    webSocketService.on('completed', handleCompleted as any);
    webSocketService.on('failed', handleFailed as any);

    return () => {
      webSocketService.off('progress', handleProgress as any);
      webSocketService.off('completed', handleCompleted as any);
      webSocketService.off('failed', handleFailed as any);
    };
  }, [refreshPosts, refreshScripts]);

  /**
   * Load SVG shapes for post editing
   */
  const loadShapes = useCallback(async () => {
    try {
      setIsLoadingShapes(true);
      setShapesError(null);

      const { shapes: fetchedShapes } = await aiStudioAPI.getShapes();
      setShapes(fetchedShapes);
    } catch (err: any) {
      console.error('Failed to load shapes:', err);
      setShapesError(err.message || 'Failed to load shapes');
    } finally {
      setIsLoadingShapes(false);
    }
  }, []);

  /**
   * Load initial data on mount - Load ALL posts and scripts (both draft and final)
   */
  useEffect(() => {
    const token = localStorage.getItem('mia_auth_token');
    if (token) {
      // Load all posts (don't filter by status)
      refreshPosts();
      refreshScripts();
      loadShapes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // ============================================================================
  // Provider Value
  // ============================================================================

  const value: AIStudioContextType = {
    activeJobs,
    posts,
    isLoadingPosts,
    postsError,
    hasMorePosts,
    postsTotal,
    scripts,
    isLoadingScripts,
    scriptsError,
    hasMoreScripts,
    scriptsTotal,
    postTemplates,
    scriptTemplates,
    isLoadingTemplates,
    hasMorePostTemplates,
    hasMoreScriptTemplates,
    shapes,
    isLoadingShapes,
    shapesError,
    isConnected,
    generatePost,
    createPostFromImage,
    generateScript,
    refreshPosts,
    loadMorePosts,
    refreshScripts,
    loadMoreScripts,
    getPost,
    getScript,
    updatePost,
    updateScript,
    deletePost,
    deleteScript,
    loadPostTemplates,
    loadMorePostTemplates,
    loadScriptTemplates,
    loadMoreScriptTemplates,
    customizePostTemplate,
    customizeScriptTemplate,
    loadShapes,
  };

  return (
    <AIStudioContext.Provider value={value}>
      {children}
    </AIStudioContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access AI Studio context
 *
 * @throws {Error} If used outside AIStudioProvider
 *
 * @example
 * const { generatePost, posts, activeJobs } = useAIStudio();
 *
 * // Generate a post
 * const postId = await generatePost({
 *   prompt: 'Modern autumn hair transformation',
 *   platform: 'instagram',
 *   style: 'professional'
 * });
 *
 * // Track progress
 * const job = activeJobs.find(j => j.id === postId);
 * console.log(`Progress: ${job?.progress}%`);
 */
export function useAIStudio() {
  const context = useContext(AIStudioContext);

  if (!context) {
    throw new Error('useAIStudio must be used within an AIStudioProvider');
  }

  return context;
}
