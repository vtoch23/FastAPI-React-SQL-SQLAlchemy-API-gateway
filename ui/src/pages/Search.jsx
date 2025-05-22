import { useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_API_URL;

export default function SearchByName() {
  const [firstName, setFirstName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`${baseUrl}/get-name?first_name=${encodeURIComponent(firstName)}`, {
        headers: { "api-key": apiKey }
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Failed to fetch");
      } else {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Search by First Name</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex-grow px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
      )}

      {results.length > 0 ? (
        <ul className="space-y-3">
          {results.map((person) => (
            <li
              key={person.fid}
              className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-lg">
                {person.first_name} {person.last_name}
              </p>
              <p>Age: {person.age}</p>
              <p>Address: {person.address}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <p className="text-gray-500 text-center mt-6">
            No results found. Try searching a first name.
          </p>
        )
      )}
    </div>
  );
}
