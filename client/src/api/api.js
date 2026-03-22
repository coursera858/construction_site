import axios from "axios";

const api = axios.create({
    baseURL: "https://construction-site-4c1n.onrender.com/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
})

export const getRequest = async (url, data) => {
    try {
        const response = await api.get(url)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const postRequest = async (url, data) => {
    try {
        const response = await api.post(url, data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const patchRequest = async (url, data) => {
    try {
        const response = await api.patch(url, data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteRequest = async (url) => {
    try {
        const response = await api.delete(url)
        return response.data
    } catch (error) {
        console.log(error)
    }
}
