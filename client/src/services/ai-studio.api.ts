/**
 * AI Studio API Service
 *
 * Handles all AI content generation and management operations including:
 * - Post generation (social media posts with AI-generated images and captions)
 * - Script generation (video scripts for reels/stories/shorts)
 * - Templates (pre-built post and script templates)
 * - Content CRUD operations (list, get, update, delete posts/scripts)
 * - SVG shapes for post editing
 * - Real-time generation status (use WebSocket service for updates)
 *
 * Base URL: https://api.miayouragent.com
 * Authentication: Bearer token required for all endpoints
 */

import { API_URL } from './auth.api';

// ============================================================================
// TypeScript Interfaces - Generation DTOs
// ============================================================================

/**
 * Request DTO for generating a social media post with AI
 */
export interface GeneratePostDto {
  category?: 'before-after' | 'promotional-offer' | 'tips' | 'client-review' | 'seasonal' | 'product-showcase';
  prompt: string;                 // The topic or idea for the post (max 500 chars)
  platform: 'instagram' | 'instagram-story' | 'facebook' | 'twitter';
  style?: 'professional' | 'modern' | 'elegant' | 'playful' | 'natural';
}

/**
 * Request DTO for generating a video script
 */
export interface GenerateScriptDto {
  topic: string;                  // The topic for the video script (max 500 chars)
  duration: number;               // Duration in seconds (15-180)
  format: 'reel' | 'story' | 'tiktok' | 'youtube-short';
}

/**
 * Response from generate post - returns job ID for status tracking
 */
export interface GeneratePostResponse {
  postId: string;                 // Post ID
  status: string;                 // Generation status
  message?: string;
  creditsRemaining?: number;
}

/**
 * Response from generate script - returns job ID for status tracking
 */
export interface GenerateScriptResponse {
  scriptId: string;               // Script ID
  status: string;                 // Generation status
  message?: string;
  creditsRemaining?: number;
}

/**
 * Generic response type for backwards compatibility
 */
export interface GenerateResponse {
  id: string;                     // Post/Script ID
  status: 'queued' | 'processing' | 'completed' | 'failed';
  message?: string;
}

// ============================================================================
// TypeScript Interfaces - Content Models
// ============================================================================

/**
 * Picture element for post editing (text or SVG overlay)
 */
export interface PictureElement {
  type: 'text' | 'svg';
  // For text elements
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
  // For SVG elements
  shape?: string;
  size?: number;
  // Common properties
  position: {
    x: number;
    y: number;
  };
  rotation?: number;
}

/**
 * Editing data for post (filters, crop, rotate)
 */
export interface EditingData {
  filter?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotation?: number;
}

/**
 * Complete post object
 */
export interface Post {
  id: string;
  user?: string;                  // User ID (from API)
  userId?: string;                // User ID (alternative field name)
  title: string;
  caption: string;
  hashtags: string[];
  platform: 'instagram' | 'instagram-story' | 'facebook' | 'twitter';
  status: 'draft' | 'final' | 'ready' | 'queued' | 'processing' | 'failed';  // API returns 'ready' for completed posts
  category?: string;
  style?: string;
  imageUrl?: string;              // AI-generated or uploaded image (frontend field)
  pictureUrl?: string;            // AI-generated or uploaded image (API field)
  pictureElements?: PictureElement[];
  editingData?: EditingData;
  generationStatus?: 'queued' | 'processing' | 'completed' | 'failed';
  generationProgress?: number;    // 0-100
  creditsUsed?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  prompt?: string;                // Original prompt used for generation
  isTemplate?: boolean;
  templateId?: string | null;
  isDeleted?: boolean;
  createdAt: string;              // ISO date string
  updatedAt: string;              // ISO date string
  createdBy?: string | null;
  updatedBy?: string | null;
}

/**
 * Script scene data
 */
export interface ScriptScene {
  sequence: number;
  duration: number;               // Duration in seconds
  instruction: string;            // Camera/action instruction
  dialogue?: string;              // Optional dialogue
  visualCue?: string;             // Optional visual cue
}

/**
 * Complete script object
 */
