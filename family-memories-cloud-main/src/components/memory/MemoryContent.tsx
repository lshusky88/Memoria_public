
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface MemoryContentProps {
  title: string;
  date: string;
  memberName: string;
  categoryName?: string;
  description?: string;
  mediaType: string;
  compact?: boolean;
  categoryId?: string;
}

const MemoryContent = ({ 
  title, 
  date, 
  memberName, 
  categoryName, 
  description, 
  mediaType, 
  compact = false,
  categoryId
}: MemoryContentProps) => {
  const formattedDate = formatDistanceToNow(new Date(date), { addSuffix: true });

  return (
    <>
      <CardHeader className={compact ? "p-3" : "p-5"}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-bold ${compact ? "text-sm" : "text-lg"} line-clamp-1`}>
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formattedDate} · {memberName}
            </p>
          </div>
          {categoryName && (
            <Badge variant="outline" style={{ 
              backgroundColor: `var(--memory-${categoryId})`,
              color: "var(--foreground)"
            }}>
              {categoryName}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      {!compact && (
        <>
          {mediaType === "note" && (
            <div className="p-6 bg-accent/30 italic text-muted-foreground">
              "{description}"
            </div>
          )}
          
          {description && mediaType !== "note" && (
            <CardContent>
              <p className="text-sm line-clamp-2">{description}</p>
            </CardContent>
          )}
        </>
      )}
    </>
  );
};

export default MemoryContent;
