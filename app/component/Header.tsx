'use client'
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "@/context/Sidebar";

export default function Header() {
	const { toggleSidebar, isSidebarOpen } = useSidebar();
    return (
        <div className={` flex md:hidden w-full h-13 p-3`}>
            <button onClick={() => toggleSidebar()} className={`${isSidebarOpen ? 'hidden':''}`}>
                <FontAwesomeIcon icon={faBars} width={20} />
            </button>
        </div>
    );
}
