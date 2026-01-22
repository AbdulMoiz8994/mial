import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AIStudioProvider } from "@/contexts/AIStudioContext";
import { ProtectedRoute } from "@/components/protected-route";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import AuthCallback from "@/pages/auth-callback";
import BrandProfile from "@/pages/brand-profile";
import BusinessType from "@/pages/business-type";
import Goals from "@/pages/goals";
import BrandColors from "@/pages/brand-colors";
import SocialMediaFocus from "@/pages/social-media-focus";
import Pricing from "@/pages/pricing";
import Generating from "@/pages/generating";
import DashboardHome from "@/pages/dashboard-home";
import AIStudio from "@/pages/ai-studio";
import Editors from "@/pages/editors";
import Calendars from "@/pages/calendars";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import AccountSettings from "@/pages/account-settings";
import BrandingSettings from "@/pages/branding-settings";
import NotificationSettings from "@/pages/notification-settings";
import IntegrationSettings from "@/pages/integration-settings";
import BillingSettings from "@/pages/billing-settings";
import InvoiceDetails from "@/pages/invoice-details";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SubscriptionProvider>
          <AIStudioProvider>
            <TooltipProvider>
            <Switch>
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/auth/callback" component={AuthCallback} />
            <Route path="/brand-profile">
              <ProtectedRoute><BrandProfile /></ProtectedRoute>
            </Route>
            <Route path="/business-type">
              <ProtectedRoute><BusinessType /></ProtectedRoute>
            </Route>
            <Route path="/goals">
              <ProtectedRoute><Goals /></ProtectedRoute>
            </Route>
            <Route path="/brand-colors">
              <ProtectedRoute><BrandColors /></ProtectedRoute>
            </Route>
            <Route path="/social-media-focus">
              <ProtectedRoute><SocialMediaFocus /></ProtectedRoute>
            </Route>
            <Route path="/pricing">
              <ProtectedRoute><Pricing /></ProtectedRoute>
            </Route>
            <Route path="/generating">
              <ProtectedRoute><Generating /></ProtectedRoute>
            </Route>
            <Route path="/home">
              <ProtectedRoute><DashboardHome /></ProtectedRoute>
            </Route>
            <Route path="/ai-studio">
              <ProtectedRoute><AIStudio /></ProtectedRoute>
            </Route>
            <Route path="/editors">
              <ProtectedRoute><Editors /></ProtectedRoute>
            </Route>
            <Route path="/calendars">
              <ProtectedRoute><Calendars /></ProtectedRoute>
            </Route>
            <Route path="/analytics">
              <ProtectedRoute><Analytics /></ProtectedRoute>
            </Route>
            <Route path="/settings">
              <ProtectedRoute><Settings /></ProtectedRoute>
            </Route>
            <Route path="/settings/accounts">
              <ProtectedRoute><AccountSettings /></ProtectedRoute>
            </Route>
            <Route path="/settings/brandings">
              <ProtectedRoute><BrandingSettings /></ProtectedRoute>
            </Route>
            <Route path="/settings/notification">
              <ProtectedRoute><NotificationSettings /></ProtectedRoute>
            </Route>
            <Route path="/settings/integrations">
              <ProtectedRoute><IntegrationSettings /></ProtectedRoute>
            </Route>
            <Route path="/settings/billings">
              <ProtectedRoute><BillingSettings /></ProtectedRoute>
            </Route>
            <Route path="/settings/billings/invoice">
              <ProtectedRoute><InvoiceDetails /></ProtectedRoute>
            </Route>
            <Route path="/" component={SignIn} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
          </TooltipProvider>
          </AIStudioProvider>
        </SubscriptionProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
