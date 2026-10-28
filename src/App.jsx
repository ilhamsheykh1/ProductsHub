import { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Filters from "./components/Filters";
import ProductList from "./components/ProductList";
import Cart from "./pages/Cart";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("productCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const productsResponse = await fetch(
          "https://dummyjson.com/products?limit=0"
        );

        const categoriesResponse = await fetch(
          "https://dummyjson.com/products/categories"
        );

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to load data");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData.products);
        setCategories(categoriesData);
      } catch (error) {
        setError("Could not load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("productCart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find((item) => {
        return item.id === product.id;
      });

      if (existingProduct) {
        return currentCart.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1
            };
          }

          return item;
        });
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1
        }
      ];
    });
  }

  function increaseQuantity(id) {
    setCart((currentCart) => {
      return currentCart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }

        return item;
      });
    });
  }

  function decreaseQuantity(id) {
    setCart((currentCart) => {
      return currentCart
        .map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity: item.quantity - 1
            };
          }

          return item;
        })
        .filter((item) => {
          return item.quantity > 0;
        });
    });
  }

  function removeFromCart(id) {
    setCart((currentCart) => {
      return currentCart.filter((item) => {
        return item.id !== id;
      });
    });
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const visibleProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      category === "" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "price-asc") {
    visibleProducts.sort((a, b) => {
      return a.price - b.price;
    });
  } else if (sort === "price-desc") {
    visibleProducts.sort((a, b) => {
      return b.price - a.price;
    });
  } else if (sort === "name-asc") {
    visibleProducts.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  return (
    <main className="app">
      <header className="navbar">
        <Link className="logo" to="/products">
          ProductsHub
        </Link>

        <nav className="nav-links">
          <Link to="/products">All Products</Link>
        </nav>

        <div className="nav-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>

        <Link className="cart-link" to="/cart">
          <span className="cart-icon">🛒</span>
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </Link>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <div className="shop-layout">
              <section className="catalog">
                <div className="catalog-heading">
                  <div>
                    <h1>All Products</h1>
                    <p>{visibleProducts.length} products found</p>
                  </div>

                  <select
                    className="sort-select"
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value);
                    }}
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>

                <Filters
                  search={search}
                  onSearchChange={setSearch}
                  category={category}
                  onCategoryChange={setCategory}
                  categories={categories}
                  sort={sort}
                  onSortChange={setSort}
                />

                {loading ? (
                  <p className="status-message">Loading products...</p>
                ) : error ? (
                  <p className="status-message error-message">{error}</p>
                ) : (
                  <ProductList
                    products={visibleProducts}
                    addToCart={addToCart}
                  />
                )}
              </section>
            </div>
          }
        />

        <Route
          path="/products"
          element={
            <div className="shop-layout">
              <section className="catalog">
                <div className="catalog-heading">
                  <div>
                    <h1>All Products</h1>
                    <p>{visibleProducts.length} products found</p>
                  </div>

                  <select
                    className="sort-select"
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value);
                    }}
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>

                <Filters
                  search={search}
                  onSearchChange={setSearch}
                  category={category}
                  onCategoryChange={setCategory}
                  categories={categories}
                  sort={sort}
                  onSortChange={setSort}
                />

                {loading ? (
                  <p className="status-message">Loading products...</p>
                ) : error ? (
                  <p className="status-message error-message">{error}</p>
                ) : (
                  <ProductList
                    products={visibleProducts}
                    addToCart={addToCart}
                  />
                )}
              </section>
            </div>
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />
      </Routes>
    </main>
  );
}

export default App;