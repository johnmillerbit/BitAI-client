'use client';

import React, { useState, useEffect } from 'react';
import { getDocuments, deleteDocument } from '../../../../services/api';

interface Document {
  id: string;
  pageContent: string;
  metadata: {
    originalContent: string;
  };
}

export default function DocumentDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };
    fetchDocuments();
  }, []);

  const handleDetail = (doc: Document) => {
    setDetailDoc(doc);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
        setDocuments(documents.filter(doc => doc.id !== id));
        if (detailDoc?.id === id) {
          setDetailDoc(null);
        }
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Document Management</h1>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">All Documents</h2>
          {documents.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center">No documents found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map(doc => (
                <div key={doc.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 text-base mb-4 line-clamp-3">{doc.metadata.originalContent}</p>
                  </div>
                  <div className="flex flex-row justify-end gap-3 mt-4">
                    <button onClick={() => handleDetail(doc)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm">View Detail</button>
                    <button onClick={() => handleDelete(doc.id)} className="bg-rose-600 text-white px-4 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {detailDoc && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all scale-100 opacity-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Document Detail</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Document ID:</p>
                  <p className="text-lg font-mono text-gray-900 dark:text-gray-100 break-all">{detailDoc.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Original Content:</p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{detailDoc.metadata.originalContent}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button onClick={() => setDetailDoc(null)} className="bg-gray-600 text-white px-5 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Close</button>
                <button onClick={() => handleDelete(detailDoc.id)} className="bg-rose-600 text-white px-5 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">Delete Document</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
