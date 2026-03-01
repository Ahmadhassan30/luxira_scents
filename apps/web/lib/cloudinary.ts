/**
 * Build optimized Cloudinary image URLs with transformation params.
 * Uses the cloud name from env — never exposes API secret.
 */
export function cloudinaryUrl(
    publicIdOrUrl: string,
    options: {
        width?: number;
        height?: number;
        quality?: number | 'auto';
        format?: 'auto' | 'webp' | 'avif';
        crop?: 'fill' | 'fit' | 'thumb';
    } = {},
): string {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return publicIdOrUrl;

    // If it's already a full URL, return as-is (could do transform injection but keep simple)
    if (publicIdOrUrl.startsWith('http')) return publicIdOrUrl;

    const transforms: string[] = [];
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.format) transforms.push(`f_${options.format}`);
    if (options.crop) transforms.push(`c_${options.crop}`);

    const t = transforms.length > 0 ? transforms.join(',') + '/' : '';
    return `https://res.cloudinary.com/${cloudName}/image/upload/${t}${publicIdOrUrl}`;
}
