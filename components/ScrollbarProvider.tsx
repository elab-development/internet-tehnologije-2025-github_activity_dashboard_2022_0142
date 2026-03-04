"use client";

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export default function RetroScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <SimpleBar 
      style={{ height: '100vh' }} 
      className="retro-scrollbar"
    >
      {children}
    </SimpleBar>
  );
}