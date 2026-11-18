import { useState, useEffect } from "react";
import { Link, Routes, Route, useSearchParams } from "react-router-dom";

import Filters from "./components/Filters";
import ProductList from "./components/ProductList";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";

import "./App.css";

const PRODUCTS_PER_PAGE = 8;

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "default");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("rating") || "");

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("productCart")) || [];
  });

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("productWishlist")) || [];
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/products/categories"
        );

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=0"
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        setProducts(data.products);
      } catch (error) {
        console.log(error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("productCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("productWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const query = search.trim().toLowerCase();

  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    const matchesCategory =
      category === "" || product.category === category;

    const matchesMinPrice =
      minPrice === "" || product.price >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" || product.price <= Number(maxPrice);

    const matchesRating =
      minRating === "" || product.rating >= Number(minRating);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesRating
    );
  });

  if (sort === "price-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sort === "name-asc") {
    filteredProducts.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    Math.max(totalPages, 1)
  );

  const startIndex =
    (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort !== "default") params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("rating", minRating);
    if (safeCurrentPage > 1) {
      params.set("page", String(safeCurrentPage));
    }

    setSearchParams(params, { replace: true });
  }, [
    search,
    category,
    sort,
    minPrice,
    maxPrice,
    minRating,
    safeCurrentPage,
    setSearchParams
  ]);

  const addToCart = (product) => {
    setCart((oldCart) => {
      const existingProduct = oldCart.find((item) => {
        return item.id === product.id;
      });

      if (existingProduct) {
        return oldCart.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1
            };
          }

          return item;
        });
      }

      return [...oldCart, { ...product, quantity: 1 }];
    });

    setToast("Added to cart");

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  const removeFromCart = (id) => {
    setCart((oldCart) => {
      return oldCart.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCart((oldCart) => {
      return oldCart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: quantity };
        }

        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((oldWishlist) => {
      const exists = oldWishlist.some((item) => {
        return item.id === product.id;
      });

      if (exists) {
        return oldWishlist.filter((item) => {
          return item.id !== product.id;
        });
      }

      return [...oldWishlist, product];
    });
  };

  const isFavorite = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const updateFilter = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("default");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setCurrentPage(1);
  };

  const cartCount = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const hasFilters =
    search.trim() !== "" ||
    category !== "" ||
    sort !== "default" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating !== "";

  const catalogPage = (
    <div className="container">
      <h1>Products</h1>

      <Filters
        search={search}
        onSearchChange={(value) => updateFilter(setSearch, value)}
        categories={categories}
        category={category}
        onCategoryChange={(value) =>
          updateFilter(setCategory, value)
        }
        sort={sort}
        onSortChange={(value) => updateFilter(setSort, value)}
        minPrice={minPrice}
        onMinPriceChange={(value) =>
          updateFilter(setMinPrice, value)
        }
        maxPrice={maxPrice}
        onMaxPriceChange={(value) =>
          updateFilter(setMaxPrice, value)
        }
        minRating={minRating}
        onRatingChange={(value) =>
          updateFilter(setMinRating, value)
        }
        onClear={clearFilters}
      />

      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>

          {hasFilters && (
            <button onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <ProductList
            products={visibleProducts}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            isFavorite={isFavorite}
          />

          <div className="pagination">
            <button
              onClick={() =>
                setCurrentPage(safeCurrentPage - 1)
              }
              disabled={safeCurrentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  className={
                    safeCurrentPage === page
                      ? "active-page"
                      : ""
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage(safeCurrentPage + 1)
              }
              disabled={safeCurrentPage === totalPages}
            >
              Next
            </button>
          </div>

          <p className="page-info">
            Page {safeCurrentPage} of {totalPages}
          </p>
        </>
      )}
    </div>
  );

  return (
    <>
      <header className="navbar">
        <Link
          className="logo"
          to="/products"
          onClick={() => setMenuOpen(false)}
        >
          ProductsHub
        </Link>

        <button
          className="hamburger-button"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? "line open" : "line"}></span>
          <span className={menuOpen ? "line open" : "line"}></span>
          <span className={menuOpen ? "line open" : "line"}></span>
        </button>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"}>
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
          >
            Wishlist
            <span className="nav-count">{wishlist.length}</span>
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
          >
            Cart
            <span className="nav-count">{cartCount}</span>
          </Link>
        </nav>
      </header>

      {toast && <div className="toast">{toast}</div>}

      <Routes>
        <Route path="/" element={catalogPage} />
        <Route path="/products" element={catalogPage} />

        <Route
          path="/products/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
            />
          }
        />

        <Route
          path="/wishlist"
          element={
            <div className="container">
              <h1>My Wishlist</h1>

              {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
              ) : (
                <ProductList
                  products={wishlist}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  isFavorite={isFavorite}
                />
              )}
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;