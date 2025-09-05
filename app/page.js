"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/createTrip", { method: "GET" });
      const data = await res.json();
      setTrips(data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/getAndDeleteTrip`, {
        method: "DELETE",
        body: id,
      });
      if (res.ok) {
        alert("Trip Deleted ❌");
        fetchTrips();
      }
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.truckNumber.toLowerCase().includes(search.toLowerCase()) ||
        trip.companyName.toLowerCase().includes(search.toLowerCase()) ||
        trip.tripNumber.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "entered"
            ? !trip.ExitTime
            : filter === "exited"
              ? trip.ExitTime
              : true;

      return matchesSearch && matchesFilter;
    });
  }, [trips, search, filter]);

  return (
    <div className="p-8 max-w-8xl mx-auto text-gray-100 font-sans bg-gray-900 min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-4xl font-extralight mb-4 sm:mb-0">
          Admin <span className="font-bold text-orange-500">Dashboard</span>
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/create"
            className="bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105"
          >
            Create Trip
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Control Panel Section */}
      <div className="shadow-2xl p-6 rounded-2xl bg-gray-800 border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-300">Trips Overview</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-full sm:w-auto">
              <input
                className="bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pl-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 w-full"
                placeholder="Search truck/trip no."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
            </div>
            <select
              className="border border-gray-600 rounded-lg py-3 px-4 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 w-full sm:w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Trips</option>
              <option value="entered">Pending Exit</option>
              <option value="exited">Exited</option>
            </select>
          </div>
        </div>

        {/* Trips Table */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-gray-700 text-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-600 text-left text-sm font-semibold uppercase tracking-wider">
                <th className="p-4 border-b border-gray-500 hidden sm:table-cell">ID</th>
                <th className="p-4 border-b border-gray-500">Trip No.</th>
                <th className="p-4 border-b border-gray-500">Truck No.</th>
                <th className="p-4 border-b border-gray-500 hidden sm:table-cell">Company</th>
                <th className="p-4 border-b border-gray-500 hidden md:table-cell">Enter Time</th>
                <th className="p-4 border-b border-gray-500 hidden md:table-cell">Exit Time</th>
                <th className="p-4 border-b border-gray-500">Status</th>
                <th className="p-4 border-b border-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                  <tr key={trip._id} className="border-b border-gray-600 hover:bg-gray-600 transition-colors duration-200">
                    <td className="p-4 hidden sm:table-cell">{trip._id}</td>
                    <td className="p-4">{trip.tripNumber}</td>
                    <td className="p-4">{trip.truckNumber}</td>
                    <td className="p-4 hidden sm:table-cell">{trip.companyName}</td>
                    <td className="p-4 hidden md:table-cell">
                      {new Date(trip.EnterTime).toLocaleString()}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {trip.ExitTime ? new Date(trip.ExitTime).toLocaleString() : "—"}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trip.ExitTime ? 'bg-green-600' : 'bg-yellow-500 text-black'}`}>
                        {trip.ExitTime ? "Completed" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center flex-wrap gap-2">
                        <Link
                          href={`/view/${trip._id}`}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition duration-300"
                        >
                          View
                        </Link>
                        <Link
                          href={`/update/${trip._id}`}
                          className={`bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition duration-300 ${trip.ExitTime ? "hidden" : ""}`}
                        >
                          Modify
                        </Link>
                        <button
                          onClick={() => handleDelete(trip._id)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-400">
                    No trips found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}