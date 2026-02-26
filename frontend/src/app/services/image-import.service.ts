import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ImportedImage {
  name: string;
  file: File;
  preview: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ImageImportService {
  private importedImages = new Subject<ImportedImage>();
  public importedImages$ = this.importedImages.asObservable();

  private imageList: ImportedImage[] = [];
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  private allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  constructor() { }

  /**
   * Validate image file
   */
  validateImage(file: File): { valid: boolean; message: string } {
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `Invalid file type. Allowed types: JPEG, PNG, GIF, WebP`
      };
    }

    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        message: `File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      };
    }

    return { valid: true, message: 'File is valid' };
  }

  /**
   * Import single image
   */
  importImage(file: File): Promise<ImportedImage> {
    return new Promise((resolve, reject) => {
      const validation = this.validateImage(file);
      
      if (!validation.valid) {
        reject(validation.message);
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const importedImage: ImportedImage = {
          name: file.name,
          file: file,
          preview: e.target?.result as string,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        };

        this.imageList.push(importedImage);
        this.importedImages.next(importedImage);
        resolve(importedImage);
      };

      reader.onerror = () => {
        reject('Error reading file');
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Import multiple images
   */
  importImages(files: FileList): Promise<ImportedImage[]> {
    const importPromises: Promise<ImportedImage>[] = [];

    Array.from(files).forEach(file => {
      importPromises.push(this.importImage(file));
    });

    return Promise.all(importPromises);
  }

  /**
   * Get all imported images
   */
  getImportedImages(): ImportedImage[] {
    return this.imageList;
  }

  /**
   * Get image by name
   */
  getImageByName(name: string): ImportedImage | undefined {
    return this.imageList.find(img => img.name === name);
  }

  /**
   * Remove image
   */
  removeImage(name: string): void {
    this.imageList = this.imageList.filter(img => img.name !== name);
  }

  /**
   * Clear all imported images
   */
  clearImages(): void {
    this.imageList = [];
  }

  /**
   * Export image as data URL
   */
  getImageDataUrl(name: string): string | null {
    const image = this.getImageByName(name);
    return image ? image.preview : null;
  }

  /**
   * Download imported image
   */
  downloadImage(name: string): void {
    const image = this.getImageByName(name);
    if (!image) {
      console.error('Image not found');
      return;
    }

    const link = document.createElement('a');
    link.href = image.preview;
    link.download = image.name;
    link.click();
  }

  /**
   * Get image statistics
   */
  getImageStats() {
    const totalSize = this.imageList.reduce((sum, img) => sum + img.size, 0);
    return {
      count: this.imageList.length,
      totalSize: totalSize,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
      types: [...new Set(this.imageList.map(img => img.type))]
    };
  }
}
