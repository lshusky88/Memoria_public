
import { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Memory } from "@/types";
import MediaPreview from "./MediaPreview";
import MemoryContent from "./MemoryContent";
import MemoryActions from "./MemoryActions";

interface MemoryCardProps {
  memory: Memory;
  compact?: boolean;
}

const MemoryCard = ({ memory, compact = false }: MemoryCardProps) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <Card className={`overflow-hidden ${compact ? "" : "hover:shadow-lg transition-shadow"}`}>
      {(memory.mediaType === "image" || memory.mediaType === "video") && (
        <MediaPreview 
          mediaType={memory.mediaType}
          mediaUrls={memory.mediaUrls}
          title={memory.title}
        />
      )}
      
      <MemoryContent 
        title={memory.title}
        date={memory.date}
        memberName={memory.memberName || ""}
        categoryName={memory.categoryName}
        description={memory.description}
        mediaType={memory.mediaType}
        compact={compact}
        categoryId={memory.categoryId || ""}
      />
      
      {!compact && (
        <CardFooter className="flex justify-between p-0">
          <MemoryActions 
            memoryId={memory.id}
            liked={liked}
            onLikeToggle={() => setLiked(!liked)}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default MemoryCard;
