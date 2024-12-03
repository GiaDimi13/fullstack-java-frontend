export enum Category {
    ELECTRONICS = 'ELECTRONICS',
    CLOTHING = 'CLOTHING',
    FOOD = 'FOOD',
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  label: string;
  sustainable: boolean;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category: Category;
  label: string;
  sustainable: boolean;
}

export type Product = ProductResponse; 