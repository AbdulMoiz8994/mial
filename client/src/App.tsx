import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/contexts/UserContext";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
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
        <TooltipProvider>
          <Switch>
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/brand-profile" component={BrandProfile} />
            <Route path="/business-type" component={BusinessType} />
            <Route path="/goals" component={Goals} />
            <Route path="/brand-colors" component={BrandColors} />
            <Route path="/social-media-focus" component={SocialMediaFocus} />
            <Route path="/pricing" component={Pricing} />
            <Route path="/generating" component={Generating} />
            <Route path="/home" component={DashboardHome} />
            <Route path="/ai-studio" component={AIStudio} />
            <Route path="/editors" component={Editors} />
            <Route path="/calendars" component={Calendars} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/settings" component={Settings} />
            <Route path="/settings/accounts" component={AccountSettings} />
            <Route path="/settings/brandings" component={BrandingSettings} />
            <Route path="/settings/notification" component={NotificationSettings} />
            <Route path="/settings/integrations" component={IntegrationSettings} />
            <Route path="/settings/billings" component={BillingSettings} />
            <Route path="/settings/billings/invoice" component={InvoiceDetails} />
            <Route path="/" component={SignIn} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
