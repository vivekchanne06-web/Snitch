import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password is required only if googleId is not provided
        }
    },
    contact: {
        type: String,
        required: false,
    },
    fullName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer",
    },
    googleId: {
        type: String,
    },

})
    

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
}); 

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


const userModel = mongoose.model("User", userSchema);

export default userModel;