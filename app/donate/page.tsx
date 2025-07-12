"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Donator {
  id: number;
  name: string;
  message: string;
  amount: number;
  file_path: string;
}

const HOST = process.env.NEXT_PUBLIC_URL!;

const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY!;

export default function DonatePage() {
  const [donators, setDonators] = useState<Donator[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonators = async () => {
      try {
        const response = await fetch(`${HOST}/api/donate`, {
          headers: { "x-api-key": X_API_KEY , "Cache-Control": "no-cache" },
        });
        const data = await response.json();
        if (response.ok) {
          setDonators(data.donators);
        } else {
          setError(data.error || "Failed to fetch donators");
        }
      } catch {
        setError("Failed to fetch donators");
      }
    };
    fetchDonators();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", name.trim() || "Anonymous");
    formData.append("message", message.trim());
    if (slip) {
      formData.append("slip", slip);
    }

    try {
      const response = await fetch(`${HOST}/api/donate`, {
        method: "POST",
        headers: { "x-api-key": X_API_KEY },
        body: formData,
      } as RequestInit);
      const data = await response.json();
      if (response.ok) {
        setDonators([data.donator, ...donators]);
        setName("");
        setMessage("");
        setSlip(null);
      } else {
        setError(data.error || "Failed to upload donation");
      }
    } catch {
      setError("Failed to upload donation");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">ສະໜັບສະໜຸນ BitAI</h1>
      <p className="mb-6 text-lg max-w-xl text-center">
        ຖ້າທ່ານເຫັນວ່າ BitAI ເປັນປະໂຫຍດ ກະລຸນາສະໜັບສະໜຸນໂຄງການຂອງພວກເຮົາ! ການບໍລິຈາກຂອງທ່ານຊ່ວຍໃຫ້ພວກເຮົາພັດທະນາແລະຮັບປະກັນການໃຫ້ບໍລິການສຳລັບທຸກຄົນ.
      </p>
      <div className="mb-6 flex flex-col items-center">
        <Image
          src="/QRcode.jpeg"
          alt="QR ສຳລັບສະໜັບສະໜຸນ"
          width={180}
          height={180}
          className="rounded-md border-2 border-yellow-400"
        />
        <span className="mt-2 text-sm text-gray-300">ສະແກນ QR ເພື່ອສະໜັບສະໜຸນ</span>
      </div>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleUpload} className="flex flex-col items-center gap-3 mb-8 w-full max-w-sm">
        <input
          type="text"
          placeholder="ຊື່ຂອງທ່ານ (ບໍ່ບັງຄັບ)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="ຂໍ້ຄວາມ (ບໍ່ບັງຄັບ)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSlip(e.target.files?.[0] || null)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-md transition-colors text-lg shadow-md w-full"
        >
          ອັບໂຫຼດສະລິບ
        </button>
      </form>
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2">ຜູ້ສະໜັບສະໜຸນ</h2>
        <ul className="bg-gray-800 rounded-md p-4 min-h-[60px]">
          {donators.length === 0 ? (
            <li className="text-gray-400">ຍັງບໍ່ມີຜູ້ສະໜັບສະໜຸນ.</li>
          ) : (
            donators.map((d) => (
              <li key={d.id} className="py-1 border-b border-gray-700 last:border-b-0">
                <span className="font-semibold">{d.name || "ບໍຈະລະບຸຊື່"}</span>
                {d.amount > 0 && <span className="ml-2 text-green-400">{d.amount} ກີບ</span>}
                {d.message && <span className="block text-sm text-gray-300">{d.message}</span>}
                {d.file_path && (
                  <Image
                    src={`${HOST}/${d.file_path}`}
                    alt="Donation slip"
                    width={100}
                    height={100}
                    className="mt-2 max-w-[100px] rounded"
                    unoptimized
                    loading="lazy"
                  />
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}