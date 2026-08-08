import mangoose from 'mongoose';
import priceSchema from './price.schema.js';


const productSchema = new mangoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
       type: priceSchema,
       required: true,
    },
    seller: {
        type: mangoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },  
    images: [{
      url: {
        type: String,
        required: true,
      }   
    }],
    variants: [
        {
            images:[
                {
                    url: {
                        type: String,
                        required: true,
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0,
            },
            attributes: {
                type: Map,
                of: String,
            },
            price: {
                type: priceSchema,
            },
            

        },       
    ],

});
 
const productModel = mangoose.model("Product", productSchema);

export default productModel;