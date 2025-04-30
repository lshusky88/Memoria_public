
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FamilyMember, Milestone } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface MilestoneFormProps {
  familyMembers: FamilyMember[];
  milestone?: Milestone;
  onSuccess: (milestone: Milestone) => void;
}

const MilestoneForm = ({ 
  familyMembers, 
  milestone, 
  onSuccess 
}: MilestoneFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(milestone?.title || "");
  const [memberId, setMemberId] = useState(milestone?.memberId || "");
  const [date, setDate] = useState<Date | undefined>(
    milestone?.date ? new Date(milestone.date) : undefined
  );
  const [reminderDate, setReminderDate] = useState<Date | undefined>(
    milestone?.reminderDate ? new Date(milestone.reminderDate) : undefined
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please enter a title for the milestone.",
      });
      return;
    }
    
    if (!memberId) {
      toast({
        variant: "destructive",
        title: "Family member required",
        description: "Please select a family member for the milestone.",
      });
      return;
    }
    
    if (!date) {
      toast({
        variant: "destructive",
        title: "Date required",
        description: "Please select a date for the milestone.",
      });
      return;
    }

    try {
      setLoading(true);
      
      const milestoneData = {
        title,
        member_id: memberId,
        date: format(date!, "yyyy-MM-dd"),
        reminder_date: reminderDate ? format(reminderDate, "yyyy-MM-dd") : null,
        completed: milestone?.completed || false
      };
      
      let result;
      
      if (milestone?.id) {
        // Update existing milestone - use type assertion to fix TS error
        const { data, error } = await supabase
          .from("milestones")
          .update(milestoneData as any)
          .eq('id', milestone.id as any)
          .select()
          .maybeSingle();
          
        if (error) throw error;
        result = data;
        
        toast({
          title: "Milestone updated",
          description: "The milestone has been updated successfully.",
        });
      } else {
        // Create new milestone - use type assertion to fix TS error
        const { data, error } = await supabase
          .from("milestones")
          .insert(milestoneData as any)
          .select()
          .maybeSingle();
          
        if (error) throw error;
        result = data;
        
        toast({
          title: "Milestone created",
          description: "The milestone has been created successfully.",
        });
      }
      
      // Transform to match Milestone type
      const transformedMilestone: Milestone = {
        id: result.id,
        title: result.title,
        memberId: result.member_id,
        date: result.date,
        reminderDate: result.reminder_date || undefined,
        completed: result.completed,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
      
      onSuccess(transformedMilestone);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving milestone",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., First steps, Graduation"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="member">Family Member</Label>
        <Select value={memberId} onValueChange={setMemberId} required>
          <SelectTrigger id="member">
            <SelectValue placeholder="Select family member" />
          </SelectTrigger>
          <SelectContent>
            {familyMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <DatePicker
          date={date}
          onSelect={setDate}
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={2100}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reminderDate">Reminder Date (Optional)</Label>
        <DatePicker
          date={reminderDate}
          onSelect={setReminderDate}
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={2100}
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : milestone?.id ? "Update Milestone" : "Create Milestone"}
      </Button>
    </form>
  );
};

export default MilestoneForm;
