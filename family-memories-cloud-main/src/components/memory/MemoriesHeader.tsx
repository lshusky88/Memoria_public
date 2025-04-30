
import { Filter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MemoriesHeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

const MemoriesHeader = ({ showFilters, onToggleFilters }: MemoriesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Memories</h1>
        <p className="text-muted-foreground">Capture and revisit special moments</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onToggleFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button asChild>
          <Link to="/memory/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Memory
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MemoriesHeader;

