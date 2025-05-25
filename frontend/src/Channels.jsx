// src/Channels.jsx
import React, { useEffect, useState } from 'react';

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [posts, setPosts]       = useState([]);
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem('access_token');

  // fetch all channels once
  useEffect(() => {
    fetch('http://localhost:8001/channels/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setChannels)
      .catch(console.error);
  }, []);

  // when a channel is clicked:
  const selectChannel = (ch) => {
    setSelected(ch.id);
    fetch(`http://localhost:8001/posts/?channel_id=${ch.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setPosts)
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Channels</h2>

      <ul className="divide-y">
        {channels.map(ch => (
          <li
            key={ch.id}
            className={`p-2 cursor-pointer ${selected === ch.id ? 'bg-gray-100' : ''}`}
            onClick={() => selectChannel(ch)}
          >
            {ch.name}
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Posts in "{channels.find(c => c.id===selected)?.name}"</h3>
          {posts.length === 0 ? (
            <p className="text-sm text-gray-500">No posts yet.</p>
          ) : (
            <ul className="divide-y">
            {posts.map(p => (
            <li key={p.id} className="py-2">
                <strong>{p.title}</strong>
                <p className="text-sm text-gray-700">{p.content}</p>

                {/* render uploaded images */}
                {p.files?.map(file => (
                <div key={file.id}>
                    <a href={file.url} target="_blank" rel="noreferrer">
                    <img
                        src={`http://localhost:8001${file.url}`}
                        alt={file.filename}
                        style={{ maxWidth: "200px" }}
                    />
                    </a>
                </div>
                ))}

                <p className="text-xs text-gray-400">
                by user #{p.author_id} on {new Date(p.created_at).toLocaleString()}
                </p>
            </li>
            ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
