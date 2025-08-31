"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "GET",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log(data)
    // if (data.success) {
    //   localStorage.setItem("token", data.token);
    //   router.push("/");
    // } else {
    //   alert("Invalid credentials ❌");
    // }
  };

  return (
    <div className="flex h-screen bg-[#002b36] text-white">
      {/* Left Section */}
      <div className="hidden md:flex flex-1 items-center justify-center flex-col border-r border-gray-700">
        <div className="flex flex-col items-center">
          {/* Replace with your logo */}
          <div className="w-16 h-16 bg-gradient-to-b from-teal-500 to-orange-500 rounded-full mb-4"></div>
          <h1 className="text-2xl font-semibold">Bailey and Co.</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-transparent p-8"
        >
          <h2 className="text-3xl font-light mb-2">Welcome</h2>
          <p className="mb-6 text-gray-300">Please login to Admin Dashboard.</p>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-orange-600 py-3 rounded text-white font-semibold hover:bg-orange-700 transition"
          >
            LOGIN
          </button>

          <p className="text-center mt-4 text-sm text-gray-400 cursor-pointer hover:text-white">
            Forgotten your password?
          </p>
        </form>
      </div>
    </div>
  );
}
