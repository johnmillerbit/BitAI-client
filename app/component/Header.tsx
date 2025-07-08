'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSidebar } from '@/context/Sidebar';
import '../../components/icons';

export default function Header() {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  return (
    <div className={`flex md:hidden w-full h-13 p-3 sticky`}>
      <button onClick={() => toggleSidebar()} className={`${isSidebarOpen ? 'hidden' : ''}`}>
        <FontAwesomeIcon icon="bars" width={20} />
      </button>
    </div>
  );
}