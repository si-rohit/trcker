"use client";
import { useState } from "react";
import TakePhoto from "./TakePhoto";

export default function TripForm() {
  const [openTakePhoto, setOpenTakePhoto] = useState(false);
  const [form, setForm] = useState({
    truckNumber: "",
    companyName:  "",
    LoadedImage: [],
    tripNumber: "",
  });


  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, LoadedImage: [...form.LoadedImage, e.target.files[0]] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // console.log(form)
  const handleSubmit = async(e) => {
    e.preventDefault();
    // onSubmit(form);
    const formData = new FormData();
    formData.append('truckNumber',form.truckNumber)
    formData.append('tripNumber',form.tripNumber)
    formData.append('companyName',form.companyName)
    form.LoadedImage.forEach((file) => {
      formData.append("LoadedImage", file);
    });

    try {
      const resp = await fetch('/api/createTrip',{
        method:'POST',
        body: formData
      })
      const data = await resp.json()
      console.log(data)
      if (data.success) {
        setForm({
          truckNumber: "",
          companyName:  "",
          LoadedImage: [],
          tripNumber: "",
        })
      }

    } catch (error) {
      console.log(error)
      alert(error)
    }
  };

  return (
    <div className="flex flex-col text-black min-h-screen overflow-y-scroll">
      <div className="bg-[#000] text-white py-2 px-2 flex items-center justify-center max-[426px]:justify-left gap-3">
        <span className="cursor-pointer hidden max-[426px]:block" onClick={(e)=>window.history.back()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-left-icon lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg></span>
        <p className="text-2xl">Create Trip</p>
      </div>
      <div className="flex items-center justify-center">
        <form className="flex flex-col gap-4 bg-white p-6 rounded-xl max-[426px]:shadow-none shadow-md min-w-xl mt-4 mx-auto">
          <input
            type="text"
            name="tripNumber"
            placeholder="Trip Number"
            value={form.tripNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required/>
          <input
            type="text"
            name="truckNumber"
            placeholder="Truck Number"
            value={form.truckNumber}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <div className="flex flex-col gap-2 justify-center text-center">
            <button className="bg-[#555] text-white px-4 py-2 rounded" onClick={(e)=>{e.preventDefault();setOpenTakePhoto(true)}}>Take Picture</button>
              <p>OR</p>
            <div className={`flex items-center justify-center flex-col gap-5 bg-gray-100 border-2 border-dotted text-center py-8 cursor-pointer`} onClick={()=>document.getElementById('loadedImage').click()}>
                <span className="bg-white p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg></span>
                <p>Drag and Drop || Select Image </p>
                <input type="file" name="LoadedImage" onChange={handleChange} id="loadedImage" className="w-full hidden" />
            </div>
          </div>
          
        
          {
            form.LoadedImage.length !== 0 && 
            <div className="relative flex items-center gap-2 ">           
              {
                form.LoadedImage.map((image,i)=>{
                  return(
                    <div className="relative" key={i}>
                      <button onClick={(e)=>{e.preventDefault();form.LoadedImage.splice(i,1);setForm({...form})}} className="absolute top-2 right-2 text-red-500 bg-black p-1 rounded-full">❌</button>
                      <img src={typeof image === "string"
          ? image // agar base64 hai
          : URL.createObjectURL(image)} className="w-30 h-30"/>
                    </div>
                  )
                })
              }
            </div> 
          }

          <button type="submit" onClick={(e)=>handleSubmit(e)} className="bg-black text-white px-4 py-2 rounded w-full">
            Create
          </button>
        </form>
        {openTakePhoto && <TakePhoto setOpenTakePhoto={setOpenTakePhoto} form={form} setForm={setForm} uploadType={"LoadedImage"}/>}
      </div>
      
    </div>
    
  );
}
