import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { CartItem, addressSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export type ShippingMethod = "standard" | "overnight";

export interface ShippingInfo extends z.infer<typeof addressSchema> {
  email: string;
  telegramHandle: string;
}

export interface CartState {
  items: CartItem[];
  shippingMethod: ShippingMethod;
  shippingInfo: ShippingInfo | null;
  isOpen: boolean;
  checkoutOpen: boolean;
  orderConfirmationOpen: boolean;
  currentOrder: {
    orderNumber: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    cashAppFee: number;
    total: number;
    shippingMethod: ShippingMethod;
    shippingAddress: ShippingInfo;
  } | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_SHIPPING_METHOD"; payload: ShippingMethod }
  | { type: "SET_SHIPPING_INFO"; payload: ShippingInfo }
  | { type: "TOGGLE_CART"; payload?: boolean }
  | { type: "TOGGLE_CHECKOUT"; payload?: boolean }
  | { type: "TOGGLE_ORDER_CONFIRMATION"; payload?: boolean }
  | { type: "SET_CURRENT_ORDER"; payload: CartState["currentOrder"] };

const initialState: CartState = {
  items: [],
  shippingMethod: "standard",
  shippingInfo: null,
  isOpen: false,
  checkoutOpen: false,
  orderConfirmationOpen: false,
  currentOrder: null
};

// Calculate totals based on cart items and shipping method
export const calculateTotals = (items: CartItem[], shippingMethod: ShippingMethod) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "standard" ? 50 : 100;
  const cashAppFee = subtotal * 0.05; // 5% fee
  const total = subtotal + shippingCost + cashAppFee;
  
  return {
    subtotal,
    shipping: shippingCost,
    cashAppFee,
    total
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // New item
        newItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: newItems,
        isOpen: true // Open cart when adding item
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload.productId)
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: []
      };

    case "SET_SHIPPING_METHOD":
      return {
        ...state,
        shippingMethod: action.payload
      };

    case "SET_SHIPPING_INFO":
      return {
        ...state,
        shippingInfo: action.payload
      };

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
        // Close other modals if opening cart
        checkoutOpen: action.payload === true ? false : state.checkoutOpen,
        orderConfirmationOpen: action.payload === true ? false : state.orderConfirmationOpen
      };

    case "TOGGLE_CHECKOUT":
      return {
        ...state,
        checkoutOpen: action.payload !== undefined ? action.payload : !state.checkoutOpen,
        // Close other modals if opening checkout
        isOpen: action.payload === true ? false : state.isOpen,
        orderConfirmationOpen: action.payload === true ? false : state.orderConfirmationOpen
      };

    case "TOGGLE_ORDER_CONFIRMATION":
      return {
        ...state,
        orderConfirmationOpen: action.payload !== undefined ? action.payload : !state.orderConfirmationOpen,
        // Close other modals if opening order confirmation
        isOpen: action.payload === true ? false : state.isOpen,
        checkoutOpen: action.payload === true ? false : state.checkoutOpen
      };

    case "SET_CURRENT_ORDER":
      return {
        ...state,
        currentOrder: action.payload
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  toggleCart: (isOpen?: boolean) => void;
  toggleCheckout: (isOpen?: boolean) => void;
  toggleOrderConfirmation: (isOpen?: boolean) => void;
  setCurrentOrder: (order: CartState["currentOrder"]) => void;
  getTotals: () => {
    subtotal: number;
    shipping: number;
    cashAppFee: number;
    total: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          parsedCart.items.forEach((item: CartItem) => {
            dispatch({
              type: "ADD_ITEM",
              payload: item
            });
          });
        }
        
        if (parsedCart.shippingMethod) {
          dispatch({
            type: "SET_SHIPPING_METHOD",
            payload: parsedCart.shippingMethod
          });
        }
        
        if (parsedCart.shippingInfo) {
          dispatch({
            type: "SET_SHIPPING_INFO",
            payload: parsedCart.shippingInfo
          });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(
      "cart", 
      JSON.stringify({
        items: state.items,
        shippingMethod: state.shippingMethod,
        shippingInfo: state.shippingInfo
      })
    );
  }, [state.items, state.shippingMethod, state.shippingInfo]);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const setShippingMethod = (method: ShippingMethod) => {
    dispatch({ type: "SET_SHIPPING_METHOD", payload: method });
  };

  const setShippingInfo = (info: ShippingInfo) => {
    dispatch({ type: "SET_SHIPPING_INFO", payload: info });
  };

  const toggleCart = (isOpen?: boolean) => {
    dispatch({ type: "TOGGLE_CART", payload: isOpen });
  };

  const toggleCheckout = (isOpen?: boolean) => {
    dispatch({ type: "TOGGLE_CHECKOUT", payload: isOpen });
  };

  const toggleOrderConfirmation = (isOpen?: boolean) => {
    dispatch({ type: "TOGGLE_ORDER_CONFIRMATION", payload: isOpen });
  };

  const setCurrentOrder = (order: CartState["currentOrder"]) => {
    dispatch({ type: "SET_CURRENT_ORDER", payload: order });
  };

  const getTotals = () => {
    return calculateTotals(state.items, state.shippingMethod);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setShippingMethod,
        setShippingInfo,
        toggleCart,
        toggleCheckout,
        toggleOrderConfirmation,
        setCurrentOrder,
        getTotals
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
