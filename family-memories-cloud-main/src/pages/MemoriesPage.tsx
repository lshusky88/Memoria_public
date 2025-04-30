
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import MemoriesGrid from "@/components/memory/MemoriesGrid";
import MemoryFilters from "@/components/memory/MemoryFilters";
import EmptyState from "@/components/memory/EmptyState";
import MemoriesHeader from "@/components/memory/MemoriesHeader";
import { useMemories } from "@/hooks/memories";

const MemoriesPage = () => {
  const { user } = useAuth();
  const {
    loading,
    memories,
    familyMembers,
    categories,
    selectedMember,
    selectedCategory,
    setSelectedMember,
    setSelectedCategory,
    showFilters,
    setShowFilters,
  } = useMemories({ userId: user?.id });

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <MemoriesHeader 
        showFilters={showFilters} 
        onToggleFilters={() => setShowFilters(!showFilters)} 
      />

      {showFilters && (
        <MemoryFilters 
          familyMembers={familyMembers}
          categories={categories}
          selectedMember={selectedMember}
          selectedCategory={selectedCategory}
          onMemberChange={setSelectedMember}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {familyMembers.length === 0 ? (
        <EmptyState type="no-members" />
      ) : memories.length === 0 ? (
        <EmptyState type="no-memories" />
      ) : (
        <MemoriesGrid memories={memories} />
      )}
    </div>
  );
};

export default MemoriesPage;
