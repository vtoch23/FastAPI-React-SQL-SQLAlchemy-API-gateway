import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_API_URL;

export default function ViewAll() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all entries
  const fetchData = () => {
    setLoading(true);
    setError("");
    fetch(`${baseUrl}/`, {
      headers: { "api-key": apiKey },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete handler with confirmation
  const handleDelete = async (fid) => {
    if (!window.confirm(`Are you sure you want to delete entry ID ${fid}?`)) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${baseUrl}/delete-name/${fid}`, {
        method: "DELETE",
        headers: { "api-key": apiKey },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Delete failed");
      }

      setSuccess(`Entry ID ${fid} deleted successfully`);
      // Refresh the list
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">All Entries</h2>

      {loading && <p className="text-center text-gray-600 mb-4">Loading...</p>}
      {error && <p className="text-center text-red-600 mb-4 font-semibold">{error}</p>}
      {success && <p className="text-center text-green-600 mb-4 font-semibold">{success}</p>}

      {data.length > 0 ? (
        <ul className="space-y-4">
          {data.map(({ fid, first_name, last_name, age, address }) => (
            <li
              key={fid}
              className="flex justify-between items-center border rounded p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-lg">
                  {first_name} {last_name}
                </p>
                <p>Age: {age}</p>
                <p>Address: {address}</p>
              </div>

              <button
                onClick={() => handleDelete(fid)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                disabled={loading}
                aria-label={`Delete entry ${fid}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-center text-gray-500">No entries found.</p>
      )}
    </div>
  );
}
