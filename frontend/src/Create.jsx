import React from 'react';

const Create = () => (
  <div className="container bg-white p-4 sm:p-8 lg:p-12 rounded-xl shadow">
    <h2 className="text-2xl sm:text-3xl font-semibold text-green-600 text-center mb-6">
      Create Your Channel
    </h2>

    {/* Channel name */}
    <div className="mt-4">
      <label htmlFor="channel-name" className="block font-semibold mb-1">
        Channel Name
      </label>
      <input
        id="channel-name"
        type="text"
        placeholder="Enter your channel name…"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>

    {/* Bio */}
    <div className="mt-6">
      <label htmlFor="channel-bio" className="block font-semibold mb-1">
        Channel Bio
      </label>
      <textarea
        id="channel-bio"
        placeholder="Describe your channel, goals, and content…"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        rows={4}
      />
    </div>

    {/* Logo upload */}
    <div className="mt-6">
      <strong className="font-semibold">Upload Channel Logo</strong>
      <p className="text-sm text-slate-600 mb-3">Recommended 1:1 image, max 5 MB</p>

      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-400 py-8 text-center">
        <span className="text-sm">
          Drag your logo file or <a href="/" className="text-blue-600 underline">browse</a>
        </span>
        <p className="text-xs text-slate-500">Supported formats : <b>.jpg .png .svg</b></p>
      </div>
    </div>

    <hr className="my-8 border-slate-200" />

    {/* Tags */}
    <div className="mt-6">
      <label htmlFor="channel-tags" className="block font-semibold mb-1">
        Channel Tags
      </label>
      <input
        id="channel-tags"
        type="text"
        placeholder="e.g. education, gaming, design…"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>

    {/* Button */}
    <button className="mt-8 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
      Create Channel
    </button>
  </div>
);

export default Create;