export interface Script {
  id: string;
  userId: string;
  title: string;
  caption: string;
  hashtags: string[];
  format: 'reel' | 'story' | 'tiktok' | 'youtube-short';
  status: 'draft' | 'final';
  duration: number;               // Total duration in seconds
  scriptData: {
    scenes: ScriptScene[];
    totalDuration: number;
    format: string;
  };
  generationStatus: 'queued' | 'processing' | 'completed' | 'failed';
  generationProgress?: number;    // 0-100
  creditsUsed: number;
  createdAt: string;              // ISO date string
  updatedAt: string;              // ISO date string
}

// ============================================================================
// TypeScript Interfaces - Update DTOs
// ============================================================================

/**
 * Request DTO for updating a post (draft only)
 */
export interface UpdatePostDto {
  title?: string;
  caption?: string;
  hashtags?: string[];
  pictureElements?: PictureElement[];
  editingData?: EditingData;
}

/**
 * Request DTO for updating a script (draft only)
 */
export interface UpdateScriptDto {
  title?: string;
  caption?: string;
  hashtags?: string[];
  scriptData?: {
    scenes: ScriptScene[];
    totalDuration: number;
    format: string;
  };
}

// ============================================================================
// TypeScript Interfaces - List Responses
// ============================================================================

/**
 * Paginated list response for posts
 */
export interface PostListResponse {
  posts: Post[];
  total: number;                  // Total count
  limit: number;                  // Items per page
  offset: number;                 // Current offset
  hasMore: boolean;               // Whether more pages exist
}

/**
 * Paginated list response for scripts
 */
