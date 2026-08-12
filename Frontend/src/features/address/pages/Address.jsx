import React from 'react'
import {useAddress} from "../hook/useAddress";
import { useSelector } from 'react-redux';


const Address = () => {

  const { handleGetUserAddress } = useAddress();
  const { addresses } = useSelector((state) => state.address)

  console.log(addresses)
  
  return (
    <div>
        address page
    </div>
  )
}

export default Address