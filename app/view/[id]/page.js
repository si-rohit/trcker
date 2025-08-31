'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const { id } = useParams()
    const [form,setForm] = useState(null)
    useEffect(()=>{
        const getdetails = async()=>{
            const res = await fetch('/api/getAndDeleteTrip',{method:"POST", body:id})
            const data = await res.json()
            // console.log(data)
            setForm(data)
        }
        getdetails()
    },[id])

    console.log(form)

  return (
    <div className='text-black'>
        <p>Trip Number : {form?.tripNumber}</p>
        <p>Truck Number : {form?.truckNumber}</p>
        <p>Driver Name : {form?.driverName}</p>
        <p>Company Name : {form?.companyName}</p>
        <p>Enter Time : {new Date(form?.EnterTime).toLocaleString()}</p>
        {
          form?.ExitTime && <p>Exit Time : {new Date(form.ExitTime).toLocaleString()}</p>
        }
        
        <p>Loaded Image</p>
        <div>
          {form?.LoadedImage && 
            form.LoadedImage.map((image,index)=>{
                return <img key={index} src={image} alt="LoadedImage" />
            })
          }
        </div>
      
        <p>Unloaded Image</p>
        <div>
          {form?.UnloadedImage && 
            form.UnloadedImage.map((image,index)=>{
                return <img key={index} src={image} alt="UnloadedImage" />
            })
          }
        </div>
        
    </div>
  )
}

export default Page