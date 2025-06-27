"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars, faGear } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/context/Sidebar";

export default function Sidebar() {
    const { toggleSidebar, isSidebarOpen } = useSidebar();
    return (
        <div className={` ${isSidebarOpen ? 'w-50 border-r-1' : 'w-0 md:w-12'} flex bg-gray-800 flex-col justify-between md:border-r-1 border-gray-600 duration-200`}>
            <div>
                <div className={`border-b-1 border-gray-600 p-3 flex justify-between items-center h-13 ${isSidebarOpen ? '':'hidden md:flex'}`}>
                    <p className={` ${isSidebarOpen ? 'block':'hidden'} text-xl`}>BitAI</p>
                    <button onClick={() => toggleSidebar()}>
                        <FontAwesomeIcon icon={faBars} width={20} />
                    </button>
                </div>
                <div className="p-3 ">
                    <button className={`text-sm ${isSidebarOpen ? 'w-full':'hidden md:flex'} bg-gray-700 p-1 rounded-md flex items-center gap-1 cursor-pointer`}>
                        <FontAwesomeIcon icon={faPlus} width={15} />
						<p className={` ${isSidebarOpen ? 'block':'hidden'}`}>New Chat</p>
                    </button>
                </div>
            </div>
            <div className={`p-3 border-t-1 border-gray-600 flex justify-between items-center h-10 ${isSidebarOpen ? '':'hidden md:flex'}`}>
                <p className={` ${isSidebarOpen ? 'block':'hidden'}`}>Setting</p>
                <FontAwesomeIcon icon={faGear} width={20} />
            </div>
        </div>
    );
}
