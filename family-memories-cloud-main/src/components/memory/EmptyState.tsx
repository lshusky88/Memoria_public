
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type: "no-members" | "no-memories";
}

const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === "no-members") {
    return (
      <div className="text-center py-10">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No family members</h3>
        <p className="mt-2 text-muted-foreground">
          Add family members first to create memories for them.
        </p>
        <Button asChild className="mt-4">
          <Link to="/family">Manage Family</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-10">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No memories found</h3>
      <p className="mt-2 text-muted-foreground">
        Create your first memory to see it here.
      </p>
      <Button asChild className="mt-4">
        <Link to="/memory/new">Create Memory</Link>
      </Button>
    </div>
  );
};

export default EmptyState;

