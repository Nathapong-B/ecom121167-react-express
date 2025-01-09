import axios from "axios";
import { config } from './config';

export const userRegister = async (payload) => {
    return axios.post(config.userPath + '/register', payload);
};

export const userSignin = async (payload) => {
    return axios.post(config.userPath+'/signin',payload);
};