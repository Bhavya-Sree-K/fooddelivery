// ============================================
// Best Food for Everyone - Application Logic
// ============================================
// Data is loaded from separate files:
//   - restaurants.js  (RESTAURANTS array)
//   - menu-items.js   (MENU_ITEMS array)
// ============================================

// --- Star rating image (rust-orange star from theme) ---
// We use a small inline SVG data URI for the star icon matching var(--color-tertiary)
const STAR_SVG_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D97742' stroke='%232B1810' stroke-width='1'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E";

// --- Empty cart illustration (simple plate SVG matching var(--color-secondary)) ---
const EMPTY_CART_SVG_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%238A7260' stroke-width='2'/%3E%3Cellipse cx='50' cy='58' rx='28' ry='5' stroke='%238A7260' stroke-width='2'/%3E%3Cpath d='M22 58c0-16 12-30 28-30s28 14 28 30' stroke='%238A7260' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='50' cy='25' r='3' fill='%238A7260'/%3E%3C/svg%3E";

// --- Shopping Cart State ---
let cart = [];
let appliedPromo = null;
const DELIVERY_COST = 40.00;
const FREE_DELIVERY_THRESHOLD = 300.00;

// Promo code definitions
const PROMO_CODES = {
  "FESTIVE25": { type: "percent", value: 25, label: "25% Off" },
  "WELCOME100": { type: "flat", value: 100, label: "₹100 Off" }
};

// --- DOM Element References ---
const menuGrid = document.getElementById("menu-grid");
const searchInput = document.getElementById("search-input");
const categoriesGrid = document.getElementById("categories-grid");
const restaurantsGrid = document.getElementById("restaurants-grid");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartCount = document.getElementById("cart-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartDiscount = document.getElementById("cart-discount");
const cartDelivery = document.getElementById("cart-delivery");
const cartTotal = document.getElementById("cart-total");
const discountRow = document.getElementById("discount-row");
const cartFooter = document.getElementById("cart-footer");
const checkoutBtn = document.getElementById("checkout-btn");
const promoInput = document.getElementById("promo-code-input");
const promoApplyBtn = document.getElementById("promo-apply-btn");
const promoStatus = document.getElementById("promo-status");

// Checkout Modal elements
const checkoutModalOverlay = document.getElementById("checkout-modal-overlay");
const checkoutModal = document.getElementById("checkout-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalHeaderTitle = document.getElementById("modal-header-title");
const modalBodyContent = document.getElementById("modal-body-content");

// Mobile Menu elements
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileNavMenu = document.getElementById("mobile-nav-menu");

// ============================================
// 1. RENDER RESTAURANTS
// ============================================
function renderRestaurants() {
  if (!restaurantsGrid) return;
  restaurantsGrid.innerHTML = "";

  RESTAURANTS.forEach(rest => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-perspective";
    cardWrapper.innerHTML = `
      <div class="restaurant-card" data-id="${rest.id}">
        <div class="restaurant-card-img-wrapper">
          ${rest.featured ? '<span class="restaurant-featured-tag">Featured</span>' : ''}
          <img class="restaurant-card-img" src="${rest.image}" alt="${rest.name}" loading="lazy">
        </div>
        <div class="restaurant-card-info">
          <h3 class="restaurant-card-name">${rest.name}</h3>
          <p class="restaurant-card-cuisine">${rest.cuisine}</p>
          <div class="restaurant-card-meta">
            <span class="restaurant-rating">
              <img class="star-img" src="${STAR_SVG_URI}" alt="star">
              ${rest.rating}
              <span class="review-count">(${rest.reviewCount})</span>
            </span>
            <span class="restaurant-delivery-time">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${rest.deliveryTime}
            </span>
            <span class="restaurant-delivery-fee ${rest.deliveryFee === 'Free' ? 'free' : ''}">
              ${rest.deliveryFee === 'Free' ? 'Free Delivery' : rest.deliveryFee}
            </span>
          </div>
        </div>
      </div>
    `;

    const card = cardWrapper.querySelector(".restaurant-card");
    setup3DTilt(card);

    restaurantsGrid.appendChild(cardWrapper);
  });
}

// ============================================
// 2. RENDER MENU ITEMS + 3D TILT
// ============================================
function renderMenu(category = "all", query = "") {
  if (!menuGrid) return;
  menuGrid.innerHTML = "";

  const filtered = MENU_ITEMS.filter(item => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase()) ||
                          item.description.toLowerCase().includes(query.toLowerCase()) ||
                          item.restaurant.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div class="no-results">
        <img src="${EMPTY_CART_SVG_URI}" alt="No results found">
        <p>No dishes found matching your search. Try a different keyword!</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-perspective";

    cardWrapper.innerHTML = `
      <div class="food-card" data-id="${item.id}">
        <div class="food-card-img-wrapper">
          <span class="food-card-tag">${item.badge}</span>
          <img class="food-card-img" src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="food-card-info">
          <h3 class="food-card-title">${item.name}</h3>
          <p class="food-card-restaurant">${item.restaurant}</p>
          <p class="food-card-desc">${item.description}</p>
        </div>
        <div class="food-card-footer">
          <div class="food-card-price-rating">
            <span class="food-card-price">₹${item.price.toFixed(2)}</span>
            <span class="food-card-rating">
              <img class="star-img" src="${STAR_SVG_URI}" alt="star">
              ${item.rating}
            </span>
          </div>
          <button class="btn-add-cart" data-id="${item.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        </div>
      </div>
    `;

    const card = cardWrapper.querySelector(".food-card");
    setup3DTilt(card);

    cardWrapper.querySelector(".btn-add-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(item.id);
    });

    menuGrid.appendChild(cardWrapper);
  });
}

