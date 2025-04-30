
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Profile = () => {
  const { user, userProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState(userProfile?.full_name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || "");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: fullName,
          avatar_url: avatarUrl
        })
        .eq("id", user.id);

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and how you appear on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || ""} alt={fullName} />
                <AvatarFallback className="text-lg">{getInitials(fullName || user.email || "")}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar_url">Profile Picture URL</Label>
                <Input
                  id="avatar_url"
                  type="text"
                  value={avatarUrl || ""}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a URL to your profile picture
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={fullName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="mt-1 bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your email cannot be changed
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="flex flex-col gap-4 mt-4">
          <div className="w-full">
            <h3 className="font-medium mb-2">Account Actions</h3>
            <Button 
              variant="destructive" 
              onClick={handleSignOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
