# Medusa v2 Plugin: Product Option Templates by Product Type

Make product options reusable. This Medusa Admin plugin lets you define option templates once per product type (e.g., Size, Color) and apply them to products with a click. It avoids repetitive data entry, skips options already present, and supports “Use” or “Use All” right inside the product page.

## Screenshots

### Product Type — Create & Manage Templates
![Product type — create and manage templates](https://i.postimg.cc/T1JDfmhs/Screenshot-2025-11-12-at-21-25-21.jpg)

### Product Detail — Apply with Use / Use All
![Product detail — apply templates with Use / Use All](https://i.postimg.cc/fyf9DXkv/Screenshot-2025-11-12-at-21-27-13.jpg)

## Install (local clone)
- This plugin isn’t published to npm yet. Clone the repo and follow the official guide for how link a local plugin to your Medusa application. https://docs.medusajs.com/learn/fundamentals/plugins/create
- After adding the plugin to your Medusa Application run the database migrations `npx medusa db:migrate`.