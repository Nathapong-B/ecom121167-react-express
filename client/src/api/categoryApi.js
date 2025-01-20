import axios from "axios";
import { config, configHeaders } from "./config";

export const addCategory = async (data, token) => {
    const payload = data;
    const headers = configHeaders(token);

    return axios.post(config.categoryPath + '/add', payload, headers);
};

export const callListCategories = async (statusby, token) => {
    const headers = configHeaders(token);

    return axios.get(config.categoryPath + '/list/' + statusby, headers);
};

export const changeStatusCategory = async (id, status, token) => {
    const headers = configHeaders(token);

    return axios.put(config.categoryPath + '/change-status/' + id, status, headers);
};

export const updateCategory = async (id, data, token) => {
    const headers = configHeaders(token);

    return axios.put(config.categoryPath + '/update/' + id, data, headers);
};

export const removeCategory = async (id, token) => {
    const headers = configHeaders(token);

    return axios.delete(config.categoryPath + '/remove/' + id, headers);
};

export const callListCategoriesHome = async () => {
    return axios.get(config.categoryPath + '/list');
};