import { v2 as cloudinary } from 'cloudinary';

// extract public id
function extractPublicId(url: string): string | null {
    try {
        const parts = url.split('/upload/')[1]; // Get everything after /upload/
        const withoutExtension = parts.split('.')[0]; // Remove file extension
        return withoutExtension;
    } catch (error) {
        return null;
    }
}

// upload file
export const uploadFileToCloudinary = async (filePath: any, folder = 'uploads') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'auto',
        });
        console.log(result, 'rs');

        return {
            url: result.secure_url,
            public_id: result.public_id,
            fileType: result.resource_type,
            fileSize: result.bytes,
        };
    } catch (error) {
        throw new Error('Cloudinary Upload Failed');
    }
};

// delete file
export const deleteFileFromCloudinary = async (url: string) => {
    try {
        const publicId = extractPublicId(url);

        if (!publicId) {
            throw new Error('Invalid Cloudinary URL. Cannot extract public_id.');
        }

        const result = await cloudinary.uploader.destroy(publicId!);
        return result;
    } catch (error) {
        throw new Error('Cloudinary Delete Failed');
    }
};

export default cloudinary;
