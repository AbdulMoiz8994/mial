import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    image: File;
    platform: 'instagram' | 'instagram-story' | 'facebook' | 'twitter';
    style: 'professional' | 'modern' | 'elegant' | 'playful' | 'natural';
    additionalContext?: string;
  }) => void;
  isLoading?: boolean;
}

export function UploadImageModal({ isOpen, onClose, onSubmit, isLoading = false }: UploadImageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [platform, setPlatform] = useState<'instagram' | 'instagram-story' | 'facebook' | 'twitter'>('instagram');
  const [style, setStyle] = useState<'professional' | 'modern' | 'elegant' | 'playful' | 'natural'>('modern');
  const [context, setContext] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    onSubmit({
      image: selectedFile,
      platform,
      style,
      additionalContext: context.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      // Reset form
      setSelectedFile(null);
      setImagePreview(null);
      setPlatform('instagram');
      setStyle('modern');
      setContext('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay className="z-[9998]" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-[9999] grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-6 border bg-background p-8 shadow-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2",
            "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "sm:rounded-lg max-h-[85vh] overflow-y-auto my-8"
          )}
        >
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <DialogHeader className="space-y-3">
            <DialogTitle>Upload Image to Create Post</DialogTitle>
            <DialogDescription>
              Upload your own image and AI will generate a styled post design for your platform
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Image *</Label>
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
              >
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG or HEIC (Max 5MB)
                </p>
              </div>
            ) : (
              <div className="relative border-2 border-gray-200 rounded-lg p-4">
                <button
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded"
                />
                <p className="text-sm text-gray-600 mt-2 text-center truncate">
                  {selectedFile?.name}
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <Label>Platform *</Label>
            <Select value={platform} onValueChange={(value: any) => setPlatform(value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="instagram">Instagram Post</SelectItem>
                <SelectItem value="instagram-story">Instagram Story</SelectItem>
                <SelectItem value="facebook">Facebook Post</SelectItem>
                <SelectItem value="twitter">Twitter Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <Label>Style *</Label>
            <Select value={style} onValueChange={(value: any) => setStyle(value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="elegant">Elegant</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
                <SelectItem value="natural">Natural</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Context (Optional) */}
          <div className="space-y-2">
            <Label>Context (Optional)</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add additional context about the image (e.g., 'Hair transformation showcase', 'Before and after color')"
              className="resize-none h-20"
              disabled={isLoading}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {context.length}/500 characters
            </p>
          </div>
        </div>

          <DialogFooter className="pt-4 gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
