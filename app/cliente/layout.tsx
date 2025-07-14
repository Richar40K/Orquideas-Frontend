import Navbar from "@/components/viajes/Navbar";
import { ReactNode } from "react";

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <main className="p-4 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
