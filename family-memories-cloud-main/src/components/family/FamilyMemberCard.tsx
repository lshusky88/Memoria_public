
import { FamilyMember } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Edit, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";

interface FamilyMemberCardProps {
  member: FamilyMember;
}

const FamilyMemberCard = ({ member }: FamilyMemberCardProps) => {
  // Calculate age if birthDate exists
  const getAgeText = () => {
    if (!member.birthDate) return "Age unknown";
    
    const birthDate = new Date(member.birthDate);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const formattedDistance = formatDistance(birthDate, today, { addSuffix: false });
    
    if (ageInYears < 2) {
      return `${formattedDistance} old`;
    }
    
    return `${ageInYears} years old`;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center p-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="text-2xl">{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="mt-3 text-lg font-semibold">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.relation}</p>
        {member.birthDate && (
          <p className="text-xs flex items-center gap-1 mt-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {getAgeText()}
          </p>
        )}
      </div>
      
      <CardFooter className="flex justify-between bg-muted/30 p-3">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/family/member/${member.id}`}>View</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <Link to={`/memory/new?memberId=${member.id}`}>
              <Camera className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" asChild>
            <Link to={`/family/member/${member.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FamilyMemberCard;