// --- Custom 3D Tilt Logic ---
function setup3DTilt(card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x - rect.width / 2) / (rect.width / 2);
    const yPct = (y - rect.height / 2) / (rect.height / 2);
    const maxTilt = 8;
    const rotateY = xPct * maxTilt;
    const rotateX = -(yPct * maxTilt);
    card.style.transition = "transform 0.05s ease-out";
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease";
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
}

// ============================================
// 3. CATEGORY FILTERING
// ============================================
let currentCategory = "all";
let currentQuery = "";

if (categoriesGrid) {
  categoriesGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".category-card");
    if (!card) return;

    document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    currentCategory = card.getAttribute("data-category");
    renderMenu(currentCategory, currentQuery);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentQuery = e.target.value;
    renderMenu(currentCategory, currentQuery);
  });
}

// ============================================
// 4. CART OPERATIONS
// ============================================
function addToCart(id) {
  const item = MENU_ITEMS.find(m => m.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCart();
  bounceCartBadge();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    updateCart();
  }
}

function updateCart() {
  renderCartDrawer();

  // Total Quantity
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQty;

  // Subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo && subtotal > 0) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.type === "percent") {
      discountAmount = subtotal * (promo.value / 100);
    } else if (promo.type === "flat") {
      discountAmount = Math.min(promo.value, subtotal);
    }
    // free_delivery handled below
  }

  if (discountAmount > 0) {
    discountRow.style.display = "flex";
    cartDiscount.textContent = `-₹${discountAmount.toFixed(2)}`;
  } else {
    discountRow.style.display = "none";
  }

  // Delivery Fee
  let delivery = DELIVERY_COST;
  if (subtotal === 0) {
    delivery = 0;
  } else if (subtotal >= FREE_DELIVERY_THRESHOLD) {
    delivery = 0;
  } else if (appliedPromo && PROMO_CODES[appliedPromo] && PROMO_CODES[appliedPromo].type === "free_delivery") {
    delivery = 0;
  }

  if (delivery === 0 && subtotal > 0) {
    cartDelivery.textContent = "FREE";
    cartDelivery.style.color = "var(--color-tertiary)";
    cartDelivery.style.fontWeight = "600";
  } else {
    cartDelivery.textContent = `₹${delivery.toFixed(2)}`;
    cartDelivery.style.color = "";
    cartDelivery.style.fontWeight = "";
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + delivery);
  cartTotal.textContent = `₹${finalTotal.toFixed(2)}`;

  // Checkout button state
  if (cart.length === 0) {
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.5";
    checkoutBtn.style.cursor = "not-allowed";
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";
  }
}

