'use client';

import Link from 'next/link';
import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Welcome to the Admin Dashboard</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
          Select a management section to continue:
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link href="/admin/dashboard/document" className="flex-1 bg-indigo-600 text-white px-6 py-4 sm:px-8 sm:py-5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 text-lg sm:text-xl font-semibold">
            Document Management
          </Link>
          <Link href="/admin/dashboard/donator" className="flex-1 bg-emerald-600 text-white px-6 py-4 sm:px-8 sm:py-5 rounded-lg shadow-md hover:bg-emerald-700 transition-colors duration-300 text-lg sm:text-xl font-semibold">
            Donator Management
          </Link>
        </div>
      </div>
    </div>
  );
}
