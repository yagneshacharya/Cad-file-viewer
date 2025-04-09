import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // 🆕 pagination
  const [totalPages, setTotalPages] = useState(1); // 🆕 total pages

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a DXF file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const data = await axios.post("https://cad-file-viewer.onrender.com/api/upload", formData);

      setSearchTerm("");
      setPage(1); // Reset to first page after upload
      fetchBlocks(1, "");
    } catch (err) {
      alert(`Upload failed because ${err.response.data.error}` );
      console.error(`v`,err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlocks = async (pg = page, search = searchTerm) => {
    try {
      const res = await axios.get("https://cad-file-viewer.onrender.com/api/sblocks", {
        params: {
          page: pg,
          limit: 5,
          ...(search ? { search } : {}),
        },
      });
      setBlocks(res.data.blocks || res.data); // handles both formats
      setTotalPages(res.data.totalPages || 1); // handles pagination
    } catch (err) {
      console.error("Error fetching blocks:", err);
    }
  };

  useEffect(() => {
    fetchBlocks(page, searchTerm);
  }, [page, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">📐 CAD Block Viewer (.dxf files allowed) </h1>

        <input
          type="file"
          accept=".dxf"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded p-2"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload DXF"}
        </button>

        <input
          type="text"
          placeholder="Search block name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset to first page on new search
          }}
          className="w-full border border-gray-300 rounded p-2"
        />

        {blocks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">🧱 Blocks Found:</h2>
            <ul className="space-y-2">
              {blocks.map((block, index) => (
                <li key={index} className="p-3 border rounded-md shadow-sm bg-gray-50">
                  <div className="font-semibold">{block.blockName || block.name}</div>
                  <div className="text-sm text-gray-600">
                    Entities: {block.entity_count ?? block.entityCount ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Base Point: {block.baseX ?? block.basePoint?.[0] ?? "--"},{" "}
                    {block.baseY ?? block.basePoint?.[1] ?? "--"}
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                ⬅ Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next ➡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