function renderCartDrawer() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <img src="${EMPTY_CART_SVG_URI}" alt="Empty cart">
        <p>Your cart is empty.</p>
        <button class="btn-secondary" id="cart-start-shopping" style="padding: 8px 18px; font-size: 0.88rem;">Start Adding</button>
      </div>
    `;
    const startBtn = document.getElementById("cart-start-shopping");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        closeCartDrawer();
        document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
      });
    }
    return;
  }

  cart.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
        <div class="cart-item-quantity">
          <button class="quantity-btn min-btn">-</button>
          <span class="quantity-num">${item.quantity}</span>
          <button class="quantity-btn plus-btn">+</button>
        </div>
      </div>
      <button class="cart-item-remove" aria-label="Remove item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;

    itemEl.querySelector(".min-btn").addEventListener("click", () => changeQuantity(item.id, -1));
    itemEl.querySelector(".plus-btn").addEventListener("click", () => changeQuantity(item.id, 1));
    itemEl.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(item.id));

    cartItemsContainer.appendChild(itemEl);
  });
}

function bounceCartBadge() {
  cartCount.style.transform = "scale(1.4)";
  setTimeout(() => {
    cartCount.style.transform = "scale(1)";
  }, 180);
}

// ============================================
// 5. PROMO CODE SYSTEM
// ============================================
if (promoApplyBtn) {
  promoApplyBtn.addEventListener("click", () => {
    const code = promoInput.value.trim().toUpperCase();

    if (!code) {
      promoStatus.textContent = "Please enter a promo code.";
      promoStatus.className = "promo-status error";
      return;
    }

    if (PROMO_CODES[code]) {
      appliedPromo = code;
      promoStatus.textContent = `Code "${code}" applied - ${PROMO_CODES[code].label}`;
      promoStatus.className = "promo-status success";
      promoInput.value = "";
      updateCart();
    } else {
      promoStatus.textContent = "Invalid promo code. Try WELCOME100 or FESTIVE25.";
      promoStatus.className = "promo-status error";
    }
  });
}

// ============================================
// 6. CART DRAWER TOGGLE
// ============================================
function openCartDrawer() {
  cartDrawerOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawerOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

cartToggleBtn.addEventListener("click", openCartDrawer);
cartCloseBtn.addEventListener("click", closeCartDrawer);

cartDrawerOverlay.addEventListener("click", (e) => {
  if (e.target === cartDrawerOverlay) {
    closeCartDrawer();
  }
});

// ============================================
// 7. MOBILE NAVIGATION
// ============================================
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileNavMenu.classList.toggle("active");
  });
}

document.querySelectorAll("#mobile-nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileNavMenu.classList.remove("active");
  });
});

// ============================================
// 8. CHECKOUT FLOW + DELIVERY SIMULATION
// ============================================
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  closeCartDrawer();
  openModal();
});

modalCloseBtn.addEventListener("click", closeModal);
checkoutModalOverlay.addEventListener("click", (e) => {
  if (e.target === checkoutModalOverlay) {
    closeModal();
  }
});

function openModal() {
  resetModalBodyToForm();
  checkoutModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  checkoutModalOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

function resetModalBodyToForm() {
  modalHeaderTitle.textContent = "Delivery Details";
  modalBodyContent.innerHTML = `
    <form id="checkout-form">
      <div class="form-group">
        <label for="cust-name">Full Name</label>
        <input type="text" id="cust-name" class="form-input" placeholder="e.g. John Smith" required>
      </div>
      <div class="form-group">
        <label for="cust-address">Delivery Address</label>
        <input type="text" id="cust-address" class="form-input" placeholder="e.g. 142 Baker St, Suite 4B" required>
      </div>
      <div class="form-group">
        <label for="cust-phone">Phone Number</label>
        <input type="tel" id="cust-phone" class="form-input" placeholder="e.g. (555) 019-2834" required>
      </div>
      <div class="form-group">
        <label for="cust-notes">Special Instructions</label>
        <input type="text" id="cust-notes" class="form-input" placeholder="e.g. Ring the doorbell twice">
      </div>
      <div style="margin-top: var(--spacing-lg);">
        <button type="submit" class="btn-primary" id="confirm-order-btn" style="width: 100%;">
          Place Order
        </button>
      </div>
    </form>
  `;
  document.getElementById("checkout-form").addEventListener("submit", handleCheckoutSubmit);
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("cust-name").value;
  const address = document.getElementById("cust-address").value;

  // Clear cart
  cart = [];
  appliedPromo = null;
  updateCart();

  // Reset promo status
  if (promoStatus) {
    promoStatus.textContent = "";
    promoStatus.className = "promo-status";
  }

  // Switch to delivery tracking view
  modalHeaderTitle.textContent = "Order Tracking";
  modalBodyContent.innerHTML = `
    <div class="tracking-wrapper">
      <div class="scooter-animation-container">
        <div class="scooter-road"></div>
        <svg class="scooter-svg" width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Delivery scooter SVG illustration -->
          <circle cx="12" cy="33" r="6" stroke="#FF4F18" stroke-width="2.5" fill="none"/>
          <circle cx="48" cy="33" r="6" stroke="#FF4F18" stroke-width="2.5" fill="none"/>
          <circle cx="12" cy="33" r="2" fill="#FF4F18"/>
          <circle cx="48" cy="33" r="2" fill="#FF4F18"/>
          <path d="M18 33 L22 20 L38 20 L42 33" stroke="#0F172A" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="22" y="12" width="16" height="8" rx="2" fill="#FF4F18"/>
          <rect x="26" y="8" width="8" height="4" rx="1" fill="#FF8C42"/>
          <line x1="30" y1="12" x2="30" y2="8" stroke="#fff" stroke-width="1"/>
        </svg>
      </div>

      <div>
        <h3 class="tracking-title" id="tracking-status-text">Placing your order...</h3>
        <p style="color: var(--color-text-muted); font-size: 0.85rem; max-width: 320px; margin: 0 auto;" id="tracking-desc-text">Connecting to the restaurant kitchen.</p>
      </div>

      <div class="tracking-steps">
        <div class="tracking-bar-progress" id="tracking-progress-bar"></div>

        <div class="tracking-step active" id="step-0">
          <div class="tracking-step-dot">1</div>
          <span class="tracking-step-label">Placed</span>
        </div>

        <div class="tracking-step" id="step-1">
          <div class="tracking-step-dot">2</div>
          <span class="tracking-step-label">Preparing</span>
        </div>

        <div class="tracking-step" id="step-2">
          <div class="tracking-step-dot">3</div>
          <span class="tracking-step-label">On the Way</span>
        </div>

        <div class="tracking-step" id="step-3">
          <div class="tracking-step-dot">4</div>
          <span class="tracking-step-label">Delivered</span>
        </div>
      </div>

      <button class="btn-secondary" id="track-done-btn" style="width: 100%; margin-top: 8px;">Close Tracker</button>
    </div>
  `;

  document.getElementById("track-done-btn").addEventListener("click", closeModal);
  runDeliverySimulation(name, address);
}

function runDeliverySimulation(customerName, address) {
  const statusTexts = [
    "Order Confirmed!",
    "Kitchen is Preparing...",
    "Rider is On the Way!",
    "Your Meal Has Arrived!"
  ];

  const descTexts = [
    `Thanks ${customerName}! Your order has been received and confirmed.`,
    "The chef is carefully preparing your delicious meal right now.",
    `Your delivery rider is heading to ${address}. Almost there!`,
    "Enjoy your meal! We hope you love every bite."
  ];

  const steps = [
    document.getElementById("step-0"),
    document.getElementById("step-1"),
    document.getElementById("step-2"),
    document.getElementById("step-3")
  ];

  const progressBar = document.getElementById("tracking-progress-bar");
  const statusText = document.getElementById("tracking-status-text");
  const descText = document.getElementById("tracking-desc-text");

  const intervals = [
    { delay: 800, progress: "0%" },
    { delay: 4000, progress: "33%" },
    { delay: 8000, progress: "66%" },
    { delay: 12000, progress: "100%" }
  ];

  intervals.forEach((stepConfig, index) => {
    setTimeout(() => {
      if (!progressBar) return;

      progressBar.style.width = stepConfig.progress;
      if (statusText) statusText.textContent = statusTexts[index];
      if (descText) descText.textContent = descTexts[index];

      steps.forEach((step, stepIdx) => {
        if (!step) return;
        if (stepIdx < index) {
          step.className = "tracking-step completed";
        } else if (stepIdx === index) {
          step.className = "tracking-step active";
        } else {
          step.className = "tracking-step";
        }
      });

      if (index === 3) {
        const doneBtn = document.getElementById("track-done-btn");
        if (doneBtn) {
          doneBtn.textContent = "Done - Enjoy!";
          doneBtn.classList.remove("btn-secondary");
          doneBtn.classList.add("btn-primary");
        }
      }
    }, stepConfig.delay);
  });
}

// ============================================
// 9. HEADER SCROLL EFFECT
// ============================================
const mainHeader = document.getElementById("main-header");
if (mainHeader) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }
  });
}

// ============================================
// 10. INITIALIZE APPLICATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  renderRestaurants();
  renderMenu();
  updateCart();

  // --- 3D Tilt for Promo/Offer Image ---
  const promoImg = document.querySelector(".promo-img");
  if (promoImg) {
    setup3DTilt(promoImg);
  }

  // --- Hero Video: Error handling & fallback ---
  const heroVideo = document.getElementById("hero-video");
  if (heroVideo) {
    // Try to play the video; if autoplay is blocked, it will remain visible and start playing on user interaction
    heroVideo.play().catch((err) => {
      console.log("Autoplay blocked or delayed:", err.message);
    });

    // Play on first user interaction to bypass strict autoplay restrictions
    const playVideoOnInteraction = () => {
      if (heroVideo.paused) {
        heroVideo.play().catch(() => {});
      }
      document.removeEventListener("click", playVideoOnInteraction);
      document.removeEventListener("scroll", playVideoOnInteraction);
    };
    document.addEventListener("click", playVideoOnInteraction);
    document.addEventListener("scroll", playVideoOnInteraction);

    heroVideo.addEventListener("error", (e) => {
      if (e.target === heroVideo) {
        heroVideo.style.display = "none";
      }
    }, true);
  }
});
