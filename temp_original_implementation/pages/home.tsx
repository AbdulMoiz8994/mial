import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Rocket className="h-8 w-8" />
            Welcome to Your App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your application is up and running! Start building by editing the files in the <code className="bg-muted px-2 py-1 rounded">client/src</code> directory.
          </p>
          
          <div className="pt-4">
            <h3 className="font-semibold mb-2">Quick Start:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Edit <code className="bg-muted px-1 rounded">client/src/pages/home.tsx</code> to customize this page</li>
              <li>Add new routes in <code className="bg-muted px-1 rounded">client/src/App.tsx</code></li>
              <li>Create API endpoints in <code className="bg-muted px-1 rounded">server/routes.ts</code></li>
            </ul>
          </div>

          <div className="pt-4">
            <Button data-testid="button-get-started">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
