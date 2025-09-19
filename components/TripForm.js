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
    tripNumber: "",
    weight: "",    
    FrontImage: null,
    TopImage: null,
    LoadedImage1: null,
    LoadedImage2: null,
    RoyaltyImage: null,
    WeightReciept: null,
    UnloadedImage1: null,
    UnloadedImage2: null,
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');


  // let uid = localStorage.getItem("user");

  useEffect(() => {
  const token = localStorage.getItem("user");
  setUid(token);
}, []);

useEffect(() => {
  if (uid === '') return; // jab tak value load nahi hoti kuch mat kar
  if (!uid) router.push("/login");
}, [uid]);

// console.log(uid);

  console.log(uid);

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
    formData.append('UnloadedImage1', form.UnloadedImage1);
    formData.append('UnloadedImage2', form.UnloadedImage2);
    // formData.append('date', new Date().toISOString());

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
          FrontImage: null,
          TopImage: null,
          LoadedImage1: null,
          LoadedImage2: null,
          RoyaltyImage: null,
          WeightReciept: null,
          UnloadedImage1: null,
          UnloadedImage2: null,
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

  const handleClose = () => {
    setOpenTakePhoto(false);
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
      <div className=" flex justify-center p-4 gap-8 max-[600px]:flex-col">
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

          {/* Submit Button */}
          <button type="submit" className="bg-orange-600 text-white px-4 py-4 flex items-center gap-2 justify-center rounded-lg w-full font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105">
            {loading ? 'Loading...' : <span className="flex items-center gap-2">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg></span>
                Create 
              </span>}
          </button>
        </form>

        <div className={`grid grid-cols-2 gap-4 w-[400px] ${openTakePhoto?'hidden':''}`}>
          {
            form.FrontImage === null ?        
            <button onClick={(e) => { e.preventDefault(); setClickButton('FrontImage'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.FrontImage?'hidden':''}`}>
              Front picture of dumper on weighbridge
            </button>:<img src={form.FrontImage instanceof File ? URL.createObjectURL(form.FrontImage) : ""} alt="Front Image" className=" object-cover" />
          }
          { 
            form.TopImage === null ?
            <button  onClick={(e) => { e.preventDefault(); setClickButton('TopImage'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.TopImage?'hidden':''}`}>
              Top picture of dumper on weighbridge
            </button>:<img src={form.FrontImage instanceof File ? URL.createObjectURL(form.TopImage): ''} alt="Top Image" className=" object-cover" />
          }
          {
            form.LoadedImage1 === null? 
            <button onClick={(e) => { e.preventDefault(); setClickButton('LoadedImage1'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.LoadedImage1?'hidden':''}`}>
              Loaded dumper Picture 1
            </button>:<img src={URL.createObjectURL(form.LoadedImage1)} alt="Loaded Image 1" className=" object-cover" />
          }
          { form.LoadedImage2 === null?
          
          <button onClick={(e) => { e.preventDefault(); setClickButton('LoadedImage2'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.LoadedImage2?'hidden':''}`}>
            Loaded dumper Picture 2
          </button>:<img src={URL.createObjectURL(form.LoadedImage2)} alt="Loaded Image 2" className=" object-cover" />
          }
          { form.RoyaltyImage === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('RoyaltyImage'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.RoyaltyImage?'hidden':''}`}>
            Royalty Picture
          </button>:<img src={URL.createObjectURL(form.RoyaltyImage)} alt="Royalty Image" className=" object-cover" />
          }
          { form.WeightReciept === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('WeightReciept'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.WeightReciept?'hidden':''}`}>
            weighbridge Reciept
          </button>:<img src={URL.createObjectURL(form.WeightReciept)} alt="Weight Reciept" className=" object-cover" />
          }
          { form.UnloadedImage1 === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('UnloadedImage1'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.UnloadedImage1?'hidden':''}`}>
            Unloaded dumper Picture 1
          </button>:<img src={URL.createObjectURL(form.UnloadedImage1)} alt="Unloaded Image 1" className=" object-cover" />
          }
          { form.UnloadedImage2 === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('UnloadedImage2'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.UnloadedImage2?'hidden':''}`}>
            Unloaded dumper Picture 2
          </button>:<img src={URL.createObjectURL(form.UnloadedImage2)} alt="Unloaded Image 2" className=" object-cover" />
          }
        </div>
        {openTakePhoto && <TakePhoto handleClose={handleClose} form={form} setForm={setForm} clickButton={clickButton} uploadType={"LoadedImage"} />}
      </div>
    </div>
  );
}