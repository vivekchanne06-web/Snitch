import mangoose from 'mongoose';    

const priceSchema = new mangoose.Schema({

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
    {
    _id: false,
    __v: false,
})

export default priceSchema;