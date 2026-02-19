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

    case ProductType.Slider: {
      if (width < 600) {
        return { isValid: false, message: "Slider min width is 600mm" };
      }
      if (width > 6000) {
        return { isValid: false, message: "Slider max width is 6000mm" };
      }
      if (height > 2500) {
        return { isValid: false, message: "Slider max height is 2500mm" };
      }
      break;
    }

    case ProductType.Slider: {
      if (width < 600) {
        return { isValid: false, message: "Slider min width is 600mm" };
      }
      if (width > 6000) {
        return { isValid: false, message: "Slider max width is 6000mm" };
      }
      if (height > 2500) {
        return { isValid: false, message: "Slider max height is 2500mm" };
      }
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

    case ProductType.Shaped: {
      if (width < 500) {
        return { isValid: false, message: "Shaped frame min width is 500mm" };
      }
      if (width > 5000) {
        return { isValid: false, message: "Shaped frame max width is 5000mm" };
      }
      if (height < 200) {
        return { isValid: false, message: "Shaped frame min height is 200mm" };
      }
      if (height > 3000) {
        return { isValid: false, message: "Shaped frame max height is 3000mm" };
      }
      break;
    }

    case ProductType.Fixed: {
      if (width < 300) {
        return { isValid: false, message: "Fixed frame min width is 300mm" };
      }
      if (width > 5000) {
        return { isValid: false, message: "Fixed frame max width is 5000mm" };
      }
      if (height < 300) {
        return { isValid: false, message: "Fixed frame min height is 300mm" };
      }
      if (height > 3000) {
        return { isValid: false, message: "Fixed frame max height is 3000mm" };
      }
      break;
    }
  }

  return { isValid: true };
};
