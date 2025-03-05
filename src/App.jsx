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
  const [selectedYear, setSelectedYear] = useState("All");
  const resultsPerPage = Number(import.meta.env.VITE_RESULTS_PER_PAGE);

  useEffect(() => {
    if (!query) {
      setSearchActive(false);
      setFilteredResults([]);
      return;
    }

    // const delayDebounce = setTimeout(() => {
      
    // }, 1500);

    // return () => clearTimeout(delayDebounce);
  }, [query, currentPage]);

  const fetchSearchResults = async (value, page) => {
    try {
      setSelectedYear("All")
      setLoading(true);
      const skip = (page - 1) * resultsPerPage;
      const response = await axios.post(import.meta.env.VITE_SEARCH_API, {
        search: value,
        queryType: "full",
        searchMode: "all",
        count: true
      }, {
        params: {
          "api-version": "2023-07-01-Preview",
          "Content-Type": "application/json",
          "$top": resultsPerPage,
          "$skip": skip,
        },
        headers: {
          "api-key": atob(import.meta.env.VITE_API_KEY),
          "Content-Type": "application/json",
        }
      });

      const processedData = processResponse(response.data, value);
      setFilteredResults(processedData);
      setTotalResults(response.data["@odata.count"]);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    // setSearchActive(e.target.value.length > 0);
    setCurrentPage(1); // Reset to the first page on query change
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      fetchSearchResults(query, currentPage);
      setSearchActive(true)
    }
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

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Extract unique years from search results
  const uniqueYears = [
    "All",
    ...Array.from(new Set(filteredResults.map(item => item.Date?.split(", ")[1])))
  ];

  // Filter results based on selected year
  const displayedResults = selectedYear === "All"
    ? filteredResults
    : filteredResults.filter(item => item.Date?.includes(selectedYear));

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="text-white py-4 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8" />
        </div>
      </header>

      <div className="w-full flex flex-col items-center px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: searchActive ? 0 : 100, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full flex flex-col items-center ${searchActive ? "mt-2" : "mt-8"}`}
        >
          <h1 className="w-full max-w-lg text-[30px] font-bold mb-5">
            TRIAL DECISIONS LIBRARY SEARCH
            <p className="text-[18px] leading-[1.5] mb-3 mt-5 font-normal">
              Search below for decisions by entering names, keywords, or phrases
            </p>
            <p className="text-[18px] leading-[1.5] font-normal">
              The library is updated monthly and contains trial decisions involving members of service of all ranking dating back to 2008
            </p>
          </h1>
          <input
            type="text"
            placeholder="Search files..."
            value={query}
            onChange={handleSearchChange}
            className="px-4 py-2 w-full max-w-lg border rounded-lg shadow-sm focus:ring focus:ring-blue-300 transition"
          />
          <button 
              onClick={handleSearchClick} 
              disabled={loading}
              className="px-4 py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Search
            </button>
        </motion.div>
      </div>

      {/* Optimized Search Banner */}
      {searchActive && totalResults > 500 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 shadow-md rounded-lg"
        >
          <h2 className="text-lg font-semibold">🔍 Optimize Your Search!</h2>
          <p className="text-sm">
            Your search is too broad and returned over <b>500 results</b>.
            Try refining your keywords for more precise results.
          </p>
        </motion.div>
      )}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
        </div>
      )}
      {/* Year Filter Dropdown */}
      {uniqueYears.length > 1 && !loading && totalResults < 500 && (
        <div className="max-w-4xl mx-auto mt-4">
          <label htmlFor="yearFilter" className="mr-2 text-gray-700 font-medium">Filter by Year:</label>
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={handleYearChange}
            className="px-3 py-2 border rounded-md shadow-sm text-gray-700"
          >
            {uniqueYears.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}


      {/* Search Results */}
      {searchActive && !loading && totalResults < 500 && (
        <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow-lg rounded-lg">
          {displayedResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {displayedResults.map((file, index) => (
                <li key={index} className="p-4 hover:bg-gray-100 transition">
                  <a href={file.LinktoTheFile} target="_blank" className="text-blue-600 font-semibold hover:underline">
                    {file.FileName}
                  </a>
                  <p className="text-gray-700">
                    <b>Date: {file.Date} | Officer: {file.OfficerName}</b>
                  </p>
                  <p className="text-sm text-gray-500">{file.FileContent}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No results found for {selectedYear}.</p>
          )}
        </div>
      )}
    </div>
  );
}
