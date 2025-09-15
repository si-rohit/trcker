'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from "date-fns";

const Page = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openImage, setOpenImage] = useState('')
  const [isAdmin, setIsAdmin] = useState("");
  const [allDataIsPresent, setAllDataIsPresent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    if (!role) {
      router.push("/login");
      return;
    }
    setIsAdmin(role);
    if (!token) {
      router.push("/login");
      return;
    }
    // uid = token;
    // fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getdetails = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/getAndDeleteTrip', { method: "POST", body: id })
        const data = await res.json()
        // console.log(data)
        setForm(data.trip)
        if (data.trip.tripNumber &&
          data.trip.truckNumber &&
          data.trip.companyName &&
          data.trip.EnterTime &&
          data.trip.weight &&
          data.trip.Suppervisor1 &&
          data.trip.FrontImage &&
          data.trip.TopImage &&
          data.trip.LoadedImage1 &&
          data.trip.LoadedImage2 &&
          data.trip.RoyaltyImage &&
          data.trip.WeightReciept &&
          data.trip.UnloadedImage1 &&
          data.trip.UnloadedImage2 &&
          data.trip.Suppervisor2) {
          setAllDataIsPresent(true);
        }
      } catch (error) {
        console.error("Failed to fetch trip details:", error)
      } finally {
        setLoading(false)
      }
    }
    getdetails()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-400">
        <p>Loading...</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">
        <p>No trip details found.</p>
      </div>
    )
  }

  const handelCompleteTrip = async () => {
    if (!allDataIsPresent) {
      alert("Cannot complete trip. Some trip details are missing.");
      return;
    }
    try {
      const res = await fetch('/api/completeTrip', { method: "POST", body: id })
      const data = await res.json()
      // console.log(data)
      if (data.success) {
        alert("Trip marked as complete.")
        setForm({ ...form, status: 'complete' })
      } else {
        alert("Failed to mark trip as complete.")
      }
    } catch (error) {
      console.error("Failed to complete trip:", error)
      alert("An error occurred while completing the trip.")
    }
  }

  console.log(form)

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col'>
      {/* Mobile Header (Sticky) */}
      <div className="sticky top-0 z-10 bg-gray-800 text-white py-4 px-4 flex items-center justify-between gap-4 shadow-md">
        <div className='flex items-center gap-3'>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M31 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        <p className="text-2xl font-extralight">No. <span className='text-orange-500 font-extrabold'>{form.truckNumber}</span></p>
        </div>

        <Link href={`/update/${id}`} className={`flex text-right bg-gray-700 py-2 px-4 rounded-md text-sm ${allDataIsPresent ?'hidden':''}`}>Update</Link>
        
        <button onClick={()=>handelCompleteTrip()} className={`flex text-right bg-orange-500 py-2 px-4 rounded-md text-sm ${isAdmin === 'suppervisor2'?'hidden':''} ${form.ExitTime ?'hidden':''} ${allDataIsPresent ?'':'hidden'}`}>Complete</button>
      </div>

      {/* Main Content Wrapper with increased width */}
      <div className='flex-1 p-4 md:p-8'>
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-12 mb-8">
            <p className="text-lg">
              <span className="font-semibold text-gray-400 block">Trip Number</span> {form.tripNumber}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-400 block">Truck Number</span> {form.truckNumber}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-400 block">Company Name</span> {form.companyName}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-400 block">Entry Time</span> {formatDistanceToNow(new Date(form.EnterTime), { addSuffix: true })}
            </p>  
            <p className="text-lg">
              <span className="font-semibold text-gray-400 block">Weight</span> {form.weight} kg
            </p>
            <p className="text-lg">
              <span className="font-semibold text-gray-400 block">Supervisor 1</span> {form.Suppervisor1.name}
            </p>       
          </div>

          {/* Loaded Image Section */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
            {/* <p className="text-xl font-semibold text-gray-300 mb-4">Load Image</p> */}
            <div className={`${form.FrontImage === null ? 'hidden' : ''}`}>
              <p>Front Image</p>
              <img src={form.FrontImage } className='w-[200px] h-[200px]' alt='Front Image'></img>
            </div>
            <div className={`${form.TopImage === null ? 'hidden' : ''}`}>
              <p>Top Image</p>
              <img src={form.TopImage} className='w-[200px] h-[200px]' alt='Top Image'></img>
            </div>
            <div className={`${form.LoadedImage1 === null ? 'hidden' : ''}`}>
              <p>Loaded Image 1</p>
              <img src={form.LoadedImage1} className='w-[200px] h-[200px]' alt='Loaded Image 1'></img>
            </div>
            <div className={`${form.LoadedImage2 === null ? 'hidden' : ''}`}>
              <p>Loaded Image 2</p>
              <img src={form.LoadedImage2} className='w-[200px] h-[200px]' alt='Loaded Image 2'></img>
            </div>
            <div className={`${form.RoyaltyImage === null ? 'hidden' : ''}`}>
              <p>Royalty Image</p>
              <img src={form.RoyaltyImage} className='w-[200px] h-[200px]' alt='Royalty Image'></img>
            </div>
            <div className={`${form.WeightReciept === null ? 'hidden' : ''}`}>
              <p>Weight Reciept</p>
              <img src={form.WeightReciept} className='w-[200px] h-[200px]' alt='Weight Reciept'></img>
            </div>
          </div>

          {form.ExitTime && (
            <div className={`}`}>
              <p className="text-lg mb-8">
                <span className="font-semibold text-gray-400 block">Exit Time</span> {formatDistanceToNow(new Date(form.ExitTime), { addSuffix: true })}
              </p>
              
            </div>
          )}
            <span className="font-semibold text-gray-400 block">Supervisor 2</span> {form?.Suppervisor2?.name}
                    

          {/* Unloaded Image Section */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 `}>
            {/* <p className="text-xl font-semibold text-gray-300 mb-4">Load Image</p> */}
            <div className={`${form.UnloadedImage1 === null ? 'hidden' : ''}`}>
              <p>Unloaded Image</p>
              <img src={form.UnloadedImage1} className='w-[200px] h-[200px]' alt='Front Image'></img>
            </div>
            <div className={`${form.UnloadedImage2 === null ? 'hidden' : ''}`}>
              <p>Unloaded Image</p>
              <img src={form.UnloadedImage2} className='w-[200px] h-[200px]' alt='Top Image'></img>
            </div>
            
          </div>
        </div>
      </div>

      {openImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4" onClick={() => setOpenImage(null)}>
          <button className="absolute top-4 right-4 bg-black text-white p-2 rounded-full text-2xl" onClick={() => setOpenImage(null)}>X</button>
          <img src={openImage} alt="Open Image" className="max-w-full max-h-full" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

export default Page