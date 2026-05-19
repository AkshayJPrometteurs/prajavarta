import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Upload a file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from FormData
 * @param {string} folderName - Cloudinary folder name (e.g., 'news', 'authors', 'categories')
 * @param {Object} options - Additional upload options
 * @returns {Promise<{secure_url: string, public_id: string, width: number, height: number}>}
 */
export async function uploadToCloudinary(fileBuffer, folderName, options = {}) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `prajavarta/${folderName}`,
                quality: 'auto',
                fetch_format: 'auto',
                resource_type: 'auto',
                ...options
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )

        uploadStream.end(fileBuffer)
    })
}

/**
 * Delete a file from Cloudinary using public_id
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>}
 */
export async function deleteFromCloudinary(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
        throw error
    }
}

/**
 * Get Cloudinary image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {string}
 */
export function getCloudinaryUrl(publicId, transformations = {}) {
    if (!publicId) return null
    return cloudinary.url(publicId, {
        secure: true,
        fetch_format: 'auto',
        quality: 'auto',
        ...transformations
    })
}

/**
 * Extract public_id from Cloudinary secure_url
 * @param {string} secureUrl - Full Cloudinary URL
 * @returns {string|null}
 */
export function extractPublicIdFromUrl(secureUrl) {
    if (!secureUrl) return null
    const match = secureUrl.match(/\/prajavarta\/(.+?)(?:\.[^/?]+)?(?:\?|$)/)
    return match ? `prajavarta/${match[1]}` : null
}

/**
 * Get responsive image transformation for different sizes
 * @returns {Object}
 */
export function getResponsiveImageTransformations() {
    return {
        thumbnail: { width: 100, height: 100, crop: 'fill', gravity: 'auto' },
        small: { width: 300, height: 200, crop: 'fill', gravity: 'auto' },
        medium: { width: 600, height: 400, crop: 'fill', gravity: 'auto' },
        large: { width: 1200, height: 800, crop: 'fill', gravity: 'auto' }
    }
}
