"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    // console.log(data);
    if (!data.error) {
      localStorage.setItem("user", data.admin._id);
      router.push("/");
      setLoading(false);
    } else {
      alert("Invalid credentials ❌");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Mobile Header (Sticky) */}
      <div className="md:hidden sticky top-0 z-10 w-full bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 flex items-center justify-center bg-orange-600 rounded-full mr-2 shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h5l-1-1v-2.25M9.75 17h4.5a1.5 1.5 0 001.5-1.5V15a1.5 1.5 0 00-1.5-1.5h-4.5a1.5 1.5 0 00-1.5 1.5v.5c0 1.333-1.875 2.25-3 2.25s-3-1-3-2.25v-.5a1.5 1.5 0 011.5-1.5h4.5M3.75 17V6.75a1.5 1.5 0 011.5-1.5h10.5a1.5 1.5 0 011.5 1.5V17"
              />
            </svg>
          </div>
          <h1 className="text-xl font-extralight">
            <span className="font-bold text-orange-500">Bailey</span> and Co.
          </h1>
        </div>
      </div>
      
      {/* Left Section - Logo and Brand (Desktop) */}
      <div className="hidden md:flex flex-1 items-center justify-center flex-col border-r border-gray-700 p-8 bg-gray-800">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center bg-orange-600 rounded-full mb-4 shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h5l-1-1v-2.25M9.75 17h4.5a1.5 1.5 0 001.5-1.5V15a1.5 1.5 0 00-1.5-1.5h-4.5a1.5 1.5 0 00-1.5 1.5v.5c0 1.333-1.875 2.25-3 2.25s-3-1-3-2.25v-.5a1.5 1.5 0 011.5-1.5h4.5M3.75 17V6.75a1.5 1.5 0 011.5-1.5h10.5a1.5 1.5 0 011.5 1.5V17"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extralight text-center">
            <span className="font-bold text-orange-500">Bailey</span> and Co.
          </h1>
          <p className="mt-2 text-gray-400 text-sm">Admin Dashboard</p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex flex-1 md:items-center justify-center p-8">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <h2 className="text-4xl font-extralight mb-2">Welcome Back</h2>
          <p className="mb-8 text-gray-400">Please log in to your account.</p>

          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 py-4 rounded-lg text-white font-semibold text-lg hover:bg-orange-700 transition duration-300 shadow-lg"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Optional: Forgotten Password link */}
          <p className="text-center mt-6 text-sm text-gray-500 cursor-pointer hover:text-orange-400 transition duration-300">
            Forgotten your password? Please contact your administrator
          </p>
        </form>
      </div>
    </div>
  );
}