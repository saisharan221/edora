import React from 'react';

const Upload = () => (
  <div className="container bg-white p-4 sm:p-8 lg:p-12 rounded-xl shadow">
    <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600 text-center mb-6">
      Create your own Post
    </h2>

    {/* Title */}
    <div className="mt-4">
      <label htmlFor="title" className="block font-semibold mb-1">
        Title
      </label>
      <input
        id="title"
        type="text"
        placeholder="Write your title here…"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>

    {/* File upload */}
    <div className="mt-6">
      <strong className="font-semibold">Document Upload</strong>
      <p className="text-sm text-slate-600 mb-3">
        Add up to <span className="font-medium">5 files</span> (max 10 MB each)
      </p>

      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-400 py-8 text-center">
        <span className="text-sm">
          Drag your file(s) or <a href="/" className="text-blue-600 underline">browse</a>
        </span>
        <p className="text-xs text-slate-500">Max 10 MB files are allowed</p>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Only <span className="font-medium">.jpg, .png, .svg, .zip</span> files supported
      </p>
    </div>

    <hr className="my-8 border-slate-200" />

    {/* URL */}
    <div className="mt-6">
      <label htmlFor="url" className="block font-semibold mb-1">
        Upload from URL
      </label>
      <input
        id="url"
        type="text"
        placeholder="URL link here…"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>

    {/* Description */}
    <div className="mt-6">
      <label htmlFor="desc" className="block font-semibold mb-1">
        Description
      </label>
      <textarea
        id="desc"
        placeholder="Write your description or question here…"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        rows={4}
      />
    </div>

    {/* Button */}
    <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
      Upload
    </button>
  </div>
);

export default Upload;
