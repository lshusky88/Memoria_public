
import { supabase } from "@/integrations/supabase/client";
import { PhotoBook } from "@/types";
import { CreatePhotoBookData } from "@/hooks/usePhotoBooks";

/**
 * Fetches all photo books for a user
 */
export const fetchUserPhotoBooks = async (userId: string) => {
  console.log("Fetching photo books for user:", userId);
  
  const { data: booksData, error: booksError } = await supabase
    .from('photo_books')
    .select(`
      *,
      family_members(name)
    `)
    .eq('created_by', userId)
    .order('created_at', { ascending: false });
    
  if (booksError) {
    console.error("Error fetching photo books:", booksError);
    throw booksError;
  }
  
  console.log("Photo books fetched:", booksData);
  return booksData;
};

/**
 * Gets the memory count for a photo book
 */
export const getPhotoBookMemoryCount = async (bookId: string) => {
  const { count, error } = await supabase
    .from('photo_book_memories')
    .select('*', { count: 'exact', head: true })
    .eq('book_id', bookId);
    
  if (error) {
    console.error("Error counting memories for book:", error);
    return 0;
  }
  
  return count || 0;
};

/**
 * Creates a new photo book
 */
export const createPhotoBook = async (userId: string, data: CreatePhotoBookData) => {
  // Create photo book record
  const { data: bookData, error: bookError } = await supabase
    .from('photo_books')
    .insert({
      title: data.title,
      description: data.description || null,
      cover_image: data.coverImage || null,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      member_id: data.memberId || null,
      created_by: userId
    })
    .select()
    .single();
    
  if (bookError) {
    console.error("Error creating photo book:", bookError);
    throw bookError;
  }
  
  // If memories are provided, associate them with the photo book
  if (data.memories && data.memories.length > 0) {
    await addMemoriesToPhotoBook(bookData.id, data.memories);
  }
  
  return bookData;
};

/**
 * Adds memories to a photo book
 */
export const addMemoriesToPhotoBook = async (bookId: string, memoryIds: string[]) => {
  const bookMemories = memoryIds.map(memoryId => ({
    book_id: bookId,
    memory_id: memoryId,
  }));
  
  const { error: memoryError } = await supabase
    .from('photo_book_memories')
    .insert(bookMemories);
    
  if (memoryError) {
    console.error("Error adding memories to photo book:", memoryError);
    throw memoryError;
  }
};

/**
 * Transforms raw photo book data into PhotoBook objects
 */
export const transformPhotoBookData = async (booksData: any[]): Promise<PhotoBook[]> => {
  const booksWithCounts = await Promise.all((booksData || []).map(async (book: any) => {
    const memoryCount = await getPhotoBookMemoryCount(book.id);
    
    return {
      id: book.id,
      title: book.title,
      description: book.description,
      coverImage: book.cover_image,
      startDate: book.start_date,
      endDate: book.end_date,
      memberId: book.member_id,
      memberName: book.family_members?.name,
      memoryCount: memoryCount,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
    };
  }));
  
  return booksWithCounts;
};
