
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase, logQueryError } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import FamilyMembersList from "@/components/family/FamilyMembersList";
import EmptyFamilyState from "@/components/family/EmptyFamilyState";
import FamilyHeader from "@/components/family/FamilyHeader";
import AddMemberDialog from "@/components/family/AddMemberDialog";
import SupabaseTest from "@/components/test/SupabaseTest";

interface FamilyData {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface FamilyMemberData {
  id: string;
  name: string;
  relation: string | null;
  birth_date: string | null;
  family_id: string;
  created_at: string;
  updated_at: string;
}

const FamilyPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [familyLoading, setFamilyLoading] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamily();
    }
  }, [user]);

  const fetchFamily = async () => {
    try {
      setLoading(true);
      
      // Make sure to check for user before proceeding
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      console.log("Fetching family for user:", user.id);
      
      const { data: families, error: familyError } = await supabase
        .from("families")
        .select("*")
        .eq("created_by", user.id);

      if (familyError) {
        console.error("Error fetching family:", familyError);
        logQueryError(familyError, "fetchFamily", { userId: user.id });
        throw familyError;
      }
      
      console.log("Families fetched:", families);
      
      const familyData = families && families.length > 0 ? families[0] : null;
      setFamily(familyData);
      
      if (familyData) {
        console.log("Fetching members for family:", familyData.id);
        
        const { data: membersData, error: membersError } = await supabase
          .from("family_members")
          .select("*")
          .eq("family_id", familyData.id)
          .order("name");
          
        if (membersError) {
          console.error("Error fetching family members:", membersError);
          logQueryError(membersError, "fetchFamilyMembers", { familyId: familyData.id });
          throw membersError;
        }
        
        console.log("Family members fetched:", membersData);
        
        setFamilyMembers(membersData || []);
      }
    } catch (error: any) {
      console.error("Error fetching family:", error);
      toast({
        variant: "destructive",
        title: "Error fetching family",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createFamily = async () => {
    if (!familyName.trim()) {
      toast({
        variant: "destructive",
        title: "Family name required",
        description: "Please enter a name for your family.",
      });
      return;
    }

    try {
      setFamilyLoading(true);
      
      // Make sure to check for user before proceeding
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Create the family object with the correct types
      const newFamily = {
        name: familyName,
        created_by: user.id
      };
      
      console.log("Creating family with:", newFamily);
      
      const { data, error } = await supabase
        .from("families")
        .insert(newFamily)
        .select()
        .single();
        
      if (error) {
        console.error("Error creating family:", error);
        logQueryError(error, "createFamily", newFamily);
        throw error;
      }
      
      setFamily(data);
      toast({
        title: "Family created",
        description: "Your family has been created successfully.",
      });
    } catch (error: any) {
      console.error("Error creating family:", error);
      toast({
        variant: "destructive",
        title: "Error creating family",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setFamilyLoading(false);
    }
  };

  const handleFamilyMemberAdded = (newMember: FamilyMemberData) => {
    setFamilyMembers([...familyMembers, newMember]);
  };

  const toggleDebugInfo = () => {
    setShowDebugInfo(prev => !prev);
  };

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Debug toggle button */}
      <div className="flex justify-end">
        <button 
          onClick={toggleDebugInfo}
          className="text-xs text-muted-foreground hover:underline"
        >
          {showDebugInfo ? "Hide" : "Show"} Debug Info
        </button>
      </div>

      {/* Debug info component */}
      {showDebugInfo && (
        <div className="mb-6">
          <SupabaseTest />
        </div>
      )}

      {!family ? (
        <EmptyFamilyState 
          familyName={familyName}
          onFamilyNameChange={setFamilyName}
          onCreateFamily={createFamily}
          isLoading={familyLoading}
        />
      ) : (
        <>
          <FamilyHeader 
            familyName={family.name}
            onAddMember={() => setIsDialogOpen(true)}
          />
          
          <AddMemberDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            familyId={family.id}
            onSuccess={handleFamilyMemberAdded}
          />

          <FamilyMembersList 
            familyMembers={familyMembers} 
            onUpdate={fetchFamily} 
          />
        </>
      )}
    </div>
  );
};

export default FamilyPage;
