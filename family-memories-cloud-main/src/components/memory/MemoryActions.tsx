
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MemoryActionsProps {
  memoryId: string;
  liked: boolean;
  onLikeToggle: () => void;
}

const MemoryActions = ({ memoryId, liked, onLikeToggle }: MemoryActionsProps) => {
  return (
    <div className="flex justify-between p-3">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={onLikeToggle}
        >
          <Heart 
            className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} 
          />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/memory/${memoryId}`}>View</Link>
      </Button>
    </div>
  );
};

export default MemoryActions;
