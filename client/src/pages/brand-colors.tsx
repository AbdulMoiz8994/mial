import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Upload } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { onboardingAPI } from "@/services/onboarding.api";
import { useToast } from "@/hooks/use-toast";

export default function BrandColors() {
  const [, setLocation] = useLocation();
  const [selectedColor, setSelectedColor] = useState<string>("#CEA54F"); // Default to gold
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ general?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const colorOptions = [
    { id: "red", color: "#D91818", name: "Red" },
    { id: "green", color: "#53BF00", name: "Green" },
    { id: "blue", color: "#4F5ADA", name: "Blue" },
    { id: "pink", color: "#C31297", name: "Pink" },
    { id: "black", color: "#040404", name: "Black" },
    { id: "gold", color: "#CEA54F", name: "Gold" },
    { id: "purple", color: "#720A94", name: "Purple" },
  ];

  const handleBack = () => {
    setLocation("/goals");
  };

  const handleFileSelect = (file: File) => {
    // Validate file type - API accepts JPG, PNG, SVG
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PNG, JPG, or SVG file",
      });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "File size must be less than 5MB",
      });
      return;
    }

    setUploadedLogo(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const validateColor = (color: string) => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedLogo) {
      toast({
        variant: "destructive",
        title: "Please upload a logo",
      });
      return;
    }

    if (!validateColor(selectedColor)) {
      toast({
        variant: "destructive",
        title: "Invalid color format",
        description: "Color must be in #RRGGBB format",
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await onboardingAPI.submitStep4({
        logo: uploadedLogo,
        accentColor: selectedColor,
      });
      toast({
        title: "Branding saved!",
        description: "Let's choose your social media platforms.",
      });
      setLocation("/social-media-focus");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save branding. Please try again.";
      setErrors({ general: errorMessage });
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div
        className="bg-white rounded-lg border flex flex-col w-full max-w-[676px] px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12"
        style={{
          borderRadius: "8px",
          borderWidth: "1px",
          borderColor: "#E8E8E8",
        }}
        data-testid="card-brand-colors"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-800 transition-colors self-start"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            Back
          </span>
        </button>

        {/* Heading */}
        <h2
          className="mb-2"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "24px",
            fontWeight: 600,
            lineHeight: "34px",
            color: "#202020",
          }}
          data-testid="text-heading"
        >
          Let's brand your content
        </h2>

        {/* Subheading */}
        <p
          className="mb-8"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#484848",
          }}
          data-testid="text-subheading"
        >
          Upload your logo and choose your brand colors
        </p>

        <form onSubmit={handleContinue} className="flex flex-col gap-6">
          {/* Logo Upload Area */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileInputChange}
              className="sr-only"
              data-testid="input-logo-upload"
            />
            <div
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[#CEA54F]"
              style={{
                borderColor: "#E8E8E8",
                borderRadius: "8px",
                minHeight: "160px",
              }}
              data-testid="area-logo-upload"
            >
              {logoPreview ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-w-[120px] max-h-[80px] object-contain"
                    data-testid="img-logo-preview"
                  />
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#484848",
                    }}
                    data-testid="text-logo-filename"
                  >
                    {uploadedLogo?.name}
                  </p>
                </div>
              ) : (
                <>
                  <Upload
                    className="mb-3"
                    style={{
                      width: "32px",
                      height: "32px",
                      color: "#484848",
                    }}
                    data-testid="icon-upload"
                  />
                  <p
                    className="mb-1"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                    data-testid="text-upload-instruction"
                  >
                    Click to upload or drag and drop
                  </p>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#484848",
                    }}
                    data-testid="text-upload-format"
                  >
                    PNG, JPG up to 5MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Choose Brand Color */}
          <div>
            <h3
              className="mb-4"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "24px",
                color: "#202020",
              }}
              data-testid="text-color-heading"
            >
              Choose Brand Color
            </h3>

            <div className="flex gap-3 flex-wrap" role="radiogroup" aria-label="Brand color selection">
              {colorOptions.map((option) => {
                const isSelected = selectedColor === option.color;
                return (
                  <label
                    key={option.id}
                    className="cursor-pointer"
                    data-testid={`option-color-${option.id}`}
                  >
                    <input
                      type="radio"
                      name="brand-color"
                      value={option.color}
                      checked={isSelected}
                      onChange={() => setSelectedColor(option.color)}
                      className="sr-only"
                      data-testid={`input-color-${option.id}`}
                    />
                    <div
                      className="transition-all"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: option.color,
                        border: isSelected ? "3px solid #CEA54F" : "3px solid transparent",
                        boxShadow: isSelected
                          ? "0 0 0 2px white, 0 0 0 5px #CEA54F"
                          : "none",
                      }}
                      data-testid={`swatch-color-${option.id}`}
                      aria-label={`${option.name} color`}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
              }}
              data-testid="error-general"
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#DC2626',
                  textAlign: 'center'
                }}
              >
                {errors.general}
              </p>
            </div>
          )}

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!uploadedLogo || !selectedColor || isLoading}
            className="w-full rounded text-white font-medium transition-opacity mt-2"
            style={{
              height: "48px",
              borderRadius: "4px",
              backgroundColor: "#CEA54F",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              opacity: uploadedLogo && selectedColor && !isLoading ? 1 : 0.5,
              cursor: uploadedLogo && selectedColor && !isLoading ? "pointer" : "not-allowed",
            }}
            data-testid="button-continue"
          >
            {isLoading ? 'Uploading...' : 'Continue'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
