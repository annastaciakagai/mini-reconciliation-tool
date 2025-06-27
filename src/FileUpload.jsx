import { useRef, useState } from "react";

export default function FileUpload({ onFilesSelected }) {
  const internalRef = useRef();
  const providerRef = useRef();
  const [internalName, setInternalName] = useState("No file chosen");
  const [providerName, setProviderName] = useState("No file chosen");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (internalRef.current.files[0] && providerRef.current.files[0]) {
      onFilesSelected(internalRef.current.files[0], providerRef.current.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <label className="block font-semibold">Internal System Export (CSV)</label>
        <span>:</span>
        <label className="border rounded px-2 py-1 bg-white cursor-pointer">
          Choose File
          <input
            type="file"
            accept=".csv"
            ref={internalRef}
            required
            className="hidden"
            onChange={e => setInternalName(e.target.files[0]?.name || "No file chosen")}
          />
        </label>
        <span className="ml-2 text-sm text-gray-600">{internalName}</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="block font-semibold">Provider Statement (CSV)</label>
        <span>:</span>
        <label className="border rounded px-2 py-1 bg-white cursor-pointer">
          Choose File
          <input
            type="file"
            accept=".csv"
            ref={providerRef}
            required
            className="hidden"
            onChange={e => setProviderName(e.target.files[0]?.name || "No file chosen")}
          />
        </label>
        <span className="ml-2 text-sm text-gray-600">{providerName}</span>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Compare
      </button>
    </form>
  );
}