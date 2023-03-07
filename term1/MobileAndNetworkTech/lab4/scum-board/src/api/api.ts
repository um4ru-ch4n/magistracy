import axios, { AxiosInstance } from "axios";
import cfg from "../cfg";
import { GetToken } from "../utils/authUtils";

export const axiosInstance = (withAuth: boolean = false): AxiosInstance => {
    if (withAuth) {
        return axios.create({
            baseURL: cfg.apiURI,
            timeout: 5000,
            headers: {
                'Authorization': GetToken(),
            }
        })
    }

    return axios.create({
        baseURL: cfg.apiURI,
        timeout: 5000,
    })
}