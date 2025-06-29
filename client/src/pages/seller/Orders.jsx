import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

function Orders() {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/seller");
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <>
            <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
                <div className="md:p-10 p-4 space-y-4">
                    <h2 className="text-lg font-medium">Orders List</h2>
                    {orders.map((order, index) => (
                        <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">
                            <div className="flex gap-5 max-w-80">
                                <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                                <div>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex flex-col justify-center">
                                            <p className="font-medium">
                                                {item.product.name} {" "}
                                                <span className="text-primary">x {item.quantity}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm md:text-base my-auto text-black/60">
                                <p className='text-black/80'> {order.addressId.firstName} {order.addressId.lastName} </p>
                                <p>{order.addressId.street}, {order.addressId.city},</p>
                                <p>{order.addressId.state}, {order.addressId.zipcode},{order.addressId.country}</p>
                                <p></p>
                                <p>{order.addressId.phone}</p>
                            </div>

                            <p className="font-medium text-lg my-auto">{currency}{order.amount}</p>

                            <div className="flex flex-col text-sm md:text-base text-black/60">
                                <p>Method: {order.paymentType}</p>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Orders