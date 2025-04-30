
import { useState } from "react";
import { Loader2, BookOpen, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import PhotoBooksGrid from "@/components/photobook/PhotoBooksGrid";
import PhotoBooksHeader from "@/components/photobook/PhotoBooksHeader";
import EmptyPhotoBooks from "@/components/photobook/EmptyPhotoBooks";
import CreatePhotoBookDialog from "@/components/photobook/CreatePhotoBookDialog";
import { usePhotoBooks } from "@/hooks/usePhotoBooks";

const PhotoBooksPage = () => {
  const { user } = useAuth();
  const { loading, photoBooks } = usePhotoBooks({ userId: user?.id });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <PhotoBooksHeader onCreateClick={() => setCreateDialogOpen(true)} />
      
      {photoBooks.length === 0 ? (
        <EmptyPhotoBooks onCreateClick={() => setCreateDialogOpen(true)} />
      ) : (
        <PhotoBooksGrid photoBooks={photoBooks} />
      )}

      <CreatePhotoBookDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        userId={user?.id}
      />
    </div>
  );
};

export default PhotoBooksPage;
