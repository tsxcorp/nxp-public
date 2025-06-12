import React from 'react';
import '@/app/globals.css'; // Đảm bảo Tailwind được import

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 