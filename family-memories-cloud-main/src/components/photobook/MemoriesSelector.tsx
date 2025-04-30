
import { useState } from "react";
import { Check, Image } from "lucide-react";
import { format } from "date-fns";
import { Memory } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MemoriesSelectorProps {
  memories: Memory[];
  selectedIds: string[];
  onChange: (selected: string[]) => void;
}

const MemoriesSelector = ({ memories, selectedIds, onChange }: MemoriesSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredMemories = memories.filter(memory => 
    memory.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (memory.description && memory.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const toggleMemory = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };
  
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search memories..."
        className="w-full p-2 border rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <ScrollArea className="h-[300px] border rounded-md">
        <div className="p-2 space-y-2">
          {filteredMemories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No memories found</p>
          ) : (
            filteredMemories.map(memory => (
              <div 
                key={memory.id}
                className={`flex gap-3 p-2 rounded-md cursor-pointer border ${
                  selectedIds.includes(memory.id) ? 'bg-primary/10 border-primary/30' : 'border-muted hover:bg-muted/50'
                }`}
                onClick={() => toggleMemory(memory.id)}
              >
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                  {memory.mediaType === 'image' && memory.mediaUrls && memory.mediaUrls.length > 0 ? (
                    <img 
                      src={memory.mediaUrls[0]} 
                      alt={memory.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image className="h-6 w-6 text-muted-foreground/50" />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm leading-tight">{memory.title}</h4>
                    {selectedIds.includes(memory.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>{format(new Date(memory.date), "MMM d, yyyy")}</p>
                    <p>{memory.memberName}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="text-sm text-muted-foreground">
        {selectedIds.length} {selectedIds.length === 1 ? 'memory' : 'memories'} selected
      </div>
    </div>
  );
};

export default MemoriesSelector;
