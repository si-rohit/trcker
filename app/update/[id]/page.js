"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TakePhoto from "@/components/TakePhoto";

export default function Page() {
  const { id } = useParams()
  const [openTakePhoto, setOpenTakePhoto] = useState(false);
  const [form, setForm] = useState({
    truckNumber: "",
    companyName:  "",
    UnloadedImage: [],
    tripNumber: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, UnloadedImage: [...form.UnloadedImage, e.target.files[0]] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  useEffect(()=>{
    const getdetails = async()=>{
        const res = await fetch('/api/getAndDeleteTrip',{method:"POST", body:id})
        const data = await res.json()
        // console.log(data)
        setForm({
            truckNumber:data.truckNumber,
            companyName:data.companyName,
            tripNumber:data.tripNumber,
            UnloadedImage:[],
        })
    }
    getdetails()
  },[id])


  const handleSubmit = async(e) => {
    e.preventDefault();
    // onSubmit(form);
    const formData = new FormData();
    formData.append('truckNumber',form.truckNumber)
    formData.append('companyName',form.companyName)
    form.UnloadedImage.forEach((file) => {
      formData.append("UnloadedImage", file);
    });
    formData.append("id", id);
    try {
      const resp = await fetch('/api/updateTrip',{
        method:'PUT',
        body: formData
      })
      const data =await resp.json()
    //   console.log(data)
      if (data.success) {
        alert('update successfully')
        window.history.back()
      }

    } catch (error) {
      console.log(error)
      alert(error)
    }
  };

  return (
    <div className="flex flex-col text-black">
      <div className="bg-[#000] text-white py-2 px-2 flex items-center gap-3">
        <span onClick={(e)=>window.history.back()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move-left-icon lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg></span>
        <p className="text-2xl">Update Trip</p>
      </div>
      <form className="space-y-4 bg-white p-6 rounded-xl max-[426px]:shadow-none shadow-md max-w-lg mx-auto mt-4">
        <input
          type="text"
          name="tripNumber"
          placeholder="Trip Number"
          value={form.tripNumber}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
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
          <div className={`flex items-center justify-center flex-col gap-5 bg-gray-100 border-2 border-dotted text-center py-8 cursor-pointer`} onClick={()=>document.getElementById('UnloadedImage').click()}>
            <span className="bg-white p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line"><path d="m18 9-6-6-6 6"/><path d="M12 3v14"/><path d="M5 21h14"/></svg></span>
            <p>Drag and Drop || Select Image </p>
            <input type="file" name="UnloadedImage" onChange={handleChange} id="UnloadedImage" className="w-full hidden" />
          </div>
        </div>
        {
            form.UnloadedImage.length !== 0 && 
            <div className="relative flex items-center gap-2 ">           
              {
                form.UnloadedImage.map((image,i)=>{
                  return(
                    <div className="relative" key={i}>
                      <button onClick={(e)=>{e.preventDefault();form.UnloadedImage.splice(i,1);setForm({...form})}} className="absolute top-2 right-2 text-red-500 bg-black p-1 rounded-full">❌</button>
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
          Update
        </button>
      </form>
      {openTakePhoto && <TakePhoto setOpenTakePhoto={setOpenTakePhoto} form={form} setForm={setForm} uploadType="UnloadedImage" />}
    </div>
  );
}
