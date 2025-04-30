
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FamilyMember, Category } from "@/types";

interface MemoryFiltersProps {
  familyMembers: FamilyMember[];
  categories: Category[];
  selectedMember: string | null;
  selectedCategory: string | null;
  onMemberChange: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
}

const MemoryFilters = ({
  familyMembers,
  categories,
  selectedMember,
  selectedCategory,
  onMemberChange,
  onCategoryChange
}: MemoryFiltersProps) => {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
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
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryFilters;
