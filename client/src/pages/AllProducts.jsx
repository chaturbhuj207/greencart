import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

function AllProducts() {
    const { products, searchQuery } = useAppContext();
    const [filteredProduct, setFilteredProduct] = useState([])

    useEffect(() => {
        if (searchQuery.length > 0) {
            setFilteredProduct(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        } else {
            setFilteredProduct(products)
        }
    }, [products, searchQuery])

    return (
        <div className='mt-16 px-4 sm:px-6 md:px-10 flex flex-col w-full'>
            {/* Heading */}
            <div className='flex flex-col items-center sm:items-end w-full sm:w-max self-center sm:self-end'>
                <p className='text-2xl font-medium uppercase text-center sm:text-right'>All Products</p>
                <div className='w-16 h-0.5 bg-primary rounded-full mt-1'></div>
            </div>

            {/* Product Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-6'>
                {filteredProduct
                    .filter((product) => product.inStock)
                    .map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
            </div>
        </div>
    )
}

export default AllProducts
