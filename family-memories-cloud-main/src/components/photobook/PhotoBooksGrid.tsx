
import { PhotoBook } from "@/types";
import PhotoBookCard from "./PhotoBookCard";

interface PhotoBooksGridProps {
  photoBooks: PhotoBook[];
}

const PhotoBooksGrid = ({ photoBooks }: PhotoBooksGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {photoBooks.map((book) => (
        <PhotoBookCard key={book.id} photoBook={book} />
      ))}
    </div>
  );
};

export default PhotoBooksGrid;
