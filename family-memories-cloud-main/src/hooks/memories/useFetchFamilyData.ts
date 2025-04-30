
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FamilyMember, Category } from "@/types";

interface UseFetchFamilyDataProps {
  userId: string | undefined;
}

interface UseFetchFamilyDataReturn {
  loading: boolean;
  familyMembers: FamilyMember[];
  categories: Category[];
  fetchData: () => Promise<void>;
}

export const useFetchFamilyData = ({ userId }: UseFetchFamilyDataProps): UseFetchFamilyDataReturn => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        setLoading(false);
        return;
      }
      
      console.log("Fetching family data for user:", userId);
      
      const { data: familyData, error: familyError } = await supabase
        .from("families")
        .select("id")
        .eq('created_by', userId)
        .maybeSingle();
        
      if (familyError) {
        console.error("Error fetching family:", familyError);
        throw familyError;
      }
      
      console.log("Family data fetched:", familyData);
      
      if (!familyData) {
        console.log("No family found for this user");
        setLoading(false);
        return;
      }
      
      const { data: membersData, error: membersError } = await supabase
        .from("family_members")
        .select("*")
        .eq("family_id", familyData.id)
        .order("name");
        
      if (membersError) {
        console.error("Error fetching family members:", membersError);
        throw membersError;
      }
      
      console.log("Family members fetched:", membersData);
      
      const transformedMembers: FamilyMember[] = (membersData || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        birthDate: member.birth_date || undefined,
        avatar: member.avatar,
        relation: member.relation || '',
        familyId: member.family_id,
        createdAt: member.created_at,
        updatedAt: member.updated_at
      }));
      
      setFamilyMembers(transformedMembers);
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");
        
      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        throw categoriesError;
      }
      
      console.log("Categories fetched:", categoriesData);
      
      const transformedCategories: Category[] = (categoriesData || []).map((category: any) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        isDefault: category.is_default,
        createdAt: category.created_at
      }));
      
      setCategories(transformedCategories);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    familyMembers,
    categories,
    fetchData
  };
};
