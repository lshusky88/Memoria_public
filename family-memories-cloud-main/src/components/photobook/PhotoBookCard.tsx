
import { useState } from "react";
import { BookOpen, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { PhotoBook } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PhotoBookCardProps {
  photoBook: PhotoBook;
}

const PhotoBookCard = ({ photoBook }: PhotoBookCardProps) => {
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden relative">
        {photoBook.coverImage ? (
          <img
            src={photoBook.coverImage}
            alt={`${photoBook.title} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <Badge variant="secondary">{photoBook.memoryCount} memories</Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-medium text-lg">{photoBook.title}</h3>
      </CardHeader>

      <CardContent className="pb-2 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {photoBook.startDate && photoBook.endDate
              ? `${format(new Date(photoBook.startDate), "MMM d, yyyy")} - ${format(new Date(photoBook.endDate), "MMM d, yyyy")}`
              : format(new Date(photoBook.createdAt), "MMM d, yyyy")}
          </span>
        </div>
        
        {photoBook.memberName && (
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>{photoBook.memberName}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 mt-auto">
        <Button variant="outline" className="w-full" asChild>
          <a href={`/photobooks/${photoBook.id}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            View Book
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PhotoBookCard;
