import React from 'react';
import Header from './Header';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className="flex-1 max-w-screen overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default MainContentWrapper;