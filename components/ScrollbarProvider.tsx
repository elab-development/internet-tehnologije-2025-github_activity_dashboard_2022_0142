"use client";

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export default function RetroScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="block md:hidden h-screen overflow-auto">
        {children}
      </div>

      <div className="hidden md:block">
        <SimpleBar style={{ height: '100vh' }} className="retro-scrollbar">
          {children}
        </SimpleBar>
      </div>
    </>
  );
}