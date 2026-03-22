/* client/src/components/hooks/use-image-upload.js */
import { useCallback, useEffect, useRef, useState } from "react";
import { uploadFile, deleteFile } from "../../api/appwrite";

export function useImageUpload({ onUpload, bucketId } = {}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        
        // Create local preview
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        previewRef.current = localUrl;

        // Perform Appwrite upload
        try {
          setIsUploading(true);
          const result = await uploadFile(file, bucketId);
          setFileId(result.$id);
          
          // Provide result to onUpload callback
          if (onUpload) {
            onUpload({
              id: result.$id,
              name: file.name,
              bucketId: result.bucketId,
              // Note: You can also get a preview URL from Appwrite if needed
            });
          }
        } catch (error) {
          console.error("Upload failed:", error);
          // In a real app, you'd show a toast here
        } finally {
          setIsUploading(false);
        }
      }
    },
    [onUpload, bucketId],
  );

  const handleRemove = useCallback(async () => {
    // If we have an Appwrite file ID, delete it from storage
    if (fileId) {
      try {
        await deleteFile(fileId, bucketId);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setPreviewUrl(null);
    setFileName(null);
    setFileId(null);
    previewRef.current = null;
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, fileId, bucketId]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileId,
    isUploading,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  };
}
