export interface IImage {
  url: string;
  name: string;
  width: number;
    height: number;
}

export interface ITransformation {
  zoom: number;
  rotate: number;
  flipHorizontal: boolean;
    flipVertical: boolean;
}

export interface IResponse {
  message: string;
  loading?: boolean;
}

export interface IImageComponent {
  imageFile: string;
  setImageFile: (value: string) => void;
  setResponse: (value: { message: string }) => void;
}

export interface IShowcase {
  imageLibrary: IImage[] | null;
}

export interface IImageUpload {
  onImageUpload?: (file: File) => void;
  response: IResponse;
  setImageFile: (value: string) => void;
}

export interface IHistory {
  past: ITransformation[];
  present: ITransformation;
  future: ITransformation[];
}
