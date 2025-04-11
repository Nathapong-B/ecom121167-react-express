import axios from "axios";
import { config, configHeaders } from "./config";

export const reportPerDay = async (payload, token) => {
    const headers = configHeaders(token);
    return axios.post(config.reportPath + '/sales/report-per-day', payload, headers);
};