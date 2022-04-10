import React from 'react';
import { API } from '../backend';


const ImageHelper = ({product}) => {
    const imageurl = product ? `${API}/product/photo/${product._id}`
    :`https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`
   return (
    <img
    src={imageurl}
    alt="photo"
    style={{ maxHeight: "100%", maxWidth: "100%" }}
    className="mb-3 rounded"
  />
   )
}

export default ImageHelper;