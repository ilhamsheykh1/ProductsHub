import ProductCard from "./ProductCard";

type Product = {
    id: number;
    title: string;
    thumbnail: string;
    brand?: string;
    category: string;
    rating: number;
    price: number;
};

type ProductListProps = {
    products: Product[];
    addToCart: (product: Product) => void;
    toggleWishlist: (product: Product) => void;
    isFavorite: (id: number) => boolean;
};

function ProductList(props: ProductListProps) {
  if (props.products.length === 0) {
    return (
      <p className="no-products">
        No products found. Try changing your search or filters.
      </p>
    );
  }

  return (
    <div className="products-grid">
      {props.products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={props.addToCart}
          toggleWishlist={props.toggleWishlist}
          isFavorite={props.isFavorite}
        />
      ))}
    </div>
  );
}

export default ProductList;