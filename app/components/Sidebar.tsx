"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "@/context/Sidebar";
import Link from "next/link";
import "../../lib/icons";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const { toggleSidebar, isSidebarOpen } = useSidebar();
    return (
        <div className={`fixed top-0 left-0 h-full z-40 ${isSidebarOpen ? 'w-50 border-r-1' : 'w-0 md:w-12'} flex bg-gray-800 flex-col justify-between border-gray-600 duration-200 md:border-r-1`}>
            <div>
                <div className={`border-b-1 border-gray-600 p-3 flex justify-between items-center h-13 ${isSidebarOpen ? '' : 'hidden md:flex'}`}>
                    <p className={` ${isSidebarOpen ? 'block' : 'hidden'} text-xl`}><Link href="/">BitAI</Link></p>
                    <button onClick={() => toggleSidebar()}>
                        <div className={`${isSidebarOpen ? 'hidden' : 'block'}`}>
                            <FontAwesomeIcon icon="bars" width={20} />
                        </div>
                        <div className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
                            <FontAwesomeIcon icon="x" width={20} />
                        </div>
                    </button>
                </div>
                <div className="p-3 ">
                    <button onClick={() => {
                        if (pathname !== '/') {
                            window.location.href = '/';
                        } else {
                            window.location.reload();
                        }
                    }} className={`text-sm ${isSidebarOpen ? 'w-full' : 'hidden md:flex'} bg-gray-700 p-1 rounded-md flex items-center gap-1 cursor-pointer`}>
                        <FontAwesomeIcon icon="plus" width={15} />
                        <p className={` ${isSidebarOpen ? 'block' : 'hidden'}`}>New Chat</p>
                    </button>
                </div>
            </div>
            <div className={`p-3 border-t-1 border-gray-600 flex flex-col gap-5 ${isSidebarOpen ? '' : 'hidden md:flex'}`}>
                <Link href="/add-info" className="flex items-center gap-2 w-full rounded-md hover:bg-gray-700 transition-colors">
                    <FontAwesomeIcon icon="chalkboard-teacher" width={20} />
                    <span className={`${isSidebarOpen ? 'block' : 'hidden'} text-lg`}>Teach AI</span>
                </Link>
                <Link href="/donate" className="flex items-center gap-2 w-full rounded-md hover:bg-gray-700 transition-colors">
                    <FontAwesomeIcon icon="donate" width={20} />
                    <span className={`${isSidebarOpen ? 'block' : 'hidden'} text-lg`}>Donate</span>
                </Link>
                <div className="flex items-center justify-between w-full mt-2">
                    <p className={` ${isSidebarOpen ? 'block' : 'hidden'} text-lg`}>Setting</p>
                    <FontAwesomeIcon icon="gear" width={20} />
                </div>
            </div>
        </div>
    );
}