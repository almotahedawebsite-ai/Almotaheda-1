/**
 * 8. CLOUDINARY MEDIA SERVICE
 */

export class CloudinaryService {
  private static cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  private static uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset || '');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    
    // Convert the returned URL to explicitly serve as WebP with automatic quality optimization
    // Example: https://res.cloudinary.com/.../image/upload/v123.../img.jpg -> .../upload/f_webp,q_auto/v123.../img.jpg
    const optimizedUrl = data.secure_url.replace('/upload/', '/upload/f_webp,q_auto/');
    
    return optimizedUrl;
  }
}
