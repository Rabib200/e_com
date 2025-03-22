export interface CartItem {
  id: string;
  slug: string;
  title: string;
  quantity: number;
  description: string;
  image: string;
  discount?: number;
  discountPrice?: number;
  price: number;
  size: string;
}
