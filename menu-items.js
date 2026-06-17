// ============================================
// Menu Items / Dish Catalog Data (Indian Cuisine)
// Each item has: id, name, price, category,
// restaurant source, description, image path,
// numeric rating, and a text badge.
// Categories: biryanis, dosas, curries, chaats, desserts
// ============================================

const MENU_ITEMS = [
  // --- Biryanis ---
  {
    id: 1,
    name: "Hyderabadi Dum Biryani",
    price: 349.00,
    category: "biryanis",
    restaurant: "The Royal Biryani Kitchen",
    description: "Fragrant basmati rice layered with juicy chicken marinated in yogurt and spices, slow-cooked in traditional Dum style.",
    image: "images/biryani.png",
    rating: 4.9,
    badge: "Signature"
  },
  {
    id: 2,
    name: "Lucknowi Mutton Biryani",
    price: 429.00,
    category: "biryanis",
    restaurant: "The Royal Biryani Kitchen",
    description: "A delicate Awadhi Biryani with tender mutton cooked in a rich stock, layered with aromatic long-grain basmati rice.",
    image: "images/mutton-biryani.png",
    rating: 4.8,
    badge: "Best Seller"
  },

  // --- Dosas & Breads ---
  {
    id: 3,
    name: "Crispy Masala Dosa",
    price: 149.00,
    category: "dosas",
    restaurant: "Dakshin Bistro",
    description: "Thin and crispy fermented rice crep\u00e9 lined with spiced potato mash, served with aromatic sambar and fresh chutneys.",
    image: "images/dosa.png",
    rating: 4.8,
    badge: "South Icon"
  },
  {
    id: 4,
    name: "Idli Sambar Platter",
    price: 99.00,
    category: "dosas",
    restaurant: "Dakshin Bistro",
    description: "Soft, fluffy steamed rice-lentil cakes served with piping hot vegetable sambar and coconut chutney.",
    image: "images/idli.png",
    rating: 4.6,
    badge: "Healthy"
  },

  // --- Curries ---
  {
    id: 5,
    name: "Butter Chicken Masala",
    price: 329.00,
    category: "curries",
    restaurant: "Delhi Darbar",
    description: "Tender tandoori chicken cooked in a smooth, rich tomato and butter gravy, finished with fresh cream.",
    image: "images/butter-chicken.png",
    rating: 4.9,
    badge: "Legendary"
  },
  {
    id: 6,
    name: "Paneer Butter Masala",
    price: 289.00,
    category: "curries",
    restaurant: "Delhi Darbar",
    description: "Soft cottage cheese cubes cooked in a sweet, creamy tomato-onion gravy, seasoned with warm spices.",
    image: "images/paneer.png",
    rating: 4.7,
    badge: "Vegetarian"
  },
  {
    id: 7,
    name: "Butter Naan & Roti Basket",
    price: 119.00,
    category: "curries",
    restaurant: "Delhi Darbar",
    description: "An assortment of freshly baked tandoori breads, including butter naan, garlic naan, and wheat rotis.",
    image: "images/naan.png",
    rating: 4.6,
    badge: "Hot & Fresh"
  },

  // --- Chaats & Starters ---
  {
    id: 8,
    name: "Crispy Samosa Platter",
    price: 79.00,
    category: "chaats",
    restaurant: "Chandni Chowk Sweets",
    description: "Golden-fried pastry pockets filled with spiced potato and peas, served with tamarind and mint chutneys.",
    image: "images/samosa.png",
    rating: 4.7,
    badge: "Street Style"
  },
  {
    id: 9,
    name: "Dahi Bhalla Chaat",
    price: 129.00,
    category: "chaats",
    restaurant: "Chandni Chowk Sweets",
    description: "Soft lentil dumplings soaked in sweetened yogurt, topped with cumin, red chili, chutneys, and pomegranates.",
    image: "images/dahi-bhalla.png",
    rating: 4.8,
    badge: "Local Favorite"
  },

  // --- Desserts & Drinks ---
  {
    id: 10,
    name: "Gulab Jamun (2 Pcs)",
    price: 89.00,
    category: "desserts",
    restaurant: "Chandni Chowk Sweets",
    description: "Soft milk-solid dumplings fried golden and soaked in cardamon sugar syrup, served warm.",
    image: "images/gulab-jamun.png",
    rating: 4.9,
    badge: "Sweet Treat"
  },
  {
    id: 11,
    name: "Mango Lassi",
    price: 99.00,
    category: "desserts",
    restaurant: "Chandni Chowk Sweets",
    description: "A thick, refreshing traditional yogurt drink blended with sweet Alphonso mango pulp and saffron.",
    image: "images/mango-lassi.png",
    rating: 4.8,
    badge: "Refreshing"
  }
];
