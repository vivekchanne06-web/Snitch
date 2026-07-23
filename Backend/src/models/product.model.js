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

});
 
const productModel = mangoose.model("Product", productSchema);

export default productModel;