/* client/src/api/appwrite.js */
import { Client, Storage, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID'); // Your project ID

const storage = new Storage(client);

export const uploadFile = async (file, bucketId = 'YOUR_BUCKET_ID') => {
    try {
        const response = await storage.createFile(
            bucketId,
            ID.unique(),
            file
        );
        return response;
    } catch (error) {
        console.error('Appwrite upload error:', error);
        throw error;
    }
};

export const getFilePreview = (fileId, bucketId = 'YOUR_BUCKET_ID') => {
    return storage.getFilePreview(bucketId, fileId);
};

export const deleteFile = async (fileId, bucketId = 'YOUR_BUCKET_ID') => {
    try {
        await storage.deleteFile(bucketId, fileId);
    } catch (error) {
        console.error('Appwrite delete error:', error);
        throw error;
    }
};

export { client, storage };
