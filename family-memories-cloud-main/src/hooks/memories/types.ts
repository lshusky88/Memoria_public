
import { Memory, FamilyMember, Category } from "@/types";

export interface UseMemoriesProps {
  userId: string | undefined;
}

export interface UseMemoriesReturn {
  loading: boolean;
  memories: Memory[];
  familyMembers: FamilyMember[];
  categories: Category[];
  selectedMember: string | null;
  selectedCategory: string | null;
  setSelectedMember: (memberId: string | null) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  refreshData: () => Promise<void>;
}
