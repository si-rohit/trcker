'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openImage, setOpenImage] = useState('')

  useEffect(() => {
    const getdetails = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/getAndDeleteTrip', { method: "POST", body: id })
        const data = await res.json()
        setForm(data)
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

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col'>
      {/* Mobile Header (Sticky) */}
      <div className="sticky top-0 z-10 bg-gray-800 text-white py-4 px-4 flex items-center justify-between gap-4 shadow-md">
        <div className='flex items-center gap-3'>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M31 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
        <p className="text-2xl font-extralight">No. <span className='text-orange-500 font-extrabold'>{form.truckNumber}</span></p>
        </div>
        
        <Link href={`/update/${id}`} className={`flex text-right bg-orange-500 py-2 px-4 rounded-md text-sm `}>Complete</Link>
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
              <span className="font-semibold text-gray-400 block">Enter Time</span> {new Date(form.EnterTime).toLocaleString()}
            </p>            
          </div>

          {/* Loaded Image Section */}
          <div className="mb-8">
            <p className="text-xl font-semibold text-gray-300 mb-4">Load Image</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.LoadedImage && form.LoadedImage.map((image, index) => (
                <div key={index} className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden shadow-lg">
                  <img src={image} onClick={() => setOpenImage(image)} alt={`Loaded Image ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {(!form.LoadedImage || form.LoadedImage.length === 0) && (
              <p className="text-gray-500 text-center py-4">No loaded images available.</p>
            )}
          </div>

          {form.ExitTime && (
            <p className="text-lg mb-8">
              <span className="font-semibold text-gray-400 block">Exit Time</span> {new Date(form.ExitTime).toLocaleString()}
            </p>
          )}

          {/* Unloaded Image Section */}
          <div>
            <p className="text-xl font-semibold text-gray-300 mb-4">Unload Image</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.UnloadedImage && form.UnloadedImage.map((image, index) => (
                <div key={index} className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden shadow-lg">
                  <img src={image} alt={`Unloaded Image ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {(!form.UnloadedImage || form.UnloadedImage.length === 0) && (
              <p className="text-gray-500 text-center py-4">No unloaded images available.</p>
            )}
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