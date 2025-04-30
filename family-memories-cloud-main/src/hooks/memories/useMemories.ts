
import { useState, useEffect } from "react";
import { useFetchFamilyData } from "./useFetchFamilyData";
import { useFetchMemories } from "./useFetchMemories";
import { UseMemoriesProps, UseMemoriesReturn } from "./types";

export const useMemories = ({ userId }: UseMemoriesProps): UseMemoriesReturn => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    loading: familyLoading,
    familyMembers, 
    categories,
    fetchData 
  } = useFetchFamilyData({ userId });

  const { 
    memories,
    isLoading: memoriesLoading, 
    fetchMemories 
  } = useFetchMemories({ 
    userId, 
    selectedMember, 
    selectedCategory 
  });

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMemories();
    }
  }, [userId, selectedMember, selectedCategory]);

  const refreshData = async () => {
    await fetchData();
    await fetchMemories();
  };

  return {
    loading: familyLoading || memoriesLoading,
    memories,
    familyMembers,
    categories,
    selectedMember,
    selectedCategory,
    setSelectedMember,
    setSelectedCategory,
    showFilters,
    setShowFilters,
    refreshData,
  };
};
