/**
 * Subscriptions API Service
 *
 * Handles all subscription and credit management operations including:
 * - Stripe checkout session creation
 * - Subscription retrieval and management
 * - Credit balance and transaction history
 * - Subscription cancellation and reactivation
 *
 * Base URL: https://api.miayouragent.com
 * Authentication: Bearer token required for all endpoints
 */

import { API_URL } from './auth.api';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Request DTO for creating a Stripe checkout session
 */
export interface CreateCheckoutDto {
  plan: 'starter' | 'professional' | 'agency';  // Subscription plan
  successUrl: string;             // Redirect URL after successful payment
  cancelUrl: string;              // Redirect URL if user cancels
}

/**
 * Response from createCheckout - contains Stripe session info
 */
export interface CheckoutSessionResponse {
  checkoutUrl: string;            // Stripe checkout URL to redirect to
  sessionId: string;              // Stripe checkout session ID
}

/**
 * API response structure for subscription/current
 */
export interface SubscriptionApiResponse {
  subscription: {
    id: string;
    plan: string;                 // "starter", "professional", or "agency"
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodStart: string;   // ISO date string
    currentPeriodEnd: string;     // ISO date string
    cancelAtPeriodEnd: boolean;
    canceledAt: string | null;    // ISO date string (if canceled)
  };
  credits: {
    totalCredits: number;
    usedCredits: number;
    remainingCredits: number;
    breakdown: {
      aiIdeas: { total: number; used: number; remaining: number };
      captions: { total: number; used: number; remaining: number };
      graphics: { total: number; used: number; remaining: number };
      scripts: { total: number; used: number; remaining: number };
    };
    lastResetAt: string;
    nextResetAt: string;
  };
}

/**
 * Normalized subscription object for use in the app
 */
export interface Subscription {
  id: string;
  planName: string;               // "Starter", "Professional", or "Agency"
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billingPeriod: 'monthly' | 'yearly';
  currentPeriodStart: string;     // ISO date string
  currentPeriodEnd: string;       // ISO date string
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;            // ISO date string (if canceled)
  nextResetAt?: string;           // Next billing/credit reset date
  credits: {
    balance: number;              // Current available credits
    used: number;                 // Total credits used
    total: number;                // Total credits allocated
  };
}

/**
 * Credit balance response
 */
export interface CreditBalance {
  balance: number;
  used: number;
  total: number;
  subscriptionId: string;
}

/**
 * Single credit transaction record
 */
export interface CreditTransaction {
  id: string;
  userId: string;
  subscriptionId: string;
  type: 'earned' | 'spent' | 'refunded';
  amount: number;                 // Positive for earned, negative for spent
  balance: number;                // Balance after transaction
  description: string;            // Human-readable description
  relatedEntity: 'subscription' | 'post' | 'script' | 'other';
  relatedEntityId?: string;       // ID of related post/script if applicable
  createdAt: string;              // ISO date string
}

/**
 * Transaction history response with pagination
 */
export interface TransactionHistoryResponse {
  transactions: CreditTransaction[];
  total: number;                  // Total count of all transactions
  limit: number;                  // Items per page
  offset: number;                 // Current offset
  hasMore: boolean;               // Whether more pages exist
}

/**
 * Request DTO for canceling subscription
 */
export interface CancelSubscriptionDto {
  reason?: string;                // Optional cancellation reason
  feedback?: string;              // Optional user feedback
}

/**
 * Customer portal URL response
 */
export interface CustomerPortalResponse {
  portalUrl: string;              // Stripe customer portal URL
}

// ============================================================================
// Subscriptions API Class
// ============================================================================

class SubscriptionsAPI {
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

  /**
   * Create Stripe checkout session for subscription purchase
   *
   * @param data - Checkout configuration (plan, billing period, URLs)
   * @returns Stripe checkout URL and session ID
   * @throws {Error} If user already has active subscription or API error
   *
   * @example
   * const { url } = await subscriptionsAPI.createCheckout({
   *   planId: 'pro',
   *   billingPeriod: 'monthly',
   *   successUrl: 'https://app.com/success',
   *   cancelUrl: 'https://app.com/pricing'
   * });
   * window.location.href = url; // Redirect to Stripe
   */
  async createCheckout(data: CreateCheckoutDto): Promise<CheckoutSessionResponse> {
    const response = await fetch(`${API_URL}/api/subscriptions/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  }

  /**
   * Get current user's subscription with credit information
   *
   * @returns Complete subscription object with credits, or null if no subscription
   * @throws {Error} If API error occurs
   *
   * @example
   * const subscription = await subscriptionsAPI.getCurrentSubscription();
   * if (subscription) {
   *   console.log(`Plan: ${subscription.planName}`);
   *   console.log(`Credits: ${subscription.credits.balance}`);
   * }
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    const response = await fetch(`${API_URL}/api/subscriptions/current`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    // 404 means user has no subscription yet
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subscription');
    }

    const data: SubscriptionApiResponse = await response.json();

    // Transform API response to normalized Subscription object
    const planNameMap: Record<string, string> = {
      'starter': 'Starter',
      'professional': 'Professional',
      'agency': 'Agency'
    };

    return {
      id: data.subscription.id,
      planName: planNameMap[data.subscription.plan] || data.subscription.plan,
      status: data.subscription.status,
      billingPeriod: 'monthly', // Default, can be updated if API provides this
      currentPeriodStart: data.subscription.currentPeriodStart,
      currentPeriodEnd: data.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd,
      canceledAt: data.subscription.canceledAt || undefined,
      nextResetAt: data.credits.nextResetAt,
      credits: {
        balance: data.credits.remainingCredits,
        used: data.credits.usedCredits,
        total: data.credits.totalCredits,
      },
    };
  }

  /**
   * Get current credit balance only (lighter than full subscription)
   *
   * @returns Credit balance information
   * @throws {Error} If no subscription or API error
   *
   * @example
   * const { balance } = await subscriptionsAPI.getCreditBalance();
   * console.log(`You have ${balance} credits`);
   */
  async getCreditBalance(): Promise<CreditBalance> {
    const response = await fetch(`${API_URL}/api/subscriptions/credits/balance`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch credit balance');
    }

    return response.json();
  }

  /**
   * Get credit transaction history with pagination
   *
   * @param limit - Number of transactions to return (default: 50)
   * @param offset - Number of transactions to skip (default: 0)
   * @returns Transaction history with pagination info
   * @throws {Error} If API error occurs
   *
   * @example
   * // Get first 20 transactions
   * const { transactions, hasMore } = await subscriptionsAPI.getTransactionHistory(20, 0);
   *
   * // Get next 20 transactions
   * if (hasMore) {
   *   const more = await subscriptionsAPI.getTransactionHistory(20, 20);
   * }
   */
  async getTransactionHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<TransactionHistoryResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(
      `${API_URL}/api/subscriptions/credits/transactions?${params}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch transaction history');
    }

    const data = await response.json();

    // Check if API returns nested pagination structure
    if (data.pagination) {
      // Transform API response to match our interface
      return {
        transactions: data.transactions,
        total: data.pagination.total,
        limit: data.pagination.limit,
        offset: data.pagination.offset,
        hasMore: (data.pagination.offset + data.pagination.limit) < data.pagination.total,
      };
    }

    // If API already returns flat structure, return as-is
    return data;
  }

  /**
   * Cancel active subscription
   *
   * Note: Subscription remains active until end of billing period
   * User retains access to features until period ends
   *
   * @param reason - Optional cancellation reason
   * @param feedback - Optional user feedback
   * @returns Updated subscription object
   * @throws {Error} If no active subscription or API error
   *
   * @example
   * await subscriptionsAPI.cancelSubscription('Too expensive');
   * // Subscription will remain active until period end
   */
  async cancelSubscription(
    reason?: string,
    feedback?: string
  ): Promise<Subscription> {
    const data: CancelSubscriptionDto = {};
    if (reason) data.reason = reason;
    if (feedback) data.feedback = feedback;

    const response = await fetch(`${API_URL}/api/subscriptions/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    // Cancel API returns partial data, fetch full subscription
    const fullSubscription = await this.getCurrentSubscription();
    if (!fullSubscription) {
      throw new Error('Failed to fetch updated subscription');
    }
    return fullSubscription;
  }

  /**
   * Reactivate a canceled subscription
   *
   * Only works if subscription hasn't expired yet
   * (i.e., still within current billing period)
   *
   * @returns Updated subscription object
   * @throws {Error} If no canceled subscription or API error
   *
   * @example
   * const subscription = await subscriptionsAPI.reactivateSubscription();
   * console.log(`Reactivated: ${subscription.planName}`);
   */
  async reactivateSubscription(): Promise<Subscription> {
    const response = await fetch(`${API_URL}/api/subscriptions/reactivate`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reactivate subscription');
    }

    // Reactivate API returns partial data, fetch full subscription
    const fullSubscription = await this.getCurrentSubscription();
    if (!fullSubscription) {
      throw new Error('Failed to fetch updated subscription');
    }
    return fullSubscription;
  }

  /**
   * Get Stripe Customer Portal URL
   *
   * Customer portal allows users to:
   * - Update payment method
   * - View invoices
   * - Update billing information
   * - Cancel subscription (alternative to API cancel)
   *
   * @param returnUrl - URL to return to after leaving portal (default: current page)
   * @returns Portal URL to redirect user to
   * @throws {Error} If no subscription or API error
   *
   * @example
   * const { url } = await subscriptionsAPI.getCustomerPortalUrl(
   *   'https://app.com/billing'
   * );
   * window.location.href = url; // Redirect to Stripe portal
   */
  async getCustomerPortalUrl(returnUrl?: string): Promise<CustomerPortalResponse> {
    const params = new URLSearchParams();
    if (returnUrl) {
      params.append('returnUrl', returnUrl);
    }

    const url = `${API_URL}/api/subscriptions/portal${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get customer portal URL');
    }

    return response.json();
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

/**
 * Singleton instance of SubscriptionsAPI
 * Import and use this throughout your application
 *
 * @example
 * import { subscriptionsAPI } from '@/services/subscriptions.api';
 *
 * const subscription = await subscriptionsAPI.getCurrentSubscription();
 */
export const subscriptionsAPI = new SubscriptionsAPI();
