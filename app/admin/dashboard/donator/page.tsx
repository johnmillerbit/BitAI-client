'use client';

import React, { useState, useEffect } from 'react';
import { getUnallowedDonators, deleteDonator, allowDonator } from '../../../../services/api';

interface Donator {
	id: string;
	name: string;
	message: string;
	file_path: string;
	allowed: boolean;
}

const HOST = process.env.NEXT_PUBLIC_URL!;

export default function DonatorDashboard() {
	const [donators, setDonators] = useState<Donator[]>([]);
	const [detailDonator, setDetailDonator] = useState<Donator | null>(null);

	useEffect(() => {
		const fetchDonators = async () => {
			try {
				const data = await getUnallowedDonators();
				setDonators(data.donators);
			} catch (error) {
				console.error("Failed to fetch donators:", error);
			}
		};
		fetchDonators();
	}, []);

	const handleDetail = (donator: Donator) => {
		setDetailDonator(donator);
	};

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this donator?")) {
			try {
				await deleteDonator(id);
				setDonators(donators.filter(donator => donator.id !== id));
				if (detailDonator?.id === id) {
					setDetailDonator(null);
				}
			} catch (error) {
				console.error("Failed to delete donator:", error);
			}
		}
	};

	const handleAllow = async (id: string) => {
		if (window.confirm("Are you sure you want to allow this donator?")) {
			try {
				await allowDonator(id); // Assuming this API allows the donator
				setDonators(donators.filter(donator => donator.id !== id));
				if (detailDonator?.id === id) {
					setDetailDonator(null);
				}
			} catch (error) {
				console.error("Failed to allow donator:", error);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
			<div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
				<h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Donator Management</h1>

				<div className="mb-6">
					<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">All Donators</h2>
					{donators.length === 0 ? (
						<p className="text-gray-600 dark:text-gray-400 text-center">No donators found.</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{donators.map(donator => (
								<div key={donator.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Name:</p>
										<p className="text-gray-700 dark:text-gray-300 text-base mb-4">{donator.name}</p>
									</div>
									<div className="flex flex-row justify-end gap-3 mt-4">
										<button onClick={() => handleDetail(donator)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm">View Detail</button>
										<button onClick={() => handleDelete(donator.id)} className="bg-rose-600 text-white px-4 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 text-sm">Delete</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{detailDonator && (
					<div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4 z-50">
						<div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all scale-100 opacity-100">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Donator Detail</h2>
							<div className="space-y-4">
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Donator ID:</p>
									<p className="text-lg font-mono text-gray-900 dark:text-gray-100 break-all">{detailDonator.id}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</p>
									<p className="text-lg text-gray-900 dark:text-gray-100">{detailDonator.name}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Slip:</p>
									<img src={`${HOST}/${detailDonator.file_path}`} alt="slip" className="max-w-full h-auto" />
								</div>
								{detailDonator.message && (<div>
									<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Message:</p>
									<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
										<p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{detailDonator.message}</p>
									</div>
								</div>)}
							</div>
							<div className="flex justify-end space-x-3 mt-8">
								<button onClick={() => setDetailDonator(null)} className="bg-gray-600 text-white px-5 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Close</button>
								<button onClick={() => handleAllow(detailDonator.id)} className="bg-green-400 text-white px-5 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 focus:outline-none">Allow</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
