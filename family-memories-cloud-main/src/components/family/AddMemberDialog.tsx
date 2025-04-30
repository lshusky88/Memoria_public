
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddFamilyMemberForm from "./AddFamilyMemberForm";

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  familyId: string;
  onSuccess: (member: any) => void;
}

const AddMemberDialog = ({ 
  isOpen, 
  onOpenChange, 
  familyId, 
  onSuccess 
}: AddMemberDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Enter the details of the family member you want to add.
          </DialogDescription>
        </DialogHeader>
        <AddFamilyMemberForm 
          familyId={familyId} 
          onSuccess={(newMember) => {
            onSuccess(newMember);
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
