import { useState } from "react";
import { Link } from "react-router-dom";

<Link to="/add">Go to Add</Link>


export default function AddName() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    address: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiKey = import.meta.env.VITE_API_KEY;
    console.log("Submitting data:", formData);
    try {
      const response = await fetch("http://localhost:8000/add-name", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Person added successfully!");
        setFormData({ first_name: "", last_name: "", age: 0, address: "" });
      } else {
        const err = await response.json();
        console.error("Error response from backend:", err);
        alert("Failed to add person: " + JSON.stringify(err.detail));

      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Person</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="first_name" placeholder="First Name" onChange={handleChange} className="border p-2 block w-full" />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} className="border p-2 block w-full" />
        <input name="age" placeholder="Age" type="number" onChange={handleChange} className="border p-2 block w-full" />
        <input name="address" placeholder="Address" onChange={handleChange} className="border p-2 block w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
