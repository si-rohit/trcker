"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | entered | exited
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const res = await fetch("/api/createTrip", { method: "GET" });
    const data = await res.json();
    setTrips(data);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/getAndDeleteTrip`, {
      method: "DELETE",
      body: id,
    });
    if (res.ok) {
      alert("Trip Deleted ❌");
      fetchTrips();
    }
  };

  // ✅ Filter + Search Logic
  const filteredTrips = trips.filter((trip) => {
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

  return (
    <>
      <div className="p-6 max-[426px]:p-2 text-black">
        <div className="flex gap-10 justify-between mb-6 px-6 max-[426px]:mb-4 max-[426px]:mt-2">
          <h1 className="text-3xl font-bold max-[426px]:text-2xl ">Admin Dashboard</h1>

          <Link
            href={"/create"}
            className=" bg-black text-white font-bold py-2 px-4 rounded-sm block"
          >
            Create
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className=" bg-black text-white font-bold py-2 px-4 rounded-sm"
          >
            Logout
          </button>
          
        </div>

        <div className="shadow p-6 rounded bg-gray-100 max-[426px]:p-2">
          <div className="mb-4 flex justify-between items-center gap-4">
            <h2 className="text-xl font-semibold">Trips</h2>
            <div className="flex gap-3">
              <input
                className="bg-white border border-gray-600 rounded-sm py-1 px-2 max-[426px]:hidden"
                placeholder="Search truck/driver"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="border border-gray-600 rounded-sm py-1 px-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="entered">Pending Exit</option>
                <option value="exited">Exited</option>
              </select>
            </div>
          </div>
          <input
            className="bg-white border border-gray-600 rounded-sm py-1 px-2 text-lg hidden max-[426px]:flex mb-4 mx-auto w-[80%]"
            placeholder="Search truck/driver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="overflow-x-auto">
            <table className="min-w-full border bg-white rounded-b-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                   <th className="p-2 border">ID</th>
                   <th className="p-2 border">Trip No.</th>
                  <th className="p-2 border">Truck No.</th>
                  <th className="p-2 border">Company</th>
                  <th className="p-2 border">Enter Time</th>
                  {/* <th className="p-2 border">Loaded Image</th> */}
                  <th className="p-2 border">Exit Time</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip._id}>
                    <td className="p-2 border">{trip._id}</td>
                    <td className="p-2 border">{trip.tripNumber}</td>
                    <td className="p-2 border">{trip.truckNumber}</td>
                    <td className="p-2 border">{trip.companyName}</td>
                    <td className="p-2 border">
                      {new Date(trip.EnterTime).toLocaleString()}
                    </td>
                    <td className="p-2 border">
                      {trip.ExitTime
                        ? new Date(trip.ExitTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-2 border">
                      {trip.ExitTime ? "Completed" : "Active"}
                    </td>
                    
                    <td className="p-2 border-t flex flex-wrap gap-2">
                     
                      {/* <button
                        onClick={() => handleDelete(trip._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 cursor-pointer"
                      >
                        Delete
                      </button> */}

                      <Link
                        href={`/view/${trip._id}`}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-5 cursor-pointer">
                        View
                      </Link>
                       
                      <Link
                        href={`/update/${trip._id}`}
                        className={`bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 mr-5 cursor-pointer ${trip.ExitTime ? "hidden" : ""}`}
                      >
                        Modify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTrips.length === 0 && (
            <div className="text-center py-2 w-full">No trip found</div>
          )}
        </div>
      </div>
    </>
  );
}
