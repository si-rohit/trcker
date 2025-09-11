"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("name", name);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
    const res = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    // console.log(data)
    if (data.success) {
      // localStorage.setItem("token", data.token);
      router.push("/login");
      setLoading(false);
    } else {
      alert("Invalid credentials ❌");
      setLoading(false);
    }
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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="suppervisor">suppervisor</option>
            <option value="admin">Admin</option>          
          </select>

          <button
            type="submit"
            className="w-full bg-orange-600 py-3 rounded text-white font-semibold hover:bg-orange-700 transition"
          >
            {loading ? "Loading..." : "Register"}
          </button>

          <p className="text-center mt-4 text-sm text-gray-400 cursor-pointer hover:text-white">
            Forgotten your password?
          </p>
        </form>
      </div>
    </div>
  );
}
