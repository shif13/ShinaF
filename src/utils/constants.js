export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    BASE: '/products',
    DETAIL: (id) => `/products/${id}`,
  },
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
  },
  ORDERS: {
    BASE: '/orders',
    DETAIL: (id) => `/orders/${id}`,
  },
};

export const PRODUCT_CATEGORIES = [
  'T-Shirts',
  'Shirts',
  'Jeans',
  'Dresses',
  'Jackets',
  'Shoes',
  'Accessories',
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];