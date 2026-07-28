import mangoose from 'mongoose';

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
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ["USD", "INR"],
            default: "INR",
        }
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
                amount: {
                    type: Number,
                    required: true,
                },
                currency: {
                    type: String,
                    enum: ["USD", "INR"],
                    default: "INR", 
                }
            },
            

        },       
    ],

});
 
const productModel = mangoose.model("Product", productSchema);

export default productModel;