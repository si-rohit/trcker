"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TakePhoto from "@/components/TakePhoto";

export default function Page() {
  const { id } = useParams();
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
  
    let uid = localStorage.getItem("user");
    if (!uid) {
      window.location.href = "/login";
    }

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
          const dataa = await res.json();
          // console.log(dataa.trip);
          const data = dataa.trip;
          setForm({
            truckNumber: data.truckNumber,
            companyName: data.companyName,
            tripNumber: data.tripNumber,
            weight:data.weight,
            FrontImage: data.FrontImage || null,
            TopImage: data.TopImage || null,
            LoadedImage1: data.LoadedImage1 || null,
            LoadedImage2: data.LoadedImage2 || null,
            RoyaltyImage: data.RoyaltyImage || null,
            WeightReciept: data.WeightReciept || null,
            UnloadedImage1: data.UnloadedImage1 || null,
            UnloadedImage2: data.UnloadedImage2 || null,
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
      setLoading(true);
      const formData = new FormData();
      formData.append('truckNumber', form.truckNumber);
      formData.append('companyName', form.companyName);
      formData.append("id", id);
      formData.append('weight', form.weight);
      formData.append('tripNumber', form.tripNumber);
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
        const resp = await fetch('/api/updateTrip', {
          method: 'PUT',
          body: formData
        });
        const data = await resp.json();
        if (data.success) {
          alert('Update successful!');
          setLoading(false);
          window.history.back();
        }
      } catch (error) {
        console.log(error);
        alert(error);
        setLoading(false);
      }
    };

    console.log(form);

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
        <p className="text-2xl font-light">Update </p>
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
            disabled={form.tripNumber !== null && form.tripNumber !== ""}
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
            disabled={form.truckNumber !== null && form.truckNumber !== ""}
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
            disabled={form.companyName !== null && form.companyName !== ""}
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
            disabled={form.weight !== null && form.weight !== ""}
          />

          {/* Submit Button */}
          <button type="submit" className="bg-orange-600 text-white px-4 py-4 flex items-center gap-2 justify-center rounded-lg w-full font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform hover:scale-105">
            {loading ? 'Loading...' : <span className="flex items-center gap-2">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg></span>
                Update 
              </span>}
          </button>
        </form>

        <div className={`grid grid-cols-2 gap-4 w-[400px] ${openTakePhoto?'hidden':''}`}>
          {
            form.FrontImage === null ?        
            <button onClick={(e) => { e.preventDefault(); setClickButton('FrontImage'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.FrontImage?'hidden':''}`}>
              Front picture of dumper on weighbridge
            </button>:<img src={form.FrontImage instanceof File ? URL.createObjectURL(form.FrontImage) :form.FrontImage} alt="Front Image" className="h-20 object-cover" />
          }
          { 
            form.TopImage === null ?
            <button  onClick={(e) => { e.preventDefault(); setClickButton('TopImage'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.TopImage?'hidden':''}`}>
              Top picture of dumper on weighbridge
            </button>:<img src={form.TopImage instanceof File ? URL.createObjectURL(form.TopImage) :form.TopImage} alt="Top Image" className="h-20 object-cover" />
          }
          {
            form.LoadedImage1 === null? 
            <button onClick={(e) => { e.preventDefault(); setClickButton('LoadedImage1'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.LoadedImage1?'hidden':''}`}>
              Loaded dumper Picture 1
            </button>:<img src={form.LoadedImage1 instanceof File ? URL.createObjectURL(form.LoadedImage1) :form.LoadedImage1} alt="Loaded Image 1" className="h-20 object-cover" />
          }
          { form.LoadedImage2 === null?
          
          <button onClick={(e) => { e.preventDefault(); setClickButton('LoadedImage2'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.LoadedImage2?'hidden':''}`}>
            Loaded dumper Picture 2
          </button>:<img src={form.LoadedImage2 instanceof File ? URL.createObjectURL(form.LoadedImage2) :form.LoadedImage2 } alt="Loaded Image 2" className="h-20 object-cover" />
          }
          { form.RoyaltyImage === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('RoyaltyImage'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.RoyaltyImage?'hidden':''}`}>
            Royalty Picture
          </button>:<img src={form.RoyaltyImage instanceof File ? URL.createObjectURL(form.RoyaltyImage) :form.RoyaltyImage} alt="Royalty Image" className="h-20 object-cover" />
          }
          { form.WeightReciept === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('WeightReciept'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.WeightReciept?'hidden':''}`}>
            weighbridge Reciept
          </button>:<img src={form.WeightReciept instanceof File ? URL.createObjectURL(form.WeightReciept) :form.WeightReciept} alt="Weight Reciept" className="h-20 object-cover" />
          }
          { form.UnloadedImage1 === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('UnloadedImage1'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.UnloadedImage1?'hidden':''}`}>
            Unloaded dumper Picture 1
          </button>:<img src={form.UnloadedImage1 instanceof File ? URL.createObjectURL(form.UnloadedImage1) :form.UnloadedImage1 } alt="Unloaded Image 1" className="h-20 object-cover" />
          }
          { form.UnloadedImage2 === null?
          <button onClick={(e) => { e.preventDefault(); setClickButton('UnloadedImage2'); setOpenTakePhoto(true);}} className={`border-dashed border-2 border-orange-600 text-white px-4 py-3 flex items-center gap-2 justify-center rounded-lg font-semibold shadow-md hover:bg-orange-700 transition duration-300 transform cursor-pointer w-full ${form.UnloadedImage2?'hidden':''}`}>
            Unloaded dumper Picture 2
          </button>:<img src={form.UnloadedImage2 instanceof File ? URL.createObjectURL(form.UnloadedImage2) : form.UnloadedImage2} alt="Unloaded Image 2" className="h-20 object-cover" />
          }
        </div>
        {openTakePhoto && <TakePhoto setOpenTakePhoto={setOpenTakePhoto} form={form} setForm={setForm} clickButton={clickButton} />}
      </div>
    </div>
  );
}