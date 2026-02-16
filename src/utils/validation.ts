
import { ProductType, ProductConfig } from '../types/product';

export const MIN_WIDTH = 400;
export const MAX_WIDTH_BIFOLD = 8000;
export const MAX_HEIGHT_BIFOLD = 3000;

export interface ValidationResult {
    isValid: boolean;
    message?: string;
}

export const validateDimensions = (config: ProductConfig): ValidationResult => {
    const { width, height, type } = config;

    if (width < MIN_WIDTH) {
        return { isValid: false, message: `Width must be at least ${MIN_WIDTH}mm` };
    }

    // Type specific validation
    switch (type) {
        case ProductType.Bifold:
            if (width > MAX_WIDTH_BIFOLD) {
                return { isValid: false, message: `Bifold max width is ${MAX_WIDTH_BIFOLD}mm` };
            }
            if (height > MAX_HEIGHT_BIFOLD) {
                return { isValid: false, message: `Bifold max height is ${MAX_HEIGHT_BIFOLD}mm` };
            }
            break;

        case ProductType.FrenchDoor:
        case ProductType.SingleDoor:
            // Basic door validation
            if (height > 2500) return { isValid: false, message: 'Door max height is 2500mm' };
            break;

        // Add other product rules here
    }

    return { isValid: true };
};
