import { useState } from "react";

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = import.meta.env.VITE_API_URL;

export default function AddName() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${baseUrl}/add-name`, {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age), // make sure age is number
        }),
      });

      if (response.ok) {
        setSuccess("Person added successfully!");
        setFormData({ first_name: "", last_name: "", age: "", address: "" });
      } else {
        const err = await response.json();
        setError(err.detail || "Failed to add person");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Person</h1>

      {error && <p className="text-red-600 mb-4 font-medium text-center">{error}</p>}
      {success && <p className="text-green-600 mb-4 font-medium text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="age"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          min={0}
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
