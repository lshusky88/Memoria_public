import { useState } from "react";
import { Calendar, Trash2, User2 } from "lucide-react";
import { format } from "date-fns";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FamilyMember {
  id: string;
  name: string;
  relation: string | null;
  birth_date: string | null;
  family_id: string;
  created_at: string;
  updated_at: string;
}

interface FamilyMembersListProps {
  familyMembers: FamilyMember[];
  onUpdate: () => void;
}

const FamilyMembersList = ({ familyMembers, onUpdate }: FamilyMembersListProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Error removing family member:", error);
        throw error;
      }
      
      toast({
        title: "Family member removed",
        description: "The family member has been removed successfully.",
      });
      
      onUpdate();
      
    } catch (error: any) {
      console.error("Error removing family member:", error);
      toast({
        variant: "destructive",
        title: "Error removing family member",
        description: error.message,
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  if (familyMembers.length === 0) {
    return (
      <div className="text-center py-10">
        <User2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No family members yet</h3>
        <p className="mt-2 text-muted-foreground">
          Add your first family member to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {familyMembers.map((member) => (
        <Card key={member.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">{member.name}</CardTitle>
            <div className="flex space-x-1">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove family member</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {member.name} from your family? This action cannot be undone and will delete all memories and milestones associated with this family member.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(member.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={member.name} />
                <AvatarFallback className="text-xl">{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                {member.relation && (
                  <Badge variant="secondary" className="capitalize">
                    {member.relation}
                  </Badge>
                )}
                {member.birth_date && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {format(new Date(member.birth_date), "MMMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FamilyMembersList;
