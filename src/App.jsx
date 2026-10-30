import { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useSearchParams
} from "react-router-dom";

import Filters from "./components/Filters";
import ProductList from "./components/ProductList";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

import "./App.css";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState(
    searchParams.get("sort") || "default"
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get("min") || ""
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("max") || ""
  );

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

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("productWishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      return [];
    }
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const productsResponse = await fetch("https://dummyjson.com/products?limit=0");

        const categoriesResponse = await fetch("https://dummyjson.com/products/categories");

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to load data");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData.products);
        setCategories(categoriesData);
      } catch (error) {
        console.log(error);
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

  useEffect(() => {
    localStorage.setItem("productWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setSort(searchParams.get("sort") || "default");
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  function updateFilters(newFilters) {
    const params = new URLSearchParams();

    if (newFilters.search) {
      params.set("search", newFilters.search);
    }

    if (newFilters.category) {
      params.set("category", newFilters.category);
    }

    if (newFilters.sort && newFilters.sort !== "default") {
      params.set("sort", newFilters.sort);
    }

    if (newFilters.minPrice !== "") {
      params.set("min", newFilters.minPrice);
    }

    if (newFilters.maxPrice !== "") {
      params.set("max", newFilters.maxPrice);
    }

    setSearchParams(params, { replace: true });
  }

  function handleSearchChange(value) {
    setSearch(value);

    updateFilters({
      search: value,
      category: category,
      sort: sort,
      minPrice: minPrice,
      maxPrice: maxPrice
    });
  }

  function handleCategoryChange(value) {
    setCategory(value);

    updateFilters({
      search: search,
      category: value,
      sort: sort,
      minPrice: minPrice,
      maxPrice: maxPrice
    });
  }

  function handleSortChange(value) {
    setSort(value);

    updateFilters({
      search: search,
      category: category,
      sort: value,
      minPrice: minPrice,
      maxPrice: maxPrice
    });
  }

  function handleMinPriceChange(value) {
    setMinPrice(value);

    updateFilters({
      search: search,
      category: category,
      sort: sort,
      minPrice: value,
      maxPrice: maxPrice
    });
  }

  function handleMaxPriceChange(value) {
    setMaxPrice(value);

    updateFilters({
      search: search,
      category: category,
      sort: sort,
      minPrice: minPrice,
      maxPrice: value
    });
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setSort("default");
    setMinPrice("");
    setMaxPrice("");

    setSearchParams({}, { replace: true });
  }

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

    setToast("Added to cart");
  }

  useEffect(() => {
    if (toast === "") {
      return;
    }

    const timer = setTimeout(() => {
      setToast("");
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

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

  function toggleWishlist(product) {
    setWishlist((currentWishlist) => {
      const isFavorite = currentWishlist.some((item) => {
        return item.id === product.id;
      });

      if (isFavorite) {
        return currentWishlist.filter((item) => {
          return item.id !== product.id;
        });
      }

      return [...currentWishlist, product];
    });
  }

  function isFavorite(id) {
    return wishlist.some((item) => {
      return item.id === id;
    });
  }

  const visibleProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesCategory =
      category === "" || product.category === category;

    const matchesMinPrice =
      minPrice === "" || product.price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || product.price <= Number(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice
    );
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

  const cartCount = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const catalogPage = (
    <div className="shop-layout">
      <section className="catalog">
        <div className="catalog-heading">
          <div>
            <h1>All Products</h1>
            <p>{visibleProducts.length} products found</p>
          </div>
        </div>

        <Filters
          search={search}
          onSearchChange={handleSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          sort={sort}
          onSortChange={handleSortChange}
          minPrice={minPrice}
          onMinPriceChange={handleMinPriceChange}
          maxPrice={maxPrice}
          onMaxPriceChange={handleMaxPriceChange}
          onClear={clearFilters}
        />

        {loading ? (
          <p className="status-message">Loading products...</p>
        ) : error ? (
          <p className="status-message error-message">{error}</p>
        ) : (
          <ProductList
            products={visibleProducts}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            isFavorite={isFavorite}
          />
        )}
      </section>
    </div>
  );

  return (
    <main className="app">
      <header className="navbar">
        <Link className="logo" to="/products">
          ProductsHub
        </Link>

        <nav className="nav-links">
          <Link to="/products">All Products</Link>

          <Link to="/wishlist">
            Wishlist ({wishlist.length})
          </Link>
        </nav>

        <div className="nav-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => {
              handleSearchChange(event.target.value);
            }}
          />
        </div>

        <Link className="cart-link" to="/cart">
          <span className="cart-icon">🛒</span>
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </Link>
      </header>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      <Routes>
        <Route path="/" element={catalogPage} />

        <Route path="/products" element={catalogPage} />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
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

        <Route
          path="/wishlist"
          element={
            <section className="catalog wishlist-page">
              <h1>My Wishlist</h1>

              <ProductList
                products={wishlist}
                addToCart={addToCart}
                toggleWishlist={toggleWishlist}
                isFavorite={isFavorite}
              />
            </section>
          }
        />
      </Routes>
    </main>
  );
}

export default App;