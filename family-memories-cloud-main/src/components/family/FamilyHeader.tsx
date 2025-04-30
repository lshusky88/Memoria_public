
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FamilyHeaderProps {
  familyName: string;
  onAddMember: () => void;
}

const FamilyHeader = ({ familyName, onAddMember }: FamilyHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{familyName}</h1>
        <p className="text-muted-foreground">Manage your family members</p>
      </div>
      <Button onClick={onAddMember}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Family Member
      </Button>
    </div>
  );
};

export default FamilyHeader;
