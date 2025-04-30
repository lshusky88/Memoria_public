
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Milestone, FamilyMember } from "@/types";
import MilestonesList from "@/components/milestone/MilestonesList";
import MilestoneForm from "@/components/milestone/MilestoneForm";
import MilestoneFilters from "@/components/milestone/MilestoneFilters";

const MilestonesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMilestones();
    }
  }, [user, selectedMember, showCompleted]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get family ID
      const { data: familyData, error: familyError } = await supabase
        .from("families")
        .select("id")
        .eq("created_by", user?.id)
        .maybeSingle();
        
      if (familyError) throw familyError;
      
      if (!familyData) {
        setLoading(false);
        return;
      }
      
      // Get family members
      const { data: membersData, error: membersError } = await supabase
        .from("family_members")
        .select("*")
        .eq("family_id", familyData.id)
        .order("name");
        
      if (membersError) throw membersError;
      
      // Transform family members data to match our FamilyMember type
      const transformedMembers: FamilyMember[] = (membersData || []).map(member => ({
        id: member.id,
        name: member.name,
        birthDate: member.birth_date || undefined,
        avatar: undefined,
        relation: member.relation || '',
        familyId: member.family_id,
        createdAt: member.created_at,
        updatedAt: member.updated_at
      }));
      
      setFamilyMembers(transformedMembers);
      
      await fetchMilestones();
      
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

  const fetchMilestones = async () => {
    try {
      // Build query
      let query = supabase
        .from("milestones")
        .select(`
          *,
          family_members(name)
        `)
        .order("date", { ascending: true });
        
      if (selectedMember) {
        query = query.eq("member_id", selectedMember);
      }
      
      if (!showCompleted) {
        query = query.eq("completed", false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match Milestone type
      const transformedMilestones: Milestone[] = (data || []).map((item: any) => ({
        id: item.id,
        memberId: item.member_id,
        title: item.title,
        date: item.date,
        reminderDate: item.reminder_date || undefined,
        completed: item.completed,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      
      setMilestones(transformedMilestones);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching milestones",
        description: error.message,
      });
    }
  };

  const handleMilestoneAdded = (newMilestone: Milestone) => {
    setMilestones([...milestones, newMilestone]);
  };

  const handleToggleComplete = async (milestoneId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("milestones")
        .update({ completed })
        .eq("id", milestoneId);
        
      if (error) throw error;
      
      setMilestones(milestones.map(m => 
        m.id === milestoneId ? { ...m, completed } : m
      ));
      
      toast({
        title: completed ? "Milestone completed" : "Milestone reopened",
        description: "Milestone status updated successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating milestone",
        description: error.message,
      });
    }
  };

  const handleDelete = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", milestoneId);
        
      if (error) throw error;
      
      setMilestones(milestones.filter(m => m.id !== milestoneId));
      
      toast({
        title: "Milestone deleted",
        description: "Milestone has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting milestone",
        description: error.message,
      });
    }
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Milestones</h1>
          <p className="text-muted-foreground">Track important achievements and dates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={familyMembers.length === 0}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Milestone</DialogTitle>
              <DialogDescription>
                Create a milestone to track an important achievement or date.
              </DialogDescription>
            </DialogHeader>
            <MilestoneForm 
              familyMembers={familyMembers}
              onSuccess={(newMilestone) => {
                handleMilestoneAdded(newMilestone);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <MilestoneFilters
        familyMembers={familyMembers}
        selectedMember={selectedMember}
        showCompleted={showCompleted}
        onMemberChange={setSelectedMember}
        onShowCompletedChange={setShowCompleted}
      />

      {familyMembers.length === 0 ? (
        <div className="text-center py-10">
          <Flag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No family members</h3>
          <p className="mt-2 text-muted-foreground">
            Add family members first to create milestones for them.
          </p>
          <Button asChild className="mt-4">
            <Link to="/family">Manage Family</Link>
          </Button>
        </div>
      ) : milestones.length === 0 ? (
        <div className="text-center py-10">
          <Flag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No milestones found</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first milestone to see it here.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            Create Milestone
          </Button>
        </div>
      ) : (
        <MilestonesList 
          milestones={milestones}
          familyMembers={familyMembers}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default MilestonesPage;
