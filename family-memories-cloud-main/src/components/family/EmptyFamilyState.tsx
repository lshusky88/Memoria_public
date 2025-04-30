
import { User2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EmptyFamilyStateProps {
  familyName: string;
  onFamilyNameChange: (value: string) => void;
  onCreateFamily: () => void;
  isLoading: boolean;
}

const EmptyFamilyState = ({
  familyName,
  onFamilyNameChange,
  onCreateFamily,
  isLoading
}: EmptyFamilyStateProps) => {
  return (
    <div className="container py-10">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Memoria</CardTitle>
          <CardDescription>
            Start by creating your family to add members and track memories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                placeholder="e.g., The Smiths"
                value={familyName}
                onChange={(e) => onFamilyNameChange(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={onCreateFamily}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Family"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmptyFamilyState;
