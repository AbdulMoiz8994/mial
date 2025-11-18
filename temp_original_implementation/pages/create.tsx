import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Instagram, Film, Copy, Heart, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Content } from "@shared/schema";
import { useLocation } from "wouter";

const contentTypes = [
  { id: "instagram", label: "Instagram Post", icon: Instagram },
  { id: "tiktok", label: "TikTok Script", icon: Film },
  { id: "reels", label: "Reels Idea", icon: Film },
];

export default function Create() {
  const [location] = useLocation();
  const [selectedType, setSelectedType] = useState("instagram");
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templatePrompt = params.get('template');
    const templateType = params.get('type');
    const templateName = params.get('name');
    
    if (templatePrompt) {
      setPrompt(templatePrompt);
    }
    if (templateType && ['instagram', 'tiktok', 'reels'].includes(templateType)) {
      setSelectedType(templateType);
    }
    if (templateName) {
      toast({
        title: `Template loaded: ${templateName}`,
        description: "Customize the prompt and generate your content.",
      });
    }
  }, [location, toast]);

  const generateMutation = useMutation({
    mutationFn: async ({ prompt, type }: { prompt: string; type: string }) => {
      const response = await apiRequest("POST", "/api/generate", { prompt, type });
      return await response.json() as { content: string };
    },
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      toast({
        title: "Content generated!",
        description: "Your content is ready to use.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (content: Omit<Content, "id" | "createdAt">) => {
      const response = await apiRequest("POST", "/api/content", content);
      return await response.json() as Content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Saved to library!",
        description: "Your content has been saved.",
      });
      setGeneratedContent("");
      setPrompt("");
      setTitle("");
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Please describe the content you want to create.",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate({ prompt, type: selectedType });
  };

  const handleSave = () => {
    if (!generatedContent || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please add a title before saving.",
        variant: "destructive",
      });
      return;
    }

    saveMutation.mutate({
      type: selectedType,
      title: title.trim(),
      body: generatedContent,
      prompt: prompt,
      favorited: false,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2" data-testid="text-page-title">Create Content</h1>
        <p className="text-muted-foreground">Generate engaging social media content powered by AI</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Type</CardTitle>
              <CardDescription>Choose the platform for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {contentTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className="justify-start gap-2 h-auto py-4"
                    onClick={() => setSelectedType(type.id)}
                    data-testid={`button-type-${type.id}`}
                  >
                    <type.icon className="h-5 w-5" />
                    <span className="font-semibold">{type.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Prompt</CardTitle>
              <CardDescription>Describe the content you want to create</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">What would you like to create?</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., A post about balayage transformation from dark brunette to caramel highlights..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  data-testid="input-prompt"
                />
                <p className="text-xs text-muted-foreground">{prompt.length} characters</p>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !prompt.trim()}
                className="w-full gap-2"
                size="lg"
                data-testid="button-generate"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Your generated content will appear here</CardDescription>
                </div>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2"
                      data-testid="button-copy"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGeneratedContent("")}
                      data-testid="button-clear"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedContent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (for your library)</Label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Give this content a title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border bg-background"
                      data-testid="input-title"
                    />
                  </div>

                  <div className="p-6 bg-muted/50 rounded-lg border min-h-[300px]">
                    <div className="flex items-start gap-2 mb-4">
                      <Badge variant="secondary" data-testid="badge-content-type">
                        {contentTypes.find((t) => t.id === selectedType)?.label}
                      </Badge>
                    </div>
                    <p className="whitespace-pre-wrap text-foreground leading-relaxed" data-testid="text-generated-content">
                      {generatedContent}
                    </p>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending || !title.trim()}
                    className="w-full gap-2"
                    size="lg"
                    data-testid="button-save"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Heart className="h-5 w-5" />
                        Save to Library
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No content yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Enter a prompt and click "Generate Content" to create your social media post
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
