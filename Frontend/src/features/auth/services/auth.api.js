import axios from "axios";


const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})



export async function register({ email, password, contact, fullName, isSeller }) {
    const response = await authApiInstance.post("/register", {
        email,
        password,
        contact,
        fullName,
        isSeller,
    });

    return response.data;
}

export async function login({email,password}){
    const response = await authApiInstance.post("/login", {
        email,
        password,
    });

    return response.data; 
}

export async function getMe() {
    const response = await authApiInstance.get("/me");
    return response.data;
}

export async function logout(){
    const response = await authApiInstance.post("/logout");
    return response.data;
}