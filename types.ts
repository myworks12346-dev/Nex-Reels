export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  taste: 'Spicy' | 'Savoury' | 'Sweet' | 'Bitter' | 'Sour';
  recommendations: string[];
  fallbackImage: string; // URL for when AI image isn't generated
}

export interface GeneratedImage {
  id: number;
  data: string; // base64
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}