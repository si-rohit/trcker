"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between">
      <h1 className="text-lg font-bold">🚛 Truck Gate Admin</h1>
      <div className="space-x-6">
        <Link href="/">Trips</Link>
        <Link href="/create">+ Create Trip</Link>
      </div>
    </nav>
  );
}
