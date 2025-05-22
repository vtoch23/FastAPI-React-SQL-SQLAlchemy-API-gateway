import { useState } from 'react';

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_API_URL;

export default function Search() {
  const [firstName, setFirstName] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:8000/get-name?first_name=${firstName}`, {
      headers: { 'api-key': apiKey },
    });
    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Search Person</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2">
        Search
      </button>

      <ul className="mt-4">
        {results.map((item, index) => (
          <li key={index} className="border p-2 mb-2">
            {item.first_name} {item.last_name} - {item.age} - {item.address}
          </li>
        ))}
      </ul>
    </div>
  );
}
