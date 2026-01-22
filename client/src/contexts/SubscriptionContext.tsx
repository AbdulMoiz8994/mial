/**
 * Subscription Context
 *
 * Provides global state management for:
 * - Current subscription data
 * - Credit balance
 * - Subscription operations (checkout, cancel, reactivate)
 *
 * Usage:
 * import { useSubscription } from '@/contexts/SubscriptionContext';
 *
 * const { subscription, creditBalance, createCheckout } = useSubscription();
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  subscriptionsAPI,
  Subscription,
  CreateCheckoutDto,
  CreditTransaction,
  TransactionHistoryResponse,
} from '@/services/subscriptions.api';

// ============================================================================
// Context Type Definition
// ============================================================================

interface SubscriptionContextType {
  // State
  subscription: Subscription | null;
  creditBalance: number;
  isLoading: boolean;
  error: string | null;

  // Methods
  refreshSubscription: () => Promise<void>;
  createCheckout: (planId: string, billingPeriod: 'monthly' | 'yearly') => Promise<string>;
  cancelSubscription: (reason?: string, feedback?: string) => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  getTransactionHistory: (limit?: number, offset?: number) => Promise<TransactionHistoryResponse>;
  getCustomerPortalUrl: (returnUrl?: string) => Promise<string>;
}

// ============================================================================
// Context Creation
// ============================================================================

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load subscription data from API
   */
  const refreshSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const sub = await subscriptionsAPI.getCurrentSubscription();
      setSubscription(sub);

      if (sub) {
        setCreditBalance(sub.credits.balance);
      } else {
        setCreditBalance(0);
      }
    } catch (err: any) {
      console.error('Failed to load subscription:', err);
      setError(err.message || 'Failed to load subscription');
      setSubscription(null);
      setCreditBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create Stripe checkout session and return checkout URL
   */
  const createCheckout = async (
    planId: string,
    billingPeriod: 'monthly' | 'yearly'
  ): Promise<string> => {
    try {
      // Map UI plan names to API plan names
      const planMap: Record<string, 'starter' | 'professional' | 'agency'> = {
        'basic': 'starter',
        'pro': 'professional'
      };

      const checkoutData: CreateCheckoutDto = {
        plan: planMap[planId] || 'professional',
        successUrl: `${window.location.origin}/home?payment=success`,
        cancelUrl: `${window.location.origin}/pricing`,
      };

      const { checkoutUrl } = await subscriptionsAPI.createCheckout(checkoutData);
      return checkoutUrl;
    } catch (err: any) {
      console.error('Failed to create checkout:', err);
      throw err;
    }
  };

  /**
   * Cancel current subscription
   */
  const cancelSubscription = async (reason?: string, feedback?: string): Promise<void> => {
    try {
      const updated = await subscriptionsAPI.cancelSubscription(reason, feedback);
      setSubscription(updated);
    } catch (err: any) {
      console.error('Failed to cancel subscription:', err);
      throw err;
    }
  };

  /**
   * Reactivate canceled subscription
   */
  const reactivateSubscription = async (): Promise<void> => {
    try {
      const updated = await subscriptionsAPI.reactivateSubscription();
      setSubscription(updated);
    } catch (err: any) {
      console.error('Failed to reactivate subscription:', err);
      throw err;
    }
  };

  /**
   * Get transaction history
   */
  const getTransactionHistory = async (
    limit: number = 50,
    offset: number = 0
  ): Promise<TransactionHistoryResponse> => {
    try {
      return await subscriptionsAPI.getTransactionHistory(limit, offset);
    } catch (err: any) {
      console.error('Failed to get transaction history:', err);
      throw err;
    }
  };

  /**
   * Get Stripe customer portal URL
   */
  const getCustomerPortalUrl = async (returnUrl?: string): Promise<string> => {
    try {
      const response = await subscriptionsAPI.getCustomerPortalUrl(returnUrl);

      if (!response || !response.portalUrl) {
        throw new Error('Invalid response from customer portal API');
      }

      return response.portalUrl;
    } catch (err: any) {
      console.error('Failed to get portal URL:', err);
      throw err;
    }
  };

  /**
   * Load subscription on mount
   */
  useEffect(() => {
    // Only load if user is authenticated
    const token = localStorage.getItem('mia_auth_token');
    if (token) {
      refreshSubscription();
    } else {
      setIsLoading(false);
    }
  }, []);

  /**
   * Listen for login events to refresh subscription data
   */
  useEffect(() => {
    const handleLoginSuccess = () => {
      refreshSubscription();
    };

    // Listen for custom login event
    window.addEventListener('user-logged-in', handleLoginSuccess);

    return () => {
      window.removeEventListener('user-logged-in', handleLoginSuccess);
    };
  }, []);

  // ============================================================================
  // Provider Value
  // ============================================================================

  const value: SubscriptionContextType = {
    subscription,
    creditBalance,
    isLoading,
    error,
    refreshSubscription,
    createCheckout,
    cancelSubscription,
    reactivateSubscription,
    getTransactionHistory,
    getCustomerPortalUrl,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access subscription context
 *
 * @throws {Error} If used outside SubscriptionProvider
 *
 * @example
 * const { subscription, creditBalance, createCheckout } = useSubscription();
 *
 * if (subscription) {
 *   console.log(`Plan: ${subscription.planName}`);
 *   console.log(`Credits: ${creditBalance}`);
 * }
 */
export function useSubscription() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  return context;
}
