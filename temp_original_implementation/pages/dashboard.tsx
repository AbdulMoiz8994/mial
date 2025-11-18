import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Instagram, Film, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-foreground leading-tight" data-testid="text-hero-title">
                Create Stunning Beauty Content
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                AI-powered content creation for hair stylists, beauty professionals, and barbers. 
                Generate engaging social media posts in seconds.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/create">
                <Button size="lg" className="rounded-full px-8 text-lg gap-2" data-testid="button-start-creating">
                  <Sparkles className="h-5 w-5" />
                  Start Creating
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg" data-testid="button-browse-templates">
                  Browse Templates
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Posts Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="hover-elevate transition-all duration-300" data-testid="card-feature-instagram">
              <CardHeader>
                <Instagram className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Instagram Posts</CardTitle>
                <CardDescription>
                  Captivating captions and hashtags for your transformations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-300 mt-12" data-testid="card-feature-tiktok">
              <CardHeader>
                <Film className="h-10 w-10 text-primary mb-4" />
                <CardTitle>TikTok Scripts</CardTitle>
                <CardDescription>
                  Trending scripts and hooks that go viral
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-300" data-testid="card-feature-reels">
              <CardHeader>
                <Film className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Reels Ideas</CardTitle>
                <CardDescription>
                  Creative concepts for engaging short-form content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate transition-all duration-300 mt-12" data-testid="card-feature-trends">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Stay ahead with the latest beauty trends
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
