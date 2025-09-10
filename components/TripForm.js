"use client";
import { useState } from "react";
import TakePhoto from "./TakePhoto";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TripForm() {
  const [openTakePhoto, setOpenTakePhoto] = useState(false);
  const [form, setForm] = useState({
    truckNumber: "",
    companyName: "",
    LoadedImage: [],
    tripNumber: "",
  });
  const router = useRouter();


  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, LoadedImage: [...form.LoadedImage, e.target.files[0]] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('truckNumber', form.truckNumber);
    formData.append('tripNumber', form.tripNumber);
    formData.append('companyName', form.companyName);
    form.LoadedImage.forEach((file) => {
      formData.append("LoadedImage", file);
    });

    try {
      const resp = await fetch('/api/createTrip', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      console.log(data);
      if (data.success) {
        setForm({
          truckNumber: "",
          companyName: "",
          LoadedImage: [],
          tripNumber: "",
        });
        alert("Trip created successfully!");
        router.push("/trips");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to create trip.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header with sticky position */}
      <div className="sticky top-0 z-10 bg-gray-800 text-white py-4 px-4 flex items-center gap-4 shadow-md">
        <span className="cursor-pointer text-orange-500" onClick={() => router.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M31 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </span>
        <p className="text-2xl font-light">Create </p>
        <div></div> {/* Spacer to balance header */}
      </div>

      {/* Form Section */}
      <div className="flex-1 flex justify-center p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl shadow-2xl w-full max-w-lg">
          {/* Trip Number Input */}
          <input
            type="text"
            name="tripNumber"
            placeholder="Trip Number"
            value={form.tripNumber}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            required
          />
          {/* Truck Number Input */}
          <input
            type="text"
            name="truckNumber"
            placeholder="Truck Number"
            value={form.truckNumber}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            required
          />
          {/* Company Name Input */}
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            required
          />

          {/* Image Upload Section */}
          <div className="flex flex-col gap-4 text-center">
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2" onClick={(e) => { e.preventDefault(); setOpenTakePhoto(true); }}><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-icon lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/></svg></span> Take Photo</button>
            <p className="text-gray-400">OR</p>
            <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:border-orange-500 transition duration-300" onClick={() => document.getElementById('loadedImage').click()}>
              <span className="bg-gray-700 p-3 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="m18 9-6-6-6 6" /><path d="M12 3v14" /><path d="M5 21h14" /></svg>
              </span>
              <p className="text-gray-300 font-medium">Drag and Drop or <span className="text-orange-400 font-semibold">Select Image</span></p>
              <input type="file" name="LoadedImage" onChange={handleChange} id="loadedImage" className="hidden" multiple />
            </div>
          </div>

          {/* Image Preview */}
          {form.LoadedImage.length > 0 && (
            <div className="relative flex flex-wrap gap-4 mt-4">
              {form.LoadedImage.map((image, i) => (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-lg" key={i}>
                  <button onClick={(e) => { e.preventDefault(); const newImages = [...form.LoadedImage]; newImages.splice(i, 1); setForm({ ...form, LoadedImage: newImages }); }} className="absolute top-1 right-1 text-red-500 text-lg bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70 transition-all">❌</button>
                  <img src={URL.createObjectURL(image)} alt={`Image ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="bg-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg w-full font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg></span>
            Create 
          </button>
        </form>
        {openTakePhoto && <TakePhoto setOpenTakePhoto={setOpenTakePhoto} form={form} setForm={setForm} uploadType={"LoadedImage"} />}
      </div>
    </div>
  );
}