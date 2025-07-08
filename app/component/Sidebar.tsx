"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "@/context/Sidebar";
import "../../components/icons";

export default function Sidebar() {
    const { toggleSidebar, isSidebarOpen } = useSidebar();
    return (
        <div className={`fixed top-0 left-0 h-full z-40 ${isSidebarOpen ? 'w-50 border-r-1' : 'w-0'} flex bg-gray-800 flex-col justify-between md:border-r-1 border-gray-600 duration-200 md:static md:w-auto`}>
            <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
            <div>
                <div className={`border-b-1 border-gray-600 p-3 flex justify-between items-center h-13 ${isSidebarOpen ? '':'hidden md:flex'}`}>
                    <p className={` ${isSidebarOpen ? 'block':'hidden'} text-xl`}>BitAI</p>
                    <button onClick={() => toggleSidebar()}>
                        <FontAwesomeIcon icon="bars" width={20} />
                    </button>
                </div>
                <div className="p-3 ">
                    <button className={`text-sm ${isSidebarOpen ? 'w-full':'hidden md:flex'} bg-gray-700 p-1 rounded-md flex items-center gap-1 cursor-pointer`}>
                        <FontAwesomeIcon icon="plus" width={15} />
						<p className={` ${isSidebarOpen ? 'block':'hidden'}`}>New Chat</p>
                    </button>
                </div>
            </div>
            <div className={`p-3 border-t-1 border-gray-600 flex justify-between items-center h-10 ${isSidebarOpen ? '':'hidden md:flex'}`}>
                <p className={` ${isSidebarOpen ? 'block':'hidden'}`}>Setting</p>
                <FontAwesomeIcon icon="gear" width={20} />
            </div>
        </div>
    );
}