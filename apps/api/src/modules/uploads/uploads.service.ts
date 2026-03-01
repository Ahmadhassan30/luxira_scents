import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
    constructor(private readonly config: ConfigService) {
        cloudinary.config({
            cloud_name: this.config.getOrThrow('cloudinary.cloudName'),
            api_key: this.config.getOrThrow('cloudinary.apiKey'),
            api_secret: this.config.getOrThrow('cloudinary.apiSecret'),
        });
    }

    async uploadImage(file: Buffer, folder: string = 'products'): Promise<{ url: string; publicId: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder,
                        resource_type: 'image',
                        transformation: [
                            { quality: 'auto:good' },
                            { fetch_format: 'auto' },
                        ],
                    },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve({ url: result.secure_url, publicId: result.public_id });
                    },
                )
                .end(file);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}
