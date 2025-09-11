"use client";
import { useEffect, useState } from "react";
import TakePhoto from "./TakePhoto";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { set } from "mongoose";

export default function TripForm() {
  const [openTakePhoto, setOpenTakePhoto] = useState(false);
  const [clickButton, setClickButton] = useState('');
  const [form, setForm] = useState({
    truckNumber: "",
    companyName: "",
    // LoadedImage: [],
    tripNumber: "",
    weight: "",    
    FrontImage: "",
    TopImage: "",
    LoadedImage1: "",
    LoadedImage2:'',
    RoyaltyImage: "",
    WeightReciept:'',
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  let uid = localStorage.getItem("user");

  useEffect(() => {
    if (!uid) router.push("/login");
  }, [uid]);

  // console.log(uid);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, LoadedImage: [...form.clickButton, e.target.files[0]] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('truckNumber', form.truckNumber);
    formData.append('tripNumber', form.tripNumber);
    formData.append('companyName', form.companyName);
    formData.append('weight', form.weight);
    formData.append('uid', uid); 
    formData.append('FrontImage', form.FrontImage);
    formData.append('TopImage', form.TopImage);
    formData.append('LoadedImage1', form.LoadedImage1);
    formData.append('LoadedImage2', form.LoadedImage2);
    formData.append('RoyaltyImage', form.RoyaltyImage);
    formData.append('WeightReciept', form.WeightReciept);

    try {
      const resp = await fetch('/api/createTrip', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      // console.log(data);
      if (data.success) {
        setForm({
          truckNumber: "",
          companyName: "",
          tripNumber: "",
          weight: "",
          FrontImage: "",
          TopImage: "",
          LoadedImage1: "",
          LoadedImage2: "",
          RoyaltyImage: "",
          WeightReciept: "",
        });
        alert("Trip created successfully!");
        setLoading(false);
        router.push("/");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Failed to create trip.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header with sticky position */}
      <div className="sticky top-0 z-10 bg-gray-800 text-white py-4 px-4 flex items-center gap-4 shadow-md">
        <span className="cursor-pointer text-orange-500" onClick={() => router.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M31 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </span>
        <p className="text-2xl font-light">Create </p>
        <div></div> {/* Spacer to balance header */}
      </div>

      {/* Form Section */}
      <div className=" flex justify-center p-4 gap-8">
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
          {/* weight */}
          <input
            type="text"
            name="weight"
            placeholder="Weight"
            value={form.weight}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            required
          />

          {/* Take Photo Button */}
            {/* <button className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2" onClick={(e) => { e.preventDefault(); setOpenTakePhoto(true); }}><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera-icon lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/></svg></span> Take Photo</button> */}

          {/* Image Upload Section */}
          <div className="flex flex-col gap-4 text-center">
            {/* <p className="text-gray-400">OR</p> */}
            <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-gray-600 cursor-pointer hover:border-orange-500 transition duration-300" onClick={() => document.getElementById('loadedImage').click()}>
              <span className="bg-gray-700 p-3 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="m18 9-6-6-6 6" /><path d="M12 3v14" /><path d="M5 21h14" /></svg>
              </span>
              <p className="text-gray-300 font-medium">Drag and Drop or <span className="text-orange-400 font-semibold">Select Image</span></p>
              <input type="file" name={clickButton} onChange={(e)=> { setClickButton(e.target.name); setForm({ ...form, [e.target.name]: e.target.files[0] }) }} id="loadedImage" className="hidden" multiple />
            </div>
          </div>

          {/* Image Preview */}
          <div className="flex flex-wrap gap-4">
            {form.FrontImage && <img src={URL.createObjectURL(form.FrontImage)} alt="Front Image" className="w-[100px] h-[100px] object-cover" />}
            {form.TopImage && <img src={URL.createObjectURL(form.TopImage)} alt="Top Image" className="w-[100px] h-[100px] object-cover" />}
            {form.LoadedImage1 && <img src={URL.createObjectURL(form.LoadedImage1)} alt="Side Image" className="w-[100px] h-[100px] object-cover" />}
            {form.LoadedImage2 && <img src={URL.createObjectURL(form.LoadedImage2)} alt="Side Image" className="w-[100px] h-[100px] object-cover" />}
            {form.RoyaltyImage && <img src={URL.createObjectURL(form.RoyaltyImage)} alt="Royalty Image" className="w-[100px] h-[100px] object-cover" />}
            {form.WeightReciept && <img src={URL.createObjectURL(form.WeightReciept)} alt="Weight Reciept" className="w-[100px] h-[100px] object-cover" />}

          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-orange-600 text-white px-4 py-4 flex items-center gap-2 justify-center rounded-lg w-full font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105">
            {loading ? 'Loading...' : <span className="flex items-center gap-2">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg></span>
                Create 
              </span>}
          </button>
        </form>

        <div className={`flex flex-wrap gap-4 w-[400px] `}>
          <button onClick={(e) => { e.preventDefault(); setClickButton('FrontImage'); document.getElementById('loadedImage').click(); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.FrontImage?'hidden':''}`}>
            Take Front picture of dumper on weighbridge
          </button>
          <button  onClick={(e) => { e.preventDefault(); setClickButton('TopImage'); document.getElementById('loadedImage').click(); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.TopImage?'hidden':''}`}>
            Take Top picture of dumper on weighbridge
          </button>
          <button onClick={(e) => { e.preventDefault(); setClickButton('LoadedImage1'); document.getElementById('loadedImage').click(); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.LoadedImage1?'hidden':''}`}>
            Take Loaded dumper Picture 1
          </button>
          <button onClick={(e) => { e.preventDefault(); setClickButton('LoadedImage2'); document.getElementById('loadedImage').click(); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.LoadedImage2?'hidden':''}`}>
            Take Loaded dumper Picture 2
          </button>
          <button onClick={(e) => { e.preventDefault(); setClickButton('RoyaltyImage'); document.getElementById('loadedImage').click(); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.RoyaltyImage?'hidden':''}`}>
            Take Royalty Picture
          </button>
          <button onClick={(e) => { e.preventDefault(); setClickButton('WeightReciept'); document.getElementById('loadedImage').click(); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.WeightReciept?'hidden':''}`}>
            Take weighbridge Reciept
          </button>
        </div>
        {/* {openTakePhoto && <TakePhoto setOpenTakePhoto={setOpenTakePhoto} form={form} setForm={setForm} clickButton={clickButton} uploadType={"LoadedImage"} />} */}
      </div>
    </div>
  );
}