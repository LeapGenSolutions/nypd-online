import { useState } from "react";
import { motion } from "framer-motion";
import TestData from "./assets/testData.json";
import Logo from "../src/assets/logo.png";

export default function App() {
  const [query, setQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearchActive(value.length > 0);
    if (value.length > 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const filteredResults = TestData.filter(
    (item) =>
      item.FileName.toLowerCase().includes(query.toLowerCase()) ||
      item.OfficerName.toLowerCase().includes(query.toLowerCase())
  );

  const navItems = ["Services", "Statics & Dashboard",
    "Personnel", "Careers"
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="text-white py-4 px-6 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-8" />
        </div>
        <nav>
          <ul className="flex space-x-4">
            {navItems.map(navItem =>
              <a
                href="#"
                className="text-black px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-[#005cb8] hover:text-white"
              >
                {navItem}
              </a>
            )}

          </ul>
        </nav>
      </header>

      {/* Search Bar */}
      <div className="w-full flex flex-col items-center px-4">
        {/* Header Title */}

        {/* Search Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: searchActive ? 0 : 100, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`w-full flex flex-col items-center ${searchActive ? "mt-2" : "mt-8"}`}
        >
        <h2 className="text-xl font-bold mb-10 mt-5 text-gray-1600">TRAIL DECISIONS LIBRARY</h2>
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
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {file.FileName}
                  </a>
                  <p className="text-sm text-gray-500">
                    Date: {file.Date} | Officer: {file.OfficerName}
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
