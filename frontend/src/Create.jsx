// src/Create.jsx
import React, { useState } from "react";

export default function Create() {
  const [name, setName] = useState("");
  const [bio,  setBio]  = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // grab your stored JWT
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not authenticated");
      return;
    }

    // send to backend
    const res = await fetch("http://127.0.0.1:8001/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ name, bio }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.detail || "Failed to create channel");
    } else {
      setSuccess("🎉 Channel created!");
      setName("");
      setBio("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-green-600 text-center mb-6">
        Create Your Channel
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="channel-name" className="block font-medium mb-1">
            Channel Name
          </label>
          <input
            id="channel-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="channel-bio" className="block font-medium mb-1">
            Channel Bio
          </label>
          <textarea
            id="channel-bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700"
        >
          Create Channel
        </button>
      </form>
    </div>
  );
}
