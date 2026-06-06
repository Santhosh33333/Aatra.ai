import { logger } from './logger';

export interface ImageValidationResult {
  path: string;
  status: 'valid' | 'broken' | 'missing';
  message: string;
  timestamp: string;
}

class ImageValidator {
  private validatedImages: Map<string, boolean> = new Map();
  private brokenImages: ImageValidationResult[] = [];

  /**
   * Validate image accessibility
   */
  async validateImage(imagePath: string): Promise<boolean> {
    if (this.validatedImages.has(imagePath)) {
      return this.validatedImages.get(imagePath) || false;
    }

    try {
      const response = await fetch(imagePath, { method: 'HEAD' });
      const isValid = response.ok || response.status === 200;
      this.validatedImages.set(imagePath, isValid);

      if (!isValid) {
        const result: ImageValidationResult = {
          path: imagePath,
          status: 'broken',
          message: `HTTP ${response.status}: ${response.statusText}`,
          timestamp: new Date().toISOString(),
        };
        this.brokenImages.push(result);
        logger.warn(`[ImageValidator] Broken image detected: ${imagePath} (${response.status})`);
      } else {
        logger.debug(`[ImageValidator] Image validated: ${imagePath}`);
      }

      return isValid;
    } catch (error) {
      const result: ImageValidationResult = {
        path: imagePath,
        status: 'missing',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
      this.brokenImages.push(result);
      logger.error(`[ImageValidator] Image validation failed: ${imagePath}`, error);
      this.validatedImages.set(imagePath, false);
      return false;
    }
  }

  /**
   * Validate multiple images
   */
  async validateImages(imagePaths: string[]): Promise<ImageValidationResult[]> {
    const results: ImageValidationResult[] = [];

    for (const path of imagePaths) {
      const isValid = await this.validateImage(path);
      if (!isValid) {
        const broken = this.brokenImages.find(b => b.path === path);
        if (broken) results.push(broken);
      }
    }

    return results;
  }

  /**
   * Get all broken images
   */
  getBrokenImages(): ImageValidationResult[] {
    return [...this.brokenImages];
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validatedImages.clear();
    this.brokenImages = [];
    logger.info('[ImageValidator] Validation cache cleared');
  }

  /**
   * Get validation report
   */
  getReport(): {
    total: number;
    validated: number;
    broken: number;
    brokenImages: ImageValidationResult[];
  } {
    return {
      total: this.validatedImages.size,
      validated: Array.from(this.validatedImages.values()).filter(v => v).length,
      broken: this.brokenImages.length,
      brokenImages: this.brokenImages,
    };
  }
}

export const imageValidator = new ImageValidator();
