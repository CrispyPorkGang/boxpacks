import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import TelegramBot from "node-telegram-bot-api";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { uploadImage, uploadVideo } from "./upload";
import { 
  insertProductSchema, 
  insertCategorySchema,
  insertSaleSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertChatMessageSchema,
  Product
} from "@shared/schema";

// Setup Telegram bot if token is provided
let bot: TelegramBot | null = null;
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_TELEGRAM_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID;

if (TELEGRAM_TOKEN) {
  try {
    bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
    console.log("Telegram bot initialized successfully");
    
    // Setup message handler
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      
      // Handle admin messages and forward to clients
      if (chatId.toString() === ADMIN_TELEGRAM_CHAT_ID) {
        // This message is from the admin, forward to the client
        const match = msg.text?.match(/^@([a-zA-Z0-9_]+):\s*(.+)$/);
        if (match) {
          const username = match[1];
          const messageText = match[2];
          
          // Find the user by telegram handle
          storage.getUserByUsername(username).then(user => {
            if (user) {
              // Store the message
              storage.addChatMessage({
                userId: user.id,
                message: messageText,
                fromUser: false
              });
              
              // Broadcast to WebSocket clients
              wss.clients.forEach((client: any) => {
                if (client.readyState === WebSocket.OPEN && client.userId === user.id) {
                  client.send(JSON.stringify({
                    type: 'chat',
                    message: {
                      text: messageText,
                      fromUser: false,
                      timestamp: new Date().toISOString()
                    }
                  }));
                }
              });
            }
          });
        }
      } else {
        // Echo the message back to the user
        bot.sendMessage(chatId, `Your chat ID: ${chatId}`);
      }
    });
  } catch (error) {
    console.error("Failed to initialize Telegram bot:", error);
  }
}

