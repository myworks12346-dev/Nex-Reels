import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Chicken Biryani",
    price: 180,
    description: "Aromatic Hyderabadi biryani cooked to perfection.",
    ingredients: ["Basmati rice", "Chicken", "Masala", "Mint", "Ghee"],
    taste: "Spicy",
    recommendations: ["Chicken 65", "Raita combo"],
    fallbackImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1080&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    price: 150,
    description: "Rich creamy paneer gravy with authentic spices.",
    ingredients: ["Paneer", "Tomato", "Butter", "Cream", "Spices"],
    taste: "Savoury",
    recommendations: ["Naan", "Jeera Rice"],
    fallbackImage: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1080&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Cold Coffee",
    price: 90,
    description: "Thick café-style cold coffee topped with foam.",
    ingredients: ["Coffee", "Milk", "Ice", "Sugar"],
    taste: "Sweet",
    recommendations: ["Brownie", "Donut"],
    fallbackImage: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=1080&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Chicken Momos",
    price: 120,
    description: "Soft steamed chicken momos with spicy chutney.",
    ingredients: ["Chicken mince", "Flour", "Spices", "Momo masala"],
    taste: "Spicy",
    recommendations: ["Fried momos", "Thukpa"],
    fallbackImage: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=1080&auto=format&fit=crop"
  }
];

export const CURRENCY = "₹";