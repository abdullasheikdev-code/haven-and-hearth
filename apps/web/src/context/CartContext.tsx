import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderType, OrderTypes } from '@haven/shared';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  imageUrl?: string;
  selectedModifiers?: {
    modifierName: string;
    optionName: string;
    price: number;
  }[];
  itemTotal: number;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  orderType: OrderType;
  tableNumber: string;
  roomNumber: string;
  addItem: (item: Omit<CartItem, 'itemTotal'>, restaurantId: string, restaurantName: string) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  setRoomNumber: (room: string) => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('haven_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurantId, setRestaurantId] = useState<string | null>(() => {
    return localStorage.getItem('haven_cart_restaurantId') || null;
  });

  const [restaurantName, setRestaurantName] = useState<string | null>(() => {
    return localStorage.getItem('haven_cart_restaurantName') || null;
  });

  const [orderType, setOrderType] = useState<OrderType>(OrderTypes.DINE_IN);
  const [tableNumber, setTableNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  useEffect(() => {
    localStorage.setItem('haven_cart', JSON.stringify(items));
    if (restaurantId) localStorage.setItem('haven_cart_restaurantId', restaurantId);
    if (restaurantName) localStorage.setItem('haven_cart_restaurantName', restaurantName);
  }, [items, restaurantId, restaurantName]);

  const addItem = (item: Omit<CartItem, 'itemTotal'>, resId: string, resName: string) => {
    // If ordering from another restaurant, reset cart with confirmation
    if (restaurantId && restaurantId !== resId && items.length > 0) {
      if (!window.confirm('Adding items from a different restaurant will replace your current cart. Continue?')) {
        return;
      }
      setItems([]);
    }

    setRestaurantId(resId);
    setRestaurantName(resName);

    setItems((prev) => {
      const itemTotal = item.price * item.quantity;
      const existingIndex = prev.findIndex(
        (i) => i.menuItemId === item.menuItemId && JSON.stringify(i.selectedModifiers) === JSON.stringify(item.selectedModifiers)
      );

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = next[existingIndex].quantity + item.quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: newQty,
          itemTotal: next[existingIndex].price * newQty,
        };
        return next;
      }

      return [...prev, { ...item, itemTotal }];
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }
    setItems((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        quantity,
        itemTotal: next[index].price * quantity,
      };
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    localStorage.removeItem('haven_cart');
    localStorage.removeItem('haven_cart_restaurantId');
    localStorage.removeItem('haven_cart_restaurantName');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const tax = Math.round(subtotal * 0.085 * 100) / 100;
  const serviceCharge = orderType === OrderTypes.DINE_IN || orderType === OrderTypes.ROOM_SERVICE
    ? Math.round(subtotal * 0.05 * 100) / 100
    : 0;
  const total = Math.round((subtotal + tax + serviceCharge) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        orderType,
        tableNumber,
        roomNumber,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        setTableNumber,
        setRoomNumber,
        itemCount,
        subtotal,
        tax,
        serviceCharge,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
