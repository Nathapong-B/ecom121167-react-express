import axios from "axios";
import { config, configHeaders } from './config';

export const userRegister = async (payload) => {
    return axios.post(config.userPath + '/register', payload);
};

export const userSignin = async (payload) => {
    return axios.post(config.userPath + '/signin', payload);
};

export const listUsers = async (statusby, count, token) => {
    const headers = configHeaders(token);
    return axios.get(config.userPath + '/list-users/' + statusby + '/' + count, headers);
};

export const changeStatusUser = async (id, status, token) => {
    const headers = configHeaders(token);
    return axios.put(config.userPath + '/change-status/' + id, status, headers);
};

export const updateProfile = async (payload, token) => {
    const headers = configHeaders(token);
    return axios.put(config.userPath + '/update-profile', payload, headers);
};