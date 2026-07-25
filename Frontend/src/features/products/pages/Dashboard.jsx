import { useEffect } from "react"

import { useProduct} from "../hook/useProduct.js"
import {useSelector} from "react-redux";

const Dashboard = () => {

const {handleGetSellerProducts}=useProduct();
const product =  useSelector(state=>state.product.sellerProducts)

    useEffect(()=>{
        handleGetSellerProducts();     
    },[])  

    console.log(product)

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard