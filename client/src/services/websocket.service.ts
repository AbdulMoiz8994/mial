/**
 * Socket.IO Service
 *
 * Provides real-time updates for AI content generation (posts and scripts).
 * Handles connection management, reconnection logic, and event subscriptions.
 *
 * Socket.IO URL: https://api.miayouragent.com/ai-studio
 * Authentication: JWT token sent in query parameter
 *
 * Events:
 * - generation:progress - Progress updates (0-100%)
 * - generation:completed - Generation finished successfully
 * - generation:failed - Generation failed with error
 */

import { io, Socket } from 'socket.io-client';

// ============================================================================
// WebSocket Event Types
// ============================================================================

/**
 * Progress event payload
 */
export interface ProgressEvent {
  id: string;                     // Post/Script ID
  type: 'post' | 'script';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;               // 0-100
  message?: string;               // Status message (e.g., "Generating image...")
}

/**
 * Completed event payload
 */
export interface CompletedEvent {
  id: string;
  type: 'post' | 'script';
  status: 'completed';
  result: any;                    // Complete Post or Script object
}

/**
 * Failed event payload
 */
export interface FailedEvent {
  id: string;
  type: 'post' | 'script';
  status: 'failed';
  error: string;                  // Error message
}

/**
 * WebSocket event types
 */
export type WebSocketEvent = ProgressEvent | CompletedEvent | FailedEvent;

/**
 * Event listener callback type
 */
export type EventListener = (event: WebSocketEvent) => void;

