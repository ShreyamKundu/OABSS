require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require("./routes/Address");
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");
const connectToDB = require("./database/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const timeout = require("connect-timeout");

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Server initialization
const server = express();

// Database connection
connectToDB();


// CORS Configuration
const corsOptions = {
  origin: "https://oabss-ten.vercel.app", // Allow requests from your frontend
  credentials: true, // Enable cookies/credentials
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  exposedHeaders: ["X-Total-Count"], // Headers exposed to the client
};
server.use(cors(corsOptions));

// Logging and parsers
server.use(morgan("tiny")); // Log requests
server.use(express.json()); // Parse JSON payloads
server.use(cookieParser()); // Parse cookies

// Handle request timeouts (prevent 504 Gateway Timeout errors)
server.use(timeout("30s")); // Adjust timeout duration
server.use((req, res, next) => {
  if (!req.timedout) next();
});

// Debug Middleware for Incoming Requests (use for troubleshooting)
server.use((req, res, next) => {
  console.log("Incoming Request:");
  console.log("Origin:", req.headers.origin);
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  next();
});

// Route Middleware
server.use("/auth", authRoutes);
server.use("/users", userRoutes);
server.use("/products", productRoutes);
server.use("/orders", orderRoutes);
server.use("/cart", cartRoutes);
server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/address", addressRoutes);
server.use("/reviews", reviewRoutes);
server.use("/wishlist", wishlistRoutes);

// Default Route
server.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Chat API Route for Gemini AI
server.post("/api/chat", async (req, res) => {
  try {
    const { message, products, deals } = req.body;

    const context = `
You are a helpful shopping assistant. Respond naturally to help customers find products and deals.
Available products and deals are:

Products:
${products.map((p) => `- ${p.name}: $${p.price} - ${p.description}`).join("\n")}

Deals:
${deals.map((d) => `- ${d.name}: ${d.discount} - ${d.description}`).join("\n")}

User query: ${message}

Important: Your response should help the customer find relevant products or deals based on their query.
If they ask about specific products, recommend matching items from the available products.
If they ask about deals or discounts, share relevant deals.

Format your response with a conversational message followed by ###JSON### and a JSON object containing:
{
  "text": "Your conversational response",
  "products": [array of product IDs that match the query],
  "deals": [array of deal IDs that match the query]
}`;

    // Generate the response using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(context);
    const response = result.response.text();

    const jsonMatch = response.match(/###JSON###\s*({[\s\S]*})/);

    if (!jsonMatch) {
      return res.json({
        text: "I understand your question, but let me try to provide a better response. Could you rephrase your question?",
      });
    }

    try {
      const parsedResponse = JSON.parse(jsonMatch[1]);

      const chatResponse = {
        text: parsedResponse.text,
        products: parsedResponse.products
          ? products.filter((p) => parsedResponse.products.includes(p.id))
          : [],
        deals: parsedResponse.deals
          ? deals.filter((d) => parsedResponse.deals.includes(d.id))
          : [],
      };

      return res.json(chatResponse);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return res.json({
        text: "I understand your question, but I had trouble processing the response. Could you try asking in a different way?",
      });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      text: "I'm having trouble connecting right now. Please try again in a moment.",
    });
  }
});

// Handle Preflight OPTIONS Requests
server.options("*", cors(corsOptions));

// Start the server
server.listen(8000, () => {
  console.log("Server [STARTED] ~ https://oabss.vercel.app/");
});
