import axios from "axios";
import { config, configHeaders } from "./config";

export const listOrdersAdmin = async (count, token) => {
    const headers = configHeaders(token);
    return axios.get(config.orderPath + '/list-orders-admin/' + count, headers);
};

export const updateOrder = async (id, data, token) => {
    const headers = configHeaders(token);
    return axios.put(config.orderPath + '/update/' + id, data, headers);
};

export const removeOrder = async (id, token) => {
    const headers = configHeaders(token);
    return axios.delete(config.orderPath + '/remove/' + id, headers);
};

export const createOrder = async (data, token) => {
    const headers = configHeaders(token);
    return axios.post(config.orderPath + '/create', data, headers);
};

export const confirmPayment = async (data, token) => {
    const headers = configHeaders(token);
    return axios.put(config.orderPath + '/confirm-payment', data, headers);
};

export const listMyPurchase = async (count, token) => {
    const headers = configHeaders(token);
    return axios.get(config.orderPath + '/list-orders/' + count, headers);
};