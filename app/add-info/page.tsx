"use client";
import { useState } from "react";

const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY!;
// const HOST = "https://bitai.millerbit.biz/api/add-document";
const HOST = "http://localhost:3001/add-document";

// Define a type for your metadata items
interface MetadataItem {
  id: string; // Add an ID for unique keying in React
  key: string;
  value: string;
}

export default function AddInfo() {
  const [content, setContent] = useState("");
  // Change metadataObj to an array of objects
  const [metadataItems, setMetadataItems] = useState<MetadataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to generate unique IDs for new metadata fields
  const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

  const handleMetadataChange = (id: string, field: "key" | "value", newValue: string) => {
    setMetadataItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const handleAddMetadataField = () => {
    setMetadataItems((prev) => [...prev, { id: generateUniqueId(), key: "source", value: "wiki" }]);
  };

  const handleRemoveMetadataField = (id: string) => {
    setMetadataItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Convert the array of metadata items back to an object for the API
    const metadataObj: Record<string, string> = metadataItems.reduce((acc: Record<string, string>, item) => {
      if (item.key.trim() !== "") { // Only include if the key is not empty
        acc[item.key] = item.value;
      }
      return acc;
    }, {});

    console.log(metadataObj);

    try {
      const res = await fetch(HOST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": X_API_KEY,
        },
        body: JSON.stringify({ content, metadata: metadataObj }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add document");
      setResult("Document added successfully!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-xl bg-gray-900/90 shadow-2xl rounded-3xl p-8 border border-gray-800 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
          <span className="inline-block bg-blue-700/80 rounded-full px-3 py-1 text-base font-semibold mr-2">AI</span>
          ເພີ່ມຂໍ້ມູນ
        </h1>
        <p className="text-gray-400 mb-6 text-base">ເພີ່ມຂໍ້ມູນໃໝ່ ແລະ metadata ເພື່ອຊ່ວຍໃຫ້ AI ຮຽນຮູ້.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 font-semibold mb-2">ຂໍ້ມູນ</label>
            <textarea
              className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 transition outline-none text-gray-100 placeholder-gray-500 text-base min-h-[120px] resize-vertical shadow-sm"
              rows={6}
              placeholder="ວາງ ຫຼື ພິມຂໍ້ມູນຂອງທ່ານທີ່ນີ້..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-2">Metadata ເພີ່ມເຕີມ (ບໍ່ບັງຄັບ)</label>
            <div className="space-y-2">
              {metadataItems.map((item) => (
                <div key={item.id} className="flex gap-2 items-center group">
                  <input
                    className="flex-1 p-2 w-20 rounded-full bg-gray-800 border border-gray-700 transition outline-none text-gray-100 placeholder-gray-500 text-sm shadow-sm px-4"
                    placeholder="ຄີ"
                    value={item.key}
                    onChange={e => handleMetadataChange(item.id, "key", e.target.value)}
                  />
                  <span className="text-gray-400 font-bold">:</span>
                  <input
                    className="flex-1 p-2 w-20 rounded-full bg-gray-800 border border-gray-700 transition outline-none text-gray-100 placeholder-gray-500 text-sm shadow-sm px-4"
                    placeholder="ຄ່າ"
                    value={item.value}
                    onChange={e => handleMetadataChange(item.id, "value", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMetadataField(item.id)}
                    className="text-red-400 hover:text-red-300 px-2 transition"
                    aria-label="ລຶບ metadata"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="py-1 px-4 bg-blue-700/80 hover:bg-blue-600/90 text-white rounded-full text-sm font-semibold shadow transition mt-2"
                onClick={handleAddMetadataField}
              >
                + ເພີ່ມ Metadata
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:bg-gray-600 font-bold text-lg shadow-lg transition"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                ກຳລັງເພີ່ມ...
              </span>
            ) : "ເພີ່ມຂໍ້ມູນ"}
          </button>
        </form>
        {result && <div className="mt-6 text-green-400 bg-green-900/30 border border-green-700 rounded-xl px-4 py-3 text-center font-semibold shadow">{result}</div>}
        {error && <div className="mt-6 text-red-400 bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-center font-semibold shadow">{error}</div>}
        <div className="mt-8 text-xs text-gray-500 text-center">
          <ul className="list-disc pl-5 inline-block text-left">
            <li><b>ຂໍ້ມູນ</b>: ຂຽນຂໍ້ມູນທີ່ທ່ານຕ້ອງການໃຫ້ AI ຮຽນຮູ້.</li>
            <li><b>Metadata</b>: ໃຊ້ metadata ເພື່ອເພີ່ມລາຍລະອຽດເພີ່ມເຕີມ, ຕົວຢ່າງ <span className="bg-gray-700 px-2 rounded">source</span> ເປັນຄີ ແລະ <span className="bg-gray-700 px-2 rounded">website</span> ເປັນຄ່າ.</li>
            <li>ທ່ານສາມາດເພີ່ມ ຫຼື ລຶບ metadata ໄດ້ຕາມຕ້ອງການ. ປ່ອຍໃຫ້ວ່າງໄວ້ຖ້າບໍ່ຈຳເປັນ.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}