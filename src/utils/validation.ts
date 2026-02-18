import { ProductType, ProductConfig } from "../types/product";

export const MIN_WIDTH = 1200;
export const MAX_WIDTH_BIFOLD = 8000;
export const MAX_HEIGHT_BIFOLD = 3000;

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateDimensions = (config: ProductConfig): ValidationResult => {
  const { width, height, type } = config;

  switch (type) {
    case ProductType.Bifold:
      if (width < MIN_WIDTH) {
        return {
          isValid: false,
          message: `Width must be at least ${MIN_WIDTH}mm`,
        };
      }
      if (width > MAX_WIDTH_BIFOLD) {
        return {
          isValid: false,
          message: `Bifold max width is ${MAX_WIDTH_BIFOLD}mm`,
        };
      }
      if (height > MAX_HEIGHT_BIFOLD) {
        return {
          isValid: false,
          message: `Bifold max height is ${MAX_HEIGHT_BIFOLD}mm`,
        };
      }
      break;

    case ProductType.FrenchDoor: {
      if (width < 1000) {
        return { isValid: false, message: "Width must be at least 1000mm" };
      }
      if (width > 5076) {
        return { isValid: false, message: "Max width is 5076mm" };
      }
      if (height < 500) {
        return { isValid: false, message: "Height must be at least 500mm" };
      }
      if (height > 5068) {
        return { isValid: false, message: "Max height is 5068mm" };
      }

      const fd = config as any; // Cast to access sidelights safely
      const leftW = fd.sidelights?.left?.enabled ? fd.sidelights.left.width : 0;
      const rightW = fd.sidelights?.right?.enabled
        ? fd.sidelights.right.width
        : 0;
      const doorWidth = width - leftW - rightW;

      if (doorWidth > 2476) {
        return {
          isValid: false,
          message: `Door width must be less than 2476mm, currently ${doorWidth}mm`,
        };
      }
      if (doorWidth < 1000) {
        return {
          isValid: false,
          message: `Door width must be greater than 1000mm, currently ${doorWidth}mm`,
        };
      }
      break;
    }

    case ProductType.Slider:
      if (width < 1000) {
        return { isValid: false, message: "Min width is 1000mm" };
      }
      if (width > 10070) {
        return { isValid: false, message: "Max width is 10070mm" };
      }
      if (height < 800) {
        return { isValid: false, message: "Min height is 800mm" };
      }
      if (height > 2768) {
        return { isValid: false, message: "Max height is 2768mm" };
      }
      break;
  }

  return { isValid: true };
};
