import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import BrandProfile from "@/pages/brand-profile";
import BusinessType from "@/pages/business-type";
import Goals from "@/pages/goals";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/brand-profile" component={BrandProfile} />
          <Route path="/business-type" component={BusinessType} />
          <Route path="/goals" component={Goals} />
          <Route path="/" component={SignIn} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
