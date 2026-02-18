
import { ProductType, ProductConfig } from '../types/product';

export const MIN_WIDTH = 1200;
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

        case ProductType.FrenchDoor: {
            const fd = config as any; // Cast to access sidelights safely
            const leftW = fd.sidelights?.left?.enabled ? fd.sidelights.left.width : 0;
            const rightW = fd.sidelights?.right?.enabled ? fd.sidelights.right.width : 0;
            const doorWidth = width - leftW - rightW;

            if (doorWidth > 2476) {
                return { isValid: false, message: `Door width must be less than 2476mm, currently ${doorWidth}mm` };
            }
            if (doorWidth < 1000) {
                return { isValid: false, message: `Door width must be greater than 1000mm, currently ${doorWidth}mm` };
            }
            if (height > 3000) return { isValid: false, message: 'Max height is 3000mm' };
            break;
        }

        case ProductType.SingleDoor: {
            if (width > 1200) {
                return { isValid: false, message: `Single door max width is 1200mm, currently ${width}mm` };
            }
            if (width < 600) {
                return { isValid: false, message: `Single door min width is 600mm, currently ${width}mm` };
            }
            if (height > 2500) return { isValid: false, message: 'Max height for single door is 2500mm' };
            break;
        }

        // Add other product rules here
    }

    return { isValid: true };
};
