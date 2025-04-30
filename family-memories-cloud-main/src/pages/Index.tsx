import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Memory, FamilyMember } from "@/types";
import MemoryCard from "@/components/memory/MemoryCard";
import FamilyMemberCard from "@/components/family/FamilyMemberCard";
import { ArrowRight, Camera, Calendar, BookOpen, Gift, Clock } from "lucide-react";

// Mock data for demonstration
const mockMemories: Memory[] = [
  {
    id: "1",
    title: "First Day of School",
    description: "Emma's first day of kindergarten. She was so excited to meet her teacher!",
    mediaUrls: ["/placeholder.svg"],
    mediaType: "image",
    date: "2023-09-05T08:30:00Z",
    memberId: "1",
    memberName: "Emma",
    categoryId: "school",
    categoryName: "School",
    createdAt: "2023-09-05T17:00:00Z",
    updatedAt: "2023-09-05T17:00:00Z",
    locationName: undefined,
    locationLatitude: undefined,
    locationLongitude: undefined,
  },
  {
    id: "2",
    title: "Soccer Practice",
    description: "Noah scored his first goal today!",
    mediaUrls: ["/placeholder.svg", "/placeholder.svg"],
    mediaType: "image",
    date: "2023-08-15T16:00:00Z",
    memberId: "2",
    memberName: "Noah",
    categoryId: "sports",
    categoryName: "Sports",
    createdAt: "2023-08-15T19:30:00Z",
    updatedAt: "2023-08-15T19:30:00Z",
    locationName: undefined,
    locationLatitude: undefined,
    locationLongitude: undefined,
  },
  {
    id: "3",
    title: "Piano Recital",
    description: "Emma played 'Twinkle Twinkle Little Star' for the first time in front of an audience.",
    mediaUrls: ["/placeholder.svg"],
    mediaType: "video",
    date: "2023-07-22T14:00:00Z",
    memberId: "1",
    memberName: "Emma",
    categoryId: "music",
    categoryName: "Music",
    createdAt: "2023-07-22T18:20:00Z",
    updatedAt: "2023-07-22T18:20:00Z",
    locationName: undefined,
    locationLatitude: undefined,
    locationLongitude: undefined,
  }
];

const mockFamilyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "Emma",
    birthDate: "2018-04-12",
    relation: "daughter",
    familyId: "1",
    createdAt: "2023-01-01T00:00:00Z", 
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Noah",
    birthDate: "2015-09-23",
    relation: "son",
    familyId: "1",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Olivia",
    birthDate: "2021-11-08",
    relation: "daughter",
    familyId: "1",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z"
  }
];

const Index = () => {
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Simulate data fetching
  useEffect(() => {
    // In a real app, this would fetch from an API
    setRecentMemories(mockMemories);
    setFamilyMembers(mockFamilyMembers);
  }, []);

  return (
    <div className="container py-8 space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Capture Your Family's Journey</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Preserve the precious moments, milestones, and memories that make your family unique.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link to="/memory/new">
              <Camera className="mr-2 h-5 w-5" />
              Add Memory
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/memories">
              View All Memories
            </Link>
          </Button>
        </div>
      </section>

      {/* Family Members Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Family Members</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/family" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {familyMembers.map((member) => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
          
          <Card className="flex flex-col items-center justify-center p-6 border-dashed">
            <Button variant="ghost" className="h-24 w-24 rounded-full" asChild>
              <Link to="/family/new-member">+</Link>
            </Button>
            <h3 className="mt-3 text-lg font-semibold">Add Family Member</h3>
            <p className="text-sm text-center text-muted-foreground mt-1">
              Add a new member to your family
            </p>
          </Card>
        </div>
      </section>

      {/* Recent Memories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Recent Memories</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/memories" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentMemories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Make the most of your memories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Milestone Tracking</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Never miss important milestones with custom reminders and notifications.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Prompt Library</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Discover prompts for every occasion to capture meaningful responses year after year.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Photo Books</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create beautiful photo books from your memories with just a few clicks.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Time Capsules</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create interactive yearly summaries showcasing growth and special moments.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
