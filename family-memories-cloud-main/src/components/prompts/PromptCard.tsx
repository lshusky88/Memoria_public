
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { BookmarkPlus, Send, Star } from "lucide-react";
import { toast } from "sonner";

interface PromptCardProps {
  prompt: Prompt;
  onSave?: (promptId: string, answer: string) => void;
  previousAnswer?: string;
  previousDate?: string;
}

const PromptCard = ({ 
  prompt, 
  onSave, 
  previousAnswer,
  previousDate
}: PromptCardProps) => {
  const [answer, setAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (onSave) {
        onSave(prompt.id, answer);
      }
      
      toast.success("Answer saved successfully!");
      setAnswer("");
    } catch (error) {
      toast.error("Failed to save answer");
      console.error("Error saving prompt answer:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{prompt.question}</CardTitle>
          {prompt.isDefault && (
            <Badge variant="outline" className="bg-primary/10">
              <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
              Featured
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {prompt.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {previousAnswer && (
          <div className="mb-4 p-3 bg-secondary text-secondary-foreground rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Previous answer {previousDate && `(${previousDate})`}</p>
            <p className="text-sm italic">"{previousAnswer}"</p>
          </div>
        )}
        
        <Textarea
          placeholder="Write your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save for Later
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          <Send className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Answer"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptCard;
