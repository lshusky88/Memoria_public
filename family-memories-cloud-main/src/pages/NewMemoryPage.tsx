import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { FamilyMember, Category } from "@/types";
import MediaUploader from "@/components/memory/MediaUploader";
import { CalendarIcon, CheckCircle, MapPin, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadFiles } from "@/integrations/supabase/storage";
import { useAuth } from "@/contexts/AuthContext";

interface FormValues {
  title: string;
  description: string;
  memberId: string;
  categoryId: string;
  date: Date;
  location: string;
}

const NewMemoryPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const preselectedMemberId = searchParams.get("memberId") || "";
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      memberId: preselectedMemberId,
      categoryId: "",
      date: new Date(),
      location: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get family ID
      const { data: familyData, error: familyError } = await supabase
        .from("families")
        .select("id")
        .eq('created_by', user?.id)
        .maybeSingle();
        
      if (familyError) throw familyError;
      
      if (!familyData) {
        setLoading(false);
        toast.error("No family found. Please create a family first.");
        navigate("/family");
        return;
      }
      
      // Get family members
      const { data: membersData, error: membersError } = await supabase
        .from("family_members")
        .select("*")
        .eq("family_id", familyData.id)
        .order("name");
        
      if (membersError) throw membersError;
      
      // Transform family members data to match our FamilyMember type
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
      
      // Get categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("name");
        
      if (categoriesError) throw categoriesError;
      
      // Transform categories data to match our Category type
      const transformedCategories: Category[] = (categoriesData || []).map((category: any) => ({
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        isDefault: category.is_default,
        createdAt: category.created_at
      }));
      
      setCategories(transformedCategories);

      // If we have a preselected member ID but it's not in our list, clear it
      if (preselectedMemberId && !transformedMembers.some(member => member.id === preselectedMemberId)) {
        form.setValue("memberId", "");
      }
      
    } catch (error: any) {
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMediaSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    toast.success(`${selectedFiles.length} files selected`);
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create memories");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let mediaUrls: string[] = [];
      let mediaType = "note"; // Default to note if no media
      
      // Handle file uploads if there are any
      if (files.length > 0) {
        mediaType = files[0].type.startsWith('image/') ? 'image' : 
                    files[0].type.startsWith('video/') ? 'video' : 
                    files[0].type.startsWith('audio/') ? 'audio' : 'note';
                    
        // Upload files to Supabase Storage
        toast.loading("Uploading files...");
        try {
          // Get the family ID from the selected member
          const { data: memberData, error: memberError } = await supabase
            .from('family_members')
            .select('family_id')
            .eq('id', data.memberId)
            .single();
            
          if (memberError || !memberData) {
            throw new Error("Could not find family for the selected member");
          }
          
          const familyId = memberData.family_id;
          
          // Upload files to the appropriate folder based on media type and family ID
          mediaUrls = await uploadFiles(files, mediaType, familyId);
          
          if (mediaUrls.length === 0) {
            throw new Error("Failed to upload files");
          }
          
          toast.dismiss();
          toast.success(`${mediaUrls.length} file(s) uploaded successfully`);
        } catch (uploadError: any) {
          toast.dismiss();
          toast.error(`File upload failed: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Insert memory record
      const { data: memory, error } = await supabase
        .from('memories')
        .insert({
          title: data.title,
          description: data.description,
          member_id: data.memberId,
          category_id: data.categoryId || null,
          date: format(data.date, 'yyyy-MM-dd'),
          location_name: data.location || null,
          media_type: mediaType,
          media_urls: mediaUrls.length > 0 ? mediaUrls : null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success("Memory created successfully!");
      navigate("/memories");
    } catch (error: any) {
      console.error("Error creating memory:", error);
      toast.error(`Failed to create memory: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Memory</h1>
        <p className="text-muted-foreground">Capture a special moment for your family</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Give this memory a name" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write more about this memory..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="memberId"
                  rules={{ required: "Family member is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Member</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select family member" />
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
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input 
                            placeholder="Add a location" 
                            className="rounded-r-none" 
                            {...field} 
                          />
                          <Button type="button" variant="outline" className="rounded-l-none">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Photos & Videos</p>
                <MediaUploader onMediaSelect={handleMediaSelect} />
                
                {files.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {files.length} {files.length === 1 ? 'file' : 'files'} selected
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Memory"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewMemoryPage;
