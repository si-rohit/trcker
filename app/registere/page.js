"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
   const searchParams = useSearchParams();
  const id = searchParams.get("id");


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    if (data.message === "Admin created successfully") {
      router.push("/login");
      setLoading(false);
    } else {
      alert("Invalid credentials ❌");
      setLoading(false);
      // console.log(data);
    }
  };

  const handleFeatchDetails = async () => {
    const res = await fetch(`/api/getUserDetail`, {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id}),
    });
    const data = await res.json();
    // console.log(data);
    if (data) {
      setUsername(data.username);
      setEmail(data.email);
      setRole(data.role);
      setName(data.name);
    }
  }
  useEffect(() => {
    if (id) {
       handleFeatchDetails();
    }
   
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("name", name);
    formData.append("id", id);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
    const res = await fetch(`/api/auth/updateUser`, {
      method: "POST",     
      body: formData,
    });
    const data = await res.json();
    // console.log(data);
    if (data.message === "User updated successfully") {
      router.push("/users");
      setLoading(false);
    } else {
      alert("something went wrong");
      setLoading(false);
      // console.log(data);
    }
  };

  return (
    <div className="flex h-screen bg-[#002b36] text-white">

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={id ? handleUpdate : handleLogin}
          className="w-full max-w-sm bg-transparent p-8"
        >
          <h2 className="text-3xl font-light mb-2"> {id ? "Update User" : "+ Add new User"}</h2>
          {/* <p className="mb-6 text-gray-300">A</p> */}

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
            // required
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
            <option value="suppervisor1" className='text-black'>suppervisor 1</option>
            <option value="suppervisor2" className='text-black'>suppervisor 2</option>
            <option value="admin" className='text-black'>Admin</option>          
          </select>

          <button
            type="submit"
            className="w-full bg-orange-600 py-3 rounded text-white font-semibold hover:bg-orange-700 transition"
          >
            {loading ? "Loading..." : `${id ? "Update User" : "+ Add new User"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
