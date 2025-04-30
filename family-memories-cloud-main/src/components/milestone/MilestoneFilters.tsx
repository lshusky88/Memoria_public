
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { FamilyMember } from "@/types";
import { Label } from "@/components/ui/label";

interface MilestoneFiltersProps {
  familyMembers: FamilyMember[];
  selectedMember: string | null;
  showCompleted: boolean;
  onMemberChange: (value: string | null) => void;
  onShowCompletedChange: (value: boolean) => void;
}

const MilestoneFilters = ({
  familyMembers,
  selectedMember,
  showCompleted,
  onMemberChange,
  onShowCompletedChange
}: MilestoneFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <label className="text-sm font-medium mb-1 block">Family Member</label>
          <Select
            value={selectedMember || "all"}
            onValueChange={(value) => onMemberChange(value === "all" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All family members" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All family members</SelectItem>
              {familyMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="showCompleted"
            checked={showCompleted}
            onCheckedChange={onShowCompletedChange}
          />
          <Label htmlFor="showCompleted">Show completed</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneFilters;
