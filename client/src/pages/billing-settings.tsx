/**
 * Billing Settings Page - INTEGRATED VERSION
 *
 * This is the complete integrated version with subscription API.
 * Replace the existing billing-settings.tsx with this file.
 */

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, CreditCard, Zap, Loader2, Download, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { CreditTransaction } from "@/services/subscriptions.api";

export default function BillingSettings() {
  const [, setLocation] = useLocation();
  const {
    subscription,
    creditBalance,
    isLoading: subLoading,
    cancelSubscription,
    reactivateSubscription,
    getTransactionHistory,
    getCustomerPortalUrl
  } = useSubscription();
  const { toast } = useToast();

  const [isCanceling, setIsCanceling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const LIMIT = 10;

  // Load initial transaction history
  useEffect(() => {
    if (subscription) {
      loadTransactions(true);
    }
  }, [subscription]);

  const loadTransactions = async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;

      if (reset) {
        setLoadingTransactions(true);
        setTransactions([]);
        setOffset(0);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const history = await getTransactionHistory(LIMIT, currentOffset);

      if (reset) {
        setTransactions(history.transactions);
      } else {
        setTransactions(prev => [...prev, ...history.transactions]);
      }

      setHasMore(history.hasMore);
      setOffset(currentOffset + LIMIT);
    } catch (error: any) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoadingTransactions(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadTransactions(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      await cancelSubscription(cancelReason);
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will remain active until the end of your billing period.",
      });
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription.",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsReactivating(true);
    try {
      await reactivateSubscription();
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription has been reactivated successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Reactivation Failed",
        description: error.message || "Failed to reactivate subscription.",
      });
    } finally {
      setIsReactivating(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoadingPortal(true);
    try {
      const portalUrl = await getCustomerPortalUrl(window.location.href);

      if (!portalUrl || portalUrl === 'undefined') {
        throw new Error('Invalid portal URL received from server');
      }

      window.location.href = portalUrl;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Open Portal",
        description: error.message || "Could not open billing portal.",
      });
      setIsLoadingPortal(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Loading state
  if (subLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  // No subscription state
  if (!subscription) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Active Subscription
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have an active subscription yet. Subscribe to unlock all features!
            </p>
            <button
              onClick={() => setLocation("/pricing")}
              className="px-6 py-2 bg-[#CEA54F] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View Plans
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Single Card containing all content */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #DDDDDD",
          }}
        >
          {/* Back Button + Header */}
          <div
            className="mb-5 pb-5"
            style={{ borderBottom: "1px solid #E5E7EB" }}
          >
            <button
              onClick={() => setLocation("/settings")}
              className="flex items-center gap-2 mb-4 transition-colors hover:opacity-70"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ChevronLeft size={20} color="#6B7280" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6B7280",
                }}
              >
                Back to Settings
              </span>
            </button>

            <div>
              <h1
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "4px",
                }}
              >
                Billing & Subscription
              </h1>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#6B7280",
                }}
              >
                Manage your plan and payment information
              </p>
            </div>
          </div>

          {/* Billing & Subscription Section */}
          <div
            className="rounded-xl p-4 md:p-5"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <h3
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#202020",
                marginBottom: "4px",
              }}
            >
              Current Plan
            </h3>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "#6B7280",
                marginBottom: "16px",
              }}
              className="md:mb-5"
            >
              Manage your plan and payment information
            </p>

            {/* Content */}
            <div className="space-y-3">
              {/* Plan Card */}
              <div
                className="rounded-xl px-4 py-3 md:px-5 md:py-4"
                style={{
                  backgroundColor: subscription.cancelAtPeriodEnd ? "#FEF3C7" : "#F2F2F2",
                  border: subscription.cancelAtPeriodEnd ? "1px solid #FCD34D" : "1px solid #DADADA",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={16} fill="#CEA64F" color="#CEA64F" />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#CEA64F",
                      }}
                    >
                      {subscription.planName} Plan
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: subscription.cancelAtPeriodEnd ? "#B45309" : "#6B7280",
                      backgroundColor: subscription.cancelAtPeriodEnd ? "#FDE68A" : "#E5E7EB",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {subscription.cancelAtPeriodEnd ? "Canceling" : subscription.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : "Active"}
                  </span>
                </div>

                {subscription.cancelAtPeriodEnd && (
                  <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                    >
                      Billing Period:
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#202020",
                      }}
                    >
                      {subscription.billingPeriod.charAt(0).toUpperCase() + subscription.billingPeriod.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                    >
                      Credits Available:
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#CEA64F",
                      }}
                    >
                      {creditBalance} / {subscription.credits.total}
                    </span>
                  </div>

                  {!subscription.cancelAtPeriodEnd && (
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "#202020",
                        }}
                      >
                        Next Payment:
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#202020",
                        }}
                      >
                        {formatDate(subscription.nextResetAt || subscription.currentPeriodEnd)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Card */}
              <div
                className="rounded-xl px-4 py-3 md:px-5 md:py-4"
                style={{
                  backgroundColor: "#202020",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: "#CEA64F",
                        borderRadius: "8px",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CreditCard size={20} color="#FFFFFF" strokeWidth={2} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#FFFFFF",
                          marginBottom: "2px",
                        }}
                      >
                        Payment Method
                      </p>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          fontWeight: 400,
                          color: "#9CA3AF",
                        }}
                      >
                        Manage via Stripe Portal
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleManageBilling}
                    disabled={isLoadingPortal}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #374151",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {isLoadingPortal ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Manage</span>
                        <ExternalLink size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Credit Transaction History */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Recent Transactions
                </h4>

                {loadingTransactions ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : transactions.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No transactions yet
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${
                              transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              Balance: {transaction.balance}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            <span>Load More</span>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                {subscription.cancelAtPeriodEnd ? (
                  <button
                    onClick={handleReactivateSubscription}
                    disabled={isReactivating}
                    className="w-full px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "#CEA54F",
                      color: "#FFFFFF",
                    }}
                  >
                    {isReactivating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reactivating...</span>
                      </>
                    ) : (
                      "Reactivate Subscription"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-4 py-3 rounded-lg font-semibold transition-colors"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #EF4444",
                      color: "#EF4444",
                    }}
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cancel Subscription
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your subscription will remain active until {formatDate(subscription.currentPeriodEnd)}. You can reactivate anytime before then.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for canceling (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CEA54F] focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Let us know why you're canceling..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                  }}
                  disabled={isCanceling}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCanceling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Canceling...</span>
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
