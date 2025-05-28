export interface CartItem {
  id: string;
  slug: string;
  title: string;
  quantity: number;
  description: string;
  image: string[];
  discount?: number; // Now a float
  discount_type?: string; // New field: "percentage" or "fixed"
  discountPrice?: number;
  price: number;
  size: string;
  color?: string; // Added color property
  status?: ProductStatus;
}

export enum ProductStatus {
  IN_STOCK = "In_Stock",
  OUT_OF_STOCK = "Out_of_Stock",
  LOW_STOCK = "Low_Stock",
}
