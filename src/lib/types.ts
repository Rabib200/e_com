export interface CartItem {
  id: string;
  slug: string;
  title: string;
  quantity: number;
  description: string;
  image: string[];
  discount?: number;
  discountPrice?: number;
  price: number;
  size: string;
  status?: ProductStatus;
}

export enum ProductStatus {
  IN_STOCK = "In_Stock",
  OUT_OF_STOCK = "Out_of_Stock",
  LOW_STOCK = "Low_Stock",
}
