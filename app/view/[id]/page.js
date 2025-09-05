'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

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
    <div className='min-h-screen bg-gray-900 text-gray-100 p-8 md:p-12 font-sans'>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 border border-gray-700">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl md:text-4xl font-extralight">
            Trip <span className="font-bold text-orange-500">Details</span>
          </h1>
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-12 mb-8">
          <p className="text-lg">
            <span className="font-semibold text-gray-400 block">Trip Number:</span> {form.tripNumber}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-400 block">Truck Number:</span> {form.truckNumber}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-400 block">Driver Name:</span> {form.driverName || "N/A"}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-400 block">Company Name:</span> {form.companyName}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-400 block">Enter Time:</span> {new Date(form.EnterTime).toLocaleString()}
          </p>
          {form.ExitTime && (
            <p className="text-lg">
              <span className="font-semibold text-gray-400 block">Exit Time:</span> {new Date(form.ExitTime).toLocaleString()}
            </p>
          )}
        </div>

        {/* Loaded Image Section */}
        <div className="mb-8">
          <p className="text-xl font-semibold text-gray-300 mb-4">Loaded Image</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {form.LoadedImage && form.LoadedImage.map((image, index) => (
              <div key={index} className="relative w-full h-32 md:h-40 rounded-lg overflow-hidden shadow-lg">
                <img src={image} alt={`Loaded Image ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          {(!form.LoadedImage || form.LoadedImage.length === 0) && (
            <p className="text-gray-500 text-center py-4">No loaded images available.</p>
          )}
        </div>

        {/* Unloaded Image Section */}
        <div>
          <p className="text-xl font-semibold text-gray-300 mb-4">Unloaded Image</p>
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
  )
}

export default Page