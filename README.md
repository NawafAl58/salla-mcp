# Salla MCP Server

A Model Context Protocol (MCP) server for the Salla Merchant API, allowing AI agents to manage products in a Salla store.

## Features

- **List Products**: Fetch products from your Salla store.
- **Create Product**: Add new products with details like name, price, and type.
- **Update Product**: Modify existing product details by ID.

## Prerequisites

### 1. Get Salla Merchant API Access Token
To use this server, you need a Merchant Access Token from Salla:
1. Log in to the [Salla Partners Portal](https://partners.salla.sa/).
2. Create a new App or select an existing one.
3. In the App settings, find the **OAuth** section.
4. Generate a **Merchant Access Token** for your store.
5. Save this token; you will need it as the `SALLA_ACCESS_TOKEN` environment variable.

## Deployment to Vercel

Since this server uses standard I/O (Stdio), for web-based MCP platforms like Poke, it's best deployed as a web service. However, for Poke specifically, you can deploy this as a Node.js project.

1. **Push to GitHub**: (Already done for you!)
2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com/new).
   - Import this repository (`salla-mcp`).
   - In the **Environment Variables** section, add:
     - `SALLA_ACCESS_TOKEN`: Your Salla Merchant Access Token.
   - Click **Deploy**.

## Adding to Poke

To use this MCP server in Poke:
1. Go to [poke.com/integrations/new](https://poke.com/integrations/new).
2. Choose **MCP Connection**.
3. Enter a name (e.g., "Salla Store").
4. For the connection type, if using Vercel deployment, you may need to use the Vercel URL or a command-line bridge if running locally.
5. Provide the necessary configuration as prompted by the Poke integration interface.

## Local Development

1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file with `SALLA_ACCESS_TOKEN`.
4. Run `npm run dev`.
