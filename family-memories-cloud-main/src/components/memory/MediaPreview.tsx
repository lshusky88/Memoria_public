
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";

interface MediaPreviewProps {
  mediaType: string;
  mediaUrls: string[];
  title: string;
}

const MediaPreview = ({ mediaType, mediaUrls, title }: MediaPreviewProps) => {
  const mainImage = mediaUrls[0] || "/placeholder.svg";

  if (mediaType === "image") {
    return (
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        {mediaUrls.length > 1 && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm"
          >
            +{mediaUrls.length - 1}
          </Badge>
        )}
      </div>
    );
  }

  if (mediaType === "video") {
    return (
      <div className="relative aspect-video bg-muted flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="rounded-full bg-background/80 p-3 backdrop-blur-sm">
            <Camera className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MediaPreview;
