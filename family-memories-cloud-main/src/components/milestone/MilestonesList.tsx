
import { format } from "date-fns";
import {
  Milestone,
  FamilyMember
} from "@/types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Trash2 } from "lucide-react";

interface MilestonesListProps {
  milestones: Milestone[];
  familyMembers: FamilyMember[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const MilestonesList = ({ 
  milestones, 
  familyMembers, 
  onToggleComplete, 
  onDelete 
}: MilestonesListProps) => {
  const getMemberName = (memberId: string): string => {
    const member = familyMembers.find(m => m.id === memberId);
    return member ? member.name : "Unknown";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Family Member</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {milestones.map((milestone) => (
          <TableRow key={milestone.id}>
            <TableCell>
              <Checkbox 
                checked={milestone.completed} 
                onCheckedChange={() => onToggleComplete(milestone.id, !milestone.completed)}
              />
            </TableCell>
            <TableCell className={milestone.completed ? "line-through text-muted-foreground" : ""}>
              {milestone.title}
            </TableCell>
            <TableCell>{getMemberName(milestone.memberId)}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{format(new Date(milestone.date), "MMM d, yyyy")}</span>
              </div>
            </TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete milestone</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this milestone? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(milestone.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MilestonesList;
