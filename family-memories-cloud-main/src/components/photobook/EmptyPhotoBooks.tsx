
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyPhotoBooksProps {
  onCreateClick: () => void;
}

const EmptyPhotoBooks = ({ onCreateClick }: EmptyPhotoBooksProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted-foreground/20 rounded-lg">
      <BookOpen className="h-16 w-16 text-muted-foreground/60 mb-4" />
      <h3 className="text-xl font-medium mb-2">No photo books yet</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Create your first photo book by selecting memories you'd like to include or let us create one based on a timeframe.
      </p>
      <Button onClick={onCreateClick}>Create Your First Photo Book</Button>
    </div>
  );
};

export default EmptyPhotoBooks;