export interface ScriptListResponse {
  scripts: Script[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// TypeScript Interfaces - Templates
// ============================================================================

/**
 * Post template object
 * Note: The API returns Post objects with isTemplate=true as templates
 * So this interface extends from Post with template-specific fields
 */
export interface PostTemplate {
  id: string;
  // API returns 'title' instead of 'name'
  title?: string;
  name?: string;
  // API returns 'caption' instead of 'description'
  caption?: string;
  description?: string;
  platform: 'instagram' | 'instagram-story' | 'facebook' | 'twitter';
  style?: 'professional' | 'modern' | 'elegant' | 'playful' | 'natural';
  category?: string;
  // API returns 'pictureUrl' instead of 'previewImageUrl'
  pictureUrl?: string;
  previewImageUrl?: string;
  pictureElements?: PictureElement[];
  editingData?: EditingData;
  templateData?: {
    pictureElements: PictureElement[];
    editingData?: EditingData;
  };
  isPublic?: boolean;
  isTemplate?: boolean;
  hashtags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  prompt?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  isDeleted?: boolean;
  user?: string | null;
  templateId?: string | null;
}

/**
 * Script template object
 */
export interface ScriptTemplate {
  id: string;
  name: string;
  description: string;
  format: 'reel' | 'story' | 'tiktok' | 'youtube-short';
  duration: number;
  templateData: {
    scenes: ScriptScene[];
    totalDuration: number;
    format: string;
  };
  isPublic: boolean;
  createdAt: string;
}

/**
 * Template list responses
 */
export interface PostTemplateListResponse {
  templates: PostTemplate[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ScriptTemplateListResponse {
  templates: ScriptTemplate[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// ============================================================================
// TypeScript Interfaces - SVG Shapes
// ============================================================================

/**
 * SVG shape object for post editing
 */
export interface SVGShape {
  id: string;
  name: string;
  category: string;
  svg: string;                    // SVG XML string from API
}

/**
 * SVG shapes response
 */
export interface ShapesResponse {
  shapes: SVGShape[];
}

// ============================================================================
// TypeScript Interfaces - Status Responses
// ============================================================================

/**
 * Generation status response
 */
export interface GenerationStatus {
  id: string;
  status: 'queued' | 'processing' | 'generating' | 'ready' | 'completed' | 'failed';  // Added 'generating' and 'ready' for backend compatibility
  progress?: number;              // 0-100
  message?: string;
  error?: string;                 // Error message if failed
  result?: Post | Script;         // Complete object if completed
}

// ============================================================================
// AI Studio API Class
// ============================================================================

class AIStudioAPI {
  /**
   * Get authorization header with Bearer token
   * @private
   * @throws {Error} If no token found in localStorage
   */
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('mia_auth_token');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  // ==========================================================================
  // Post Generation
  // ==========================================================================

  /**
   * Generate a social media post with AI
   *
   * This endpoint queues the generation job and returns immediately.
   * Use WebSocket service or getPostStatus() to track progress.
   *
   * @param data - Post generation parameters
   * @returns Post ID and status (queued)
   * @throws {Error} If insufficient credits or API error
   *
   * @example
   * const { id } = await aiStudioAPI.generatePost({
   *   prompt: 'Modern autumn hair transformation',
   *   platform: 'instagram',
   *   style: 'professional',
   *   category: 'before-after'
   * });
   * // Use WebSocket to track progress
   */
  async generatePost(data: GeneratePostDto): Promise<GenerateResponse> {
    const response = await fetch(`${API_URL}/api/ai-studio/generate-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate post');
    }

    const apiResponse: GeneratePostResponse = await response.json();

    // Map API response to normalized format
    return {
      id: apiResponse.postId,
      status: apiResponse.status as any,
      message: apiResponse.message,
    };
  }

  /**
   * Generate a video script with AI
   *
   * This endpoint queues the generation job and returns immediately.
   * Use WebSocket service or getScriptStatus() to track progress.
   *
   * @param data - Script generation parameters
   * @returns Script ID and status (queued)
   * @throws {Error} If insufficient credits or API error
   *
   * @example
   * const { id } = await aiStudioAPI.generateScript({
   *   topic: 'Haircut transformation reveal',
   *   duration: 30,
   *   format: 'reel'
   * });
   */
  async generateScript(data: GenerateScriptDto): Promise<GenerateResponse> {
    const response = await fetch(`${API_URL}/api/ai-studio/generate-script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate script');
    }

    const apiResponse: GenerateScriptResponse = await response.json();

    // Map API response to normalized format
    return {
      id: apiResponse.scriptId,
      status: apiResponse.status as any,
      message: apiResponse.message,
    };
  }

  // ==========================================================================
  // Generation Status Tracking
  // ==========================================================================

  /**
   * Get post generation status
   *
   * @param id - Post ID
   * @returns Generation status with progress
   * @throws {Error} If API error
   *
   * @example
   * const status = await aiStudioAPI.getPostStatus(postId);
   * if (status.status === 'completed') {
   *   console.log('Post ready!', status.result);
   * }
   */
  async getPostStatus(id: string): Promise<GenerationStatus> {
    const response = await fetch(`${API_URL}/api/ai-studio/posts/${id}/status`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get post status');
    }

    return response.json();
  }

  /**
   * Get script generation status
   *
   * @param id - Script ID
   * @returns Generation status with progress
   * @throws {Error} If API error
   */
  async getScriptStatus(id: string): Promise<GenerationStatus> {
    const response = await fetch(`${API_URL}/api/ai-studio/scripts/${id}/status`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get script status');
    }

    return response.json();
  }

  // ==========================================================================
  // Posts CRUD
  // ==========================================================================

  /**
   * List user's posts with pagination and filtering
   *
   * @param status - Filter by status ('draft' or 'final')
   * @param limit - Number of posts to return (default: 20)
   * @param offset - Number of posts to skip (default: 0)
   * @returns Paginated list of posts
   * @throws {Error} If API error
   *
   * @example
   * const { posts, hasMore } = await aiStudioAPI.listPosts('draft', 20, 0);
   */
  async listPosts(
    status?: 'draft' | 'final',
    limit: number = 20,
    offset: number = 0
  ): Promise<PostListResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(
      `${API_URL}/api/ai-studio/posts?${params}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch posts');
    }

    const data = await response.json();

    // Transform API response to match our interface
    return {
      posts: data.posts,
      total: data.pagination.total,
      limit: data.pagination.limit,
      offset: data.pagination.offset,
      hasMore: (data.pagination.offset + data.pagination.limit) < data.pagination.total,
    };
  }

  /**
   * Get a specific post by ID
   *
   * @param id - Post ID
   * @returns Complete post object
   * @throws {Error} If post not found or API error
   */
  async getPost(id: string): Promise<Post> {
    const response = await fetch(`${API_URL}/api/ai-studio/posts/${id}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch post');
    }

    const data = await response.json();
    // API returns { post: Post } instead of Post directly
    return data.post || data;
  }

  /**
   * Update a post (draft only)
   *
   * @param id - Post ID
   * @param data - Fields to update
   * @returns Updated post object
   * @throws {Error} If post is final or API error
   *
   * @example
   * const updated = await aiStudioAPI.updatePost(postId, {
   *   title: 'New Title',
   *   hashtags: ['#new', '#updated']
   * });
   */
  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    const response = await fetch(`${API_URL}/api/ai-studio/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update post');
    }

    return response.json();
  }

  /**
   * Delete a post (soft delete)
   *
   * @param id - Post ID
   * @returns Success message
   * @throws {Error} If API error
   */
  async deletePost(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/api/ai-studio/posts/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete post');
    }

    return response.json();
  }

  // ==========================================================================
  // Scripts CRUD
  // ==========================================================================

  /**
   * List user's scripts with pagination and filtering
   *
   * @param status - Filter by status ('draft' or 'final')
   * @param limit - Number of scripts to return (default: 20)
   * @param offset - Number of scripts to skip (default: 0)
   * @returns Paginated list of scripts
   * @throws {Error} If API error
   */
  async listScripts(
    status?: 'draft' | 'final',
    limit: number = 20,
    offset: number = 0
  ): Promise<ScriptListResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(
      `${API_URL}/api/ai-studio/scripts?${params}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch scripts');
    }

    const data = await response.json();

    // Transform API response to match our interface
    return {
      scripts: data.scripts,
      total: data.pagination.total,
      limit: data.pagination.limit,
      offset: data.pagination.offset,
      hasMore: (data.pagination.offset + data.pagination.limit) < data.pagination.total,
    };
  }

  /**
   * Get a specific script by ID
   *
   * @param id - Script ID
   * @returns Complete script object
   * @throws {Error} If script not found or API error
   */
  async getScript(id: string): Promise<Script> {
    const response = await fetch(`${API_URL}/api/ai-studio/scripts/${id}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch script');
    }

    return response.json();
  }

  /**
   * Update a script (draft only)
   *
   * @param id - Script ID
   * @param data - Fields to update
   * @returns Updated script object
   * @throws {Error} If script is final or API error
   */
  async updateScript(id: string, data: UpdateScriptDto): Promise<Script> {
    const response = await fetch(`${API_URL}/api/ai-studio/scripts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update script');
    }

    return response.json();
  }

  /**
   * Delete a script (soft delete)
   *
   * @param id - Script ID
   * @returns Success message
   * @throws {Error} If API error
   */
  async deleteScript(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/api/ai-studio/scripts/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete script');
    }

    return response.json();
  }

  // ==========================================================================
  // Templates
  // ==========================================================================

  /**
   * List post templates with filtering
   *
   * @param platform - Filter by platform
   * @param style - Filter by style
   * @param limit - Number of templates to return (default: 20)
   * @param offset - Number of templates to skip (default: 0)
   * @returns Paginated list of post templates
   * @throws {Error} If API error
   */
  async listPostTemplates(
    platform?: string,
    style?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PostTemplateListResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (platform) params.append('platform', platform);
    if (style) params.append('style', style);

    const response = await fetch(
      `${API_URL}/api/ai-studio/templates/posts?${params}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch post templates');
    }

    const data = await response.json();

    // Transform API response to match our interface
    return {
      templates: data.templates,
      total: data.pagination.total,
      limit: data.pagination.limit,
      offset: data.pagination.offset,
      hasMore: (data.pagination.offset + data.pagination.limit) < data.pagination.total,
    };
  }

  /**
   * Get a specific post template by ID
   *
   * @param id - Template ID
   * @returns Post template object
   * @throws {Error} If template not found or API error
   */
  async getPostTemplate(id: string): Promise<PostTemplate> {
    const response = await fetch(`${API_URL}/api/ai-studio/templates/posts/${id}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch post template');
    }

    return response.json();
  }

  /**
   * Customize a post template (creates a user draft copy)
   *
   * @param templateId - Template ID
   * @returns New post draft created from template
   * @throws {Error} If template not found or API error
   */
  async customizePostTemplate(templateId: string): Promise<Post> {
    const response = await fetch(
      `${API_URL}/api/ai-studio/templates/posts/${templateId}/customize`,
      {
        method: 'POST',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to customize template');
    }

    const data = await response.json();

    // API returns { message, post } - extract the post object
    if (data.post) {
      return data.post;
    }

    // Fallback: if response is already a post object (for backwards compatibility)
    return data;
  }

  /**
   * List script templates with filtering
   *
   * @param status - Filter by status
   * @param limit - Number of templates to return (default: 20)
   * @param offset - Number of templates to skip (default: 0)
   * @returns Paginated list of script templates
   * @throws {Error} If API error
   */
  async listScriptTemplates(
    status?: 'draft' | 'final',
    limit: number = 20,
    offset: number = 0
  ): Promise<ScriptTemplateListResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) params.append('status', status);

    const response = await fetch(
      `${API_URL}/api/ai-studio/templates/scripts?${params}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch script templates');
    }

    const data = await response.json();

    // Transform API response to match our interface
    return {
      templates: data.templates,
      total: data.pagination.total,
      limit: data.pagination.limit,
      offset: data.pagination.offset,
      hasMore: (data.pagination.offset + data.pagination.limit) < data.pagination.total,
    };
  }

  /**
   * Get a specific script template by ID
   *
   * @param id - Template ID
   * @returns Script template object
   * @throws {Error} If template not found or API error
   */
  async getScriptTemplate(id: string): Promise<ScriptTemplate> {
    const response = await fetch(`${API_URL}/api/ai-studio/templates/scripts/${id}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch script template');
    }

    return response.json();
  }

  /**
   * Customize a script template (creates a user draft copy)
   *
   * @param templateId - Template ID
   * @returns New script draft created from template
   * @throws {Error} If template not found or API error
   */
  async customizeScriptTemplate(templateId: string): Promise<Script> {
    const response = await fetch(
      `${API_URL}/api/ai-studio/templates/scripts/${templateId}/customize`,
      {
        method: 'POST',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to customize template');
    }

    return response.json();
  }

  // ==========================================================================
  // SVG Shapes
  // ==========================================================================

  /**
   * Get available SVG shapes for post editing
   *
   * @returns List of SVG shapes
   * @throws {Error} If API error
   *
   * @example
   * const { shapes } = await aiStudioAPI.getShapes();
   * // Use shapes in post editor
   */
  async getShapes(): Promise<ShapesResponse> {
    const response = await fetch(`${API_URL}/api/ai-studio/shapes`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch shapes');
    }

    return response.json();
  }

  // ==========================================================================
  // Flatten Post
  // ==========================================================================

  /**
   * Flatten a post - merges picture elements (text overlays) into the image
   * and uploads the final image to B2 storage
   *
   * @param id - Post ID
   * @param format - Image format (e.g., 'jpeg', 'png', 'webp')
   * @param quality - Image quality (0-100, typically 80-95 for good quality)
   * @returns Flattened image response with URL and metadata
   * @throws {Error} If API error
   *
   * @example
   * const result = await aiStudioAPI.flattenPost(postId, 'jpeg', 90);
   * // result.flattenedUrl contains the B2 URL of the flattened image
   */
  async flattenPost(
    id: string,
    format: string = 'jpeg',
    quality: number = 90
  ): Promise<{
    postId: string;
    flattenedUrl: string;
    mimeType: string;
    width: number;
    height: number;
    size: number;
  }> {
    const params = new URLSearchParams({
      format: format,
      quality: quality.toString(),
    });

    const response = await fetch(
      `${API_URL}/api/ai-studio/posts/${id}/flatten?${params}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to flatten post');
    }

    return response.json();
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

/**
 * Singleton instance of AIStudioAPI
 * Import and use this throughout your application
 *
 * @example
 * import { aiStudioAPI } from '@/services/ai-studio.api';
 *
 * // Generate a post
 * const { id } = await aiStudioAPI.generatePost({
 *   prompt: 'Summer hair trends',
 *   platform: 'instagram',
 *   style: 'modern'
 * });
 *
 * // Track progress via WebSocket or polling
 * const status = await aiStudioAPI.getPostStatus(id);
 */
export const aiStudioAPI = new AIStudioAPI();
