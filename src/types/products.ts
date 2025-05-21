
export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    createdBy?: string;
  }
  type ProductResponse = {
    products: Product[];
    total: number;
  };