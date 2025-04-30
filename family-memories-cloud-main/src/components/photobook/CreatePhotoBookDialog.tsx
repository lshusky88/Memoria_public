
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { FamilyMember, Memory } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { CreatePhotoBookData, usePhotoBooks } from "@/hooks/usePhotoBooks";
import { toast } from "sonner";
import MemoriesSelector from "./MemoriesSelector";

interface CreatePhotoBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | undefined;
}

interface FormValues {
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  memberId: string;
  selectedMemoryIds: string[];
}

type TabType = "manual" | "auto";

const CreatePhotoBookDialog = ({ open, onOpenChange, userId }: CreatePhotoBookDialogProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("manual");
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const { createPhotoBook } = usePhotoBooks({ userId });
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      memberId: "",
      selectedMemoryIds: []
    }
  });

  useEffect(() => {
    if (open && userId) {
      fetchData();
    }
  }, [open, userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch family data
      const { data: familyData, error: familyError } = await supabase
        .from("families")
        .select("id")
        .eq('created_by', userId)
        .maybeSingle();
        
      if (familyError) throw familyError;
      if (!familyData) return;
      
      // Fetch family members
      const { data: membersData, error: membersError } = await supabase
        .from("family_members")
        .select("*")
        .eq("family_id", familyData.id)
        .order("name");
        
      if (membersError) throw membersError;
      
      // Transform family members
      const transformedMembers: FamilyMember[] = (membersData || []).map((member: any) => ({
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
      
      // Fetch memories
      const { data: memoriesData, error: memoriesError } = await supabase
        .from("memories")
        .select(`
          *,
          family_members(name),
          categories(name, color, icon)
        `)
        .order("date", { ascending: false });
        
      if (memoriesError) throw memoriesError;
      
      // Transform memories
      const transformedMemories: Memory[] = (memoriesData || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        mediaUrls: item.media_urls || [],
        mediaType: item.media_type,
        date: item.date,
        memberId: item.member_id,
        memberName: item.family_members?.name,
        categoryId: item.category_id,
        categoryName: item.categories?.name,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        locationName: item.location_name,
        locationLatitude: item.location_latitude,
        locationLongitude: item.location_longitude,
      }));
      
      setMemories(transformedMemories);
      
    } catch (error: any) {
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Format data for API
      const bookData: CreatePhotoBookData = {
        title: values.title,
        description: values.description,
        startDate: values.startDate ? format(values.startDate, "yyyy-MM-dd") : undefined,
        endDate: values.endDate ? format(values.endDate, "yyyy-MM-dd") : undefined,
        memberId: values.memberId || undefined,
        memories: values.selectedMemoryIds
      };
      
      // If on auto tab, generate photo book based on criteria
      if (activeTab === "auto") {
        // Filter memories based on date range and member selection
        const filteredMemories = memories.filter(memory => {
          const memoryDate = new Date(memory.date);
          const startDateMatch = !values.startDate || memoryDate >= values.startDate;
          const endDateMatch = !values.endDate || memoryDate <= values.endDate;
          const memberMatch = !values.memberId || memory.memberId === values.memberId;
          return startDateMatch && endDateMatch && memberMatch;
        });
        
        // If no memories match criteria, show error
        if (filteredMemories.length === 0) {
          toast.error("No memories found matching your criteria");
          setLoading(false);
          return;
        }
        
        // Use filtered memory IDs
        bookData.memories = filteredMemories.map(memory => memory.id);
        
        // Auto-generate a title if one isn't provided
        if (!values.title) {
          const yearRange = getYearRange(values.startDate, values.endDate);
          const memberName = values.memberId 
            ? familyMembers.find(m => m.id === values.memberId)?.name 
            : undefined;
            
          bookData.title = memberName
            ? `${memberName}'s Memories ${yearRange}`
            : `Family Memories ${yearRange}`;
        }
        
        // Set cover image to first memory with media if available
        const memoryWithImage = filteredMemories.find(m => 
          m.mediaType === "image" && m.mediaUrls && m.mediaUrls.length > 0
        );
        if (memoryWithImage && memoryWithImage.mediaUrls.length > 0) {
          bookData.coverImage = memoryWithImage.mediaUrls[0];
        }
      }
      
      // Create the photo book
      const result = await createPhotoBook(bookData);
      
      if (result) {
        onOpenChange(false);
        form.reset();
      }
    } catch (error: any) {
      toast.error(`Error creating photo book: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const getYearRange = (startDate?: Date, endDate?: Date) => {
    if (!startDate && !endDate) return new Date().getFullYear().toString();
    if (startDate && endDate) {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      return startYear === endYear ? startYear.toString() : `${startYear}-${endYear}`;
    }
    return startDate ? startDate.getFullYear().toString() : endDate ? endDate.getFullYear().toString() : "";
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Photo Book</DialogTitle>
          <DialogDescription>
            Create a beautiful photo book from your memories
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Selection</TabsTrigger>
            <TabsTrigger value="auto">Auto Generate</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-4">
              <TabsContent value="manual" className="space-y-4">
                {/* Book title and description */}
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title for your photo book" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Memory selector component */}
                <FormField
                  control={form.control}
                  name="selectedMemoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Memories</FormLabel>
                      <FormControl>
                        <MemoriesSelector 
                          memories={memories}
                          selectedIds={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="auto" className="space-y-4">
                {/* Book title (optional for auto-generation) */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="We'll generate a title if left blank" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add a description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Date range selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => 
                                date > new Date() || 
                                date < new Date("1900-01-01") || 
                                (form.getValues().startDate && date < form.getValues().startDate)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Family member selection */}
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Member (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Include memories from all family members" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {familyMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} {member.relation ? `(${member.relation})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Photo Book
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePhotoBookDialog;
