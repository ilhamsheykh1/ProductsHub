# ProductsHub 🛍️

ProductsHub is a simple online shopping application built with React and JavaScript. It allows users to browse products, search by name, filter by category, sort products, and manage a shopping cart.

## Features

- Fetch products and categories from the DummyJSON API
- Search products by name
- Filter products by category
- Sort products by price or name
- Add products to the shopping cart
- Increase or decrease product quantities
- Remove individual products or clear the entire cart
- Save cart data in localStorage
- Navigate between the product catalog and shopping cart using React Router
- Handle loading states and API errors

## Technologies Used

- React
- JavaScript (ES6+)
- React Hooks 
- React Router DOM
- Fetch API and Async/Await
- localStorage
- CSS
- DummyJSON API

## Project Structure

- `App.jsx` — Main application component that manages products, filters, sorting, cart state, API requests, and routing.
- `Filters.jsx` — Handles product search and category filtering.
- `ProductList.jsx` — Displays the list of products and provides the add-to-cart functionality.
- `Cart.jsx` — Displays cart items, quantities, prices, and order summary.
- `App.css` — Contains the application's styling and responsive layout.

## Screenshots



## Getting Started

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## API

Product data and categories are provided by [DummyJSON](https://dummyjson.com/).

## Purpose

This project was created to practice React fundamentals, component-based architecture, state management, API integration, array methods, event handling, routing, and browser storage.
