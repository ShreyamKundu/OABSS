// "use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
// import { Loader2, ExternalLink, ShoppingCart, Tag } from "lucide-react";
// import Link from "next/link";

const initialProducts = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 79.99,
    description: "High-quality sound with long battery life",
    image: "/images/earbuds.webp",
    badge: "Best Seller",
    keywords: [
      "earbuds",
      "headphones",
      "audio",
      "wireless",
      "sound",
      "music",
      "earphones",
    ],
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    description: "Track your fitness and stay connected",
    image: "/images/smartwatch.webp",
    badge: "New",
    keywords: [
      "watch",
      "smartwatch",
      "wearable",
      "fitness",
      "smart",
      "tracker",
      "digital",
    ],
  },
  {
    id: 3,
    name: "Analogue Watch",
    price: 799.99,
    description: "Track your fitness and stay connected",
    image: "/images/analogwatch.webp",
    badge: "New",
    keywords: [
      "watch",
      "smartwatch",
      "wearable",
      "fitness",
      "smart",
      "tracker",
      "digital",
    ],
  },
  {
    id: 4,
    name: "Portable Charger",
    price: 49.99,
    description: "Keep your devices powered on the go",
    image: "/images/charger.webp",
    badge: "Popular",
    keywords: [
      "charger",
      "power bank",
      "portable",
      "battery",
      "power",
      "charging",
    ],
  },
  {
    id: 5,
    name: "Puma Shoes",
    price: 99.99,
    description: "Puma shoes for Men",
    image:
      "https://imgs.search.brave.com/_BnlDaZtA_WxyJtMsKbOD2MKlc7URWkQ_2BRBIgLgIg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzUzLzU1LzQ0/LzM2MF9GXzY1MzU1/NDQ3OV9yZ1NnQkRC/TVlVcXNxMEk2WkNY/bDBSMXJuWHI2OHl0/cC5qcGc",
    badge: "New",
  },
];

const initialDeals = [
  {
    id: 1,
    name: "Summer Sale",
    discount: "20% off",
    description: "Get 20% off on all summer essentials",
    validUntil: "2024-08-31",
    keywords: ["summer", "sale", "discount", "seasonal", "hot", "deals"],
  },
  {
    id: 2,
    name: "Bundle and Save",
    discount: "Buy 2, Get 1 Free",
    description: "On selected electronics",
    validUntil: "2024-12-31",
    keywords: ["bundle", "electronics", "offer", "free", "savings"],
  },
  {
    id: 3,
    name: "Flash Sale",
    discount: "Up to 50% off",
    description: "Limited time offer on top brands",
    validUntil: "2024-07-15",
    keywords: ["flash", "sale", "limited", "discount", "offer", "deals"],
  },
];

const welcomeMessage = {
  text: "👋 Hi! I'm your AI shopping assistant. I can help you find products, compare prices, and discover great deals. What are you looking for today?",
  isUser: false,
  timestamp: new Date(),
};

const searchMappings = {
  watch: ["watch", "smartwatch", "wearable"],
  headphone: ["earbuds", "headphones", "earphones"],
  power: ["charger", "battery", "power bank"],
  deal: ["sale", "discount", "offer"],
  audio: ["earbuds", "headphones", "sound", "music"],
};

