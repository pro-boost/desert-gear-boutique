// Grid component constants
export const GRID_GAP_CLASSES = {
  none: "gap-0",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
} as const;

export const GRID_COLS_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6",
} as const;

// ImageDropzone types
export interface BaseImageDropzoneProps {
  className?: string;
  multiple?: boolean;
}

export interface SingleImageDropzoneProps extends BaseImageDropzoneProps {
  onImageUpload: (image: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
  multiple?: false;
}

export interface MultiImageDropzoneProps extends BaseImageDropzoneProps {
  onImageUpload: (images: string[]) => void;
  currentImages?: string[];
  onImageRemove?: (index: number) => void;
  multiple: true;
}

export type ImageDropzoneProps = SingleImageDropzoneProps | MultiImageDropzoneProps; 