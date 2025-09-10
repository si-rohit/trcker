"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TakePhoto from "@/components/TakePhoto";

export default function Page() {
  const { id } = useParams();
  const [openTakePhoto, setOpenTakePhoto] = useState(false);
  const [form, setForm] = useState({
    truckNumber: "",
    companyName: "",
    UnloadedImage: [],
    tripNumber: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, UnloadedImage: [...form.UnloadedImage, ...e.target.files] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    const getdetails = async () => {
      try {
        const res = await fetch('/api/getAndDeleteTrip', { method: "POST", body: id });
        const data = await res.json();
        setForm({
          truckNumber: data.truckNumber,
          companyName: data.companyName,
          tripNumber: data.tripNumber,
          UnloadedImage: [],
        });
      } catch (error) {
        console.log(error);
        alert("Failed to fetch trip details.");
      }
    };
    if (id) {
      getdetails();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('truckNumber', form.truckNumber);
    formData.append('companyName', form.companyName);
    form.UnloadedImage.forEach((file) => {
      formData.append("UnloadedImage", file);
    });
    formData.append("id", id);
    try {
      const resp = await fetch('/api/updateTrip', {
        method: 'PUT',
        body: formData
      });
      const data = await resp.json();
      if (data.success) {
        alert('Update successful!');
        window.history.back();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm(prevForm => ({
      ...prevForm,
      UnloadedImage: prevForm.UnloadedImage.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="sticky top-0 z-10 bg-gray-800 text-white py-4 px-4 flex items-center gap-4 shadow-md">
        <span className="cursor-pointer text-orange-500" onClick={() => window.history.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M31 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </span>
        <p className="text-2xl font-light">Update </p>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center p-4">

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl shadow-2xl w-full max-w-lg">
          <input
            type="text"
            name="tripNumber"
            placeholder="Trip Number"
            value={form.tripNumber}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            required
          />
          <input
            type="text"
            name="truckNumber"
            placeholder="Truck Number"
            value={form.truckNumber}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            required
          />
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
            <button className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300" onClick={(e) => { e.preventDefault(); setOpenTakePhoto(true); }}>Take Photo</button>
            <p className="text-gray-400">OR</p>
            <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:border-orange-500 transition duration-300" onClick={() => document.getElementById('UnloadedImage').click()}>
              <span className="bg-gray-700 p-3 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="m18 9-6-6-6 6" /><path d="M12 3v14" /><path d="M5 21h14" /></svg>
              </span>
              <p className="text-gray-300 font-medium">Drag and Drop or <span className="text-orange-400 font-semibold">Select Image</span></p>
              <input type="file" name="UnloadedImage" onChange={handleChange} id="UnloadedImage" className="hidden" multiple />
            </div>
          </div>

          {/* Image Preview */}
          {form.UnloadedImage.length > 0 && (
            <div className="relative flex flex-wrap gap-4 mt-4">
              {form.UnloadedImage.map((image, i) => (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-lg" key={i}>
                  <button onClick={(e) => { e.preventDefault(); handleRemoveImage(i); }} className="absolute top-1 right-1 text-red-500 text-lg bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-70 transition-all">❌</button>
                  <img src={URL.createObjectURL(image)} alt={`Image ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="bg-orange-600 text-white px-4 py-3 rounded-lg w-full font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105">
            Update
          </button>
        </form>
        {openTakePhoto && <TakePhoto setOpenTakePhoto={setOpenTakePhoto} form={form} setForm={setForm} uploadType="UnloadedImage" />}
      </div>
    </div>
  );
}