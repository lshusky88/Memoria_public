import { supabase } from './client';

// Define bucket name - this should match what you create in Supabase dashboard
const MEMORIES_BUCKET = 'memories';

// Track if the bucket exists and is accessible
let bucketExists = false;

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param mediaType Type of media (e.g. photos, videos)
 * @param familyId ID of the family
 * @param path Optional path within the bucket
 * @returns URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (file: File, mediaType: string, familyId: string, path: string = ''): Promise<string | null> => {
  try {
    // Create a unique filename to avoid collisions
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Full path including media type, family ID, and file name
    const fullPath = `${mediaType}/${familyId}/${fileName}`;
    
    // Log the full path for debugging
    console.log('Uploading file to path:', fullPath);
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      console.error('Upload parameters:', { fullPath, fileType: file.type, fileSize: file.size });
      return null;
    }
    
    console.log('File uploaded successfully:', uploadData);
    
    // Add a small delay before creating the signed URL to ensure the file is fully processed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get a signed URL that respects RLS policies
    console.log('Creating signed URL for path:', fullPath);
    
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .createSignedUrl(fullPath, 60 * 60 * 24 * 365); // 1 year expiry
      
    console.log('Signed URL response:', signedUrlData);
      
    // Extract the signedUrl from the data
    const signedUrl = signedUrlData?.signedUrl;
      
    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      
      // Try fallback to public URL
      console.log('Falling back to public URL');
      const { data: publicUrlData } = supabase.storage
        .from(MEMORIES_BUCKET)
        .getPublicUrl(fullPath);
      
      console.log('Public URL response:', publicUrlData);
      
      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
      
      return null;
    }
    
    return signedUrl;
  } catch (error) {
    console.error('Unexpected error during file upload:', error);
    return null;
  }
};

/**
 * Upload multiple files to Supabase Storage
 * @param files Array of files to upload
 * @param mediaType Type of media (e.g. photos, videos)
 * @param familyId ID of the family
 * @param path Optional path within the bucket
 * @returns Array of URLs of the uploaded files
 */
export const uploadFiles = async (files: File[], mediaType: string, familyId: string, path: string = ''): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadFile(file, mediaType, familyId, path));
  const results = await Promise.all(uploadPromises);
  
  // Filter out any null results (failed uploads)
  return results.filter(url => url !== null) as string[];
};

/**
 * Delete a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @returns boolean indicating success
 */
export const deleteFile = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/memories\/(.+)/);
    
    if (!pathMatch || !pathMatch[1]) {
      console.error('Could not extract file path from URL:', url);
      return false;
    }
    
    const filePath = pathMatch[1];
    
    // Delete the file
    const { error } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error during file deletion:', error);
    return false;
  }
};

/**
 * Initialize storage - check if bucket exists and create it if needed
 * This should be called when the app starts
 */
export const initStorage = async (): Promise<void> => {
  try {
    console.log(`Checking access to bucket: '${MEMORIES_BUCKET}'`);
    
    // First, list all available buckets to see what's available
    try {
      const { data: bucketList, error: bucketListError } = await supabase.storage.listBuckets();
      if (bucketListError) {
        console.error('Error listing buckets:', bucketListError);
      } else {
        console.log('Available buckets:', bucketList?.map(b => b.name) || []);
      }
    } catch (bucketListErr) {
      console.error('Error trying to list buckets:', bucketListErr);
    }
    
    // Now check if our target bucket exists and is accessible
    const { data, error } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .list();
    
    if (error) {
      console.error('Error accessing storage bucket:', error);
      console.warn(`Please ensure the '${MEMORIES_BUCKET}' bucket exists in your Supabase project and has proper permissions.`);
      console.warn('You may need to create this bucket in the Supabase dashboard and ensure RLS is properly configured.');
      bucketExists = false;
    } else {
      console.log(`Successfully connected to '${MEMORIES_BUCKET}' bucket. Contents:`, data);
      
      // Check RLS policies by trying to create a signed URL for a test path
      try {
        const testPath = `test-${Date.now()}.txt`;
        const { error: signedUrlError } = await supabase.storage
          .from(MEMORIES_BUCKET)
          .createSignedUrl(testPath, 60);
          
        if (signedUrlError) {
          console.warn('Bucket exists but there may be issues with signed URLs:', signedUrlError);
          console.warn('Please check your RLS policies in the Supabase dashboard.');
        } else {
          console.log('Signed URL creation test successful. RLS policies appear to be working.');
        }
      } catch (signedUrlErr) {
        console.error('Error testing signed URL creation:', signedUrlErr);
      }
      
      bucketExists = true;
    }
  } catch (error) {
    console.error('Unexpected error initializing storage:', error);
    bucketExists = false;
  }
};
