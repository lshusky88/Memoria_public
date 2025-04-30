
import { BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoBooksHeaderProps {
  onCreateClick: () => void;
}

const PhotoBooksHeader = ({ onCreateClick }: PhotoBooksHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Photo Books</h1>
        <p className="text-muted-foreground">Create beautiful books from your memories</p>
      </div>
      <Button onClick={onCreateClick}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create Photo Book
      </Button>
    </div>
  );
};

export default PhotoBooksHeader;
