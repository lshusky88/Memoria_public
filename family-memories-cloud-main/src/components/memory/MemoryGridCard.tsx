
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Memory } from "@/types";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface MemoryGridCardProps {
  memory: Memory;
}

const MemoryGridCard = ({ memory }: MemoryGridCardProps) => {
  const getMediaPreview = () => {
    if (memory.mediaUrls && memory.mediaUrls.length > 0) {
      if (memory.mediaType === "image") {
        return (
          <img 
            src={memory.mediaUrls[0]} 
            alt={memory.title}
            className="h-48 w-full object-cover rounded-t-md"
          />
        );
      } else if (memory.mediaType === "video") {
        return (
          <div className="h-48 w-full bg-muted flex items-center justify-center rounded-t-md">
            <span className="text-muted-foreground">Video</span>
          </div>
        );
      }
    }
    
    return (
      <div className="h-48 w-full bg-muted flex items-center justify-center rounded-t-md">
        <span className="text-muted-foreground">No media</span>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      {getMediaPreview()}
      <CardHeader className="pb-2">
        <h3 className="font-medium text-lg leading-tight">{memory.title}</h3>
      </CardHeader>
      <CardContent className="pb-2">
        {memory.description && (
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
            {memory.description}
          </p>
        )}
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Calendar className="h-3 w-3" />
          <time>{format(new Date(memory.date), "MMM d, yyyy")}</time>
        </div>
        {memory.locationName && (
          <div className="flex items-center text-sm text-muted-foreground gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            <span>{memory.locationName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 mt-auto flex justify-between">
        <Badge variant="outline" className="text-xs">
          {memory.memberName}
        </Badge>
        {memory.categoryName && (
          <Badge variant="secondary" className="text-xs">
            {memory.categoryName}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default MemoryGridCard;
