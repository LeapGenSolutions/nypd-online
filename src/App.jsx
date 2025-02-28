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

  useEffect(() => {
    if (!query) {
      setSearchActive(false);
      setFilteredResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchSearchResults(query);
    }, 500); // Debounce time of 500ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSearchResults = async (value) => {
    try {
      setLoading(true);
      // const response = await axios.get(import.meta.env.VITE_SEARCH_API, {
      const response = await axios.post(import.meta.env.VITE_SEARCH_API, {
        "search": value,
        "queryType": "full",
        "searchMode": "all"
      }, {
        params: {
          "api-version": "2023-07-01-Preview",
          "Content-Type": "application/json",
        },
        headers: {
          "api-key": atob(import.meta.env.VITE_API_KEY),
          "Content-Type": "application/json",
        }
      });

      setFilteredResults(processResponse(response.data, value));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setSearchActive(e.target.value.length > 0);
  };

  const navItems = ["Services", "Statistics & Dashboard", "Personnel", "Careers"];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="text-white py-4 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8" />
        </div>
        {/* <nav>
          <ul className="flex space-x-4">
            {navItems.map((navItem, index) => (
              <a
                key={index}
                href="#"
                className="text-black px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-[#005cb8] hover:text-white"
              >
                {navItem}
              </a>
            ))}
          </ul>
        </nav> */}
      </header>

      {/* Search Bar */}
      <div className="w-full flex flex-col items-center px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: searchActive ? 0 : 100, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full flex flex-col items-center ${searchActive ? "mt-2" : "mt-8"}`}
        >
          <h5 className="w-full max-w-lg font-extrabold mb-8 mt-6 text-[rgb(0,92,184)] leading-relaxed">
            The <span className="underline">NYPD Trial Library</span> is now searchable.
            Find trial decisions by entering <span className="italic">names, keywords, or phrases</span> below.
            <br /><br />
            Updated monthly, the library contains trial decisions involving uniformed service members of all ranks,
            prosecuted by both the <span className="font-semibold">Department Advocate's Office</span> and the
            <span className="font-semibold"> Civilian Complaint Review Board</span>, dating back to <span className="text-black">2008</span>.
          </h5>
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
                    href={file.LinktoTheFile} target="_blank"
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
        </div>
      )}
    </div>
  );
}
