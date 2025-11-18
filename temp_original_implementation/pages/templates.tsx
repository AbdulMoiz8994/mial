import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Instagram, Film, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Template } from "@shared/schema";

export default function Templates() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const useTemplateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const response = await apiRequest("POST", `/api/templates/${template.id}/use`);
      return { response: await response.json(), template };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      const template = data.template;
      const params = new URLSearchParams({
        template: template.promptTemplate,
        type: template.type,
        name: template.name
      });
      setLocation(`/create?${params.toString()}`);
    },
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Transformation: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
      Product: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
      Tutorial: "bg-green-500/10 text-green-700 dark:text-green-300",
      Lifestyle: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
      "Social Proof": "bg-pink-500/10 text-pink-700 dark:text-pink-300",
      Trends: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    };
    return colors[category] || "bg-gray-500/10 text-gray-700 dark:text-gray-300";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "tiktok":
      case "reels":
        return <Film className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2" data-testid="text-page-title">Content Templates</h1>
        <p className="text-muted-foreground">Pre-made templates to jumpstart your content creation</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-serif font-semibold">{category}</h2>
                <Badge variant="secondary">{categoryTemplates.length}</Badge>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover-elevate transition-all duration-200"
                    data-testid={`card-template-${template.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            {getTypeIcon(template.type)}
                            <Badge variant="outline" className="text-xs" data-testid={`badge-type-${template.id}`}>
                              {template.type}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg" data-testid={`text-name-${template.id}`}>{template.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription data-testid={`text-description-${template.id}`}>{template.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <p className="text-xs font-mono text-muted-foreground line-clamp-3" data-testid={`text-prompt-${template.id}`}>
                          {template.promptTemplate}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-wrap justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span data-testid={`text-usage-${template.id}`}>{template.usageCount} uses</span>
                      </div>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => useTemplateMutation.mutate(template)}
                        data-testid={`button-use-${template.id}`}
                      >
                        <Sparkles className="h-4 w-4" />
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
