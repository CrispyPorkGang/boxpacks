import { 
  User, InsertUser, 
  Category, InsertCategory,
  Product, InsertProduct,
  Sale, InsertSale,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  ChatMessage, InsertChatMessage
} from "@shared/schema";
import { randomBytes } from "crypto";
import createMemoryStore from "memorystore";
import session from "express-session";
import { hashPassword } from "./auth";

// Create the memory store for sessions
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Sale operations
  getAllSales(): Promise<Sale[]>;
  getActiveSales(): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  getSaleByProductId(productId: number): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale>;
  deleteSale(id: number): Promise<boolean>;
  
  // Order operations
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  
  // Order Item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Chat operations
  getUserChatMessages(userId: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private sales: Map<number, Sale>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private chatMessages: Map<number, ChatMessage>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private saleIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private chatMessageIdCounter: number;
  private orderNumberCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.sales = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.chatMessages = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.saleIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.chatMessageIdCounter = 1;
    this.orderNumberCounter = 2000;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add an admin user by default using an async IIFE
    (async () => {
      try {
        const hashedPassword = await hashPassword("admin123");
        const user = await this.createUser({
          email: "admin@boxpacks.com",
          username: "admin",
          password: hashedPassword,
          telegramHandle: "admin"
        });
        // Update to make admin
        const adminUser = { ...user, isAdmin: true };
        this.users.set(user.id, adminUser);
      } catch (error) {
        console.error("Failed to create admin user:", error);
      }
    })();
    
    // Add initial categories
    const categories = [
      { name: "Flowers", slug: "flowers" },
      { name: "Edibles", slug: "edibles" },
      { name: "Concentrates", slug: "concentrates" },
      { name: "Pre-rolls", slug: "pre-rolls" }
    ];
    
    categories.forEach(cat => this.createCategory(cat));
    
    // Add initial products
    const products = [
      {
        name: "Pink Acai",
        description: "Premium quality Pink Acai strain.",
        price: 650.00,
        images: ["https://images.unsplash.com/photo-1603909223429-69bb7909331c"],
        videos: [],
        categoryId: 1,
        sku: "BP1568",
        inventory: 10,
        weight: "1 lb"
      },
      {
        name: "Blue Dream",
        description: "High-grade Blue Dream strain.",
        price: 550.00,
        images: ["https://images.unsplash.com/photo-1581176780057-c6b5258ff5a0"],
        videos: [],
        categoryId: 1,
        sku: "BD4292",
        inventory: 15,
        weight: "1 lb"
      },
      {
        name: "Purple Haze",
        description: "Top-shelf Purple Haze strain.",
        price: 650.00,
        images: ["https://images.unsplash.com/photo-1567828711006-f38308ce2c25"],
        videos: [],
        categoryId: 1,
        sku: "PH7712",
        inventory: 8,
        weight: "1 lb"
      },
      {
        name: "Northern Lights",
        description: "Exceptional Northern Lights strain.",
        price: 600.00,
        images: ["https://images.unsplash.com/photo-1589884629108-3193400c7cc9"],
        videos: [],
        categoryId: 1,
        sku: "NL9021",
        inventory: 12,
        weight: "1 lb"
      }
    ];
    
    products.forEach(prod => this.createProduct(prod));
    
    // Add initial sales
    const sales = [
      {
        productId: 1,
        discountPercentage: 20,
        active: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        productId: 2,
        discountPercentage: 15,
        active: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        productId: 3,
        discountPercentage: 25,
        active: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ];
    
    sales.forEach(sale => this.createSale(sale));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { 
      ...user, 
      id, 
      isAdmin: false,
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      category => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { 
      ...category, 
      id, 
      createdAt: new Date() 
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    const updatedCategory: Category = { 
      ...existingCategory, 
      ...category 
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.categoryId === categoryId
    );
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      product => product.sku === sku
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const updatedProduct: Product = { 
      ...existingProduct, 
      ...product 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Sale operations
  async getAllSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getActiveSales(): Promise<Sale[]> {
    const now = new Date();
    return Array.from(this.sales.values()).filter(
      sale => sale.active && 
              sale.startDate <= now && 
              (!sale.endDate || sale.endDate >= now)
    );
  }

  async getSale(id: number): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async getSaleByProductId(productId: number): Promise<Sale | undefined> {
    const now = new Date();
    return Array.from(this.sales.values()).find(
      sale => sale.productId === productId && 
              sale.active && 
              sale.startDate <= now && 
              (!sale.endDate || sale.endDate >= now)
    );
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const id = this.saleIdCounter++;
    const newSale: Sale = { 
      ...sale, 
      id
    };
    this.sales.set(id, newSale);
    return newSale;
  }

  async updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale> {
    const existingSale = this.sales.get(id);
    if (!existingSale) {
      throw new Error(`Sale with ID ${id} not found`);
    }
    
    const updatedSale: Sale = { 
      ...existingSale, 
      ...sale 
    };
    this.sales.set(id, updatedSale);
    return updatedSale;
  }

  async deleteSale(id: number): Promise<boolean> {
    return this.sales.delete(id);
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      order => order.orderNumber === orderNumber
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const orderNumber = (this.orderNumberCounter++).toString();
    
    const newOrder: Order = { 
      ...order, 
      id, 
      orderNumber,
      createdAt: new Date() 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    const updatedOrder: Order = { 
      ...existingOrder, 
      status 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order Item operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { 
      ...orderItem, 
      id, 
      createdAt: new Date() 
    };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Chat operations
  async getUserChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageIdCounter++;
    const newMessage: ChatMessage = { 
      ...message, 
      id, 
      createdAt: new Date() 
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