export default function Chatbox() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async () => {
    setIsTyping(true);
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500)
    );
    setIsTyping(false);
  };

  const findRelevantProducts = (query) => {
    const searchTerms = query.toLowerCase().split(" ");
    const productMatches = new Set();

    searchTerms.forEach((term) => {
      const cleanTerm = term.replace(/[.,!?]/g, "").trim();
      if (
        cleanTerm.length < 2 ||
        [
          "show",
          "me",
          "a",
          "the",
          "and",
          "or",
          "in",
          "on",
          "at",
          "to",
          "for",
          "of",
          "with",
          "by",
        ].includes(cleanTerm)
      ) {
        return;
      }

      const mappedTerms =
        Object.entries(searchMappings).find(
          ([key]) => cleanTerm.includes(key) || key.includes(cleanTerm)
        )?.[1] || [];

      initialProducts.forEach((product) => {
        const searchableText = [
          product.name.toLowerCase(),
          product.description.toLowerCase(),
          ...(product.keywords || []),
          ...mappedTerms,
        ].join(" ");

        if (
          searchableText.includes(cleanTerm) ||
          cleanTerm.includes(product.name.toLowerCase()) ||
          (product.keywords &&
            product.keywords.some(
              (keyword) =>
                keyword.includes(cleanTerm) || cleanTerm.includes(keyword)
            ))
        ) {
          productMatches.add(product);
        }
      });
    });

    return Array.from(productMatches);
  };

  const findRelevantDeals = (query) => {
    const searchTerms = query.toLowerCase().split(" ");
    const dealMatches = new Set();

    searchTerms.forEach((term) => {
      const cleanTerm = term.replace(/[.,!?]/g, "").trim();
      if (
        cleanTerm.length < 2 ||
        [
          "show",
          "me",
          "a",
          "the",
          "and",
          "or",
          "in",
          "on",
          "at",
          "to",
          "for",
          "of",
          "with",
          "by",
        ].includes(cleanTerm)
      ) {
        return;
      }

      initialDeals.forEach((deal) => {
        const searchableText = [
          deal.name.toLowerCase(),
          deal.description.toLowerCase(),
          ...(deal.keywords || []),
        ].join(" ");

        if (
          searchableText.includes(cleanTerm) ||
          cleanTerm.includes("deal") ||
          cleanTerm.includes("sale") ||
          cleanTerm.includes("discount")
        ) {
          dealMatches.add(deal);
        }
      });
    });

    return Array.from(dealMatches);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await simulateTyping();

      const relevantProducts = findRelevantProducts(input);
      const relevantDeals = findRelevantDeals(input);

      const aiMessage = {
        text: generateResponse(input, relevantProducts, relevantDeals),
        isUser: false,
        timestamp: new Date(),
        products: relevantProducts,
        deals: relevantDeals,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm sorry, I encountered an error. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (input, products, deals) => {
    const searchTerms = input.toLowerCase();

    if (
      searchTerms.includes("deal") ||
      searchTerms.includes("sale") ||
      searchTerms.includes("discount")
    ) {
      return deals.length > 0
        ? `I found some great deals that might interest you:\n\n${deals
            .map(
              (deal) =>
                `- ${deal.name}: ${deal.discount}\n  Valid Until: ${deal.validUntil}`
            )
            .join("\n\n")}`
        : "I couldn't find any deals right now. Please try again later.";
    } else if (products.length > 0) {
      return `I found the following products for you:\n\n${products
        .map(
          (product) =>
            `- ${product.name}: ${product.description} - $${product.price}\n  [Link](/products/${product.id})`
        )
        .join("\n\n")}`;
    } else {
      return "Sorry, I couldn't find anything related to your request. Try being more specific!";
    }
  };

  return (
    <div>
      <Card
        style={{
          backgroundColor: "#1a1a23",
          color: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <CardHeader
          title="AI Shopping Assistant"
          subheader="How can I assist you today?"
          subheaderTypographyProps={{ style: { color: "white" } }} // Change subheader color here
        />
        <CardContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  style={{
                    fontWeight: message.isUser ? "bold" : "normal",
                    marginBottom: "10px",
                  }}
                >
                  {message.text}
                </div>
                {message.products && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    {message.products.map((product) => (
                      <div
                        key={product.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          width={50}
                          style={{
                            borderRadius: "5px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                          }}
                        />
                        <span>{product.name}</span>
                        <span>{product.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                {message.deals && (
                  <div style={{ marginTop: "10px" }}>
                    {message.deals.map((deal) => (
                      <div key={deal.id} style={{ marginBottom: "5px" }}>
                        <span>{deal.name}</span>
                        <span style={{ fontWeight: "bold" }}>
                          {deal.discount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && <div style={{ color: "gray" }}>Typing...</div>}
            <div ref={messagesEndRef}></div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <TextField
              label="Type your message"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{
                input: { color: "white" }, // Input text color
                label: { color: "white" }, // Label text color
                ".MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", // Border color
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "gray", // Hover border color
                  },
              }}
            />
            <Button
              onClick={handleSend}
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{
                padding: "10px 20px",
                backgroundColor: "#6200ea", // Material Design purple color
                color: "white",
                "&:hover": {
                  backgroundColor: "#3700b3",
                },
              }}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
