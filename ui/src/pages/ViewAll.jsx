import { useEffect, useState } from 'react';

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_API_URL;

export default function ViewAll() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch(`${baseUrl}/`, {
      headers: { 'api-key': apiKey },
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (fid) => {
    if (!confirm("Are you sure you want to delete this person?")) return;

    try {
      const res = await fetch(`${baseUrl}/delete-name/${fid}`, {
        method: "DELETE",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        alert("Person deleted.");
        setData(data.filter(item => item.fid !== fid)); // Optimistic update
      } else {
        const error = await res.json();
        alert("Error: " + error.detail);
      }
    } catch (err) {
      alert("Request failed: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Entries</h2>
      <ul>
        {data.map((item) => (
          <li key={item.fid} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              {item.first_name} {item.last_name} - {item.age} - {item.address}
            </div>
            <button
              onClick={() => handleDelete(item.fid)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
