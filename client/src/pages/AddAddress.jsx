import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// inputfields
const InputFields = ({ type, placeholder, name, address, handlechange }) => (
    <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handlechange}
        name={name}
        value={address[name]}   
        required />
)
function AddAddress() {
    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    })

    const { axios ,user,navigate} = useAppContext();

    const handlechange = (e) => {
        const { name, value } = e.target
        setAddress((prev) => ({ ...prev, [name]: value }))
    }
    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.post("/api/address/add", {address});
            if (data.success) {
                toast.success(data.message);
                navigate("/cart");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (!user) {
            navigate("/cart");
        }
    }, [])
    return (
        <>
            <div className='mt-16 pb-16'>
                <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>
                <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                    <div className='flex-1 max-w-md'>
                        <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>

                            <div className='grid grid-cols-2 gap-4'>
                                <InputFields handlechange={handlechange} address={address} name="firstName" type="text" placeholder="First Name" />
                                <InputFields handlechange={handlechange} address={address} name="lastName" type="text" placeholder="Last Name" />
                            </div>

                            <InputFields handlechange={handlechange} address={address} name="email" type="email" placeholder="Email" />
                            <InputFields handlechange={handlechange} address={address} name="street" type="text" placeholder="Street" />

                            <div className='grid grid-cols-2 gap-4'>
                                <InputFields handlechange={handlechange} address={address} name="city" type="text" placeholder="City" />
                                <InputFields handlechange={handlechange} address={address} name="state" type="text" placeholder="State" />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <InputFields handlechange={handlechange} address={address} name="zipcode" type="number" placeholder="Zip code" />
                                <InputFields handlechange={handlechange} address={address} name="country" type="text" placeholder="Country" />
                            </div>

                            <InputFields handlechange={handlechange} address={address} name="phone" type="number" placeholder="Phone" />

                            <button className='w-full mt-6 bg-primary text-white py-3 hover:primary-dull transition cursor-pointer uppercase'>
                                Save Address
                            </button>

                        </form>
                    </div>
                    <img src={assets.add_address_iamge} alt="Add address" className='md:mr-16 mb-16 md:mt-0' />
                </div>
            </div>
        </>
    )
}

export default AddAddress