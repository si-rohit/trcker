"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("entered");
  const [monthsFilter, setMonthsFilter] = useState('thisMonth');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
      // console.log(data);
      setTrips(data);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
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

      // console.log(trip.EnterTime.Date)
      const enterDate = new Date(trip.EnterTime);

      const matchesMonthFilter = 
        monthsFilter === 'thisMonth'
          ? enterDate.getMonth() === new Date().getMonth()
          : monthsFilter === 'lastMonth'
            ? enterDate.getMonth() === new Date().getMonth() - 1
            : monthsFilter === 'last3Months'
              ? enterDate.getMonth() >= new Date().getMonth() - 3
              : true;


      return matchesSearch && matchesFilter && matchesMonthFilter;
    });
  }, [trips, search, filter, monthsFilter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // setIsFilterOpen(false); // Close off-canvas after selection
  };
  const handleMonthsFilterChange = (newFilter) => {
    setMonthsFilter(newFilter);
    // setIsFilterOpen(false); // Close off-canvas after selection
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700">
        <div className="p-3 md:px-8 max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-1xl md:text-3xl font-extralight">
            <span className="font-bold text-orange-500">Logo</span>
          </h1>
          <div>
            <div className="flex flex-1 flex-row justify-between items-center gap-4">
              <div className="relative ms-3 md:ms-0">
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pl-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              {/* Create Trip button for desktop view */}
              <div className="hidden sm:block">
                <Link
                  href="/create"
                  className="w-full text-center bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105 text-base block sm:inline-block sm:w-auto"
                >
                  <div className="flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create
                  </div>
                </Link>
              </div>
              {/* Desktop Filter Dropdown (visible on sm and larger screens) */}
              <div className="hidden sm:block w-full sm:w-auto">
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

              <div className="hidden sm:block w-full sm:w-auto">
                <select
                  className="border border-gray-600 rounded-lg py-3 px-4 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 w-full sm:w-auto"
                  value={monthsFilter}
                  onChange={(e) => setMonthsFilter(e.target.value)}
                >
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="last3Months">Last 3 Months</option>
                </select>
              </div>
              <div className="">
                {/* Profile Icon Button */}
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="hidden sm:block absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded-md transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-8xl mx-auto">
        {/* Trips Table - Mobile View: Cards */}
        <div className="sm:hidden space-y-4 mb-20">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <Link key={trip._id} href={`/view/${trip._id}`}>
                <div className="bg-gray-700 p-4 rounded-lg shadow-md border mb-4 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-400">
                      Trip No.
                    </span>
                    <span className="text-base font-medium">
                      {trip.tripNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-400">
                      Truck No.
                    </span>
                    <span className="text-base font-medium">
                      {trip.truckNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-400">
                      Company
                    </span>
                    <span className="text-base font-medium">
                      {trip.companyName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-400">
                      Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${trip.ExitTime ? "bg-green-600" : "bg-yellow-500 text-black"
                        }`}
                    >
                      {trip.ExitTime ? "Completed" : "Active"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-700 p-4 rounded-lg shadow-md border mb-4 border-gray-600 animate-pulse"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="h-3 w-16 bg-gray-600 rounded"></span>
                  <span className="h-4 w-20 bg-gray-500 rounded"></span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="h-3 w-20 bg-gray-600 rounded"></span>
                  <span className="h-4 w-24 bg-gray-500 rounded"></span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="h-3 w-20 bg-gray-600 rounded"></span>
                  <span className="h-4 w-28 bg-gray-500 rounded"></span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="h-3 w-16 bg-gray-600 rounded"></span>
                  <span className="h-5 w-20 bg-gray-500 rounded-full"></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trips Table - Desktop View */}
        <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-gray-700 text-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-600 text-left text-sm font-semibold uppercase tracking-wider">
                <th className="p-4 border-b border-gray-500 hidden sm:table-cell">
                  ID
                </th>
                <th className="p-4 border-b border-gray-500">Trip No.</th>
                <th className="p-4 border-b border-gray-500">Truck No.</th>
                <th className="p-4 border-b border-gray-500 hidden sm:table-cell">
                  Company
                </th>
                <th className="p-4 border-b border-gray-500 hidden md:table-cell">
                  Enter Time
                </th>
                <th className="p-4 border-b border-gray-500 hidden md:table-cell">
                  Exit Time
                </th>
                <th className="p-4 border-b border-gray-500">Status</th>
                <th className="p-4 border-b border-gray-500 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                  <tr
                    key={trip._id}
                    className="border-b border-gray-600 transition-colors duration-200"
                  >
                    <td className="p-4 hidden sm:table-cell">{trip._id}</td>
                    <td className="p-4">{trip.tripNumber}</td>
                    <td className="p-4">{trip.truckNumber}</td>
                    <td className="p-4 hidden sm:table-cell">
                      {trip.companyName}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {new Date(trip.EnterTime).toLocaleString()}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {trip.ExitTime ? new Date(trip.ExitTime).toLocaleString() : "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${trip.ExitTime ? "bg-green-600" : "bg-yellow-500 text-black"
                          }`}
                      >
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
                        {/* <Link
                          href={`/update/${trip._id}`}
                          className={`bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition duration-300 ${trip.ExitTime ? "hidden" : ""
                            }`}
                        >
                          Modify
                        </Link> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-600 animate-pulse">
                    <td className="p-4 hidden sm:table-cell">
                      <div className="h-4 w-20 bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-20 bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="h-4 w-28 bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="h-4 w-32 bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="h-4 w-32 bg-gray-600 rounded"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-16 bg-gray-500 rounded-full"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-8 w-16 bg-gray-500 rounded-lg mx-auto"></div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Fixed "Create New Trip" button for mobile */}
      <div className="fixed bottom-0 flex gap-3 left-0 right-0 p-4 bg-gray-900 border-t border-gray-700 sm:hidden z-40">
        <Link
          href="/create"
          className="w-full text-center bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105 text-base block"
        >
          <div className="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Trip
          </div>
        </Link>

        {/* Mobile Filter Button (visible on mobile, opens off-canvas) */}
        <button
          onClick={() => {
            setIsFilterOpen(true);
            setIsProfileDropdownOpen(false);
          }}
          className="block sm:hidden py-3 px-4 rounded-lg font-semibold transition-colors duration-300 bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          <div className="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Filter
          </div>
        </button>
      </div>

      {/* Off-canvas Filter Menu for Mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="bg-gray-800 rounded-t-2xl p-6 shadow-2xl border-t border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Filter</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            
            <button
              onClick={() => handleFilterChange("entered")}
              className={`py-3 px-4 rounded-lg font-semibold w-full transition-colors duration-300 ${filter === "entered" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Active
            </button>

            <button
              onClick={() => handleFilterChange("exited")}
              className={`py-3 px-4 rounded-lg font-semibold w-full transition-colors duration-300 ${filter === "exited" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Completed
            </button>

            <button
              onClick={() => handleFilterChange("all")}
              className={`py-3 px-4 rounded-lg font-semibold w-full transition-colors duration-300 ${filter === "all" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              All Trips
            </button>

            <hr className="border-gray-700"></hr>

            <button
              onClick={() => handleMonthsFilterChange("thisMonth")}
              className={`py-3 px-4 rounded-lg font-semibold w-full transition-colors duration-300 ${monthsFilter === "thisMonth" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              This Month
            </button>
            <button
              onClick={() => handleMonthsFilterChange("lastMonth")}
              className={`py-3 px-4 rounded-lg font-semibold w-full transition-colors duration-300 ${monthsFilter === "lastMonth" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Last Month
            </button>
            <button
              onClick={() => handleMonthsFilterChange("last3Months")}
              className={`py-3 px-4 rounded-lg font-semibold w-full transition-colors duration-300 ${monthsFilter === "last3Months" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              Last 3 Months
            </button>
          </div>
        </div>
      </div>

      {/* Off-canvas Profile Menu for Mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${isProfileDropdownOpen ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="bg-gray-800 rounded-t-2xl p-6 shadow-2xl border-t border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Do you want to logout?</h3>
            <button
              onClick={() => setIsProfileDropdownOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsProfileDropdownOpen(false)}
              className=" text-center text-white font-semibold py-3 px-6 rounded-lg shadow-md bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
            >
              No
            </button>
            <button
              onClick={handleLogout}
              className="text-center bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      {/* Overlay to dim background when off-canvas is open */}
      {(isFilterOpen || isProfileDropdownOpen) && (
        <div
          onClick={() => {
            setIsFilterOpen(false);
            setIsProfileDropdownOpen(false);
          }}
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 sm:hidden"
        ></div>
      )}
    </div>
  );
}