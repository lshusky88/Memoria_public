import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Plus, LogOut, UserCircle, Settings } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const hasNotifications = true; // Placeholder - will be replaced with actual logic

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Memoria</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/family" className="text-sm font-medium transition-colors hover:text-primary">
              Family
            </Link>
            <Link to="/memories" className="text-sm font-medium transition-colors hover:text-primary">
              Memories
            </Link>
            <Link to="/milestones" className="text-sm font-medium transition-colors hover:text-primary">
              Milestones
            </Link>
            <Link to="/photobooks" className="text-sm font-medium transition-colors hover:text-primary">
              Photo Books
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                )}
              </Button>

              <Button variant="default" size={isMobile ? "icon" : "default"} asChild>
                <Link to="/memory/new">
                  {isMobile ? <Plus className="h-5 w-5" /> : "Add Memory"}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.avatar_url || ""} alt={userProfile?.full_name || ""} />
                      <AvatarFallback>{getInitials(userProfile?.full_name || user.email || "")}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {userProfile?.full_name && (
                        <p className="font-medium">{userProfile.full_name}</p>
                      )}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex w-full items-center">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
      
      {isMobile && isMenuOpen && user && (
        <div className="container pb-3">
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="px-2 py-1 rounded-md hover:bg-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/family" 
              className="px-2 py-1 rounded-md hover:bg-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Family
            </Link>
            <Link 
              to="/memories" 
              className="px-2 py-1 rounded-md hover:bg-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Memories
            </Link>
            <Link 
              to="/milestones" 
              className="px-2 py-1 rounded-md hover:bg-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Milestones
            </Link>
            <Link 
              to="/photobooks" 
              className="px-2 py-1 rounded-md hover:bg-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Photo Books
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