// ============================================================================
// Socket.IO Service Class
// ============================================================================

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, EventListener[]> = new Map();
  private isIntentionallyClosed: boolean = false;

  /**
   * Connect to Socket.IO server
   *
   * @example
   * webSocketService.connect();
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      const token = localStorage.getItem('mia_auth_token');

      // Connect to Socket.IO server
      this.socket = io('https://api.miayouragent.com/ai-studio', {
        auth: {
          token: token,
        },
        query: {
          token: token,
        },
        transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        reconnectionDelayMax: 9000,
        timeout: 20000,
      });

      // Setup event handlers
      this.socket.on('connect', this.handleConnect.bind(this));
      this.socket.on('disconnect', this.handleDisconnect.bind(this));
      this.socket.on('connect_error', this.handleError.bind(this));

      // Listen for generation events
      this.socket.on('generation:progress', this.handleProgress.bind(this));
      this.socket.on('generation:completed', this.handleCompleted.bind(this));
      this.socket.on('generation:failed', this.handleFailed.bind(this));
    } catch (error) {
      console.error('[Socket.IO] Connection error:', error);
    }
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    this.isIntentionallyClosed = true;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Handle connection
   */
  private handleConnect(): void {
    // Connection successful
  }

  /**
   * Handle disconnect
   */
  private handleDisconnect(reason: string): void {
    if (reason === 'io server disconnect') {
      // Server disconnected us, need to reconnect manually
      if (!this.isIntentionallyClosed) {
        this.socket?.connect();
      }
    }
  }

  /**
   * Handle connection error
   */
  private handleError(error: Error): void {
    console.error('[Socket.IO] Connection error:', error.message);
  }

  /**
   * Handle progress event
   */
  private handleProgress(payload: ProgressEvent): void {
    this.emit('progress', payload);
  }

  /**
   * Handle completed event
   */
  private handleCompleted(payload: CompletedEvent): void {
    this.emit('completed', payload);
  }

  /**
   * Handle failed event
   */
  private handleFailed(payload: FailedEvent): void {
    this.emit('failed', payload);
  }

  /**
   * Subscribe to specific job ID
   *
   * Tell the server to send updates for this specific post/script generation
   *
   * @param id - Post or Script ID
   * @param type - Content type ('post' or 'script')
   *
   * @example
   * webSocketService.subscribe(postId, 'post');
   */
  subscribe(id: string, type: 'post' | 'script'): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('subscribe', {
      id,
      contentType: type,
    });
  }

  /**
   * Unsubscribe from specific job ID
   *
   * @param id - Post or Script ID
   * @param type - Content type ('post' or 'script')
   */
  unsubscribe(id: string, type: 'post' | 'script'): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('unsubscribe', {
      id,
      contentType: type,
    });
  }

  /**
   * Add event listener
   *
   * @param event - Event type ('progress', 'completed', 'failed', 'all')
   * @param listener - Callback function
   *
   * @example
   * webSocketService.on('progress', (event) => {
   *   console.log(`Progress: ${event.progress}%`);
   * });
   *
   * webSocketService.on('completed', (event) => {
   *   console.log('Generation completed!', event.result);
   * });
   */
  on(event: 'progress' | 'completed' | 'failed' | 'all', listener: EventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  /**
   * Remove event listener
   *
   * @param event - Event type
   * @param listener - Callback function to remove
   */
  off(event: 'progress' | 'completed' | 'failed' | 'all', listener: EventListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: 'progress' | 'completed' | 'failed', payload: WebSocketEvent): void {
    // Emit to specific event listeners
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(payload));
    }

    // Emit to 'all' listeners
    const allListeners = this.listeners.get('all');
    if (allListeners) {
      allListeners.forEach((listener) => listener(payload));
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get connection state
   */
  getState(): 'connecting' | 'open' | 'closed' {
    if (!this.socket) return 'closed';
    if (this.socket.connected) return 'open';
    return 'connecting';
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

/**
 * Singleton instance of WebSocketService
 * Import and use this throughout your application
 *
 * @example
 * import { webSocketService } from '@/services/websocket.service';
 *
 * // Connect to Socket.IO
 * webSocketService.connect();
 *
 * // Generate post
 * const { id } = await aiStudioAPI.generatePost({...});
 *
 * // Subscribe to updates
 * webSocketService.subscribe(id, 'post');
 *
 * // Listen for progress
 * webSocketService.on('progress', (event) => {
 *   if (event.id === id) {
 *     console.log(`Progress: ${event.progress}%`);
 *     setProgress(event.progress);
 *   }
 * });
 *
 * // Listen for completion
 * webSocketService.on('completed', (event) => {
 *   if (event.id === id) {
 *     console.log('Done!', event.result);
 *     setPost(event.result);
 *   }
 * });
 *
 * // Disconnect when done
 * webSocketService.unsubscribe(id, 'post');
 * webSocketService.disconnect();
 */
export const webSocketService = new WebSocketService();

// ============================================================================
// React Hook for Socket.IO (Optional)
// ============================================================================

// Import React for the hook
import React from 'react';

/**
 * React hook for Socket.IO connection management
 *
 * Automatically connects on mount and disconnects on unmount
 *
 * @example
 * function MyComponent() {
 *   const { isConnected, subscribe, unsubscribe } = useWebSocket();
 *
 *   useEffect(() => {
 *     if (isConnected && postId) {
 *       subscribe(postId, 'post');
 *       return () => unsubscribe(postId, 'post');
 *     }
 *   }, [isConnected, postId]);
 *
 *   return <div>Connected: {isConnected ? 'Yes' : 'No'}</div>;
 * }
 */
export function useWebSocket() {
  const [isConnected, setIsConnected] = React.useState(webSocketService.isConnected());

  React.useEffect(() => {
    // Connect on mount
    webSocketService.connect();

    // Update connection status
    const checkConnection = setInterval(() => {
      setIsConnected(webSocketService.isConnected());
    }, 1000);

    // Disconnect on unmount
    return () => {
      clearInterval(checkConnection);
      webSocketService.disconnect();
    };
  }, []);

  return {
    isConnected,
    state: webSocketService.getState(),
    subscribe: webSocketService.subscribe.bind(webSocketService),
    unsubscribe: webSocketService.unsubscribe.bind(webSocketService),
    on: webSocketService.on.bind(webSocketService),
    off: webSocketService.off.bind(webSocketService),
  };
}
