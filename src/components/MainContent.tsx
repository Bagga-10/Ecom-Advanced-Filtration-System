import { useEffect, useState } from "react";
import axios from "axios";
import { useFilter } from "./FilterContext";
import BookCard from "./BookCard";
import { Tally3 } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";

const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter();

  interface Product {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
    category?: string;
    rating?: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${
      (currentPage - 1) * itemsPerPage
    }`;

    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    setLoading(true);
    setError(null);

    axios
      .get(url)
      .then((response) => {
        setProducts(response.data.products);
        setTotalProducts(response.data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch products.");
        setLoading(false);
      });
  }, [currentPage, keyword]);

  const getFilteredProducts = () => {
    let filteredProducts = products;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice);
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "expensive":
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      case "cheap":
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case "popular":
        return [...filteredProducts].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return filteredProducts;
    }
  };

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setDropdownOpen(false);
  };

  const getPaginationButtons = () => {
    const buttons: number[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage - 2 < 1) {
      endPage = Math.min(totalPages, endPage + (2 - (currentPage - 1)));
    }
    if (currentPage + 2 > totalPages) {
      startPage = Math.max(1, startPage - (2 - (totalPages - currentPage)));
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(page);
    }

    return buttons;
  };

  return (
    <section className="w-full max-w-6xl mx-auto p-5">
      <div className="mb-5">
        {/* Header + Filter */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="ml-70 text-2xl font-bold text-center mt-4 mb-6 text-gray-800 font-mono">
        Hi, I'm{" "}
        <span className="text-indigo-600 font-extrabold">Syed Farhan</span>
        {", "}
        <span className="text-black">
          <Typewriter
            words={[
              "Welcome to my Store!",
              "Explore the Collection.",
              "Find Your Next Read.",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </h1>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="border px-4 py-2 rounded-full flex items-center"
            >
              <Tally3 className="mr-2" />
              {filter === "all" ? "Filter" : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>

            {dropdownOpen && (
              <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full sm:w-40 z-10">
                {["cheap", "expensive", "popular"].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && <p className="mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-4">
          {filteredProducts.map((product) => (
            <BookCard
              key={product.id}
              id={product.id}
              title={product.title}
              image={product.thumbnail}
              price={product.price}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border px-4 py-2 mx-2 rounded-full"
          >
            Previous
          </button>

          <div className="flex flex-wrap justify-center">
            {getPaginationButtons().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`border px-4 py-2 mx-1 rounded-full ${
                  page === currentPage ? "bg-black text-white" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border px-4 py-2 mx-2 rounded-full"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default MainContent;
