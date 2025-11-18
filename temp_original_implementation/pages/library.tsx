import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Copy, Search, Instagram, Film } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Content } from "@shared/schema";
import { format } from "date-fns";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: content = [], isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Deleted",
        description: "Content removed from library.",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ id, favorited }: { id: string; favorited: boolean }) => {
      const response = await apiRequest("PATCH", `/api/content/${id}`, { favorited: !favorited });
      return await response.json() as Content;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
  });

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filterType || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "tiktok":
      case "reels":
        return <Film className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2" data-testid="text-page-title">Content Library</h1>
        <p className="text-muted-foreground">Your saved content collection</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterType === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(null)}
            data-testid="button-filter-all"
          >
            All
          </Button>
          <Button
            variant={filterType === "instagram" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("instagram")}
            className="gap-2"
            data-testid="button-filter-instagram"
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </Button>
          <Button
            variant={filterType === "tiktok" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("tiktok")}
            className="gap-2"
            data-testid="button-filter-tiktok"
          >
            <Film className="h-4 w-4" />
            TikTok
          </Button>
          <Button
            variant={filterType === "reels" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("reels")}
            className="gap-2"
            data-testid="button-filter-reels"
          >
            <Film className="h-4 w-4" />
            Reels
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {searchQuery || filterType
                ? "Try adjusting your search or filters"
                : "Create some content to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover-elevate transition-all duration-200" data-testid={`card-content-${item.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2" data-testid={`text-title-${item.id}`}>{item.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="gap-1" data-testid={`badge-type-${item.id}`}>
                        {getTypeIcon(item.type)}
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavoriteMutation.mutate({ id: item.id, favorited: item.favorited })}
                    className={item.favorited ? "text-primary" : "text-muted-foreground"}
                    data-testid={`button-favorite-${item.id}`}
                  >
                    <Heart className={`h-5 w-5 ${item.favorited ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap" data-testid={`text-body-${item.id}`}>
                  {item.body}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between gap-2">
                <span className="text-xs text-muted-foreground" data-testid={`text-date-${item.id}`}>
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(item.body)}
                    className="gap-1"
                    data-testid={`button-copy-${item.id}`}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
