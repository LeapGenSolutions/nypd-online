import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Logo from "../src/assets/logo.png";
import processResponse from "./helpers/ProcessResponse";

export default function App() {
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = Number(import.meta.env.VITE_RESULTS_PER_PAGE); // Number of results per page

  useEffect(() => {
    if (!query) {
      setSearchActive(false);
      setFilteredResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSearchResults(query, currentPage);
    }, 500); // Debounce time of 500ms

    return () => clearTimeout(delayDebounce);
  }, [query, currentPage]);

  const fetchSearchResults = async (value, page) => {
    try {
      setLoading(true);
      const skip = (page - 1) * resultsPerPage; // Calculate skip for pagination
      const response = await axios.post(import.meta.env.VITE_SEARCH_API, {
        search: value,
        queryType: "full",
        searchMode: "all"
      }, {
        params: {
          "api-version": "2023-07-01-Preview",
          "Content-Type": "application/json",
          "$top": resultsPerPage, // Limit the number of results per page
          "$skip": skip, // Offset for pagination
        },
        headers: {
          "api-key": atob(import.meta.env.VITE_API_KEY),
          "Content-Type": "application/json",
        }
      });

      // Process the results as needed
      setFilteredResults(processResponse(response.data, value));

      // Capture the total number of results from the API response
      const totalResults = response.data["@odata.count"];
      setTotalResults(1000); // Store total number of results

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setSearchActive(e.target.value.length > 0);
    setCurrentPage(1); // Reset to the first page on query change
  };

  const handleNextPage = () => {
    if (currentPage * resultsPerPage < totalResults) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageJump = (e) => {
    const pageNum = parseInt(e.target.value);
    if (pageNum > 0 && pageNum <= Math.ceil(totalResults / resultsPerPage)) {
      setCurrentPage(pageNum);
    }
  };

  const navItems = ["Services", "Statistics & Dashboard", "Personnel", "Careers"];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="text-white py-4 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8" />
        </div>
      </header>

      {/* Search Bar */}
      <div className="w-full flex flex-col items-center px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: searchActive ? 0 : 100, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full flex flex-col items-center ${searchActive ? "mt-2" : "mt-8"}`}
        >
          <h1 className="w-full max-w-lg text-[30px] font-bold mb-5">
            TRAIL DECISIONS LIBRARY SEARCH
            <p className="text-[18px] leading-[1.5] mb-3 mt-5 font-normal">
              Search below for decisions by entering names, keywords, or phrases
            </p>
            <p className="text-[18px] leading-[1.5] font-normal">
              The library is updated monthly and contains trail decisions involving members of service of all ranking dating back to 2008
            </p>
          </h1>
          <input
            type="text"
            placeholder="Search files..."
            value={query}
            onChange={handleSearchChange}
            className="px-4 py-2 w-full max-w-lg border rounded-lg shadow-sm focus:ring focus:ring-blue-300 transition"
          />
        </motion.div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
        </div>
      )}

      {/* Results */}
      {searchActive && !loading && (
        <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-lg rounded-lg">
          {filteredResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredResults.map((file, index) => (
                <li key={index} className="p-4 hover:bg-gray-100 transition">
                  <a
                    href={file.LinktoTheFile}
                    target="_blank"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {file.FileName}
                  </a>
                  <p className="text-gray-700">
                    <b>Date: {file.Date} | Officer: {file.OfficerName}</b>
                  </p>
                  <p className="text-sm text-gray-500">
                    {file.FileContent}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No results found.</p>
          )}

          {/* Pagination Controls */}
          {totalResults > resultsPerPage && (
            <div className="flex justify-between mt-4 items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>

              {/* Page Jump Input */}
              <div className="flex items-center space-x-2">
                <label htmlFor="pageInput" className="text-sm text-gray-600">Page:</label>
                <input
                  id="pageInput"
                  type="number"
                  value={currentPage}
                  min="1"
                  max={Math.ceil(totalResults / resultsPerPage)}
                  onChange={handlePageJump}
                  className="w-16 text-center px-2 py-1 border rounded-lg"
                />
                <span className="text-sm text-gray-600">{`of ${Math.ceil(totalResults / resultsPerPage)}`}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage * resultsPerPage >= totalResults}
                className="px-4 py-2 bg-blue-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
