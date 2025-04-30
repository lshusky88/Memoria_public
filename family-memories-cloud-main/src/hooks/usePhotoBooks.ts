
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PhotoBook } from "@/types";
import { toast } from "sonner";
import {
  fetchUserPhotoBooks,
  createPhotoBook as apiCreatePhotoBook,
  transformPhotoBookData
} from "@/services/photoBooks/api";

interface UsePhotoBooksProps {
  userId: string | undefined;
}

interface UsePhotoBooksReturn {
  loading: boolean;
  photoBooks: PhotoBook[];
  createPhotoBook: (data: CreatePhotoBookData) => Promise<PhotoBook | null>;
  refreshPhotoBooks: () => Promise<void>;
}

export interface CreatePhotoBookData {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  memberId?: string;
  coverImage?: string;
  memories?: string[];
}

export const usePhotoBooks = ({ userId }: UsePhotoBooksProps): UsePhotoBooksReturn => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [photoBooks, setPhotoBooks] = useState<PhotoBook[]>([]);

  useEffect(() => {
    if (userId) {
      fetchPhotoBooks();
    }
  }, [userId]);

  const fetchPhotoBooks = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        setLoading(false);
        return;
      }
      
      const booksData = await fetchUserPhotoBooks(userId);
      const transformedBooks = await transformPhotoBookData(booksData);
      
      setPhotoBooks(transformedBooks);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching photo books",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createPhotoBook = async (data: CreatePhotoBookData) => {
    try {
      if (!userId) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to create a photo book",
        });
        return null;
      }
      
      // Create the photo book via API
      const bookData = await apiCreatePhotoBook(userId, data);
      
      // Refresh the photo books list
      await fetchPhotoBooks();
      
      toast({
        title: "Photo book created",
        description: "Your new photo book has been created successfully",
      });
      
      return {
        id: bookData.id,
        title: bookData.title,
        description: bookData.description,
        coverImage: bookData.cover_image,
        startDate: bookData.start_date,
        endDate: bookData.end_date,
        memberId: bookData.member_id,
        memberName: null,
        memoryCount: data.memories?.length || 0,
        createdAt: bookData.created_at,
        updatedAt: bookData.updated_at,
      };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating photo book",
        description: error.message,
      });
      return null;
    }
  };

  return {
    loading,
    photoBooks,
    createPhotoBook,
    refreshPhotoBooks: fetchPhotoBooks,
  };
};
