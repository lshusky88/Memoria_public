
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase, logQueryError, supabaseUrl } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";

const RELATIONS = [
  "parent",
  "spouse",
  "child",
  "sibling",
  "grandparent",
  "grandchild",
  "aunt/uncle",
  "niece/nephew",
  "cousin",
  "friend",
  "other"
];

interface AddFamilyMemberFormProps {
  familyId: string;
  onSuccess: (member: any) => void;
}

const AddFamilyMemberForm = ({ familyId, onSuccess }: AddFamilyMemberFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState<string | undefined>();
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter a name for the family member.",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create the member object
      const newMember = {
        name, 
        relation, 
        family_id: familyId,
        birth_date: birthDate ? format(birthDate, "yyyy-MM-dd") : null
      };
      
      console.log("Adding family member:", newMember);
      console.log("Supabase client config:", {
        url: supabaseUrl,
      });
      
      // Insert the new family member
      const { data, error } = await supabase
        .from("family_members")
        .insert(newMember)
        .select()
        .single();
        
      if (error) {
        console.error("Error adding family member:", error);
        logQueryError(error, "addFamilyMember", newMember);
        throw error;
      }
      
      console.log("Family member added successfully:", data);
      
      toast({
        title: "Family member added",
        description: `${name} has been added to your family.`,
      });
      
      onSuccess(data);
      
      // Reset form
      setName("");
      setRelation(undefined);
      setBirthDate(undefined);
      
    } catch (error: any) {
      console.error("Error adding family member:", error);
      toast({
        variant: "destructive",
        title: "Error adding family member",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="relation">Relation</Label>
        <Select value={relation} onValueChange={setRelation}>
          <SelectTrigger id="relation">
            <SelectValue placeholder="Select relation" />
          </SelectTrigger>
          <SelectContent>
            {RELATIONS.map((rel) => (
              <SelectItem key={rel} value={rel}>
                {rel.charAt(0).toUpperCase() + rel.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthDate">Birth Date (Optional)</Label>
        <DatePicker
          date={birthDate}
          onSelect={setBirthDate}
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={new Date().getFullYear()}
        />
      </div>
      
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Family Member"
        )}
      </Button>
    </form>
  );
};

export default AddFamilyMemberForm;
