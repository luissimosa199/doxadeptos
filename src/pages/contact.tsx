import React, { useState } from "react";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      Swal.fire(
        "Success",
        "Your message has been sent successfully!",
        "success"
      );

      setFormData({
        name: "",
        email: "",
        number: "",
        message: "",
      });
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl">Contact us!</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-6"
      >
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
        />
        <textarea
          placeholder="Your message"
          rows={5}
          className="w-full p-2 border rounded"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Contact;
