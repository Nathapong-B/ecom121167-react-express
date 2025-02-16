import axios from "axios";
import { config, configHeaders } from "./config";

export const listProducts = async (count) => {
    return axios.get(config.productPath + '/' + count);
};

export const listInactiveProducts = async (count, token) => {
    const headers = configHeaders(token);
    return axios.get(config.productPath + '/inactive/' + count, headers);
};

export const addProduct = async (data, token) => {
    const headers = configHeaders(token);
    return axios.post(config.productPath + '/add', data, headers);
};

export const updateProduct = async (id, data, token) => {
    const headers = configHeaders(token);
    return axios.put(config.productPath + '/update/' + id, data, headers);
};

export const changeStatusProduct = async (id, status, token) => {
    const headers = configHeaders(token);
    return axios.put(config.productPath + '/change-status/' + id, status, headers);
};

export const removeProduct = async (id, token) => {
    const headers = configHeaders(token);
    return axios.delete(config.productPath + '/remove/' + id, headers);
};

export const listProductsBy = async (count, sort) => {
    return axios.get(config.productPath + '/' + count + '/' + sort);
};

export const callProductsByList = async (arrListId) => {
    return axios.post(config.productPath + '/list-by-list', { arrListId });
};

export const getEachProduct = async (id) => {
    return axios.get(config.productPath + '/each/' + id);
};

export const searchProduct = async (payload) => {
    return axios.post(config.productPath + '/search', payload);
};