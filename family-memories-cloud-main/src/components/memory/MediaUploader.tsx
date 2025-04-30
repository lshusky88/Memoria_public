
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Image, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface MediaUploaderProps {
  onMediaSelect: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
}

const MediaUploader = ({ 
  onMediaSelect, 
  maxFiles = 10,
  acceptedTypes = "image/*,video/*" 
}: MediaUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files at once`);
      return;
    }
    
    setSelectedFiles(files);
    
    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };
  
  const handleSubmit = () => {
    onMediaSelect(selectedFiles);
    setOpen(false);
    
    // Clean up previews to avoid memory leaks
    previews.forEach(preview => URL.revokeObjectURL(preview));
    setSelectedFiles([]);
    setPreviews([]);
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    // Clean up preview URL
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };
  
  const openCamera = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Handle the camera stream (in a real app, you'd show a camera view and handle capturing)
      console.log("Camera access granted:", stream);
      
      // For this demo, we'll simulate taking a photo after 2 seconds
      setTimeout(() => {
        // Close the stream
        stream.getTracks().forEach((track) => track.stop());
        
        // Pretend we captured an image (in a real app you'd actually capture from the video stream)
        toast.success("Photo captured!");
        // In reality, you would create a file from the captured image and add it to selectedFiles
      }, 2000);
      
    } catch (err) {
      toast.error("Could not access camera. Please check permissions.");
      console.error("Camera access error:", err);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Photos & Videos</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => fileInputRef.current?.click()}>
              <Image className="mr-2 h-4 w-4" />
              Select Files
            </Button>
            <Button onClick={openCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Open Camera
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept={acceptedTypes}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <img 
                    src={preview} 
                    alt={`Preview ${index}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            onClick={handleSubmit} 
            disabled={selectedFiles.length === 0}
            className="w-full mt-2"
          >
            Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaUploader;
