
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Memory } from "@/types";

interface UseFetchMemoriesProps {
  userId: string | undefined;
  selectedMember: string | null;
  selectedCategory: string | null;
}

interface UseFetchMemoriesReturn {
  memories: Memory[];
  isLoading: boolean;
  fetchMemories: () => Promise<void>;
}

export const useFetchMemories = ({ 
  userId, 
  selectedMember, 
  selectedCategory 
}: UseFetchMemoriesProps): UseFetchMemoriesReturn => {
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMemories = async () => {
    try {
      if (!userId) return;
      
      setIsLoading(true);
      console.log("Fetching memories with filters:", { selectedMember, selectedCategory });
      
      let query = supabase
        .from("memories")
        .select(`
          *,
          family_members(name),
          categories(name, color, icon)
        `)
        .order("date", { ascending: false });
        
      if (selectedMember) {
        query = query.eq("member_id", selectedMember);
      }
      
      if (selectedCategory) {
        query = query.eq("category_id", selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching memories:", error);
        throw error;
      }
      
      console.log("Memories fetched:", data);
      
      const transformedMemories: Memory[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        mediaUrls: item.media_urls || [],
        mediaType: item.media_type,
        date: item.date,
        memberId: item.member_id,
        memberName: item.family_members?.name,
        categoryId: item.category_id,
        categoryName: item.categories?.name,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        locationName: item.location_name,
        locationLatitude: item.location_latitude,
        locationLongitude: item.location_longitude,
      }));
      
      setMemories(transformedMemories);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching memories",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    memories,
    isLoading,
    fetchMemories
  };
};
