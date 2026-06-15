import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SALLA_API_BASE = "https://api.salla.sa/merchant/v2";
const ACCESS_TOKEN = process.env.SALLA_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error("SALLA_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

const sallaClient = axios.create({
  baseURL: SALLA_API_BASE,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const server = new Server(
  {
    name: "salla-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_products",
        description: "List products from the Salla store",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number" },
            per_page: { type: "number", description: "Products per page" },
          },
        },
      },
      {
        name: "create_product",
        description: "Create a new product in the Salla store",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Product name" },
            price: { type: "number", description: "Product price" },
            product_type: { type: "string", description: "Product type (e.g., food, service, digital, clothes)" },
            quantity: { type: "number", description: "Product quantity" },
            description: { type: "string", description: "Product description" },
          },
          required: ["name", "price", "product_type", "quantity"],
        },
      },
      {
        name: "update_product",
        description: "Update an existing product in the Salla store",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Product ID" },
            name: { type: "string", description: "Product name" },
            price: { type: "number", description: "Product price" },
            quantity: { type: "number", description: "Product quantity" },
          },
          required: ["id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_products": {
        const response = await sallaClient.get("/products", { params: args });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data) }],
        };
      }
      case "create_product": {
        const response = await sallaClient.post("/products", args);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data) }],
        };
      }
      case "update_product": {
        const { id, ...data } = args as any;
        const response = await sallaClient.put(`/products/${id}`, data);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data) }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.response?.data?.error?.message || error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Salla MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});