// Setup WebSocket for real-time chat
let wss: WebSocketServer;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Create the HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server on a specific path to avoid conflicts with Vite
  wss = new WebSocketServer({ 
    server: httpServer,
    path: '/api/ws'
  });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', async (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'auth' && data.userId) {
          (ws as any).userId = data.userId;
          
          // Send history messages
          const messages = await storage.getUserChatMessages(data.userId);
          ws.send(JSON.stringify({
            type: 'history',
            messages: messages.map(msg => ({
              id: msg.id,
              text: msg.message,
              fromUser: msg.fromUser,
              timestamp: msg.createdAt.toISOString()
            }))
          }));
        }
        
        if (data.type === 'chat' && data.message && (ws as any).userId) {
          const userId = (ws as any).userId;
          
          // Save message to storage
          const chatMessage = await storage.addChatMessage({
            userId,
            message: data.message,
            fromUser: true
          });
          
          // Send message to admin via Telegram
          const user = await storage.getUser(userId);
          if (bot && ADMIN_TELEGRAM_CHAT_ID && user) {
            bot.sendMessage(
              ADMIN_TELEGRAM_CHAT_ID, 
              `Message from ${user.username}:\n${data.message}`
            );
          }
          
          // Send auto-response
          setTimeout(async () => {
            const autoResponse = "Thanks for your message! Our team will get back to you shortly. In the meantime, feel free to contact us directly via Signal or Telegram for faster assistance.";
            
            // Save auto-response to storage
            await storage.addChatMessage({
              userId,
              message: autoResponse,
              fromUser: false
            });
            
            // Send to client
            ws.send(JSON.stringify({
              type: 'chat',
              message: {
                text: autoResponse,
                fromUser: false,
                timestamp: new Date().toISOString()
              }
            }));
          }, 1000);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    // Only allow authenticated users or public image access
    if (req.isAuthenticated() || req.path.startsWith('/images/')) {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }, express.static(path.join(process.cwd(), 'uploads')));

  // ===== FILE UPLOAD ROUTES =====
  // Image upload endpoint
  app.post("/api/upload/image", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      // Use multer to handle the file upload
      uploadImage.single('image')(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No image file uploaded" });
        }

        // Return the file path to be stored in the product
        const filePath = `/uploads/images/${req.file.filename}`;
        res.json({ url: filePath });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Video upload endpoint
  app.post("/api/upload/video", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      // Use multer to handle the file upload
      uploadVideo.single('video')(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No video file uploaded" });
        }

        // Return the file path to be stored in the product
        const filePath = `/uploads/videos/${req.file.filename}`;
        res.json({ url: filePath });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload video" });
    }
  });
  
  // ===== CATEGORY ROUTES =====
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    
    try {
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(parseInt(id), validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    
    try {
      const success = await storage.deleteCategory(parseInt(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // ===== PRODUCT ROUTES =====
  app.get("/api/products", async (req, res) => {
    try {
      let products = await storage.getAllProducts();
      const activeSales = await storage.getActiveSales();
      
      // Attach sale information to products
      products = await Promise.all(products.map(async (product) => {
        const sale = activeSales.find(s => s.productId === product.id);
        return {
          ...product,
          sale: sale ? {
            id: sale.id,
            discountPercentage: sale.discountPercentage,
            salePrice: product.price * (1 - sale.discountPercentage / 100)
          } : null
        };
      }));
      
      // Filter by category if provided
      const categoryId = req.query.categoryId 
        ? parseInt(req.query.categoryId as string) 
        : null;
        
      if (categoryId) {
        products = products.filter(p => p.categoryId === categoryId);
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      const product = await storage.getProduct(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Check for active sale
      const sale = await storage.getSaleByProductId(product.id);
      
      const productWithSale = {
        ...product,
        sale: sale ? {
          id: sale.id,
          discountPercentage: sale.discountPercentage,
          salePrice: product.price * (1 - sale.discountPercentage / 100)
        } : null
      };
      
      res.json(productWithSale);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    
    try {
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(parseInt(id), validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    
    try {
      const success = await storage.deleteProduct(parseInt(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // ===== SALE ROUTES =====
  app.get("/api/sales", async (req, res) => {
    try {
      let sales = await storage.getAllSales();
      
      // Include product info
      sales = await Promise.all(sales.map(async (sale) => {
        const product = await storage.getProduct(sale.productId);
        return {
          ...sale,
          product: product || null
        };
      }));
      
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  });

  app.get("/api/sales/active", async (req, res) => {
    try {
      let sales = await storage.getActiveSales();
      
      // Include product info
      sales = await Promise.all(sales.map(async (sale) => {
        const product = await storage.getProduct(sale.productId);
        return {
          ...sale,
          product: product || null
        };
      }));
      
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active sales" });
    }
  });

  app.post("/api/sales", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      const validatedData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(validatedData);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create sale" });
    }
  });

  app.put("/api/sales/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    
    try {
      const validatedData = insertSaleSchema.partial().parse(req.body);
      const sale = await storage.updateSale(parseInt(id), validatedData);
      res.json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update sale" });
    }
  });

  app.delete("/api/sales/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    
    try {
      const success = await storage.deleteSale(parseInt(id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Sale not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete sale" });
    }
  });

  // ===== ORDER ROUTES =====
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      let orders;
      
      if (req.user.isAdmin) {
        // Admin can see all orders
        orders = await storage.getAllOrders();
      } else {
        // Regular users can only see their own orders
        orders = await storage.getUserOrders(req.user.id);
      }
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        return {
          ...order,
          items
        };
      }));
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    
    try {
      const order = await storage.getOrder(parseInt(id));
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Check if user is authorized to view this order
      if (!req.user.isAdmin && order.userId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Get order items
      const items = await storage.getOrderItems(order.id);
      
      res.json({
        ...order,
        items
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      // Validate order data
      const validatedOrderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Create the order
      const order = await storage.createOrder(validatedOrderData);
      
      // Create order items
      if (Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const validatedItemData = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          
          await storage.createOrderItem(validatedItemData);
        }
      }
      
      // Get the complete order with items
      const items = await storage.getOrderItems(order.id);
      
      // Notify admin of new order via Telegram
      if (bot && ADMIN_TELEGRAM_CHAT_ID) {
        const orderSummary = `
🛒 NEW ORDER #${order.orderNumber}

From: ${req.user.username} (${req.user.email})
Total Amount: $${order.totalAmount.toFixed(2)}
Shipping Method: ${order.shippingMethod}
Payment Method: ${order.paymentMethod}
Payment Fee: $${order.paymentFee.toFixed(2)}
        `;
        
        bot.sendMessage(ADMIN_TELEGRAM_CHAT_ID, orderSummary);
      }
      
      res.status(201).json({
        ...order,
        items
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    
    try {
      const order = await storage.updateOrderStatus(parseInt(id), status);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // ===== CHAT ROUTES =====
  app.get("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const messages = await storage.getUserChatMessages(req.user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        userId: req.user.id,
        fromUser: true
      });
      
      const message = await storage.addChatMessage(validatedData);
      
      // Forward to Telegram
      if (bot && ADMIN_TELEGRAM_CHAT_ID) {
        bot.sendMessage(
          ADMIN_TELEGRAM_CHAT_ID, 
          `Message from ${req.user.username}:\n${req.body.message}`
        );
      }
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  return httpServer;
}
