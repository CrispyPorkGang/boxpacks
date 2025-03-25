import { pgTable, text, serial, integer, boolean, jsonb, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  telegramHandle: text("telegram_handle"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true,
  isAdmin: true
});

// Category Schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertCategorySchema = createInsertSchema(categories).omit({ 
  id: true,
  createdAt: true
});

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  images: jsonb("images").$type<string[]>(),
  videos: jsonb("videos").$type<string[]>(),
  categoryId: integer("category_id").references(() => categories.id),
  sku: text("sku").notNull().unique(),
  inventory: integer("inventory").default(0),
  weight: text("weight").default("1 lb"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertProductSchema = createInsertSchema(products).omit({ 
  id: true,
  createdAt: true
});

// Sales Schema
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  active: boolean("active").default(true).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date")
});

export const insertSaleSchema = createInsertSchema(sales).omit({ 
  id: true
});

// Order Schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  totalAmount: doublePrecision("total_amount").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  shippingCost: doublePrecision("shipping_cost").notNull(),
  paymentFee: doublePrecision("payment_fee").notNull(),
  paymentMethod: text("payment_method").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertOrderSchema = createInsertSchema(orders).omit({ 
  id: true,
  createdAt: true,
  orderNumber: true
});

// Order Items Schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  sku: text("sku").notNull(),
  weight: text("weight").default("1 lb"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ 
  id: true,
  createdAt: true
});

// Address Type for Orders
export const addressSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string()
});

// Payment Method Type
export const paymentMethodSchema = z.enum([
  "zelle", 
  "cashapp", 
  "chime", 
  "btc", 
  "usdt", 
  "venmo"
]);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// Cart Item Type (not stored in DB, just for frontend)
export const cartItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().default(1),
  sku: z.string(),
  weight: z.string().default("1 lb"),
  image: z.string().optional()
});

// Chat Message Schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  fromUser: boolean("from_user").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ 
  id: true,
  createdAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Address = z.infer<typeof addressSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
