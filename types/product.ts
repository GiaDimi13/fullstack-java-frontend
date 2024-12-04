export enum Category {
    ELECTRONICS = 'ELECTRONICS',
    CLOTHING = 'CLOTHING',
    FOOD = 'FOOD'
}

// Helper function to get display name for category
export function getCategoryDisplayName(category: Category): string {
    switch (category) {
        case Category.ELECTRONICS:
            return 'Electronics';
        case Category.CLOTHING:
            return 'Clothing';
        case Category.FOOD:
            return 'Food';
        default:
            return category;
    }
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

export interface Product extends ProductRequest {
  id: number
} 