// ============================================
// Restaurant Partner Data (Indian Cuisine)
// Each restaurant has: id, name, cuisine tags,
// rating, delivery time, delivery fee, cover
// image (local generated image), and featured flag.
// ============================================

const RESTAURANTS = [
  {
    id: 1,
    name: "The Royal Biryani Kitchen",
    cuisine: "Mughlai, Biryanis, Kebabs",
    rating: 4.9,
    reviewCount: 324,
    deliveryTime: "30-40 min",
    deliveryFee: "₹40",
    image: "images/biryani.png",
    featured: true
  },
  {
    id: 2,
    name: "Dakshin Bistro",
    cuisine: "South Indian, Dosas, Filter Coffee",
    rating: 4.8,
    reviewCount: 512,
    deliveryTime: "20-30 min",
    deliveryFee: "₹30",
    image: "images/dosa.png",
    featured: true
  },
  {
    id: 3,
    name: "Delhi Darbar",
    cuisine: "North Indian, Curries, Tandoori",
    rating: 4.7,
    reviewCount: 278,
    deliveryTime: "25-35 min",
    deliveryFee: "₹40",
    image: "images/butter-chicken.png",
    featured: false
  },
  {
    id: 4,
    name: "Chandni Chowk Sweets",
    cuisine: "Indian Desserts, Chaats, Drinks",
    rating: 4.6,
    reviewCount: 198,
    deliveryTime: "15-25 min",
    deliveryFee: "Free",
    image: "images/gulab-jamun.png",
    featured: true
  }
];
